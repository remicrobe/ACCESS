import * as express from 'express'

import config from './config'

import * as cors from 'cors'
import {AppDataSource} from "./database/datasource";


class Index {
    static app = express()
    static router = express.Router()

    static globalConfig(){
        Index.app.use(cors())
        Index.app.use(express.json())
    }

    static routeConfig(){
        Index.app.use(cors())
        Index.app.use(express.json())
    }

    static serverConfig(){
        AppDataSource.initialize().then(async () => {
            console.log("Connecté a la base de données")
            Index.app.listen(config.PORT, ()=> console.log("API démarrée ...."))
        }).catch(error => console.log(error))
    }

    static main() {
        Index.globalConfig()
        Index.routeConfig()
        Index.serverConfig()
    }

}

Index.main() 