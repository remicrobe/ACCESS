import * as express from 'express'

import config from './config'
import * as cron from 'node-cron'

import * as cors from 'cors'
import {AppDataSource} from "./database/datasource";
import {collaborateurRouter} from "./route/collaborateur";
import {serviceRouter} from "./route/service"
import {accessRouter} from "./route/access";
import {tokenRouter} from "./route/token";
import {absenceRouter} from "./route/absence";
import {modeleHoraireRouter} from "./route/modele-horaire";
import {historiqueRouter} from "./route/historique";
import {advertCollabHorsHeure} from "./controller/CollabController";
import { paramRouter } from './route/param';

class Index {
    static app = express()
    static router = express.Router()

    static globalConfig(){
        Index.app.use(cors())
        Index.app.use(express.json())
    }

    static routeConfig(){
        Index.app.use('/collab', collaborateurRouter)
        Index.app.use('/service', serviceRouter)
        Index.app.use('/access', accessRouter)
        Index.app.use('/token', tokenRouter)
        Index.app.use('/absence', absenceRouter)
        Index.app.use('/modele-horaire', modeleHoraireRouter)
        Index.app.use('/historique', historiqueRouter)
        Index.app.use('/param', paramRouter)
    }

    static jobsConfig(){
        cron.schedule('0 1 * * *', async () => {
            await advertCollabHorsHeure();
        });
    }

    static serverConfig(){
        AppDataSource.initialize().then(async () => {
            console.log("Connecté a la base de données")
            Index.app.listen(config.PORT, ()=> console.log(`API démarrée sur le port ${config.PORT}....`))
        }).catch(error => console.log(error))

    }

    static main() {
        Index.globalConfig()
        Index.routeConfig()
        Index.jobsConfig()
        Index.serverConfig()
    }

}

Index.main() 