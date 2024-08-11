import { AppDataSource } from "../datasource";
import {HorairesModele} from "../entity/HorairesModele";

export const HorairesModeleRepository = AppDataSource.getRepository(HorairesModele).extend({
})
