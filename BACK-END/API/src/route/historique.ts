import * as express from "express";
import { jwtMiddlewareFullInfo } from "../middleware/jwt";
import { Request, Response } from "express";
import { AppDataSource } from "../database/datasource";
import { HorairesModele } from "../database/entity/HorairesModele";
import { ErrorHandler } from "../utils/error/error-handler";
import { Collaborateur } from "../database/entity/Collaborateur";
import { getHistory, getHistoryByService, getMyHistory } from "../controller/HistoriqueController";
import { isARH, isDRH, isRH } from "../controller/CollabController";
import { IsNull } from "typeorm";
import { jsonToExcel } from "../utils/excel/json-to-excel";

const historiqueRouter = express.Router();

// Route pour obtenir l'historique personnel du collaborateur connecté
historiqueRouter.get('/me', jwtMiddlewareFullInfo, async (req: Request, res: Response) => {
    /*  #swagger.tags = ['Historique']
        #swagger.path = '/historique/me'
        #swagger.method = 'get'
        #swagger.description = 'Obtenir l\'historique personnel du collaborateur connecté'
        #swagger.responses[200] = {
            description: 'Historique personnel du collaborateur connecté.',
            schema: { $ref: '#/definitions/Historique' }
        }
    */
    try {
        let connectedCollab: Collaborateur = req.body.connectedCollab;
        res.send(await getMyHistory(connectedCollab));
    } catch (error) {
        ErrorHandler(error, req, res);
    }
});

// Route pour obtenir l'historique avec pagination
historiqueRouter.get('/:page/:itemsParPage', jwtMiddlewareFullInfo, async (req: Request, res: Response) => {
    /*  #swagger.tags = ['Historique']
        #swagger.path = '/historique/{page}/{itemsParPage}'
        #swagger.method = 'get'
        #swagger.description = 'Obtenir l\'historique avec pagination'
        #swagger.parameters['page'] = {
            in: 'path',
            description: 'Numéro de la page',
            required: true,
            type: 'integer'
        }
        #swagger.parameters['itemsParPage'] = {
            in: 'path',
            description: 'Nombre d\'éléments par page',
            required: true,
            type: 'integer'
        }
        #swagger.parameters['filtering'] = {
            in: 'query',
            description: 'Filtres à appliquer',
            required: false,
            type: 'string'
        }
        #swagger.responses[200] = {
            description: 'Historique avec pagination.',
            schema: { $ref: '#/definitions/Historique' }
        }
        #swagger.responses[401] = {
            description: 'Non autorisé.'
        }
    */
    try {
        let connectedCollab: Collaborateur = req.body.connectedCollab;
        let page = parseInt(req.params.page);
        let itemsParPage = parseInt(req.params.itemsParPage);
        let filter = JSON.parse(req.query.filtering as string);
        if (isDRH(connectedCollab) || isARH(connectedCollab) || isRH(connectedCollab)) {
            res.send(await getHistory(page, itemsParPage, filter));
        } else if (connectedCollab.service && connectedCollab.service.chefservice.id === connectedCollab.id) {
            res.send(await getHistoryByService(connectedCollab.service, page, itemsParPage, filter));
        } else {
            res.sendStatus(401);
        }
    } catch (error) {
        ErrorHandler(error, req, res);
    }
});

// Route pour exporter l'historique
historiqueRouter.get('/export/:page/:itemsParPage', jwtMiddlewareFullInfo, async (req: Request, res: Response) => {
    /*  #swagger.tags = ['Historique']
        #swagger.path = '/historique/export/{page}/{itemsParPage}'
        #swagger.method = 'get'
        #swagger.description = 'Exporter l\'historique'
        #swagger.parameters['page'] = {
            in: 'path',
            description: 'Numéro de la page',
            required: true,
            type: 'integer'
        }
        #swagger.parameters['itemsParPage'] = {
            in: 'path',
            description: 'Nombre d\'éléments par page',
            required: true,
            type: 'integer'
        }
        #swagger.parameters['filtering'] = {
            in: 'query',
            description: 'Filtres à appliquer',
            required: false,
            type: 'string'
        }
        #swagger.responses[200] = {
            description: 'Fichier exporté avec succès.',
            content: {
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": {
                    schema: {
                        type: 'string',
                        format: 'binary'
                    }
                }
            }
        }
        #swagger.responses[401] = {
            description: 'Non autorisé.'
        }
    */
    try {
        let connectedCollab: Collaborateur = req.body.connectedCollab;
        let filter = JSON.parse(req.query.filtering as string);
        let data;
        if (isDRH(connectedCollab) || isARH(connectedCollab) || isRH(connectedCollab)) {
            data = await getHistory(null, null, filter);
        } else if (connectedCollab.service && connectedCollab.service.chefservice.id === connectedCollab.id) {
            data = await getHistoryByService(connectedCollab.service, null, null, filter);
        } else {
            return res.sendStatus(401);
        }

        data[0].forEach((access) => {
            access.collab = access.collab.nom + ' ' + access.collab.prenom;
            access.point = access.point.typePoint + ' ' + access.point.location + ' ' + access.point.nompoint;
        });

        let stream = jsonToExcel(data[0]);

        res.setHeader('Content-Disposition', 'attachment; filename=output.xlsx');
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        stream.pipe(res);
    } catch (error) {
        ErrorHandler(error, req, res);
    }
});

export { historiqueRouter };
