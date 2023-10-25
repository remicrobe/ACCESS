import * as express from 'express'
import {Request, Response} from 'express'
import {
    creerCollab,
    getCollabInfoFromId,
    getCollabUnderControl,
    isARH,
    isDRH,
    isRH,
    modifierCollab
} from "../controller/CollabController";
import {Collaborateur, typeCollab} from "../database/entity/Collab";
import {AppDataSource} from "../database/datasource";
import {
    checkTokenPassword,
    getCollabInfoFromToken,
    setAuthToken,
    setTokenPasswordAndSendMail
} from "../controller/Token";
import {createHash} from "crypto";
import {jwtMiddleware, jwtMiddlewareFullInfo} from "../middleware/jwt";
import {isSuperior} from "../controller/ServiceController";

const collaborateurRouter = express.Router();

// Route pour créer un collaborateur
collaborateurRouter.post('/creerCollab', jwtMiddleware, async (req: Request, res: Response) => {
    try {
        let connectedCollab:Collaborateur = req.body.connectedCollab
        if(!isDRH(connectedCollab)){
            res.sendStatus(401)
        }else{
            const {prenom, nom, mail, grade, fonction} = req.body;
            const collaborateur = await creerCollab(prenom, nom, mail, grade, fonction);

            if (collaborateur && await setTokenPasswordAndSendMail(collaborateur)) {
                res.status(201).json(collaborateur);
            } else {
                res.status(400).json({error: 'L\'utilisateur existe déjà.'});
            }
        }
    } catch (error) {
        res.status(500).json({error: 'Une erreur est survenue lors de la création du collaborateur.'});
    }
});

// Route pour récuperer les infos sur un collab
collaborateurRouter.get('/infoCollab', jwtMiddlewareFullInfo, async (req: Request, res: Response) => {
    try {
        res.send(req.body.connectedCollab)
    } catch (error) {
        res.status(500).json({error: 'Une erreur est survenue lors de la recherche du collaborateur.'});
    }
});

// Route pour récuperer les infos sur un collab
collaborateurRouter.get('/infoCollab/:idcollab', jwtMiddlewareFullInfo, async (req: Request, res: Response) => {
    try {
        let connectedCollab:Collaborateur = req.body.connectedCollab
        let searchedCollab:Collaborateur = await getCollabInfoFromId(parseInt(req.params.idcollab))
        if(
            isDRH(connectedCollab)
            || isARH(connectedCollab)
            || isRH(connectedCollab)
            || (connectedCollab.id === searchedCollab.id)
            || await isSuperior(connectedCollab,searchedCollab)
        ) {
            res.send(searchedCollab)
        }else{
            res.sendStatus(401)
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({error: 'Une erreur est survenue lors de la recherche du collaborateur.'});
    }
});

// Route pour récuperer les collab sous la direction du connected collab
collaborateurRouter.get('/infoCollabSousControl/', jwtMiddlewareFullInfo, async (req: Request, res: Response) => {
    try {
        let connectedCollab:Collaborateur = req.body.connectedCollab

        res.send(await getCollabUnderControl(connectedCollab))

    } catch (error) {
        res.status(500).json({error: 'Une erreur est survenue lors de la recherche du collaborateur.'});
    }
});

// Route pour modifier un collaborateur
collaborateurRouter.put('/modifierCollab/:collaborateur',jwtMiddleware, async (req: Request, res: Response) => {
    try {
        let connectedCollab:Collaborateur = req.body.connectedCollab
        if(!isDRH(connectedCollab) && !isARH(connectedCollab) && !isRH(connectedCollab)){
            res.sendStatus(401)
        }else {
            const collabID = parseInt(req.params.collaborateur);
            let {prenom, nom, mail, grade, fonction,actif,horaire} = req.body;
            if(actif){
                actif = parseInt(actif) === 1
            }
            const collaborateur = await modifierCollab(collabID, prenom, nom, mail, grade, fonction,actif,horaire);
            console.log(collaborateur)
            if (collaborateur) {
                res.status(201).json(collaborateur);
            } else {
                res.status(400).json({error: 'L\'utilisateur existe pas.'});
            }
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({error: 'Une erreur est survenue lors de la modification du collaborateur.'});
    }
});

// Route pour récuperer un collaborateur
collaborateurRouter.post('/recuperation/:token', async (req: Request, res: Response) => {
    try {
        const token = req.params.token;
        const password = req.body.motdepasse;

        console.log(token)
        res.send(await checkTokenPassword(token, password))
    } catch (error) {
        console.log(error)
        res.status(500).json({error: 'Une erreur est survenue lors du paramètrage du compte.'});
    }
});

// Route pour demander la récupération
collaborateurRouter.post('/demande-recuperation/', async (req: Request, res: Response) => {
    try {
        const mail = req.body.mail;
        let collab = await AppDataSource.getRepository(Collaborateur).findOneByOrFail({mail})

        let success = await setTokenPasswordAndSendMail(collab)
        if (success) {
            res.send('Mail de récupération envoyé')
        } else {
            res.sendStatus(500)
        }

    } catch (error) {
        res.status(500).json({error: 'Une erreur est survenue lors du paramètrage du compte.'});
    }
});

// Route pour connecter le collaborateur
collaborateurRouter.post('/connect/', async (req: Request, res: Response) => {
    try {
        const mail = req.body.mail;
        let motdepasse = req.body.motdepasse;
        console.log(req.body)
        motdepasse = createHash('sha256').update(motdepasse).digest('hex');

        let collab = await AppDataSource.getRepository(Collaborateur).findOneOrFail({where:{mail, motdepasse},relations:{service:{chefservice:true}}})

        res.send(await setAuthToken(collab))

    } catch (error) {
        console.log(error)
        res.status(500).json({error: 'Une erreur est survenue lors de la connexion au compte.'});
    }
});

export {collaborateurRouter};
