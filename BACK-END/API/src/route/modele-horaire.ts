import * as express from "express";
import { jwtMiddlewareFullInfo } from "../middleware/jwt";
import { Request, Response } from "express";
import { collaborateurRouter } from "./collaborateur";
import { AppDataSource } from "../database/datasource";
import { HorairesModele } from "../database/entity/HorairesModele";
import { ErrorHandler } from "../utils/error/error-handler";
import { editModele, nouveauModele } from "../controller/HorraireController";

const modeleHoraireRouter = express.Router();

modeleHoraireRouter.get('/', jwtMiddlewareFullInfo, async (req: Request, res: Response) => {
    try {
        res.send(await AppDataSource.getRepository(HorairesModele).find());
    } catch (error) {
        ErrorHandler(error, req, res);
    }
});

modeleHoraireRouter.put('/:id', jwtMiddlewareFullInfo, async (req: Request, res: Response) => {
    try {
        res.send(await editModele(parseInt(req.params.id), req.body.nom, req.body));
    } catch (error) {
        ErrorHandler(error, req, res);
    }
});

modeleHoraireRouter.post('/', jwtMiddlewareFullInfo, async (req: Request, res: Response) => {
    try {
        res.send(await nouveauModele(req.body.nom, req.body));
    } catch (error) {
        ErrorHandler(error, req, res);
    }
});

modeleHoraireRouter.get('/:id', jwtMiddlewareFullInfo, async (req: Request, res: Response) => {
    try {
        res.send(await AppDataSource.getRepository(HorairesModele).findOneByOrFail({id: parseInt(req.params.id)}));
    } catch (error) {
        ErrorHandler(error, req, res);
    }
});

export { modeleHoraireRouter };
