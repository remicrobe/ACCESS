

// Ajouter des collaborateurs à un service
import {AppDataSource} from "../database/datasource";
import {Service} from "../database/entity/Service";
import * as express from "express";
import {addCollab, createService, editService, getCollabService, removeCollab} from "../controller/ServiceController";

const serviceRouter = express.Router();

// Créer un nouveau service
serviceRouter.post('/', async (req, res) => {
    const { nomService, collaborateurs, chefService } = req.body; // Supposons que les données du service sont envoyées dans le corps de la requête
    try {
        const newService = await createService(nomService, collaborateurs, chefService);
        return res.json(newService);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Erreur lors de la création du service' });
    }
});

// Modifier un service existant
serviceRouter.put('/:serviceId', async (req, res) => {
    const serviceId = parseInt(req.params.serviceId);
    const { nomService, chefService } = req.body; // Supposons que les données de mise à jour sont envoyées dans le corps de la requête
    try {
        const service = await AppDataSource.getRepository(Service).findOneBy({id:serviceId});
        if (!service) {
            return res.status(404).json({ message: 'Service non trouvé' });
        }
        await editService(service, nomService, chefService);
        return res.json({ message: 'Service modifié avec succès' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Erreur lors de la modification du service' });
    }
});

/*// Supprimer un service
serviceRouter.delete('/service/:serviceId', async (req, res) => {
    const serviceId = req.params.serviceId;
    try {
        const service = await AppDataSource.getRepository(Service).findOne(serviceId);
        if (!service) {
            return res.status(404).json({ message: 'Service non trouvé' });
        }
        await deleteService(service);
        return res.json({ message: 'Service supprimé avec succès' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Erreur lors de la suppression du service' });
    }
});*/

serviceRouter.post('/:serviceId/addCollab', async (req, res) => {
    const serviceId = parseInt(req.params.serviceId);
    const { collaborateurs } = req.body; // Supposons que les collaborateurs sont envoyés dans le corps de la requête
    try {
        const service = await AppDataSource.getRepository(Service).findOneBy({id:serviceId});
        if (!service) {
            return res.status(404).json({ message: 'Service non trouvé' });
        }
        await addCollab(collaborateurs, service);
        return res.json({ message: 'Collaborateurs ajoutés avec succès' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Erreur lors de l\'ajout de collaborateurs' });
    }
});

// Supprimer des collaborateurs d'un service
serviceRouter.delete('/:serviceId/removeCollab', async (req, res) => {
    const serviceId = parseInt(req.params.serviceId);
    const { collaborateurs } = req.body; // Supposons que les collaborateurs à supprimer sont envoyés dans le corps de la requête
    try {
        const service = await AppDataSource.getRepository(Service).findOneBy({id:serviceId});
        if (!service) {
            return res.status(404).json({ message: 'Service non trouvé' });
        }
        await removeCollab(collaborateurs, service);
        return res.json({ message: 'Collaborateurs supprimés avec succès' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Erreur lors de la suppression de collaborateurs' });
    }
});

// Obtenir les collaborateurs d'un service
serviceRouter.get('/:serviceId/collaborateurs', async (req, res) => {
    const serviceId = parseInt(req.params.serviceId);
    try {
        const service = await AppDataSource.getRepository(Service).findOneBy({id:serviceId});
        if (!service) {
            return res.status(404).json({ message: 'Service non trouvé' });
        }
        const collaborateurs = await getCollabService(service);
        return res.json(collaborateurs);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Erreur lors de la récupération des collaborateurs' });
    }
});

export {serviceRouter}