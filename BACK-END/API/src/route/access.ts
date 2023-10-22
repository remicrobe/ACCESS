import {Access, typePoint} from '../database/entity/Access';
import {AppDataSource} from "../database/datasource";
import {Collaborateur, typeCollab} from "../database/entity/Collab";
import {Service} from "../database/entity/Service";
import * as express from "express";
import {
    creerAccess,
    modifierAccess,
    listeAccess,
    pointAccessAccessible,
    aAccess,
    getPointConfig
} from "../controller/AccessController";
import {jwtMiddleware, jwtMiddlewareFullInfo} from "../middleware/jwt";
import {checkQRCode} from "../controller/Token";

const accessRouter = express.Router();

// Créer un nouveau point d'accès
accessRouter.post('/creerAccess', jwtMiddleware, async (req, res) => {
    const { macadress, typePoint, location, nompoint, active, collabAutoriseIds, serviceAutoriseIds } = req.body;
    try {
        const newAccess = await creerAccess(macadress, typePoint, location, nompoint, active, collabAutoriseIds, serviceAutoriseIds);
        return res.json(newAccess);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Erreur lors de la création du point d\'accès' });
    }
});

// Modifier un point d'accès existant
accessRouter.put('/modifierAccess/:accessId', jwtMiddlewareFullInfo, async (req, res) => {
    const accessId = parseInt(req.params.accessId);
    const { macadress, typePoint, location, nompoint, active, collabAutoriseIds, serviceAutoriseIds } = req.body;
    try {
        const access = await AppDataSource.getRepository(Access).findOneBy({id: accessId});
        if (!access) {
            return res.status(404).json({message: 'Point d\'accès non trouvé'});
        }
        return res.json(await modifierAccess(accessId, macadress, typePoint, location, nompoint, active, collabAutoriseIds, serviceAutoriseIds));
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Erreur lors de la modification du point d\'accès' });
    }
});

// Obtenir la liste des points d'accès
accessRouter.get('/listeAccess', jwtMiddlewareFullInfo, async (req, res) => {
    try {
        const accessList = await listeAccess();
        return res.json(accessList);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Erreur lors de la récupération de la liste des points d\'accès' });
    }
});

// Obtenir les points d'accès accessibles par un collaborateur
accessRouter.get('/pointsAccessibles', jwtMiddlewareFullInfo, async (req, res) => {
    try {
        let connectedCollab:Collaborateur = req.body.connectedCollab
        return res.send(await pointAccessAccessible(connectedCollab));
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Erreur lors de la récupération des points d\'accès accessibles' });
    }
});

// Tester si un token a accès a un point
accessRouter.get('/check/:token/:macAdress', async (req, res) => {
    try {
        let collab = await checkQRCode(req.params.token)
        res.send(await aAccess(collab,req.params.macAdress))
    } catch (error) {
        return res.sendStatus(500)
    }
});

// Récupérer la config du point d'accès
accessRouter.get('/config/:macAdress', async (req, res) => {
    try {

        res.send(await getPointConfig(req.params.macAdress))
    } catch (error) {
        return res.sendStatus(500)
    }
});

export {accessRouter}
