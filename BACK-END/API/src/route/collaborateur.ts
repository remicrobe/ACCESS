import * as express from 'express';
import { Request, Response } from 'express';
import {
    creerCollab,
    getCollabInfoFromId,
    getCollabUnderControl,
    isARH,
    isDRH,
    isRH,
    modifierCollab
} from "../controller/CollabController";
import { Collaborateur } from "../database/entity/Collaborateur";
import {
    checkTokenPassword, disconnectToken,
    setAuthToken,
    setTokenPasswordAndSendMail
} from "../controller/Token";
import { createHash } from "crypto";
import { jwtMiddleware, jwtMiddlewareFullInfo } from "../middleware/jwt";
import { isSuperior } from "../controller/ServiceController";
import { ErrorHandler } from "../utils/error/error-handler";
import { IsNull } from "typeorm";
import { checkRequiredField } from "../utils/global";
import config from '../config';
import {CollaborateurRepository} from "../database/repository/CollaborateurRepository";

const collaborateurRouter = express.Router();

// Route pour créer un collaborateur
collaborateurRouter.post('/creerCollab', jwtMiddlewareFullInfo, async (req: Request, res: Response) => {
    /*  #swagger.tags = ['Collaborateur']
        #swagger.path = '/collab/creerCollab'
        #swagger.method = 'post'
        #swagger.description = 'Créer un nouveau collaborateur'
        #swagger.parameters['body'] = {
            in: 'body',
            description: 'Informations du collaborateur',
            required: true,
            schema: {
                prenom: 'string',
                nom: 'string',
                mail: 'string',
                grade: 'string',
                fonction: 'string',
                service: 'object',
                horairesdefault: 'object',
                horaire: 'object',
                actif: 'boolean'
            }
        }
        #swagger.responses[201] = {
            description: 'Collaborateur créé avec succès.',
            schema: { $ref: '#/definitions/Collaborateur' }
        }
        #swagger.responses[400] = {
            description: 'L\'utilisateur existe déjà.'
        }
        #swagger.responses[401] = {
            description: 'Non autorisé.'
        }
        #swagger.responses[422] = {
            description: 'Champs requis manquants.'
        }
    */
    try {
        let connectedCollab: Collaborateur = req.body.connectedCollab;
        if (!isDRH(connectedCollab)) {
            res.sendStatus(401);
        } else {
            let {
                prenom,
                nom,
                mail,
                grade,
                fonction,
                service,
                horairesdefault,
                horaire,
                actif
            } = req.body;
            if (!checkRequiredField([prenom, nom, { object: mail, type: 'mail' }, grade, fonction])) {
                return res.sendStatus(422);
            }
            const collaborateur = await creerCollab(prenom, nom, mail, grade, fonction, service, horairesdefault, horaire, actif);

            if (collaborateur && await setTokenPasswordAndSendMail(collaborateur)) {
                res.status(201).json(collaborateur);
            } else {
                res.status(400).json({ error: 'L\'utilisateur existe déjà.' });
            }
        }
    } catch (error) {
        ErrorHandler(error, req, res);
    }
});

// Route pour récuperer les infos sur un collab
collaborateurRouter.get('/infoCollab', jwtMiddlewareFullInfo, async (req: Request, res: Response) => {
    /*  #swagger.tags = ['Collaborateur']
        #swagger.path = '/collab/infoCollab'
        #swagger.method = 'get'
        #swagger.description = 'Obtenir les informations du collaborateur connecté'
        #swagger.responses[200] = {
            description: 'Informations du collaborateur connecté.',
            schema: { $ref: '#/definitions/Collaborateur' }
        }
    */
    try {
        res.send(req.body.connectedCollab);
    } catch (error) {
        ErrorHandler(error, req, res);
    }
});

// Route pour récuperer les infos sur un collab
collaborateurRouter.get('/infoCollab/:idcollab', jwtMiddlewareFullInfo, async (req: Request, res: Response) => {
    /*  #swagger.tags = ['Collaborateur']
        #swagger.path = '/collab/infoCollab/{idcollab}'
        #swagger.method = 'get'
        #swagger.description = 'Obtenir les informations d\'un collaborateur par son ID'
        #swagger.parameters['idcollab'] = {
            in: 'path',
            description: 'ID du collaborateur',
            required: true,
            type: 'integer'
        }
        #swagger.responses[200] = {
            description: 'Informations du collaborateur.',
            schema: { $ref: '#/definitions/Collaborateur' }
        }
        #swagger.responses[401] = {
            description: 'Non autorisé.'
        }
    */
    try {
        let connectedCollab: Collaborateur = req.body.connectedCollab;
        let searchedCollab: Collaborateur = await getCollabInfoFromId(parseInt(req.params.idcollab));
        if (
            isDRH(connectedCollab)
            || isARH(connectedCollab)
            || isRH(connectedCollab)
            || (connectedCollab.id === searchedCollab.id)
            || await isSuperior(connectedCollab, searchedCollab)
        ) {
            res.send(searchedCollab);
        } else {
            res.sendStatus(401);
        }
    } catch (error) {
        ErrorHandler(error, req, res);
    }
});

// Route pour récuperer les collab sous la direction du connected collab
collaborateurRouter.get('/infoCollabSousControl/', jwtMiddlewareFullInfo, async (req: Request, res: Response) => {
    /*  #swagger.tags = ['Collaborateur']
        #swagger.path = '/collab/infoCollabSousControl'
        #swagger.method = 'get'
        #swagger.description = 'Obtenir les collaborateurs sous la direction du collaborateur connecté'
        #swagger.responses[200] = {
            description: 'Liste des collaborateurs sous la direction.',
            schema: {
                type: 'array',
                items: { $ref: '#/definitions/Collaborateur' }
            }
        }
    */
    try {
        let connectedCollab: Collaborateur = req.body.connectedCollab;

        res.send(await getCollabUnderControl(connectedCollab));

    } catch (error) {
        ErrorHandler(error, req, res);
    }
});

// Route pour obtenir l'ensemble des collaborateurs sans service
collaborateurRouter.get('/sansService', jwtMiddleware, async (req: Request, res: Response) => {
    /*  #swagger.tags = ['Collaborateur']
        #swagger.path = '/collab/sansService'
        #swagger.method = 'get'
        #swagger.description = 'Obtenir l\'ensemble des collaborateurs sans service'
        #swagger.responses[200] = {
            description: 'Liste des collaborateurs sans service.',
            schema: {
                type: 'array',
                items: { $ref: '#/definitions/Collaborateur' }
            }
        }
        #swagger.responses[401] = {
            description: 'Non autorisé.'
        }
    */
    try {
        let connectedCollab: Collaborateur = req.body.connectedCollab;
        if (!isDRH(connectedCollab) && !isARH(connectedCollab) && !isRH(connectedCollab)) {
            res.sendStatus(401);
        } else {
            res.send(await CollaborateurRepository.find({ where: { service: IsNull() } }));
        }
    } catch (error) {
        ErrorHandler(error, req, res);
    }
});

// Route pour modifier un collaborateur
collaborateurRouter.put('/modifierCollab/:collaborateur', jwtMiddleware, async (req: Request, res: Response) => {
    /*  #swagger.tags = ['Collaborateur']
        #swagger.path = '/collab/modifierCollab/{collaborateur}'
        #swagger.method = 'put'
        #swagger.description = 'Modifier les informations d\'un collaborateur'
        #swagger.parameters['collaborateur'] = {
            in: 'path',
            description: 'ID du collaborateur',
            required: true,
            type: 'integer'
        }
        #swagger.parameters['body'] = {
            in: 'body',
            description: 'Nouvelles informations du collaborateur',
            required: true,
            schema: {
                prenom: 'string',
                nom: 'string',
                mail: 'string',
                grade: 'string',
                fonction: 'string',
                service: 'object',
                horairesdefault: 'object',
                horaire: 'object',
                actif: 'boolean'
            }
        }
        #swagger.responses[201] = {
            description: 'Collaborateur modifié avec succès.',
            schema: { $ref: '#/definitions/Collaborateur' }
        }
        #swagger.responses[400] = {
            description: 'L\'utilisateur n\'existe pas.'
        }
        #swagger.responses[401] = {
            description: 'Non autorisé.'
        }
        #swagger.responses[422] = {
            description: 'Champs requis manquants.'
        }
    */
    const collabID = parseInt(req.params.collaborateur);
    try {
        let connectedCollab: Collaborateur = req.body.connectedCollab;
        let target = await CollaborateurRepository.findOneOrFail({
            where: { id: collabID },
            relations: { service: { chefservice: true } }
        });
        if (!isDRH(connectedCollab) && !isARH(connectedCollab) && !isRH(connectedCollab) && !await isSuperior(connectedCollab, target)) {
            res.sendStatus(401);
        } else {

            let {
                prenom,
                nom,
                mail,
                grade,
                fonction,
                service,
                horairesdefault,
                horaire,
                actif
            } = req.body;
            if (!checkRequiredField([prenom, nom, { object: mail, type: 'mail' }, grade, fonction])) {
                return res.sendStatus(422);
            }
            if (!isDRH(connectedCollab) && !isARH(connectedCollab) && !isRH(connectedCollab)) {
                grade = target.grade;
                service = target.service;
            }
            const collaborateur = await modifierCollab(target, prenom, nom, mail, grade, fonction, service, horairesdefault, horaire, actif);
            if (collaborateur) {
                res.status(201).json(collaborateur);
            } else {
                res.status(400).json({ error: 'L\'utilisateur n\'existe pas.' });
            }
        }
    } catch (error) {
        ErrorHandler(error, req, res);
    }
});

// Route pour récuperer un collaborateur
collaborateurRouter.post('/recuperation/:token', async (req: Request, res: Response) => {
    /*  #swagger.tags = ['Collaborateur']
        #swagger.path = '/collab/recuperation/{token}'
        #swagger.method = 'post'
        #swagger.description = 'Récupérer un collaborateur à partir d\'un token'
        #swagger.parameters['token'] = {
            in: 'path',
            description: 'Token de récupération',
            required: true,
            type: 'string'
        }
        #swagger.parameters['body'] = {
            in: 'body',
            description: 'Mot de passe pour la récupération',
            required: true,
            schema: {
                motdepasse: 'string'
            }
        }
        #swagger.responses[200] = {
            description: 'Collaborateur récupéré avec succès.',
            schema: { $ref: '#/definitions/Collaborateur' }
        }
        #swagger.responses[400] = {
            description: 'Token ou mot de passe invalide.'
        }
    */
    try {
        const token = req.params.token;
        const password = req.body.motdepasse;

        res.send(await checkTokenPassword(token, password));
    } catch (error) {
        ErrorHandler(error, req, res);
    }
});

// Route pour demander la récupération
collaborateurRouter.post('/demande-recuperation/', async (req: Request, res: Response) => {
    /*  #swagger.tags = ['Collaborateur']
        #swagger.path = '/collab/demande-recuperation'
        #swagger.method = 'post'
        #swagger.description = 'Demander la récupération du compte'
        #swagger.parameters['body'] = {
            in: 'body',
            description: 'Email du collaborateur',
            required: true,
            schema: {
                mail: 'string'
            }
        }
        #swagger.responses[200] = {
            description: 'Mail de récupération envoyé.'
        }
        #swagger.responses[422] = {
            description: 'Champs requis manquants.'
        }
        #swagger.responses[500] = {
            description: 'Erreur interne du serveur.'
        }
    */
    try {
        const mail = req.body.mail;
        if (!checkRequiredField([{ object: mail, type: 'mail' }])) {
            return res.sendStatus(422);
        }
        let collab = await CollaborateurRepository.findOneByOrFail({ mail });

        let success = await setTokenPasswordAndSendMail(collab);
        if (success) {
            res.send('Mail de récupération envoyé');
        } else {
            res.sendStatus(500);
        }

    } catch (error) {
        ErrorHandler(error, req, res);
    }
});

// Route pour connecter le collaborateur
collaborateurRouter.post('/connect/', async (req: Request, res: Response) => {
    /*  #swagger.tags = ['Collaborateur']
        #swagger.path = '/collab/connect'
        #swagger.method = 'post'
        #swagger.description = 'Connecter un collaborateur'
        #swagger.parameters['body'] = {
            in: 'body',
            description: 'Informations de connexion',
            required: true,
            schema: {
                mail: 'string',
                motdepasse: 'string'
            }
        }
        #swagger.responses[200] = {
            description: 'Collaborateur connecté avec succès.',
            schema: { $ref: '#/definitions/Token' }
        }
        #swagger.responses[422] = {
            description: 'Champs requis manquants.'
        }
        #swagger.responses[404] = {
            description: 'Collaborateur non trouvé.'
        }
    */
    try {
        const mail = req.body.mail;
        let motdepasse = req.body.motdepasse;
        if (!checkRequiredField([{ object: mail, type: 'mail' }, motdepasse])) {
            return res.sendStatus(422);
        }
        motdepasse = createHash('sha256').update(config.SALAGE + motdepasse).digest('hex');

        let collab = await CollaborateurRepository.findOneOrFail({
            where: { mail, motdepasse },
            relations: { service: { chefservice: true } }
        });

        res.send(await setAuthToken(collab));

        collab.lastIp = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress;
        collab.lastConnection = new Date();
        await CollaborateurRepository.save(collab);
    } catch (error) {
        ErrorHandler(error, req, res);
    }
});

// Route pour déconnecter
collaborateurRouter.post('/deconneter/', jwtMiddleware, async (req: Request, res: Response) => {
    /*  #swagger.tags = ['Collaborateur']
        #swagger.path = '/collab/deconneter'
        #swagger.method = 'post'
        #swagger.description = 'Déconnecter un collaborateur'
        #swagger.responses[200] = {
            description: 'Collaborateur déconnecté avec succès.'
        }
    */
    try {
        res.send(await disconnectToken(req.body.jwtToken));
    } catch (error) {
        ErrorHandler(error, req, res);
    }
});

export { collaborateurRouter };
