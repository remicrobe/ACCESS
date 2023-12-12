import { AppDataSource } from "../database/datasource";
import { Param } from "../database/entity/Param";

export async function listeParam() {
    return await AppDataSource.getRepository(Param).find()
}

export async function modifierParam(name, value) {
    let param = await AppDataSource.getRepository(Param).findOneByOrFail({
        uniqueName: name
    })

    param.value = value

    return await AppDataSource.getRepository(Param).save(param)
}