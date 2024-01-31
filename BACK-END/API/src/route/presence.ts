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
import {jsonToExcel} from "../utils/excel/json-to-excel";
import {Presence} from "../database/entity/Presence";

const presenceRouter = express.Router();

presenceRouter.get('/presenceDeMesCollaborateurs/:page?/:itemsParPage?', jwtMiddlewareFullInfo, async (req, res) => {
    try {
        const collab:Collaborateur = req.body.connectedCollab;
        let presence = undefined
        let page = parseInt(req.params.page)
        let itemsParPage = parseInt(req.params.itemsParPage)
        let filter = req.query.filtering ? JSON.parse(req.query.filtering as string) : undefined
        if(
            isDRH(collab)
            || isARH(collab)
            || isRH(collab)
        ) {
            presence = await listerPresence(page, itemsParPage, filter)
        }
        else if(collab.service.chefservice.id === collab.id){
            presence = await listerPresenceMesCollabs(collab, page, itemsParPage, filter);
        }else{
            return res.sendStatus(401)
        }
        return res.send(presence);

    } catch (error) {
        ErrorHandler(error, req, res)
    }
});

presenceRouter.get('/presenceDeMesCollaborateurs/export/:page?/:itemsParPage?', jwtMiddlewareFullInfo, async (req, res) => {
    try {
        const collab:Collaborateur = req.body.connectedCollab;
        let presence = undefined
        let page = parseInt(req.params.page)
        let itemsParPage = parseInt(req.params.itemsParPage)
        let filter = req.query.filtering ? JSON.parse(req.query.filtering as string) : undefined
        if(
            isDRH(collab)
            || isARH(collab)
            || isRH(collab)
        ) {
            presence = await listerPresence(page, itemsParPage, filter)
        }
        else if(collab.service.chefservice.id === collab.id){
            presence = await listerPresenceMesCollabs(collab, page, itemsParPage, filter);
        }else{
            return res.sendStatus(401)
        }
        presence[0] .forEach((pres) => {
            pres.collab = pres.collab.nom + ' ' + pres.collab.prenom
            if(pres.modifierPar)
                pres.modifiePar = pres.modifiePar.nom + ' ' + pres.modifiePar.prenom
        })

        let stream = jsonToExcel(presence[0]);

        res.setHeader('Content-Disposition', 'attachment; filename=output.xlsx');
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        stream.pipe(res);

    } catch (error) {
        ErrorHandler(error, req, res)
    }
});


presenceRouter.get('/mesPresences', jwtMiddlewareFullInfo, async (req, res) => {
    try {
        const collab = req.body.connectedCollab;
        const presence = await obtenirPresenceCollab(collab);
        return res.json(presence);
    } catch (error) {
        ErrorHandler(error, req, res)
    }
});

presenceRouter.post('/ajouterPresenceCollab', jwtMiddlewareFullInfo, async (req, res) => {
    try {
        const collab: Collaborateur = req.body.connectedCollab;
        const { idCollab, datePres, hdeb, hfin, desc } = req.body;
        res.send(await ajouterPresenceCollab(idCollab, datePres, hdeb, hfin, desc, collab))
    } catch (error) {
        ErrorHandler(error, req, res);
    }
});

presenceRouter.put('/modifierPresenceCollab/:idPres', jwtMiddlewareFullInfo, async (req, res) => {
    try {
        const collab: Collaborateur = req.body.connectedCollab;
        const { idPres } = req.params;
        const { idCollab , datePres, hdeb, hfin, desc } = req.body;
        res.send(await modifierPresenceCollab(parseInt(idPres), datePres, hdeb, hfin,desc, collab));

    } catch (error) {
        ErrorHandler(error, req, res);
    }
});


export { presenceRouter }

