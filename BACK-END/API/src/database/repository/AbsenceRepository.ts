import { AppDataSource } from "../datasource";
import {Absence} from "../entity/Absence";

export const AbsenceRepository = AppDataSource.getRepository(Absence).extend({
})
