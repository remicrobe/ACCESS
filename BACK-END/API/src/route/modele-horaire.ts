import * as express from "express";
import { jwtMiddlewareFullInfo } from "../middleware/jwt";
import { Request, Response } from "express";
import { AppDataSource } from "../database/datasource";
import { HorairesModele } from "../database/entity/HorairesModele";
import { ErrorHandler } from "../utils/error/error-handler";
import { editModele, nouveauModele } from "../controller/HorraireController";

const modeleHoraireRouter = express.Router();

// Route pour obtenir tous les modèles d'horaires
modeleHoraireRouter.get('/', jwtMiddlewareFullInfo, async (req: Request, res: Response) => {
    /*  #swagger.tags = ['Modèle Horaire']
        #swagger.path = '/modele-horaire/'
        #swagger.method = 'get'
        #swagger.description = 'Obtenir tous les modèles d\'horaires'
        #swagger.responses[200] = {
            description: 'Liste des modèles d\'horaires.',
            schema: { $ref: '#/definitions/HorairesModele' }
        }
    */
    try {
        res.send(await AppDataSource.getRepository(HorairesModele).find());
    } catch (error) {
        ErrorHandler(error, req, res);
    }
});

// Route pour modifier un modèle d'horaires
modeleHoraireRouter.put('/:id', jwtMiddlewareFullInfo, async (req: Request, res: Response) => {
    /*  #swagger.tags = ['Modèle Horaire']
        #swagger.path = '/modele-horaire/{id}'
        #swagger.method = 'put'
        #swagger.description = 'Modifier un modèle d\'horaires'
        #swagger.parameters['id'] = {
            in: 'path',
            description: 'ID du modèle d\'horaires',
            required: true,
            type: 'integer'
        }
        #swagger.parameters['body'] = {
            in: 'body',
            description: 'Données du modèle d\'horaires',
            required: true,
            schema: { $ref: '#/definitions/HorairesModele' }
        }
        #swagger.responses[200] = {
            description: 'Modèle d\'horaires modifié.',
            schema: { $ref: '#/definitions/HorairesModele' }
        }
    */
    try {
        res.send(await editModele(parseInt(req.params.id), req.body.nom, req.body));
    } catch (error) {
        ErrorHandler(error, req, res);
    }
});

// Route pour créer un nouveau modèle d'horaires
modeleHoraireRouter.post('/', jwtMiddlewareFullInfo, async (req: Request, res: Response) => {
    /*  #swagger.tags = ['Modèle Horaire']
        #swagger.path = '/modele-horaire/'
        #swagger.method = 'post'
        #swagger.description = 'Créer un nouveau modèle d\'horaires'
        #swagger.parameters['body'] = {
            in: 'body',
            description: 'Données du modèle d\'horaires',
            required: true,
            schema: { $ref: '#/definitions/HorairesModele' }
        }
        #swagger.responses[200] = {
            description: 'Nouveau modèle d\'horaires créé.',
            schema: { $ref: '#/definitions/HorairesModele' }
        }
    */
    try {
        res.send(await nouveauModele(req.body.nom, req.body));
    } catch (error) {
        ErrorHandler(error, req, res);
    }
});

// Route pour obtenir un modèle d'horaires par ID
modeleHoraireRouter.get('/:id', jwtMiddlewareFullInfo, async (req: Request, res: Response) => {
    /*  #swagger.tags = ['Modèle Horaire']
        #swagger.path = '/modele-horaire/{id}'
        #swagger.method = 'get'
        #swagger.description = 'Obtenir un modèle d\'horaires par ID'
        #swagger.parameters['id'] = {
            in: 'path',
            description: 'ID du modèle d\'horaires',
            required: true,
            type: 'integer'
        }
        #swagger.responses[200] = {
            description: 'Modèle d\'horaires obtenu par ID.',
            schema: { $ref: '#/definitions/HorairesModele' }
        }
    */
    try {
        res.send(await AppDataSource.getRepository(HorairesModele).findOneByOrFail({id: parseInt(req.params.id)}));
    } catch (error) {
        ErrorHandler(error, req, res);
    }
});

export { modeleHoraireRouter };
