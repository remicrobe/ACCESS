import { AppDataSource } from "../datasource";
import {Historique} from "../entity/Historique";

export const HistoriqueRepository = AppDataSource.getRepository(Historique).extend({
})
