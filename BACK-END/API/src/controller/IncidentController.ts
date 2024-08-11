import { Between, IsNull, In } from "typeorm";
import { AppDataSource } from "../database/datasource";
import { Collaborateur } from "../database/entity/Collaborateur";
import { Incident } from "../database/entity/Incident";
import {IncidentRepository} from "../database/repository/IncidentRepository";

export async function getIncidentUnderMyControl(collab: Collaborateur, page: number, itemParPage: number, filter: any) {
    let dateConfig, accepteConfig;
    if (filter.startDate && filter.endDate) {
        dateConfig = Between(new Date(filter.startDate), new Date(filter.endDate));
    }
    if (filter.state === 'Ouvert') {
        accepteConfig = true;
    } else if (filter.state === 'Fermé') {
        accepteConfig = false;
    }
    return await IncidentRepository.findAndCount({
        where: {
            creeLe: dateConfig,
            ouvert: accepteConfig,
            collab: {
                id: filter.collabs ? In(filter.collabs) : undefined,
                service: {
                    chefservice: {
                        id: collab.id
                    }
                }
            }
        },
        order: {
            creeLe: 'DESC'
        },
        relations: {collab: true, modifiePar: true, reponse: true},
        skip: page ? page > 1 ? (page - 1) * itemParPage : 0 : undefined,
        take: itemParPage ? itemParPage : undefined,
    });
}

export async function getAllIncident(page: number, itemParPage: number, filter: any) {
    let dateConfig, accepteConfig;
    if (filter.startDate && filter.endDate) {
        dateConfig = Between(new Date(filter.startDate), new Date(filter.endDate));
    }
    if (filter.state) {
        if (filter.state === 'Ouvert') {
            accepteConfig = true;
        } else if (filter.state === 'Fermé') {
            accepteConfig = false;
        }
    }
    return await IncidentRepository.findAndCount({
        relations: {collab: true, modifiePar: true, reponse: true},
        where: {
            creeLe: dateConfig,
            ouvert: accepteConfig,
            collab: {
                id: filter.collabs ? In(filter.collabs) : undefined,
            },
        },
        order: {
            creeLe: 'DESC'
        },
        skip: page ? page > 1 ? (page - 1) * itemParPage : 0 : undefined,
        take: itemParPage ? itemParPage : undefined,
    });
}
