import { AppDataSource } from "../datasource";
import {Token} from "../entity/Token";

export const TokenRepository = AppDataSource.getRepository(Token).extend({
})
