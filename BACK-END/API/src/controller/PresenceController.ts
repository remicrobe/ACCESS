import { Between, In, IsNull } from "typeorm"
import { Collaborateur } from "../database/entity/Collab"
import { AppDataSource } from "../database/datasource";
import { Presence } from "../database/entity/Presence";

export async function listerPresenceMesCollabs(collab: Collaborateur, page:number,itemParPage:number,filter:any) {
    let dateConfig
    if(filter.startDate && filter.endDate){
        dateConfig = Between(new Date(filter.startDate), new Date(filter.endDate))
    }
    
    return await AppDataSource.getRepository(Presence).findAndCount({
        where: {
            datePres: dateConfig,
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
            datePres: 'DESC'
        },
        relations: {collab: true, modifiePar: true},
        skip: page ? page > 1 ? (page-1)*itemParPage : 0 : undefined,
        take: itemParPage ? itemParPage : undefined,
    });
}

export async function listerPresence(page:number,itemParPage:number,filter:any) {
    let dateConfig
    if(filter.startDate && filter.endDate){
        dateConfig = Between(new Date(filter.startDate), new Date(filter.endDate))
    }
    
    return await AppDataSource.getRepository(Presence).findAndCount({
        relations: {collab: true, modifiePar: true},
        where:{
            datePres: dateConfig,
            collab: {
                id: filter.collabs ?  In(filter.collabs) : undefined,
            },
        },
        order:{
            datePres: 'DESC'
        },
        skip: page ? page > 1 ? (page-1)*itemParPage : 0 : undefined,
        take: itemParPage ? itemParPage : undefined,
    });
}

export async function obtenirPresenceCollab(collab:Collaborateur){
    return await AppDataSource.getRepository(Presence).findBy({
        collab:{
            id: collab.id
        }
    })
}