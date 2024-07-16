import { AppDataSource } from "../database/datasource";
import { Service } from "../database/entity/Service";
import * as express from "express";
import { createService, editService, getCollabService, ServiceUnderControl } from "../controller/ServiceController";
import { Collaborateur } from "../database/entity/Collab";
import { isARH, isDRH, isRH } from "../controller/CollabController";
import { jwtMiddleware, jwtMiddlewareFullInfo } from "../middleware/jwt";
import { ErrorHandler } from "../utils/error/error-handler";
import { checkRequiredField } from "../utils/global";

const serviceRouter = express.Router();

// Créer un nouveau service
serviceRouter.post('/creerService', jwtMiddleware, async (req, res) => {
    /*  #swagger.tags = ['Service']
        #swagger.path = '/service/creerService'
        #swagger.method = 'post'
        #swagger.description = 'Créer un nouveau service'
        #swagger.parameters['body'] = {
            in: 'body',
            description: 'Informations du service',
            required: true,
            schema: {
                nomservice: 'string',
                collabs: 'array',
                chefservice: {
                    id: 'integer'
                }
            }
        }
        #swagger.responses[200] = {
            description: 'Nouveau service créé.',
            schema: { $ref: '#/definitions/Service' }
        }
        #swagger.responses[422] = {
            description: 'Données manquantes.'
        }
        #swagger.responses[401] = {
            description: 'Accès non autorisé.'
        }
    */
    const { nomservice, collabs, chefservice } = req.body;
    try {
        if (!checkRequiredField([nomservice, collabs, chefservice])) {
            return res.sendStatus(422);
        }
        let connectedCollab: Collaborateur = req.body.connectedCollab;
        if (!isDRH(connectedCollab)) {
            res.sendStatus(401);
        } else {
            const newService = await createService(nomservice, collabs, chefservice.id);
            return res.json(newService);
        }
    } catch (error) {
        ErrorHandler(error, req, res);
    }
});

// Modifier un service existant
serviceRouter.put('/modifierService/:serviceId', jwtMiddlewareFullInfo, async (req, res) => {
    /*  #swagger.tags = ['Service']
        #swagger.path = '/service/modifierService/{serviceId}'
        #swagger.method = 'put'
        #swagger.description = 'Modifier un service existant'
        #swagger.parameters['serviceId'] = {
            in: 'path',
            description: 'ID du service',
            required: true,
            type: 'integer'
        }
        #swagger.parameters['body'] = {
            in: 'body',
            description: 'Informations du service',
            required: true,
            schema: {
                nomservice: 'string',
                collabs: 'array',
                chefservice: {
                    id: 'integer'
                }
            }
        }
        #swagger.responses[200] = {
            description: 'Service modifié.',
            schema: { $ref: '#/definitions/Service' }
        }
        #swagger.responses[422] = {
            description: 'Données manquantes.'
        }
        #swagger.responses[401] = {
            description: 'Accès non autorisé.'
        }
    */
    const serviceId = parseInt(req.params.serviceId);
    const { nomservice, collabs, chefservice } = req.body;
    try {
        if (!checkRequiredField([nomservice, collabs, chefservice])) {
            return res.sendStatus(422);
        }
        let connectedCollab: Collaborateur = req.body.connectedCollab;
        const service = await AppDataSource.getRepository(Service).findOneOrFail({
            where: { id: serviceId },
            relations: { chefservice: true }
        });
        let idResp = service.chefservice ? service.chefservice.id : -1;
        if (!isDRH(connectedCollab) && !isARH(connectedCollab) && !isRH(connectedCollab) && !(idResp === connectedCollab.id)) {
            res.sendStatus(401);
        } else {
            return res.json(await editService(service, nomservice, collabs, chefservice.id));
        }
    } catch (error) {
        ErrorHandler(error, req, res);
    }
});

// Obtenir les collaborateurs d'un service
serviceRouter.get('/monService', jwtMiddlewareFullInfo, async (req, res) => {
    /*  #swagger.tags = ['Service']
        #swagger.path = '/service/monService'
        #swagger.method = 'get'
        #swagger.description = 'Obtenir les collaborateurs de mon service'
        #swagger.responses[200] = {
            description: 'Collaborateurs du service.',
            schema: { $ref: '#/definitions/Service' }
        }
    */
    try {
        let connectedCollab: Collaborateur = req.body.connectedCollab;
        res.send(connectedCollab.service);
    } catch (error) {
        ErrorHandler(error, req, res);
    }
});

// Obtenir les services sous la responsabilité du collaborateur connecté
serviceRouter.get('/mesServices', jwtMiddlewareFullInfo, async (req, res) => {
    /*  #swagger.tags = ['Service']
        #swagger.path = '/service/mesServices'
        #swagger.method = 'get'
        #swagger.description = 'Obtenir les services sous ma responsabilité'
        #swagger.responses[200] = {
            description: 'Services sous la responsabilité du collaborateur.',
            schema: { $ref: '#/definitions/Service' }
        }
    */
    try {
        let connectedCollab: Collaborateur = req.body.connectedCollab;
        res.send(await ServiceUnderControl(connectedCollab));
    } catch (error) {
        ErrorHandler(error, req, res);
    }
});

// Obtenir les collaborateurs d'un service spécifique
serviceRouter.get('/:serviceId/collaborateurs', jwtMiddlewareFullInfo, async (req, res) => {
    /*  #swagger.tags = ['Service']
        #swagger.path = '/service/{serviceId}/collaborateurs'
        #swagger.method = 'get'
        #swagger.description = 'Obtenir les collaborateurs d\'un service spécifique'
        #swagger.parameters['serviceId'] = {
            in: 'path',
            description: 'ID du service',
            required: true,
            type: 'integer'
        }
        #swagger.responses[200] = {
            description: 'Collaborateurs du service.',
            schema: { $ref: '#/definitions/Service' }
        }
        #swagger.responses[404] = {
            description: 'Service non trouvé.'
        }
        #swagger.responses[401] = {
            description: 'Accès non autorisé.'
        }
    */
    try {
        const serviceId = parseInt(req.params.serviceId);
        let connectedCollab: Collaborateur = req.body.connectedCollab;

        const service = await AppDataSource.getRepository(Service).findOne({
            where: { id: serviceId },
            relations: { chefservice: true, collabs: true }
        });
        if (!service) {
            return res.status(404).json({ message: 'Service non trouvé' });
        }

        if (isDRH(connectedCollab) || isARH(connectedCollab) || isRH(connectedCollab) || (connectedCollab.id === service.chefservice.id)) {
            res.send(service);
        } else {
            res.sendStatus(401);
        }
    } catch (error) {
        ErrorHandler(error, req, res);
    }
});

// Obtenir tous les services
serviceRouter.get('/', jwtMiddlewareFullInfo, async (req, res) => {
    /*  #swagger.tags = ['Service']
        #swagger.path = '/service'
        #swagger.method = 'get'
        #swagger.description = 'Obtenir tous les services'
        #swagger.responses[200] = {
            description: 'Liste de tous les services.',
            schema: { $ref: '#/definitions/Service' }
        }
        #swagger.responses[401] = {
            description: 'Accès non autorisé.'
        }
    */
    try {
        let connectedCollab: Collaborateur = req.body.connectedCollab;

        const service = await AppDataSource.getRepository(Service).find({
            relations: {
                chefservice: true,
                collabs: true
            }
        });

        if (isDRH(connectedCollab) || isARH(connectedCollab) || isRH(connectedCollab)) {
            res.send(service);
        } else {
            res.sendStatus(401);
        }
    } catch (error) {
        ErrorHandler(error, req, res);
    }
});

export { serviceRouter };
