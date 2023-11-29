import express = require("express");
import { jwtMiddleware } from "../middleware/jwt";
import { checkRequiredField } from "../utils/global";
import { ErrorHandler } from "../utils/error/error-handler";
import e = require("express");
import { Collaborateur } from "../database/entity/Collab";
import { isARH, isDRH, isRH } from "../controller/CollabController";
import { listeParam, modifierParam } from "../controller/ParamController";

const paramRouter = express.Router();

// Modifier un param
paramRouter.put('/modifierParam/:uniqueName', jwtMiddleware, async (req, res) => {
    const { value } = req.body;
    const {uniqueName} = req.params
    const collab:Collaborateur = req.body.connectedCollab;
    try {
        if(!checkRequiredField([ value, uniqueName ])){
            return res.sendStatus(422)
        }
        if (!isDRH(collab) && !isARH(collab) && !isRH(collab) ){
            return res.sendStatus(401)
        }
        res.send(await modifierParam(uniqueName,value))

    } catch (error) {
        ErrorHandler(error, req, res)
    }
});

// Lister les paramètres
paramRouter.get('/', jwtMiddleware, async (req, res) => {
    const { nom, valeur } = req.body;
    const collab:Collaborateur = req.body.connectedCollab;
    try {
        if (!isDRH(collab) && !isARH(collab) && !isRH(collab) ){
            return res.sendStatus(401)
        }
        let params = await listeParam()
        console.log(params)
        res.send(params)
    } catch (error) {
        ErrorHandler(error, req, res)
    }
});

export {paramRouter };