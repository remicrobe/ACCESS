import { Access } from '../database/entity/Access';
import { Collaborateur, typeCollab } from "../database/entity/Collaborateur";
import * as express from "express";
import {
    creerAccess,
    modifierAccess,
    listeAccess,
    pointAccessAccessible,
    aAccess,
    getPointConfig
} from "../controller/AccessController";
import { jwtMiddleware, jwtMiddlewareFullInfo } from "../middleware/jwt";
import { checkQRCode } from "../controller/Token";
import { ErrorHandler } from "../utils/error/error-handler";
import { MoreThan, Not } from "typeorm";
import { DateTime } from "luxon";
import { isARH, isDRH, isRH } from "../controller/CollabController";
import { getAbsenceUnderMyControl, getAllAbsences } from "../controller/AbsenceController";
import { getHistory, getHistoryByService } from "../controller/HistoriqueController";
import {CollaborateurRepository} from "../database/repository/CollaborateurRepository";
import {AccessRepository} from "../database/repository/AccessRepository";
import {HistoriqueRepository} from "../database/repository/HistoriqueRepository";

const accessRouter = express.Router();

// Créer un nouveau point d'accès
accessRouter.post('/creerAccess', jwtMiddleware, async (req, res) => {
    /*  #swagger.tags = ['Access']
        #swagger.path = '/access/creerAccess'
        #swagger.method = 'post'
        #swagger.description = 'Créer un nouveau point d\'accès'
        #swagger.parameters['body'] = {
            in: 'body',
            description: 'Informations du point d\'accès',
            required: true,
            schema: {
                macadress: 'string',
                typePoint: 'string',
                location: 'string',
                nompoint: 'string',
                active: 'boolean',
                collabAutorise: 'array',
                serviceAutorise: 'array'
            }
        }
        #swagger.responses[200] = {
            description: 'Point d\'accès créé avec succès.',
            schema: { $ref: '#/definitions/Access' }
        }
    */
    const { macadress, typePoint, location, nompoint, active, collabAutorise, serviceAutorise } = req.body;
    try {
        const newAccess = await creerAccess(macadress, typePoint, location, nompoint, active, collabAutorise, serviceAutorise);
        return res.send(newAccess);
    } catch (error) {
        ErrorHandler(error, req, res);
    }
});

// Modifier un point d'accès existant
accessRouter.put('/modifierAccess/:accessId', jwtMiddlewareFullInfo, async (req, res) => {
    /*  #swagger.tags = ['Access']
        #swagger.path = '/access/modifierAccess/{accessId}'
        #swagger.method = 'put'
        #swagger.description = 'Modifier un point d\'accès existant'
        #swagger.parameters['accessId'] = {
            in: 'path',
            description: 'ID du point d\'accès',
            required: true,
            type: 'integer'
        }
        #swagger.parameters['body'] = {
            in: 'body',
            description: 'Nouvelles informations du point d\'accès',
            required: true,
            schema: {
                macadress: 'string',
                typePoint: 'string',
                location: 'string',
                nompoint: 'string',
                active: 'boolean',
                collabAutorise: 'array',
                serviceAutorise: 'array'
            }
        }
        #swagger.responses[200] = {
            description: 'Point d\'accès modifié avec succès.',
            schema: { $ref: '#/definitions/Access' }
        }
        #swagger.responses[404] = {
            description: 'Point d\'accès non trouvé.'
        }
    */
    const accessId = parseInt(req.params.accessId);
    const { macadress, typePoint, location, nompoint, active, collabAutorise, serviceAutorise } = req.body;
    try {
        const access = await AccessRepository.findOneBy({ id: accessId });
        if (!access) {
            return res.status(404).json({ message: 'Point d\'accès non trouvé' });
        }
        return res.json(await modifierAccess(accessId, macadress, typePoint, location, nompoint, active, collabAutorise, serviceAutorise));
    } catch (error) {
        ErrorHandler(error, req, res);
    }
});

// Obtenir la liste des points d'accès
accessRouter.get('/listeAccess', jwtMiddlewareFullInfo, async (req, res) => {
    /*  #swagger.tags = ['Access']
        #swagger.path = '/access/listeAccess'
        #swagger.method = 'get'
        #swagger.description = 'Obtenir la liste des points d\'accès'
        #swagger.responses[200] = {
            description: 'Liste des points d\'accès.',
            schema: {
                type: 'array',
                items: { $ref: '#/definitions/Access' }
            }
        }
    */
    try {
        const accessList = await listeAccess();
        return res.json(accessList);
    } catch (error) {
        ErrorHandler(error, req, res);
    }
});

// Obtenir les points d'accès accessibles par un collaborateur
accessRouter.get('/pointsAccessibles', jwtMiddlewareFullInfo, async (req, res) => {
    /*  #swagger.tags = ['Access']
        #swagger.path = '/access/pointsAccessibles'
        #swagger.method = 'get'
        #swagger.description = 'Obtenir les points d\'accès accessibles par un collaborateur'
        #swagger.responses[200] = {
            description: 'Liste des points d\'accès accessibles.',
            schema: {
                type: 'array',
                items: { $ref: '#/definitions/Access' }
            }
        }
    */
    try {
        let connectedCollab: Collaborateur = req.body.connectedCollab;
        return res.send(await pointAccessAccessible(connectedCollab));
    } catch (error) {
        ErrorHandler(error, req, res);
    }
});

// Obtenir les notifications
accessRouter.get('/notifications', jwtMiddlewareFullInfo, async (req, res) => {
    /*  #swagger.tags = ['Notifications']
        #swagger.path = '/access/notifications'
        #swagger.method = 'get'
        #swagger.description = 'Obtenir les notifications pour le collaborateur connecté'
        #swagger.responses[200] = {
            description: 'Liste des notifications.',
            schema: {
                type: 'array',
                items: { $ref: '#/definitions/Notification' }
            }
        }
    */
    try {
        let connectedCollab: Collaborateur = req.body.connectedCollab;
        let notifications = [];
        let absenceFilter = { state: 'En attente' };
        const now = DateTime.now().setZone('Europe/Paris');
        let historiqueFilter = {
            state: 'Refusé',
            startDate: now.startOf('day').toJSDate(),
            endDate: now.endOf('day').toJSDate(),
        };
        let absences;
        let historique;

        // On récupère les demandes de congés non accepté
        if (
            isDRH(connectedCollab)
            || isARH(connectedCollab)
            || isRH(connectedCollab)
        ) {
            absences = await getAllAbsences(null, null, absenceFilter);
        } else if (connectedCollab.service.chefservice.id === connectedCollab.id) {
            absences = await getAbsenceUnderMyControl(connectedCollab, null, null, absenceFilter);
        }

        if (absences[1] > 0) {
            notifications.push({
                title: 'Absence',
                subtitle: 'Vous n\'avez pas traité certaines demande d\'absence',
                link: "/demande-collab/",
            });
        }

        // On récupère les accès non autorisé
        if (isDRH(connectedCollab) || isARH(connectedCollab) || isRH(connectedCollab)) {
            historique = await getHistory(null, null, historiqueFilter);
        } else if (connectedCollab.service && connectedCollab.service.chefservice.id === connectedCollab.id) {
            historique = await getHistoryByService(connectedCollab.service, null, null, historiqueFilter);
        }

        if (historique[1] > 0) {
            notifications.push({
                title: 'Access',
                subtitle: 'Vos collaborateurs ont accédé a certains points de manière non autorisé, prière de remonter la raison',
                link: "/demande-collab/",
            });
        }

        res.send(notifications);
    } catch (error) {
        ErrorHandler(error, req, res);
    }
});

// Obtenir les statistiques
accessRouter.get('/stats', jwtMiddlewareFullInfo, async (req, res) => {
    /*  #swagger.tags = ['Statistics']
        #swagger.path = '/access/stats'
        #swagger.method = 'get'
        #swagger.description = 'Obtenir les statistiques des points d\'accès'
        #swagger.responses[200] = {
            description: 'Statistiques des points d\'accès.',
            schema: {
                type: 'array',
                items: { $ref: '#/definitions/Statistics' }
            }
        }
    */
    try {
        let today = new Date();
        let dayOfWeek = today.toLocaleDateString('fr-FR', { weekday: 'long' });
        let hDeb = 'hDeb' + dayOfWeek.charAt(0).toUpperCase() + dayOfWeek.slice(1);

        let todayCollabByHour = await CollaborateurRepository.count({
            where: [
                {
                    horaire: {
                        [hDeb]: Not('00:00:00')
                    },
                },
                {
                    horairesdefault: {
                        [hDeb]: Not('00:00:00')
                    }
                }
            ]
        });

        let totalInOut = await HistoriqueRepository.count({
            where: {
                date: MoreThan(DateTime.local().startOf('day').toJSDate()),
                typeAction: 'Access',
                actionAutorise: true
            }
        });

        let collabInToday = await HistoriqueRepository
            .createQueryBuilder("historique")
            .select("DISTINCT collabId")
            .where("date > :date", { date: DateTime.local().startOf('day').toJSDate() })
            .andWhere("actionAutorise = true")
            .groupBy("collabId")
            .getRawMany();

        let items = [
            { title: "Employés dans les locaux", subtitle: `${collabInToday.length}`, icon: "mdi-account" },
            { title: "Employés attendus ", subtitle: `${todayCollabByHour}`, icon: "mdi-clock" },
            { title: "Entrées sorties", subtitle: `${totalInOut}`, icon: "mdi-exit-to-app" },
        ];

        res.send(items);
    } catch (error) {
        ErrorHandler(error, req, res);
    }
});

// Tester si un token a accès à un point
accessRouter.get('/check/:token/:macAdress', async (req, res) => {
    /*  #swagger.tags = ['Access']
        #swagger.path = '/access/check/{token}/{macAdress}'
        #swagger.method = 'get'
        #swagger.description = 'Tester si un token a accès à un point'
        #swagger.parameters['token'] = {
            in: 'path',
            description: 'Token du collaborateur',
            required: true,
            type: 'string'
        }
        #swagger.parameters['macAdress'] = {
            in: 'path',
            description: 'Adresse MAC du point d\'accès',
            required: true,
            type: 'string'
        }
        #swagger.responses[200] = {
            description: 'Résultat du test d\'accès.',
            schema: {
                type: 'object',
                properties: {
                    hasAccess: { type: 'boolean' }
                }
            }
        }
    */
    try {
        let collab = await checkQRCode(req.params.token);

        res.send(await aAccess(collab, req.params.macAdress));
    } catch (error) {
        ErrorHandler(error, req, res);
    }
});

// Récupérer la config du point d'accès
accessRouter.get('/config/:macAdress', async (req, res) => {
    /*  #swagger.tags = ['Access']
        #swagger.path = '/access/config/{macAdress}'
        #swagger.method = 'get'
        #swagger.description = 'Récupérer la config du point d\'accès'
        #swagger.parameters['macAdress'] = {
            in: 'path',
            description: 'Adresse MAC du point d\'accès',
            required: true,
            type: 'string'
        }
        #swagger.responses[200] = {
            description: 'Configuration du point d\'accès.',
            schema: { $ref: '#/definitions/AccessConfig' }
        }
    */
    try {
        res.send(await getPointConfig(req.params.macAdress));
    } catch (error) {
        ErrorHandler(error, req, res);
    }
});

export { accessRouter };
