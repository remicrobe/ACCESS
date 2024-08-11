import { AppDataSource } from "../datasource";
import {Param} from "../entity/Param";

export const ParamRepository = AppDataSource.getRepository(Param).extend({
})
