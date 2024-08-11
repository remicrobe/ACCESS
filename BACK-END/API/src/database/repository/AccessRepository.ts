import { AppDataSource } from "../datasource";
import {Access} from "../entity/Access";

export const AccessRepository = AppDataSource.getRepository(Access).extend({
})
