import { Collaborateur } from '../database/entity/Collaborateur';
import * as express from "express";
import { jwtMiddlewareFullInfo } from "../middleware/jwt";
import {
    accepterAbsence,
    creerAbsence,
    getAbsences,
    getAbsenceUnderMyControl, getAllAbsences,
    modifierAbsence
} from "../controller/AbsenceController";
import { isARH, isDRH, isRH } from "../controller/CollabController";
import { isSuperior } from "../controller/ServiceController";
import { ErrorHandler } from "../utils/error/error-handler";
import { checkRequiredField } from "../utils/global";
import { jsonToExcel } from "../utils/excel/json-to-excel";
import {CollaborateurRepository} from "../database/repository/CollaborateurRepository";

const absenceRouter = express.Router();

absenceRouter.get('/my/export', jwtMiddlewareFullInfo, async (req, res) => {
    /*  #swagger.tags = ['Absence']
        #swagger.path = '/absence/my/export'
        #swagger.method = 'get'
        #swagger.description = 'Export absences under my control as an Excel file.'
        #swagger.responses[200] = {
            description: 'File downloaded successfully.'
        }
        #swagger.responses[401] = {
            description: 'Unauthorized access.'
        }
    */
    try {
        const collab: Collaborateur = req.body.connectedCollab;
        let absences = undefined;
        let filter = req.query.filtering ? JSON.parse(req.query.filtering as string) : undefined;
        if (
            isDRH(collab)
            || isARH(collab)
            || isRH(collab)
        ) {
            absences = await getAllAbsences(null, null, filter);
        } else if (collab.service.chefservice.id === collab.id) {
            absences = await getAbsenceUnderMyControl(collab, null, null, filter);
        } else {
            return res.sendStatus(401);
        }
        absences[0].forEach((access) => {
            access.collab = access.collab.nom + ' ' + access.collab.prenom;
            access.reponseDe = access.reponseDe ? access.reponseDe.nom + ' ' + access.reponseDe.prenom : '';
            access.modifierPar = access.modifierPar ? access.modifierPar.nom + ' ' + access.modifierPar.prenom : '';
        });

        let stream = jsonToExcel(absences[0]);

        res.setHeader('Content-Disposition', 'attachment; filename=output.xlsx');
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        stream.pipe(res);

    } catch (error) {
        ErrorHandler(error, req, res);
    }
});

// Obtenir les absences des collaborateurs sous mon contrôle
absenceRouter.get('/my/:page?/:itemsParPage?', jwtMiddlewareFullInfo, async (req, res) => {
    /*  #swagger.tags = ['Absence']
        #swagger.path = '/absence/my/{page}/{itemsParPage}'
        #swagger.method = 'get'
        #swagger.description = 'Get absences under my control.'
        #swagger.parameters['page'] = {
            in: 'path',
            description: 'Page number',
            required: false,
            type: 'integer',
            example: 1
        }
        #swagger.parameters['itemsParPage'] = {
            in: 'path',
            description: 'Number of items per page',
            required: false,
            type: 'integer',
            example: 10
        }
        #swagger.parameters['filtering'] = {
            in: 'query',
            description: 'Filter criteria',
            required: false,
            type: 'string',
            example: '{"status": "approved"}'
        }
        #swagger.responses[200] = {
            description: 'List of absences.',
            schema: {
                type: 'array',
                items: { $ref: '#/definitions/Absence' }
            }
        }
        #swagger.responses[401] = {
            description: 'Unauthorized access.'
        }
    */
    try {
        const collab: Collaborateur = req.body.connectedCollab;
        let absences = undefined;
        let page = parseInt(req.params.page);
        let itemsParPage = parseInt(req.params.itemsParPage);
        let filter = req.query.filtering ? JSON.parse(req.query.filtering as string) : undefined;
        if (
            isDRH(collab)
            || isARH(collab)
            || isRH(collab)
        ) {
            absences = await getAllAbsences(page, itemsParPage, filter);
        } else if (collab.service.chefservice.id === collab.id) {
            absences = await getAbsenceUnderMyControl(collab, page, itemsParPage, filter);
        } else {
            return res.sendStatus(401);
        }
        return res.send(absences);

    } catch (error) {
        ErrorHandler(error, req, res);
    }
});

// Obtenir mes absences
absenceRouter.get('/mesAbsences', jwtMiddlewareFullInfo, async (req, res) => {
    /*  #swagger.tags = ['Absence']
        #swagger.path = '/absence/mesAbsences'
        #swagger.method = 'get'
        #swagger.description = 'Get my absences.'
        #swagger.responses[200] = {
            description: 'List of my absences.',
            schema: {
                type: 'array',
                items: { $ref: '#/definitions/Absence' }
            }
        }
    */
    try {
        const collab = req.body.connectedCollab;
        const absences = await getAbsences(collab);
        return res.json(absences);
    } catch (error) {
        ErrorHandler(error, req, res);
    }
});

// Créer une absence
absenceRouter.post('/creerUneAbsence/:idcollab?', jwtMiddlewareFullInfo, async (req, res) => {
    /*  #swagger.tags = ['Absence']
        #swagger.path = '/absence/creerUneAbsence/{idcollab}'
        #swagger.method = 'post'
        #swagger.description = 'Create an absence.'
        #swagger.parameters['idcollab'] = {
            in: 'path',
            description: 'ID of the collaborator',
            required: false,
            type: 'integer',
            example: 1
        }
        #swagger.parameters['body'] = {
            in: 'body',
            description: 'Absence details',
            required: true,
            schema: {
                datedeb: '2023-05-31',
                datefin: '2023-06-07',
                periodeDeb: '0',
                periodeFin: '1',
                raison: 'sick leave',
                description: 'Flu'
            }
        }
        #swagger.responses[200] = {
            description: 'Absence created successfully.',
            schema: { $ref: '#/definitions/Absence' }
        }
        #swagger.responses[422] = {
            description: 'Required fields missing.'
        }
    */
    try {
        let connectedCollab = req.body.connectedCollab;
        let targetCollab: Collaborateur = undefined;
        let targetCollabID = parseInt(req.params.idcollab);
        if (targetCollabID) {
            targetCollab = await CollaborateurRepository.findOneOrFail({
                where: {id: targetCollabID},
                relations: {service: {chefservice: true}}
            });
            if (!isDRH(connectedCollab) && !isARH(connectedCollab) && !isRH(connectedCollab) && !await isSuperior(connectedCollab, targetCollab)) {
                return res.sendStatus(403);
            }
        } else {
            targetCollab = connectedCollab;
        }

        const {datedeb, datefin, periodeDeb, periodeFin, raison, description} = req.body;
        if (!checkRequiredField([datefin, datedeb, periodeDeb, periodeFin])) {
            return res.sendStatus(422);
        }
        const newAbsence = await creerAbsence(targetCollab, datedeb, datefin, periodeDeb, periodeFin, raison, description);
        return res.json(newAbsence);
    } catch (error) {
        ErrorHandler(error, req, res);
    }
});

// Modifier une absence
absenceRouter.put('/modifierAbsence/:absenceId', jwtMiddlewareFullInfo, async (req, res) => {
    try {
        const donneurDordre = req.body.connectedCollab;
        const absenceId = parseInt(req.params.absenceId);
        const {datedeb, datefin, raison, description} = req.body;
        if (!checkRequiredField([datefin, datedeb, description])) {
            return res.sendStatus(422);
        }
        const updatedAbsence = await modifierAbsence(absenceId, datedeb, datefin, raison, donneurDordre, description);
        return res.json(updatedAbsence);
    } catch (error) {
        if (error === 'Accès refusé') {
            return res.status(403).json({message: error});
        } else {
            ErrorHandler(error, req, res);
        }
    }
});

// Accepter une absence
absenceRouter.put('/accepterAbsence/:absenceId', jwtMiddlewareFullInfo, async (req, res) => {
    try {
        const donneurDordre = req.body.connectedCollab;
        const absenceId = parseInt(req.params.absenceId);
        const reponse = req.body.reponse;
        const updatedAbsence = await accepterAbsence(absenceId, reponse, donneurDordre);
        return res.json(updatedAbsence);
    } catch (error) {
        if (error === 'Accès refusé') {
            return res.status(403).json({message: error});
        } else {
            ErrorHandler(error, req, res);
        }
    }
});

export { absenceRouter };
