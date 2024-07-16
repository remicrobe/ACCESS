import * as express from "express";
import { Collaborateur } from "../database/entity/Collab";
import { jwtMiddlewareFullInfo } from "../middleware/jwt";
import { isDRH, isARH, isRH } from "../controller/CollabController";
import { ErrorHandler } from "../utils/error/error-handler";
import { getAllIncident, getIncidentUnderMyControl } from "../controller/IncidentController";
import { AppDataSource } from '../database/datasource';
import { Incident } from '../database/entity/Incident';
import { isSuperior } from '../controller/ServiceController';
import { IncidentReponse } from '../database/entity/IncidentReponse';

const incidentRouter = express.Router();

// Route pour obtenir les incidents des collaborateurs sous la direction de l'utilisateur connecté
incidentRouter.get('/incidentDeMesCollaborateurs/:page?/:itemsParPage?', jwtMiddlewareFullInfo, async (req, res) => {
    /*  #swagger.tags = ['Incident']
        #swagger.path = '/incident/incidentDeMesCollaborateurs/{page}/{itemsParPage}'
        #swagger.method = 'get'
        #swagger.description = 'Obtenir les incidents des collaborateurs sous la direction de l\'utilisateur connecté'
        #swagger.parameters['page'] = {
            in: 'path',
            description: 'Numéro de la page',
            required: false,
            type: 'integer'
        }
        #swagger.parameters['itemsParPage'] = {
            in: 'path',
            description: 'Nombre d\'éléments par page',
            required: false,
            type: 'integer'
        }
        #swagger.parameters['filtering'] = {
            in: 'query',
            description: 'Filtres à appliquer',
            required: false,
            type: 'string'
        }
        #swagger.responses[200] = {
            description: 'Liste des incidents.',
            schema: { $ref: '#/definitions/Incident' }
        }
        #swagger.responses[401] = {
            description: 'Non autorisé.'
        }
    */
    try {
        const collab: Collaborateur = req.body.connectedCollab;
        let incident = undefined;
        let page = parseInt(req.params.page);
        let itemsParPage = parseInt(req.params.itemsParPage);
        let filter = req.query.filtering ? JSON.parse(req.query.filtering as string) : undefined;
        if (isDRH(collab) || isARH(collab) || isRH(collab)) {
            incident = await getAllIncident(page, itemsParPage, filter);
        } else if (collab.service.chefservice.id === collab.id) {
            incident = await getIncidentUnderMyControl(collab, page, itemsParPage, filter);
        } else {
            return res.sendStatus(401);
        }
        return res.send(incident);
    } catch (error) {
        ErrorHandler(error, req, res);
    }
});

// Route pour ajouter un message à un incident
incidentRouter.post('/:id/message', jwtMiddlewareFullInfo, async (req, res) => {
    /*  #swagger.tags = ['Incident']
        #swagger.path = '/incident/{id}/message'
        #swagger.method = 'post'
        #swagger.description = 'Ajouter un message à un incident'
        #swagger.parameters['id'] = {
            in: 'path',
            description: 'ID de l\'incident',
            required: true,
            type: 'integer'
        }
        #swagger.parameters['message'] = {
            in: 'body',
            description: 'Message à ajouter',
            required: true,
            schema: {
                type: 'object',
                properties: {
                    message: { type: 'string' }
                }
            }
        }
        #swagger.responses[200] = {
            description: 'Message ajouté à l\'incident.',
            schema: { $ref: '#/definitions/IncidentReponse' }
        }
        #swagger.responses[422] = {
            description: 'Paramètres non valides.'
        }
        #swagger.responses[403] = {
            description: 'Non autorisé.'
        }
    */
    try {
        const collab: Collaborateur = req.body.connectedCollab;
        let idIncident = parseInt(req.params.id);
        let message = req.body.message;

        if (!idIncident && !message) {
            return res.sendStatus(422);
        }

        let incident = await AppDataSource.getRepository(Incident).findOneOrFail({
            where: {
                id: idIncident
            },
            relations: {
                collab: true,
                reponse: true,
                modifiePar: true
            }
        });

        if (isDRH(collab) || isARH(collab) || isRH(collab)) {
            // Authorization check passed
        } else if (await isSuperior(collab, incident.collab)) {
            // Authorization check passed
        } else {
            return res.sendStatus(403);
        }

        let reponseIncident = new IncidentReponse();
        reponseIncident.incident = incident;
        reponseIncident.reponse = `${collab.nom} ${collab.prenom} - ${message}`;

        incident.modifiePar = collab;
        incident.modifieLe = new Date();
        incident.ouvert = false;
        await AppDataSource.getRepository(Incident).save(incident);

        return res.send(await AppDataSource.getRepository(IncidentReponse).save(reponseIncident));
    } catch (error) {
        ErrorHandler(error, req, res);
    }
});

// Route pour obtenir un incident par ID
incidentRouter.get('/:id', jwtMiddlewareFullInfo, async (req, res) => {
    /*  #swagger.tags = ['Incident']
        #swagger.path = '/incident/{id}'
        #swagger.method = 'get'
        #swagger.description = 'Obtenir un incident par ID'
        #swagger.parameters['id'] = {
            in: 'path',
            description: 'ID de l\'incident',
            required: true,
            type: 'integer'
        }
        #swagger.responses[200] = {
            description: 'Incident obtenu par ID.',
            schema: { $ref: '#/definitions/Incident' }
        }
        #swagger.responses[422] = {
            description: 'Paramètres non valides.'
        }
        #swagger.responses[403] = {
            description: 'Non autorisé.'
        }
    */
    try {
        const collab: Collaborateur = req.body.connectedCollab;
        let idIncident = parseInt(req.params.id);

        if (!idIncident) {
            return res.sendStatus(422);
        }

        let incident = await AppDataSource.getRepository(Incident).findOneOrFail({
            where: {
                id: idIncident
            },
            relations: {
                collab: true,
                reponse: true,
                modifiePar: true
            }
        });

        if (isDRH(collab) || isARH(collab) || isRH(collab)) {
            return res.send(incident);
        } else if (await isSuperior(collab, incident.collab)) {
            return res.send(incident);
        } else {
            return res.sendStatus(403);
        }
    } catch (error) {
        ErrorHandler(error, req, res);
    }
});

export { incidentRouter };
