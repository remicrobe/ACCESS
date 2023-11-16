import express = require("express");
import { getAllAbsences, getAbsenceUnderMyControl, getAbsences } from "../controller/AbsenceController";
import { isDRH, isARH, isRH } from "../controller/CollabController";
import { Collaborateur } from "../database/entity/Collab";
import { jwtMiddlewareFullInfo } from "../middleware/jwt";
import { ErrorHandler } from "../utils/error/error-handler";
import { listerPresence, listerPresenceMesCollabs, obtenirPresenceCollab } from "../controller/PresenceController";

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


presenceRouter.get('/mesPresences', jwtMiddlewareFullInfo, async (req, res) => {
    try {
        const collab = req.body.connectedCollab;
        const presence = await obtenirPresenceCollab(collab);
        return res.json(presence);
    } catch (error) {
        ErrorHandler(error, req, res)
    }
});

export { presenceRouter }

// @TODO: Modifier absence, créer absence etc.....