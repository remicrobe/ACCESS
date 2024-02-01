import * as express from "express";
import { Collaborateur } from "../database/entity/Collab";
import { jwtMiddlewareFullInfo } from "../middleware/jwt";
import { getAllAbsences, getAbsenceUnderMyControl } from "../controller/AbsenceController";
import { isDRH, isARH, isRH } from "../controller/CollabController";
import { ErrorHandler } from "../utils/error/error-handler";
import { getAllIncident, getIncidentUnderMyControl } from "../controller/IncidentController";

const incidentRouter = express.Router();

incidentRouter.get('/incidentDeMesCollaborateurs/:page?/:itemsParPage?', jwtMiddlewareFullInfo, async (req, res) => {
    try {
        const collab:Collaborateur = req.body.connectedCollab;
        let incident = undefined
        let page = parseInt(req.params.page)
        let itemsParPage = parseInt(req.params.itemsParPage)
        let filter = req.query.filtering ? JSON.parse(req.query.filtering as string) : undefined
        if(
            isDRH(collab)
            || isARH(collab)
            || isRH(collab)
        ) {
            incident = await getAllIncident(page, itemsParPage, filter)
        }
        else if(collab.service.chefservice.id === collab.id){
            incident = await getIncidentUnderMyControl(collab, page, itemsParPage, filter);
        }else{
            return res.sendStatus(401)
        }
        return res.send(incident);

    } catch (error) {
        ErrorHandler(error, req, res)
    }
});

export { incidentRouter }