import {Between, In, IsNull, Not} from "typeorm"
import {Collaborateur} from "../database/entity/Collab"
import {AppDataSource} from "../database/datasource";
import {Presence} from "../database/entity/Presence";
import {DateTime} from "luxon";

export async function listerPresenceMesCollabs(collab: Collaborateur, page: number, itemParPage: number, filter: any) {
    let dateConfig
    if (filter.startDate && filter.endDate) {
        dateConfig = Between(new Date(filter.startDate), new Date(filter.endDate))
    }

    return await AppDataSource.getRepository(Presence).findAndCount({
        where: {
            datePres: dateConfig,
            collab: {
                id: filter.collabs && filter.collabs.length > 0 ? In(filter.collabs) : undefined,
                service: {
                    chefservice: {
                        id: collab.id
                    }
                }
            }
        },
        order: {
            datePres: 'DESC'
        },
        relations: {collab: true, modifiePar: true},
        skip: page ? page > 1 ? (page - 1) * itemParPage : 0 : undefined,
        take: itemParPage ? itemParPage : undefined,
    });
}

export async function listerPresence(page: number, itemParPage: number, filter: any) {
    let dateConfig
    if (filter.startDate && filter.endDate) {
        dateConfig = Between(new Date(filter.startDate), new Date(filter.endDate))
    }

    return await AppDataSource.getRepository(Presence).findAndCount({
        relations: {collab: true, modifiePar: true},
        where: {
            datePres: dateConfig,
            collab: {
                id: filter.collabs && filter.collabs.length > 0 ? In(filter.collabs) : undefined,
            },
        },
        order: {
            datePres: 'DESC'
        },
        skip: page ? page > 1 ? (page - 1) * itemParPage : 0 : undefined,
        take: itemParPage ? itemParPage : undefined,
    });
}

export async function obtenirPresenceCollab(collab: Collaborateur) {
    return await AppDataSource.getRepository(Presence).findBy({
        collab: {
            id: collab.id
        }
    })
}

export async function ajouterPresenceCollab(collab: number, datePres: Date, hdeb: string, hfin: string,desc:string, executant: Collaborateur) {
    const presence = new Presence();
    presence.collab = await AppDataSource.getRepository(Collaborateur).findOneByOrFail({id: collab});
    presence.datePres = datePres;
    presence.desc = desc
    presence.hdeb = hdeb;
    presence.hfin = hfin;
    presence.creePar = executant.nom + ' ' + executant.prenom;
    return await AppDataSource.getRepository(Presence).save(presence);
}

export async function modifierPresenceCollab(idPres: number, datePres: Date, hdeb: string, hfin: string, desc:string, executant: Collaborateur) {
    const presence = await AppDataSource.getRepository(Presence).findOneOrFail({where:{id: idPres},relations: {collab: true, modifiePar: true}});
    presence.datePres = datePres;
    presence.hdeb = hdeb;
    presence.hfin = hfin;
    presence.desc = desc
    presence.modifieLe = new Date();
    presence.modifiePar = executant
    return await AppDataSource.getRepository(Presence).save(presence);
}

export async function systemeCreerPresence(collab:Collaborateur,hdeb:string,hfin:string,date:Date, desc:string){
    let presence = new Presence()
    presence.desc = desc
    presence.hdeb = hdeb
    presence.hfin = hfin
    presence.collab = collab
    presence.datePres = date
    presence.creePar = 'SYSTEME'
}