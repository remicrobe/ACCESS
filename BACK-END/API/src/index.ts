import * as express from 'express';

import config from './config';
import * as cron from 'node-cron';

import * as cors from 'cors';
import { AppDataSource } from "./database/datasource";
import { collaborateurRouter } from "./route/collaborateur";
import { serviceRouter } from "./route/service";
import { accessRouter } from "./route/access";
import { tokenRouter } from "./route/token";
import { absenceRouter } from "./route/absence";
import { modeleHoraireRouter } from "./route/modele-horaire";
import { historiqueRouter } from "./route/historique";
import { advertCollabHorsHeure } from "./controller/CollabController";
import { presenceRouter } from './route/presence';
import { paramRouter } from './route/param';
import { incidentRouter } from './route/incident';
import { parseMailIncident } from './jobs/mailParserIncident';
import * as basicAuth from 'express-basic-auth'
import * as swaggerJsonFile from "./docs/swagger_output.json"
import * as swStats from "swagger-stats";

class Index {
    static app = express();
    static router = express.Router();

    static globalConfig() {
        Index.app.use(cors());
        Index.app.use(express.json());
    }

    static routeConfig() {
        Index.app.use('/collab', collaborateurRouter);
        Index.app.use('/service', serviceRouter);
        Index.app.use('/access', accessRouter);
        Index.app.use('/token', tokenRouter);
        Index.app.use('/absence', absenceRouter);
        Index.app.use('/modele-horaire', modeleHoraireRouter);
        Index.app.use('/historique', historiqueRouter);
        Index.app.use('/presence', presenceRouter);
        Index.app.use('/param', paramRouter);
        Index.app.use('/incident', incidentRouter);
    }

    static jobsConfig() {
        // A 1h du matin, chaque jour
        cron.schedule('0 1 * * *', async () => {
            await advertCollabHorsHeure();
        });

        // Chaque minute, chaque jour
        cron.schedule('* * * * *', async () => {
            await parseMailIncident();
        });
    }

    static swaggerConfig() {
        const swaggerUi = require('swagger-ui-express')
        Index.app.use('/docs', basicAuth({
            users: {'accessdoc': 'docpassword'},
            challenge: true,
        }), swaggerUi.serve, swaggerUi.setup(swaggerJsonFile))
    }

    static statsConfig() {
        Index.app.use(swStats.getMiddleware({
            swaggerSpec:swaggerJsonFile,
            authentication: true,
            sessionMaxAge: 900,
            onAuthenticate: function(req,username,password){
                // simple check for username and password
                return((username==='access-splitstats') && (password==='access-splitpassword') );
            }
        }))
    }

    static serverConfig() {
        AppDataSource.initialize().then(async () => {
            console.log("Connecté a la base de données");
            Index.app.listen(config.PORT, () => console.log(`API démarrée sur le port ${config.PORT}....`));
        }).catch(error => console.log(error));

    }

    static main() {
        Index.globalConfig();
        Index.swaggerConfig()
        Index.statsConfig()
        Index.routeConfig();
        Index.jobsConfig();
        Index.serverConfig();
    }

}

Index.main();
