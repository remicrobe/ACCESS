import * as express from "express";
import {jwtMiddlewareFullInfo} from "../middleware/jwt";
import {Request, Response} from "express";
import {collaborateurRouter} from "./collaborateur";
import {AppDataSource} from "../database/datasource";
import {HorairesModele} from "../database/entity/HorairesModele";

const modeleHoraireRouter = express.Router();

modeleHoraireRouter.get('/', jwtMiddlewareFullInfo, async (req: Request, res: Response) => {
    try {
        res.send(await AppDataSource.getRepository(HorairesModele).find())
    } catch (error) {
        res.status(500).json({error: 'Une erreur est survenue lors de la recup.'});
    }
});

modeleHoraireRouter.get('/:id', jwtMiddlewareFullInfo, async (req: Request, res: Response) => {
    try {
        res.send(await AppDataSource.getRepository(HorairesModele).findOneByOrFail({id:parseInt(req.params.id)}))
    } catch (error) {
        res.status(500).json({error: 'Une erreur est survenuee lors de la recup.'});
    }
});

export {modeleHoraireRouter}