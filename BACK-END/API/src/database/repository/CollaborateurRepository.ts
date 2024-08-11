import { AppDataSource } from "../datasource";
import {Access} from "../entity/Access";
import {Collaborateur} from "../entity/Collaborateur";

export const CollaborateurRepository = AppDataSource.getRepository(Collaborateur).extend({
})
