import { AppDataSource } from "../datasource";
import {Incident} from "../entity/Incident";

export const IncidentRepository = AppDataSource.getRepository(Incident).extend({
})
