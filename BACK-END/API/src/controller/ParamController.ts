import { AppDataSource } from "../database/datasource";
import { Param } from "../database/entity/Param";
import {ParamRepository} from "../database/repository/ParamRepository";

export async function listeParam() {

    return await ParamRepository.find()
}

export async function modifierParam(name, value) {
    let param = await ParamRepository.findOneByOrFail({
        uniqueName: name
    })

    param.value = value

    return await ParamRepository.save(param)
}