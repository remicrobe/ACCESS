

// Ajouter des collaborateurs à un service
import {AppDataSource} from "../database/datasource";
import {Service} from "../database/entity/Service";
import * as express from "express";
import {createService, editService, getCollabService, ServiceUnderControl} from "../controller/ServiceController";
import {Collaborateur} from "../database/entity/Collab";
import {isARH, isDRH, isRH} from "../controller/CollabController";
import {jwtMiddleware, jwtMiddlewareFullInfo} from "../middleware/jwt";

const serviceRouter = express.Router();

// Créer un nouveau service
serviceRouter.post('/creerService', jwtMiddleware, async (req, res) => {
    const { nomService, collaborateurs, chefService } = req.body; // Supposons que les données du service sont envoyées dans le corps de la requête
    try {
        let connectedCollab:Collaborateur = req.body.connectedCollab
        if(!isDRH(connectedCollab)){
            res.sendStatus(401)
        }else {
            const newService = await createService(nomService, collaborateurs, chefService);
            return res.json(newService);
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Erreur lors de la création du service' });
    }
});

// Modifier un service existant
serviceRouter.put('/modifierService/:serviceId',  jwtMiddlewareFullInfo, async (req, res) => {
    const serviceId = parseInt(req.params.serviceId);
    const { nomService, collaborateurs, chefService } = req.body; // Supposons que les données de mise à jour sont envoyées dans le corps de la requête
    try {
        let connectedCollab:Collaborateur = req.body.connectedCollab
        const service = await AppDataSource.getRepository(Service).findOneOrFail({where:{id: serviceId},relations:{chefservice:true}});
        let idResp = service.chefservice ? service.chefservice.id : -1
        if(!isDRH(connectedCollab) && !isARH(connectedCollab) && !isRH(connectedCollab) && !(idResp === connectedCollab.id) ){
            res.sendStatus(401)
        }else {
            return res.json(await editService(service, nomService, collaborateurs, chefService));
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Erreur lors de la modification du service' });
    }
});

// Obtenir les collaborateurs d'un service
serviceRouter.get('/monService', jwtMiddlewareFullInfo, async (req, res) => {
    try {
        let connectedCollab:Collaborateur = req.body.connectedCollab
        res.send(connectedCollab.service)
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Erreur lors de la récupération des collaborateurs' });
    }
});

// Obtenir les collaborateurs d'un service
serviceRouter.get('/mesServices', jwtMiddlewareFullInfo, async (req, res) => {
    try {
        let connectedCollab:Collaborateur = req.body.connectedCollab
        res.send(await ServiceUnderControl(connectedCollab))
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Erreur lors de la récupération des collaborateurs' });
    }
});


// Obtenir les collaborateurs d'un service
serviceRouter.get('/:serviceId/collaborateurs', jwtMiddlewareFullInfo, async (req, res) => {
    try {
        const serviceId = parseInt(req.params.serviceId);
        let connectedCollab:Collaborateur = req.body.connectedCollab

        const service = await AppDataSource.getRepository(Service).findOne({where:{id:serviceId},relations:{chefservice:true,collabs:true}});
        if (!service) {
            return res.status(404).json({ message: 'Service non trouvé' });
        }

        if(
            isDRH(connectedCollab)
            || isARH(connectedCollab)
            || isRH(connectedCollab)
            || (connectedCollab.id === service.chefservice.id)
        ) {
            res.send(service);
        }else{
            res.sendStatus(401)
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Erreur lors de la récupération des collaborateurs' });
    }
});

// Obtenir les services
serviceRouter.get('/', jwtMiddlewareFullInfo, async (req, res) => {
    try {
        let connectedCollab:Collaborateur = req.body.connectedCollab

        const service = await AppDataSource.getRepository(Service).find({relations:{chefservice:true,collabs:true}});


        if(
            isDRH(connectedCollab)
            || isARH(connectedCollab)
            || isRH(connectedCollab)
        ) {
            res.send(service);
        }else{
            res.sendStatus(401)
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Erreur lors de la récupération des collaborateurs' });
    }
});

export {serviceRouter}