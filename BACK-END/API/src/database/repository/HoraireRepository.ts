import { AppDataSource } from "../datasource";
import {Horaire} from "../entity/Horaire";

export const HoraireRepository = AppDataSource.getRepository(Horaire).extend({
})
