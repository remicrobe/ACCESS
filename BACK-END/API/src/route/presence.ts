import express = require("express");
import { getAllAbsences, getAbsenceUnderMyControl, getAbsences } from "../controller/AbsenceController";
import { isDRH, isARH, isRH } from "../controller/CollabController";
import { Collaborateur } from "../database/entity/Collab";
import { jwtMiddlewareFullInfo } from "../middleware/jwt";
import { ErrorHandler } from "../utils/error/error-handler";
import {
    ajouterPresenceCollab,
    listerPresence,
    listerPresenceMesCollabs,
    modifierPresenceCollab,
    obtenirPresenceCollab
} from "../controller/PresenceController";
import { jsonToExcel } from "../utils/excel/json-to-excel";
import { Presence } from "../database/entity/Presence";

const presenceRouter = express.Router();

// Lister les présences des collaborateurs
presenceRouter.get('/presenceDeMesCollaborateurs/:page?/:itemsParPage?', jwtMiddlewareFullInfo, async (req, res) => {
    /*  #swagger.tags = ['Présence']
        #swagger.path = '/presence/presenceDeMesCollaborateurs/{page}/{itemsParPage}'
        #swagger.method = 'get'
        #swagger.description = 'Lister les présences des collaborateurs'
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
            description: 'Filtres appliqués',
            required: false,
            type: 'string'
        }
        #swagger.responses[200] = {
            description: 'Liste des présences.',
            schema: { $ref: '#/definitions/Presence' }
        }
        #swagger.responses[401] = {
            description: 'Accès non autorisé.'
        }
    */
    try {
        const collab: Collaborateur = req.body.connectedCollab;
        let presence = undefined;
        let page = parseInt(req.params.page);
        let itemsParPage = parseInt(req.params.itemsParPage);
        let filter = req.query.filtering ? JSON.parse(req.query.filtering as string) : undefined;
        if (isDRH(collab) || isARH(collab) || isRH(collab)) {
            presence = await listerPresence(page, itemsParPage, filter);
        } else if (collab.service.chefservice.id === collab.id) {
            presence = await listerPresenceMesCollabs(collab, page, itemsParPage, filter);
        } else {
            return res.sendStatus(401);
        }
        return res.send(presence);
    } catch (error) {
        ErrorHandler(error, req, res);
    }
});

// Exporter les présences des collaborateurs
presenceRouter.get('/presenceDeMesCollaborateurs/export/:page?/:itemsParPage?', jwtMiddlewareFullInfo, async (req, res) => {
    /*  #swagger.tags = ['Présence']
        #swagger.path = '/presence/presenceDeMesCollaborateurs/export/{page}/{itemsParPage}'
        #swagger.method = 'get'
        #swagger.description = 'Exporter les présences des collaborateurs'
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
            description: 'Filtres appliqués',
            required: false,
            type: 'string'
        }
        #swagger.responses[200] = {
            description: 'Fichier Excel exporté.',
            schema: { type: 'file' }
        }
        #swagger.responses[401] = {
            description: 'Accès non autorisé.'
        }
    */
    try {
        const collab: Collaborateur = req.body.connectedCollab;
        let presence = undefined;
        let page = parseInt(req.params.page);
        let itemsParPage = parseInt(req.params.itemsParPage);
        let filter = req.query.filtering ? JSON.parse(req.query.filtering as string) : undefined;
        if (isDRH(collab) || isARH(collab) || isRH(collab)) {
            presence = await listerPresence(page, itemsParPage, filter);
        } else if (collab.service.chefservice.id === collab.id) {
            presence = await listerPresenceMesCollabs(collab, page, itemsParPage, filter);
        } else {
            return res.sendStatus(401);
        }
        presence[0].forEach((pres) => {
            pres.collab = pres.collab.nom + ' ' + pres.collab.prenom;
            if (pres.modifierPar)
                pres.modifiePar = pres.modifiePar.nom + ' ' + pres.modifiePar.prenom;
        });

        let stream = jsonToExcel(presence[0]);

        res.setHeader('Content-Disposition', 'attachment; filename=output.xlsx');
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        stream.pipe(res);
    } catch (error) {
        ErrorHandler(error, req, res);
    }
});

// Obtenir les présences d'un collaborateur
presenceRouter.get('/mesPresences', jwtMiddlewareFullInfo, async (req, res) => {
    /*  #swagger.tags = ['Présence']
        #swagger.path = '/presence/mesPresences'
        #swagger.method = 'get'
        #swagger.description = 'Obtenir les présences d\'un collaborateur'
        #swagger.responses[200] = {
            description: 'Liste des présences du collaborateur.',
            schema: { $ref: '#/definitions/Presence' }
        }
    */
    try {
        const collab = req.body.connectedCollab;
        const presence = await obtenirPresenceCollab(collab);
        return res.json(presence);
    } catch (error) {
        ErrorHandler(error, req, res);
    }
});

// Ajouter une présence pour un collaborateur
presenceRouter.post('/ajouterPresenceCollab', jwtMiddlewareFullInfo, async (req, res) => {
    /*  #swagger.tags = ['Présence']
        #swagger.path = '/presence/ajouterPresenceCollab'
        #swagger.method = 'post'
        #swagger.description = 'Ajouter une présence pour un collaborateur'
        #swagger.parameters['body'] = {
            in: 'body',
            description: 'Informations de la présence',
            required: true,
            schema: {
                idCollab: 'integer',
                datePres: 'string',
                hdeb: 'string',
                hfin: 'string',
                desc: 'string'
            }
        }
        #swagger.responses[200] = {
            description: 'Présence ajoutée.',
            schema: { $ref: '#/definitions/Presence' }
        }
    */
    try {
        const collab: Collaborateur = req.body.connectedCollab;
        const { idCollab, datePres, hdeb, hfin, desc } = req.body;
        res.send(await ajouterPresenceCollab(idCollab, datePres, hdeb, hfin, desc, collab));
    } catch (error) {
        ErrorHandler(error, req, res);
    }
});

// Modifier une présence pour un collaborateur
presenceRouter.put('/modifierPresenceCollab/:idPres', jwtMiddlewareFullInfo, async (req, res) => {
    /*  #swagger.tags = ['Présence']
        #swagger.path = '/presence/modifierPresenceCollab/{idPres}'
        #swagger.method = 'put'
        #swagger.description = 'Modifier une présence pour un collaborateur'
        #swagger.parameters['idPres'] = {
            in: 'path',
            description: 'ID de la présence',
            required: true,
            type: 'integer'
        }
        #swagger.parameters['body'] = {
            in: 'body',
            description: 'Informations de la présence',
            required: true,
            schema: {
                idCollab: 'integer',
                datePres: 'string',
                hdeb: 'string',
                hfin: 'string',
                desc: 'string'
            }
        }
        #swagger.responses[200] = {
            description: 'Présence modifiée.',
            schema: { $ref: '#/definitions/Presence' }
        }
    */
    try {
        const collab: Collaborateur = req.body.connectedCollab;
        const { idPres } = req.params;
        const { datePres, hdeb, hfin, desc } = req.body;
        res.send(await modifierPresenceCollab(parseInt(idPres), datePres, hdeb, hfin, desc, collab));
    } catch (error) {
        ErrorHandler(error, req, res);
    }
});

export { presenceRouter };
