import {Collaborateur} from '../database/entity/Collab';
import {AppDataSource} from "../database/datasource";
import {Token, tokenType} from "../database/entity/Token";
import * as express from "express";
import {jwtMiddleware, jwtMiddlewareFullInfo} from "../middleware/jwt";
import {
    accepterAbsence,
    creerAbsence,
    getAbsences,
    getAbsenceUnderMyControl, getAllAbsences,
    modifierAbsence
} from "../controller/AbsenceController";
import {Absence} from "../database/entity/Absence";
import {isARH, isDRH, isRH} from "../controller/CollabController";
import {isSuperior} from "../controller/ServiceController";
const absenceRouter = express.Router();

// Obtenir les absences des collaborateurs sous mon contrôle
absenceRouter.get('/absenceDeMesCollaborateurs', jwtMiddlewareFullInfo, async (req, res) => {
    try {
        const collab:Collaborateur = req.body.connectedCollab;
        let absences:Absence[] = undefined

        if(
            isDRH(collab)
            || isARH(collab)
            || isRH(collab)
        ) {
            absences = await getAllAbsences()
        }
        else if(collab.service.chefservice.id === collab.id){
            absences = await getAbsenceUnderMyControl(collab);
        }else{
            return res.sendStatus(401)
        }
        return res.json(absences);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Erreur lors de la récupération des absences' });
    }
});

// Obtenir mes absences
absenceRouter.get('/mesAbsences', jwtMiddlewareFullInfo, async (req, res) => {
    try {
        const collab = req.body.connectedCollab;
        const absences = await getAbsences(collab);
        return res.json(absences);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Erreur lors de la récupération des absences' });
    }
});

// Créer une absence
absenceRouter.post('/creerUneAbsence', jwtMiddlewareFullInfo, async (req, res) => {
    try {
        const collab = req.body.connectedCollab;
        const { datedeb, datefin, raison, description } = req.body;
        const newAbsence = await creerAbsence(collab, datedeb, datefin, raison, description);
        return res.json(newAbsence);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Erreur lors de la création de l\'absence' });
    }
});

// Modifier une absence
absenceRouter.put('/modifierAbsence/:absenceId', jwtMiddlewareFullInfo, async (req, res) => {
    try {
        const donneurDordre = req.body.connectedCollab;
        const absenceId = parseInt(req.params.absenceId);
        const { datedeb, datefin, raison, description } = req.body;
        const updatedAbsence = await modifierAbsence(absenceId, datedeb, datefin, raison, donneurDordre, description);
        return res.json(updatedAbsence);
    } catch (error) {
        console.error(error);
        if (error === 'Accès refusé') {
            return res.status(403).json({ message: error });
        } else {
            return res.status(500).json({ message: 'Erreur lors de la modification de l\'absence' });
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
        console.error(error);
        if (error === 'Accès refusé') {
            return res.status(403).json({ message: error });
        } else {
            return res.status(500).json({ message: 'Erreur lors de l\'acceptation de l\'absence' });
        }
    }
});

export {absenceRouter}
