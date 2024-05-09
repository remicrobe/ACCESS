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
import { Collaborateur, typeCollab } from "../database/entity/Collab";
import { AppDataSource } from "../database/datasource";
import {
    checkTokenPassword, disconnectToken,
    getCollabInfoFromToken,
    setAuthToken,
    setTokenPasswordAndSendMail
} from "../controller/Token";
import { createHash } from "crypto";
import { jwtMiddleware, jwtMiddlewareFullInfo } from "../middleware/jwt";
import { isSuperior } from "../controller/ServiceController";
import { Token } from "../database/entity/Token";
import { ErrorHandler } from "../utils/error/error-handler";
import { IsNull } from "typeorm";
import { checkRequiredField } from "../utils/global";
import config from '../config';

const collaborateurRouter = express.Router();

// Route pour créer un collaborateur
collaborateurRouter.post('/creerCollab', jwtMiddlewareFullInfo, async (req: Request, res: Response) => {
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
            if (!checkRequiredField([prenom, nom, {object: mail, type: 'mail'}, grade, fonction])) {
                return res.sendStatus(422);
            }
            const collaborateur = await creerCollab(prenom, nom, mail, grade, fonction, service, horairesdefault, horaire, actif);

            if (collaborateur && await setTokenPasswordAndSendMail(collaborateur)) {
                res.status(201).json(collaborateur);
            } else {
                res.status(400).json({error: 'L\'utilisateur existe déjà.'});
            }
        }
    } catch (error) {
        ErrorHandler(error, req, res);
    }
});

// Route pour récuperer les infos sur un collab
collaborateurRouter.get('/infoCollab', jwtMiddlewareFullInfo, async (req: Request, res: Response) => {
    try {
        res.send(req.body.connectedCollab);
    } catch (error) {
        ErrorHandler(error, req, res);
    }
});

// Route pour récuperer les infos sur un collab
collaborateurRouter.get('/infoCollab/:idcollab', jwtMiddlewareFullInfo, async (req: Request, res: Response) => {
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
    try {
        let connectedCollab: Collaborateur = req.body.connectedCollab;

        res.send(await getCollabUnderControl(connectedCollab));

    } catch (error) {
        ErrorHandler(error, req, res);
    }
});

// Route pour obtenir l'ensemble des collaborateurs sanns service
collaborateurRouter.get('/sansService', jwtMiddleware, async (req: Request, res: Response) => {
    try {
        let connectedCollab: Collaborateur = req.body.connectedCollab;
        if (!isDRH(connectedCollab) && !isARH(connectedCollab) && !isRH(connectedCollab)) {
            res.sendStatus(401);
        } else {
            res.send(await AppDataSource.getRepository(Collaborateur).find({where: {service: IsNull()}}));
        }
    } catch (error) {
        ErrorHandler(error, req, res);
    }
});

// Route pour modifier un collaborateur
collaborateurRouter.put('/modifierCollab/:collaborateur', jwtMiddleware, async (req: Request, res: Response) => {
    const collabID = parseInt(req.params.collaborateur);
    try {
        let connectedCollab: Collaborateur = req.body.connectedCollab;
        let target = await AppDataSource.getRepository(Collaborateur).findOneOrFail({
            where: {id: collabID},
            relations: {service: {chefservice: true}}
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
            if (!checkRequiredField([prenom, nom, {object: mail, type: 'mail'}, grade, fonction])) {
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
                res.status(400).json({error: 'L\'utilisateur existe pas.'});
            }
        }
    } catch (error) {
        ErrorHandler(error, req, res);
    }
});

// Route pour récuperer un collaborateur
collaborateurRouter.post('/recuperation/:token', async (req: Request, res: Response) => {
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
    try {
        const mail = req.body.mail;
        if (!checkRequiredField([{object: mail, type: 'mail'}])) {
            return res.sendStatus(422);
        }
        let collab = await AppDataSource.getRepository(Collaborateur).findOneByOrFail({mail});

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
    try {
        const mail = req.body.mail;
        let motdepasse = req.body.motdepasse;
        if (!checkRequiredField([{object: mail, type: 'mail'}, motdepasse])) {
            return res.sendStatus(422);
        }
        motdepasse = createHash('sha256').update(config.SALAGE + motdepasse).digest('hex');

        let collab = await AppDataSource.getRepository(Collaborateur).findOneOrFail({
            where: {mail, motdepasse},
            relations: {service: {chefservice: true}}
        });

        res.send(await setAuthToken(collab));

    } catch (error) {
        ErrorHandler(error, req, res);
    }
});

// Route pour déconnecter
collaborateurRouter.post('/deconneter/', jwtMiddleware, async (req: Request, res: Response) => {
    try {
        res.send(await disconnectToken(req.body.jwtToken));
    } catch (error) {
        ErrorHandler(error, req, res);
    }
});

export { collaborateurRouter };
