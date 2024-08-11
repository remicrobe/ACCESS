import {AppDataSource} from "../database/datasource";
import {Collaborateur} from "../database/entity/Collaborateur";
import {Historique} from "../database/entity/Historique";
import {Service} from "../database/entity/Service";
import {Between, In} from "typeorm";
import {HistoriqueRepository} from "../database/repository/HistoriqueRepository";

export async function getMyHistory(collab:Collaborateur){

    return await HistoriqueRepository.find({
        where: {
            collab: {
                id: collab.id
            }
        },
        relations: {
            point: true,
        }
    })
}

export async function getHistoryByService(service:Service,page:number,itemParPage:number,filter:any){
    let dateConfig, collabConfig, serviceConfig
    if(filter.startDate && filter.endDate){
        dateConfig = Between(new Date(filter.startDate), new Date(filter.endDate))
    }
    return await HistoriqueRepository.findAndCount({
        where: {
            date: dateConfig,
            actionAutorise: filter.state ? filter.state === 'Autorisé' : undefined,
            typeAction: filter.access,
            collab: {
                id: filter.collabs ?  In(filter.collabs) : undefined,
                service: {
                    id: service.id
                }
            }
        },
        relations: {
            point: true,
            collab: true
        },
        skip: page ? page > 1 ? (page-1)*itemParPage : 0 : undefined,
        take: itemParPage ? itemParPage : undefined,
        order:{
            date: "DESC"
        }
    })
}

export async function getHistory(page:number,itemParPage:number,filter:any){
    let dateConfig, collabConfig, serviceConfig
    if(filter.startDate && filter.endDate){
        dateConfig = Between(new Date(filter.startDate), new Date(filter.endDate))
    }
    return await HistoriqueRepository.findAndCount({
        where:{
            date: dateConfig,
            actionAutorise: filter.state ? filter.state === 'Autorisé' : undefined,
            typeAction: filter.access,
            collab: {
                id: filter.collabs ?  In(filter.collabs) : undefined,
            },
        },
        relations: {
            point: true,
            collab: true
        },
        skip: page ? page > 1 ? (page-1)*itemParPage : 0 : undefined,
        take: itemParPage ? itemParPage : undefined,
        order:{
            date: "DESC"
        }

    })
}