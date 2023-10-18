import { DataSource } from "typeorm"
import config from '../config'
console.log(config)

export const AppDataSource = new DataSource({
    type: "mysql",
    host: config.DBHOST,
    port: 3306,
    username: config.DBUSER,
    password: config.DBPASSWORD,
    database: config.DBNAME,
    entities: ["src/database/entity/**/*.ts"],
    logging: true,
    synchronize: false
})
