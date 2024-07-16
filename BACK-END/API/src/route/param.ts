import express = require("express");
import { jwtMiddleware } from "../middleware/jwt";
import { checkRequiredField } from "../utils/global";
import { ErrorHandler } from "../utils/error/error-handler";
import { Collaborateur } from "../database/entity/Collab";
import { isARH, isDRH, isRH } from "../controller/CollabController";
import { listeParam, modifierParam } from "../controller/ParamController";

const paramRouter = express.Router();

// Modifier un paramètre
paramRouter.put('/modifierParam/:uniqueName', jwtMiddleware, async (req, res) => {
    /*  #swagger.tags = ['Paramètres']
        #swagger.path = '/param/modifierParam/{uniqueName}'
        #swagger.method = 'put'
        #swagger.description = 'Modifier un paramètre'
        #swagger.parameters['uniqueName'] = {
            in: 'path',
            description: 'Nom unique du paramètre',
            required: true,
            type: 'string'
        }
        #swagger.parameters['body'] = {
            in: 'body',
            description: 'Valeur du paramètre',
            required: true,
            schema: {
                value: 'string'
            }
        }
        #swagger.responses[200] = {
            description: 'Paramètre modifié.',
            schema: {
                uniqueName: 'string',
                value: 'string'
            }
        }
        #swagger.responses[422] = {
            description: 'Paramètre requis manquant.'
        }
        #swagger.responses[401] = {
            description: 'Accès non autorisé.'
        }
    */
    const { value } = req.body;
    const { uniqueName } = req.params;
    const collab: Collaborateur = req.body.connectedCollab;
    try {
        if (!checkRequiredField([value, uniqueName])) {
            return res.sendStatus(422);
        }
        if (!isDRH(collab) && !isARH(collab) && !isRH(collab)) {
            return res.sendStatus(401);
        }
        res.send(await modifierParam(uniqueName, value));
    } catch (error) {
        ErrorHandler(error, req, res);
    }
});

// Lister les paramètres
paramRouter.get('/', jwtMiddleware, async (req, res) => {
    /*  #swagger.tags = ['Paramètres']
        #swagger.path = '/param/'
        #swagger.method = 'get'
        #swagger.description = 'Lister les paramètres'
        #swagger.responses[200] = {
            description: 'Liste des paramètres.',
            schema: [{
                uniqueName: 'string',
                value: 'string'
            }]
        }
        #swagger.responses[401] = {
            description: 'Accès non autorisé.'
        }
    */
    const collab: Collaborateur = req.body.connectedCollab;
    try {
        if (!isDRH(collab) && !isARH(collab) && !isRH(collab)) {
            return res.sendStatus(401);
        }
        let params = await listeParam();
        console.log(params);
        res.send(params);
    } catch (error) {
        ErrorHandler(error, req, res);
    }
});

export { paramRouter };
