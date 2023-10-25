import * as express from 'express'

import config from './config'

import * as cors from 'cors'
import {AppDataSource} from "./database/datasource";
import {collaborateurRouter} from "./route/collaborateur";
import {serviceRouter} from "./route/service"
import {accessRouter} from "./route/access";
import {tokenRouter} from "./route/token";
import {absenceRouter} from "./route/absence";
import {modeleHoraireRouter} from "./route/modele-horaire";

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
        Index.serverConfig()
    }

}

Index.main() 