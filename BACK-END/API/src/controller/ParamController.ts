import { AppDataSource } from "../database/datasource";
import { ParamModele } from "../database/entity/Param";

export async function listeParam() {
    return await AppDataSource.getRepository(ParamModele).find()
}

export async function modifierParam(name, value) {
    let param = await AppDataSource.getRepository(ParamModele).findOneByOrFail({
        uniqueName: name
    })

    param.value = value

    return await AppDataSource.getRepository(ParamModele).save(param)
}