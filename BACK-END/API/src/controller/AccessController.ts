import {Access, typePoint} from '../database/entity/Access';
import {AppDataSource} from "../database/datasource";
import {Collaborateur} from "../database/entity/Collab";
import {Service} from "../database/entity/Service";
import {In} from "typeorm";

export async function creerAccess(macadress: string, typePoint: typePoint, location: string, nompoint: string, active: boolean, collabAutoriseIds: number[], serviceAutoriseIds: number[]) {

    let collabAutorise
    if (collabAutoriseIds && collabAutoriseIds.length > 0) {
         collabAutorise = await AppDataSource.getRepository(Collaborateur).findBy({id: In(collabAutoriseIds)});
    }
    let serviceAutorise
    if (serviceAutoriseIds && serviceAutoriseIds.length > 0) {
         serviceAutorise = await AppDataSource.getRepository(Service).findBy({id: In(serviceAutoriseIds)});
    }

    let access = new Access();
    access.macadress = macadress;
    access.typePoint = typePoint;
    access.location = location;
    access.nompoint = nompoint;
    access.active = active;
    access.collabAutorise = collabAutorise;
    access.serviceAutorise = serviceAutorise;

    return await AppDataSource.getRepository(Access).save(access)
}

export async function modifierAccess(accessID: number, macadress: string, typePoint: typePoint, location: string, nompoint: string, active: boolean, collabAutoriseIds: number[], serviceAutoriseIds: number[]) {

    const access = await AppDataSource.getRepository(Access).findOne(
        {
            where:
                {
                    id: accessID
                },
            relations: {
                collabAutorise: true,
                serviceAutorise: true,
            }
        });
    if (!access) {
        return null;
    }

    let collabAutorise
    if (collabAutoriseIds && collabAutoriseIds.length > 0) {
        collabAutorise = await AppDataSource.getRepository(Collaborateur).findBy({id: In(collabAutoriseIds)});
    }
    let serviceAutorise
    if (serviceAutoriseIds && serviceAutoriseIds.length > 0) {
        serviceAutorise = await AppDataSource.getRepository(Service).findBy({id: In(serviceAutoriseIds)});
    }

    access.macadress = macadress;
    access.typePoint = typePoint;
    access.location = location;
    access.nompoint = nompoint;
    access.active = active;
    access.collabAutorise = collabAutorise;
    access.serviceAutorise = serviceAutorise;

    return await AppDataSource.getRepository(Access).save(access);
}

export async function listeAccess(){
    return await AppDataSource.getRepository(Access).find({
        relations:{
            collabAutorise: true,
            serviceAutorise: true,
        }
    })
}

export async function pointAccessAccessible(collab: Collaborateur){
    const collabId = collab.id;
    const serviceId = collab.service.id;

    let accessByCollab = await AppDataSource.getRepository(Access)
        .createQueryBuilder("access")
        .leftJoin("access.collabAutorise", "collab")
        .where("collab.id = :collabId", { collabId })
        .getMany();

    let accessByService = await AppDataSource.getRepository(Access)
        .createQueryBuilder("access")
        .leftJoin("access.serviceAutorise", "service")
        .where("service.id = :serviceId", { serviceId })
        .getMany();

    let allAccess = [...accessByCollab, ...accessByService];

    let uniqueIds = new Set();

    // Filter the results to remove duplicates
    let uniqueAccess = allAccess.filter(access => {
        if (!uniqueIds.has(access.id)) {
            uniqueIds.add(access.id);
            return true;
        }
        return false;
    });

    return {access: uniqueAccess};
}

export async function getPointConfig(macAdress) {
    // Récupérer le point d'accès à partir de l'adresse MAC
    return await AppDataSource.getRepository(Access).findOneOrFail({
        where: {
            macadress: macAdress
        },
        relations: {
            collabAutorise: true,
            serviceAutorise: true,
        }
    })
}

export async function aAccess(collaborateur, macAdress) {
    // Récupérer le point d'accès à partir de l'adresse MAC
    const access = await AppDataSource.getRepository(Access).findOneOrFail({
        where: {
            macadress: macAdress
        },
        relations: {
            collabAutorise: true,
            serviceAutorise: true,
        }
    });

    if (!access) {
        return null;
    }

    if(access.typePoint === typePoint.pointeuse){
        // Logique pour enregistrer dans la table que le collaborateur a pointé
        console.log('pointage')
        return true
    }

    // Vérifier si le collaborateur a accès
    const hasAccess = access.collabAutorise.some(collab => collab.id === collaborateur.id) ||
        access.serviceAutorise.some(service => service.id === collaborateur.service.id);

    if(hasAccess){
        // Logique pour enregistrer dans la table que le collaborateur a accédé au point
        return true
    }else{
        throw `Collaborateur ${collaborateur.id} a éssayé d'accéder a la zone ${access.nompoint} de manière non autorisée`
    }
}