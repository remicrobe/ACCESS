import {Absence} from '../database/entity/Absence';
import {AppDataSource} from "../database/datasource";
import {Collaborateur} from "../database/entity/Collab";

export async function creerAbsence(collab: Collaborateur, datedeb: Date, datefin: Date, raison: string, description?: string) {


    let absence = new Absence();
    absence.collab = collab;
    absence.datedeb = datedeb;
    absence.datefin = datefin;
    absence.raison = raison;
    absence.description = description;

    return await AppDataSource.getRepository(Absence).save(absence);
}

export async function getAbsences(collab: Collaborateur) {
    return await AppDataSource.getRepository(Absence).find({
        where: {collab: {id: collab.id}},
        relations: {collab: true}
    });
}

export async function getAbsenceUnderMyControl(collab: Collaborateur) {
    return await AppDataSource.getRepository(Absence).find({
        where: {
            collab: {
                service: {
                    id: collab.service.chefservice.id
                }
            }},
        relations: {collab: true}
    });
}

export async function modifierAbsence(absenceId: number, datedeb: Date, datefin: Date, raison: string, donneurDordre: Collaborateur, description?: string) {
    const absence = await AppDataSource.getRepository(Absence).findOneOrFail({
        where: {id: absenceId},
        relations: {collab: {service: true}}
    });
    let idResp = absence.collab.service.chefservice ? absence.collab.service.chefservice.id : -1
    if ((idResp === donneurDordre.id) || (donneurDordre.id === absence.collab.id)) {
        absence.datedeb = datedeb;
        absence.datefin = datefin;
        absence.raison = raison;
        absence.description = description;

        return await AppDataSource.getRepository(Absence).save(absence);
    } else {
        throw "Accès refusé"
    }


}

export async function accepterAbsence(absenceId: number, reponse: boolean, donneurDordre: Collaborateur) {
    const absence = await AppDataSource.getRepository(Absence).findOneOrFail({
        where: {id: absenceId},
        relations: {collab: {service: {chefservice:true}}}
    });
    let idResp = absence.collab.service.chefservice ? absence.collab.service.chefservice.id : -1
    if (idResp === donneurDordre.id) {
        absence.accepte = reponse;
        absence.datereponse = new Date()

        return await AppDataSource.getRepository(Absence).save(absence);
    } else {
        throw "Accès refusé"
    }


}

