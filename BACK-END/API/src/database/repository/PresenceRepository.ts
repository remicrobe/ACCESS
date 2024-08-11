import { AppDataSource } from "../datasource";
import {Presence} from "../entity/Presence";

export const PresenceRepository = AppDataSource.getRepository(Presence).extend({
})
