import { AppDataSource } from "../datasource";
import {IncidentReponse} from "../entity/IncidentReponse";

export const IncidentReponseRepository = AppDataSource.getRepository(IncidentReponse).extend({
})
