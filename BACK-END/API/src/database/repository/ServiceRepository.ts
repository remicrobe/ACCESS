import { AppDataSource } from "../datasource";
import {Service} from "../entity/Service";

export const ServiceRepository = AppDataSource.getRepository(Service).extend({
})
