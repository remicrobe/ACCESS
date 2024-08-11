import {Access, typePoint} from '../database/entity/Access';
import {AppDataSource} from "../database/datasource";
import {Collaborateur} from "../database/entity/Collaborateur";
import {Service} from "../database/entity/Service";
import {In} from "typeorm";
import {Historique} from "../database/entity/Historique";
import {DateTime} from "luxon";
import {sendunauthorizedAccessMail} from "../utils/mail/mail";
import {ServiceRepository} from "../database/repository/ServiceRepository";
import {CollaborateurRepository} from "../database/repository/CollaborateurRepository";
import {AccessRepository} from "../database/repository/AccessRepository";
import {HistoriqueRepository} from "../database/repository/HistoriqueRepository";

export async function creerAccess(macadress: string, typePoint: typePoint, location: string, nompoint: string, active: boolean, collabAutorise: any[], serviceAutorise: any[]) {


    let access = new Access();
    access.macadress = macadress;
    access.typePoint = typePoint;
    access.location = location;
    access.nompoint = nompoint;
    access.active = active;
    if (collabAutorise && collabAutorise.length > 0) {
        access.collabAutorise = await CollaborateurRepository.findBy({id: In(collabAutorise.map((c) => c.id))});
    }
    if (serviceAutorise && serviceAutorise.length > 0) {
        access.serviceAutorise = await ServiceRepository.findBy({id: In(serviceAutorise.map((s) => s.id))});
    }

    return await AccessRepository.save(access)
}

export async function modifierAccess(accessID: number, macadress: string, typePoint: typePoint, location: string, nompoint: string, active: boolean, collabAutorise: any[], serviceAutorise: any[]) {

    const access = await AccessRepository.findOne(
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

    access.macadress = macadress;
    access.typePoint = typePoint;
    access.location = location;
    access.nompoint = nompoint;
    access.active = active;
    if (collabAutorise && collabAutorise.length > 0) {
        access.collabAutorise = await CollaborateurRepository.findBy({id: In(collabAutorise.map((c) => c.id))});
    } else {
        access.collabAutorise = null
    }
    if (serviceAutorise && serviceAutorise.length > 0) {
        access.serviceAutorise = await ServiceRepository.findBy({id: In(serviceAutorise.map((s) => s.id))});
    } else {
        access.serviceAutorise = null
    }


    return await AccessRepository.save(access);
}

export async function listeAccess() {
    return await AccessRepository.find({
        relations: {
            collabAutorise: true,
            serviceAutorise: true,
        }
    })
}

export async function pointAccessAccessible(collab: Collaborateur) {
    const collabId = collab.id;
    const serviceId = collab.service.id;

    let accessByCollab = await AccessRepository
        .createQueryBuilder("access")
        .leftJoin("access.collabAutorise", "collab")
        .where("collab.id = :collabId", {collabId})
        .getMany();

    let accessByService = await AccessRepository
        .createQueryBuilder("access")
        .leftJoin("access.serviceAutorise", "service")
        .where("service.id = :serviceId", {serviceId})
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
    return await AccessRepository.findOneOrFail({
        where: {
            macadress: macAdress,
        },
        relations: {
            collabAutorise: true,
            serviceAutorise: true,
        }
    })
}

export async function aAccess(collaborateur: Collaborateur, macAdress) {


    // Récupérer le point d'accès à partir de l'adresse MAC
    const access = await AccessRepository.findOneOrFail({
        where: {
            macadress: macAdress,
            active: true,
        },
        relations: {
            collabAutorise: {
                horaire: true,
                horairesdefault: true
            },
            serviceAutorise: {
                collabs: {
                    horaire: true,
                    horairesdefault: true
                }
            },
        }
    });

    if (!access) {
        return null;
    }


    let newHistory = new Historique()
    newHistory.collab = collaborateur
    newHistory.point = access
    newHistory.actionAutorise = true
    newHistory.statutUtilise = ''


    if (access.typePoint === typePoint.pointeuse) {
        newHistory.typeAction = 'Pointage'

        await HistoriqueRepository.save(newHistory)
        return true
    } else {
        newHistory.typeAction = 'Access'
    }

    // Vérifier si le collaborateur a accès
    let hasAccess = false;
    if (access.collabAutorise.length > 0 || access.serviceAutorise.length > 0) {
        if (access.collabAutorise.some(collab => collab.id === collaborateur.id)) {
            hasAccess = true;
        } else if (access.serviceAutorise) {
            access.serviceAutorise.forEach((service) => {
                service.collabs.forEach((collab) => {
                    if (collab.id === collaborateur.id) {
                        hasAccess = true;
                        newHistory.statutUtilise = 'Service'
                    }
                })
            })
        }
    }

    if (hasAccess) {
        let today = new Date();
        let dayOfWeek = today.toLocaleDateString('fr-FR', {weekday: 'long'});
        let hDeb = 'hDeb' + dayOfWeek.charAt(0).toUpperCase() + dayOfWeek.slice(1);
        let hFin = 'hFin' + dayOfWeek.charAt(0).toUpperCase() + dayOfWeek.slice(1);
        const now = DateTime.now().toMillis()
        if (collaborateur.horaire) {
            const heureDebAutorise = DateTime.fromFormat(collaborateur.horaire[hDeb], "HH:mm:ss").toMillis();
            const heureFinAutorise = DateTime.fromFormat(collaborateur.horaire[hFin], "HH:mm:ss").toMillis();
            if(now < heureDebAutorise || now > heureFinAutorise){
                newHistory.statutUtilise += ' Hors heure'
                hasAccess = false
            }
        } else if (collaborateur.horairesdefault) {
            const heureDebAutorise = DateTime.fromFormat(collaborateur.horairesdefault[hDeb], "HH:mm:ss").toMillis();
            const heureFinAutorise = DateTime.fromFormat(collaborateur.horairesdefault[hFin], "HH:mm:ss").toMillis();
            if(now < heureDebAutorise || now > heureFinAutorise){
                newHistory.statutUtilise += ' Hors heure'
                hasAccess = false
            }
        }
    }

    if (hasAccess) {
        await HistoriqueRepository.save(newHistory)
        return collaborateur
    } else {
        newHistory.actionAutorise = false
        await HistoriqueRepository.save(newHistory)
        if(collaborateur.service && collaborateur.service.chefservice)
        {
            sendunauthorizedAccessMail(collaborateur, collaborateur.service.chefservice, access)
        }
        throw `[WARNING] Collaborateur ${collaborateur.id} a éssayé d'accéder a la zone ${access.nompoint} de manière non autorisée`
    }
}