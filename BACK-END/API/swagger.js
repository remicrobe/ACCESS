const swaggerAutogen = require('swagger-autogen')()

const outputFile = './src/docs/swagger_output.json'
const endpointsFiles = [
    './src/route/absence.ts',
    './src/route/access.ts',
    './src/route/collaborateur.ts',
    './src/route/historique.ts',
    './src/route/incident.ts',
    './src/route/modele-horaire.ts',
    './src/route/param.ts',
    './src/route/presence.ts',
    './src/route/service.ts',
    './src/route/token.ts',
]

const doc = {
    info: {
        title: 'Access Link API',
        description: 'API for Access',
    },
    host: [
        'api.access-link.tech',
    ],
    schemes: ['https'],
    consumes: ['application/json'],
    produces: ['application/json'],
    securityDefinitions: {
        Bearer: {
            type: 'apiKey',
            name: 'Authorization',
            in: 'header',
            description: 'Enter your Bearer token in the format **Bearer &lt;token&gt;**'
        }
    },
    security: [
        {
            Bearer: []
        }
    ],
    definitions: {
        Absence: {
            id: 1,
            collab: { $ref: '#/definitions/Collaborateur' },
            datedeb: '2023-07-15',
            periodeDeb: 1,
            datefin: '2023-07-20',
            periodeFin: 2,
            raison: 'conge',
            description: 'Congé annuel',
            accepte: true,
            datereponse: '2023-07-16',
            dateDemande: '2023-07-01',
            reponseDe: { $ref: '#/definitions/Collaborateur' },
            modifierPar: { $ref: '#/definitions/Collaborateur' }
        },
        Access: {
            id: 1,
            macadress: '00:14:22:01:23:45',
            typePoint: 'pointeuse',
            location: 'Bureau',
            nompoint: 'Entrée principale',
            active: true,
            collabAutorise: [{ $ref: '#/definitions/Collaborateur' }],
            serviceAutorise: [{ $ref: '#/definitions/Service' }],
            historique: [{ $ref: '#/definitions/Historique' }]
        },
        Collaborateur: {
            id: 1,
            prenom: 'John',
            nom: 'Doe',
            mail: 'john.doe@example.com',
            motdepasse: 'password',
            fonction: 'Développeur',
            grade: 'collab',
            tokens: [{ $ref: '#/definitions/Token' }],
            absences: [{ $ref: '#/definitions/Absence' }],
            incident: [{ $ref: '#/definitions/Incident' }],
            historique: [{ $ref: '#/definitions/Historique' }],
            service: { $ref: '#/definitions/Service' },
            horairesdefault: { $ref: '#/definitions/HorairesModele' },
            horaire: { $ref: '#/definitions/Horaire' },
            actif: true,
            valide: false,
            date: '2023-07-01'
        },
        Historique: {
            id: 1,
            date: '2023-07-15',
            collab: { $ref: '#/definitions/Collaborateur' },
            point: { $ref: '#/definitions/Access' },
            typeAction: 'Entrée',
            actionAutorise: true,
            statutUtilise: 'Identité'
        },
        Horaire: {
            id: 1,
            hDebLundi: '08:00:00',
            hFinLundi: '17:00:00',
            hDebMardi: '08:00:00',
            hFinMardi: '17:00:00',
            hDebMercredi: '08:00:00',
            hFinMercredi: '17:00:00',
            hDebJeudi: '08:00:00',
            hFinJeudi: '17:00:00',
            hDebVendredi: '08:00:00',
            hFinVendredi: '17:00:00',
            hDebSamedi: '08:00:00',
            hFinSamedi: '17:00:00',
            hDebDimanche: '08:00:00',
            hFinDimanche: '17:00:00'
        },
        HorairesModele: {
            id: 1,
            nom: 'Modèle standard',
            hDebLundi: '08:00:00',
            hFinLundi: '17:00:00',
            hDebMardi: '08:00:00',
            hFinMardi: '17:00:00',
            hDebMercredi: '08:00:00',
            hFinMercredi: '17:00:00',
            hDebJeudi: '08:00:00',
            hFinJeudi: '17:00:00',
            hDebVendredi: '08:00:00',
            hFinVendredi: '17:00:00',
            hDebSamedi: '08:00:00',
            hFinSamedi: '17:00:00',
            hDebDimanche: '08:00:00',
            hFinDimanche: '17:00:00',
            collabs: [{ $ref: '#/definitions/Collaborateur' }]
        },
        Incident: {
            id: 1,
            collab: { $ref: '#/definitions/Collaborateur' },
            description: 'Problème de connexion',
            ouvert: true,
            modifiePar: { $ref: '#/definitions/Collaborateur' },
            modifieLe: '2023-07-15',
            creeLe: '2023-07-10',
            creePar: 'John Doe',
            dateIncident: '2023-07-09',
            reponse: [{ $ref: '#/definitions/IncidentReponse' }]
        },
        IncidentReponse: {
            id: 1,
            reponse: 'Problème résolu',
            incident: { $ref: '#/definitions/Incident' },
            creeLe: '2023-07-11'
        },
        Param: {
            uniqueName: 'configParam',
            viewName: 'Configuration Parameter',
            value: 'SomeValue'
        },
        Presence: {
            id: 1,
            collab: { $ref: '#/definitions/Collaborateur' },
            datePres: '2023-07-15',
            hdeb: '08:00:00',
            hfin: '17:00:00',
            modifiePar: { $ref: '#/definitions/Collaborateur' },
            modifieLe: '2023-07-16',
            creeLe: '2023-07-15',
            creePar: 'Admin',
            desc: 'Présence normale'
        },
        Service: {
            id: 1,
            chefservice: { $ref: '#/definitions/Collaborateur' },
            nomservice: 'Informatique',
            collabs: [{ $ref: '#/definitions/Collaborateur' }]
        },
        Token: {
            id: 1,
            collab: { $ref: '#/definitions/Collaborateur' },
            type: 'auth',
            actif: true,
            token: 'token123',
            datecreation: '2023-07-15'
        },
    }
};




swaggerAutogen(outputFile, endpointsFiles, doc)