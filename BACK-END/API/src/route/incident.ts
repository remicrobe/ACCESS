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

incidentRouter.get('/incidentDeMesCollaborateurs/:page?/:itemsParPage?', jwtMiddlewareFullInfo, async (req, res) => {
    try {
        const collab: Collaborateur = req.body.connectedCollab;
        let incident = undefined;
        let page = parseInt(req.params.page);
        let itemsParPage = parseInt(req.params.itemsParPage);
        let filter = req.query.filtering ? JSON.parse(req.query.filtering as string) : undefined;
        if (
            isDRH(collab)
            || isARH(collab)
            || isRH(collab)
        ) {
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

incidentRouter.post('/:id/message', jwtMiddlewareFullInfo, async (req, res) => {
    try {
        const collab: Collaborateur = req.body.connectedCollab;
        let idIncident = parseInt(req.params.id);
        let message = req.body.message;

        if(!idIncident && !message) {
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

        if (
            isDRH(collab)
            || isARH(collab)
            || isRH(collab)
        ) {

        } else if (await isSuperior(collab, incident.collab)) {

        } else {
            return res.sendStatus(403);
        }

        let reponseIncident = new IncidentReponse();
        reponseIncident.incident = incident;
        reponseIncident.reponse = `${collab.nom} ${collab.prenom} - ${message}`

        incident.modifiePar = collab;
        incident.modifieLe = new Date();
        incident.ouvert = false;
        await AppDataSource.getRepository(Incident).save(incident)

        return res.send(await AppDataSource.getRepository(IncidentReponse).save(reponseIncident))
    } catch (error) {
        ErrorHandler(error, req, res);
    }
});


incidentRouter.get('/:id', jwtMiddlewareFullInfo, async (req, res) => {
    try {
        const collab: Collaborateur = req.body.connectedCollab;
        let idIncident = parseInt(req.params.id);

        if(!idIncident) {
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

        if (
            isDRH(collab)
            || isARH(collab)
            || isRH(collab)
        ) {
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
