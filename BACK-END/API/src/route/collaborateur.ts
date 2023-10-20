import * as express from 'express'
import {Response,Request} from "express";
import {creerCollab, setCollabGrade} from "../controller/CollabController";
import {Collaborateur} from "../database/entity/Collab";
import {AppDataSource} from "../database/datasource";

const collaborateurRouter = express.Router();

// Route pour créer un collaborateur
collaborateurRouter.post('/creer', async (req: Request, res: Response) => {
    try {
        const { prenom, nom, mail, date, grade, fonction } = req.body;
        console.log(req.body)
        const collaborateur = await creerCollab(prenom, nom, mail, grade, fonction);

        if (collaborateur) {
            res.status(201).json(collaborateur);
        } else {
            res.status(400).json({ error: 'L\'utilisateur existe déjà.' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Une erreur est survenue lors de la création du collaborateur.' });
    }
});

// Route pour mettre à jour le grade d'un collaborateur
collaborateurRouter.put('/setGrade/:collaborateurId', async (req: Request, res: Response) => {
    try {
        const collaborateurId = parseInt(req.params.collaborateurId);
        const nouveauGrade = req.body.nouveauGrade;
        const utilisateur = await AppDataSource.getRepository(Collaborateur).findOneBy({ id: collaborateurId });

        if (!utilisateur) {
            return res.status(404).json({ error: 'Collaborateur non trouvé.' });
        }

        setCollabGrade(utilisateur, nouveauGrade);
        await AppDataSource.getRepository(Collaborateur).save(utilisateur)

        res.status(200).json(utilisateur);
    } catch (error) {
        res.status(500).json({ error: 'Une erreur est survenue lors de la mise à jour du grade.' });
    }
});


export { collaborateurRouter };
