import {Absence} from '../database/entity/Absence';
import {AppDataSource} from "../database/datasource";
import {Collaborateur} from "../database/entity/Collab";
import {isSuperior} from "./ServiceController";
import {isARH, isDRH, isRH} from "./CollabController";
import {Between, In, IsNull} from "typeorm";
import {isNull} from "util";
import {sendEditConge, sendNewCongeMail, sendResponseConge} from "../utils/mail/mail";
import {DateTime} from "luxon";

export async function creerAbsence(collab: Collaborateur, datedeb: string, datefin: string, periodeDeb: number, periodeFin: number, raison: string, description?: string) {
    let absence = new Absence();
    absence.collab = collab;
    absence.datedeb = DateTime.fromISO(datedeb, { zone: "Europe/Paris" }).toJSDate();
    absence.periodeDeb = periodeDeb;
    absence.periodeFin = periodeFin
    absence.datefin = DateTime.fromISO(datefin, { zone: "Europe/Paris" }).toJSDate();
    absence.raison = raison;
    absence.description = description;

    if(collab.service && collab.service.chefservice){
        sendNewCongeMail(collab,collab.service.chefservice,absence)
    }

    return await AppDataSource.getRepository(Absence).save(absence);
}

export async function getAbsences(collab: Collaborateur) {
    return await AppDataSource.getRepository(Absence).find({
        where: {collab: {id: collab.id}},
        relations: {collab: true}
    });
}

export async function getAbsenceUnderMyControl(collab: Collaborateur, page:number,itemParPage:number,filter:any) {
    let dateConfig, accepteConfig
    if(filter.startDate && filter.endDate){
        dateConfig = Between(new Date(filter.startDate), new Date(filter.endDate))
    }
    if(filter.state){
        if(filter.state === 'Accepté'){
            accepteConfig = true
        }else if(filter.state === 'Refusé'){
            accepteConfig = false
        }else if(filter.state === 'En attente'){
            accepteConfig = IsNull()
        }
    }
    return await AppDataSource.getRepository(Absence).findAndCount({
        where: {
            dateDemande: dateConfig,
            accepte: accepteConfig,
            collab: {
                id: filter.collabs ?  In(filter.collabs) : undefined,
                service: {
                    chefservice:{
                        id:collab.id
                    }
                }
            }
        },
        order:{
            dateDemande: 'DESC'
        },
        relations: {collab: true, modifierPar: true, reponseDe: true},
        skip: page ? page > 1 ? (page-1)*itemParPage : 0 : undefined,
        take: itemParPage ? itemParPage : undefined,
    });
}

export async function getAllAbsences(page:number,itemParPage:number,filter:any) {
    let dateConfig, accepteConfig
    if(filter.startDate && filter.endDate){
        dateConfig = Between(new Date(filter.startDate), new Date(filter.endDate))
    }
    if(filter.state){
        if(filter.state === 'Accepté'){
            accepteConfig = true
        }else if(filter.state === 'Refusé'){
            accepteConfig = false
        }else if(filter.state === 'En attente'){
            accepteConfig = IsNull()
        }
    }
    return await AppDataSource.getRepository(Absence).findAndCount({
        relations: {collab: true, modifierPar: true, reponseDe: true},
        where:{
            dateDemande: dateConfig,
            accepte: accepteConfig,
            collab: {
                id: filter.collabs ?  In(filter.collabs) : undefined,
            },
        },
        order:{
            dateDemande: 'DESC'
        },
        skip: page ? page > 1 ? (page-1)*itemParPage : 0 : undefined,
        take: itemParPage ? itemParPage : undefined,
    });
}

export async function modifierAbsence(absenceId: number, datedeb: string, datefin: string, raison: string, donneurDordre: Collaborateur, description?: string) {
    const absence = await AppDataSource.getRepository(Absence).findOneOrFail({
        where: {id: absenceId},
        relations: {collab: {service: true}}
    });
    let idResp = absence.collab.service.chefservice ? absence.collab.service.chefservice.id : -1
    if (isDRH(donneurDordre) || isARH(donneurDordre) || isRH(donneurDordre) || await isSuperior(donneurDordre, absence.collab)) {
        let oldAbsence = {...absence}
        absence.datedeb = DateTime.fromISO(datedeb, { zone: "Europe/Paris" }).isValid ? DateTime.fromISO(datedeb, { zone: "Europe/Paris" }).toJSDate() : absence.datedeb;
        absence.datefin = DateTime.fromISO(datefin, { zone: "Europe/Paris" }).isValid ? DateTime.fromISO(datefin, { zone: "Europe/Paris" }).toJSDate() : absence.datefin;
        absence.raison = raison;
        absence.description = description;
        absence.modifierPar = donneurDordre

        sendEditConge(absence.collab,donneurDordre,absence,oldAbsence)

        return await AppDataSource.getRepository(Absence).save(absence);
    } else {
        throw "Accès refusé"
    }


}

export async function accepterAbsence(absenceId: number, reponse: boolean, donneurDordre: Collaborateur) {
    const absence = await AppDataSource.getRepository(Absence).findOneOrFail({
        where: {id: absenceId},
        relations: {collab: true}
    });
    if (isDRH(donneurDordre)
        || isARH(donneurDordre)
        || isRH(donneurDordre)
        || await isSuperior(donneurDordre, absence.collab)) {
        absence.accepte = reponse;
        absence.datereponse = new Date()
        absence.reponseDe = donneurDordre

        sendResponseConge(absence.collab,donneurDordre,absence)

        return await AppDataSource.getRepository(Absence).save(absence);
    } else {
        throw "Accès refusé"
    }


}

