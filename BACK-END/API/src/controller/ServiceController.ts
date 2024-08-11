import {AppDataSource} from '../database/datasource';
import {Collaborateur} from "../database/entity/Collaborateur";
import {Service} from "../database/entity/Service";
import {In} from "typeorm";
import {isARH, isDRH, isRH} from "./CollabController";
import {ServiceRepository} from "../database/repository/ServiceRepository";
import {CollaborateurRepository} from "../database/repository/CollaborateurRepository";


// Éditer un service existant (chefService facultatif)
export async function editService(service: Service, nomService: string, collaborateurs: any[], chefService: number) {
    service.nomservice = nomService;
    if (collaborateurs && collaborateurs.length > 0) {
        service.collabs = await CollaborateurRepository.findBy({id: In(collaborateurs.map((c)=>c.id))});
    }
    if (chefService) {
        service.chefservice = await CollaborateurRepository.findOneBy({id: chefService});
    }
    return await ServiceRepository.save(service);
}


// Créer un nouveau service avec des collaborateurs (chefService facultatif)
export async function createService(nomService: string, collaborateurs: any[], chefService?: number) {
    const service = new Service();
    service.nomservice = nomService;
    if (chefService) {
        service.chefservice = await CollaborateurRepository.findOneBy({id: chefService});
    }

    if (collaborateurs && collaborateurs.length > 0) {
        service.collabs = await CollaborateurRepository.findBy({id: In(collaborateurs.map((c)=>c.id))});
    } else {
        service.collabs = null; // Aucun collaborateur spécifié
    }

    return await ServiceRepository.save(service);
}


// Obtenir les collaborateurs d'un service
export async function getCollabService(service: Service) {
    return service.collabs;
}

// Obtenir le service contrôlé par un chef de service
export async function getControlService(chefService: Collaborateur) {
    return await ServiceRepository.findOneBy({chefservice: chefService});
}

export async function isSuperior(chefService: Collaborateur, collaborateur: Collaborateur) {
    // if(!collaborateur.service) return false
    // return (collaborateur.service.chefservice.id === chefService.id)

    if (await ServiceRepository.findOne({
        where: {
            collabs: {
                id:In([collaborateur.id])
            },
            chefservice: chefService
        }
    })) {
        return true
    }else{
        return false
    }
}

export async function ServiceUnderControl(collab: Collaborateur) {
    if (
        isDRH(collab)
        || isARH(collab)
        || isRH(collab)
    ) { // Si le collab est RH alors il peut récupérer des infos sur l'ensemble des collab
        return await ServiceRepository.find({
            relations: {
                chefservice: true,
                collabs: true
            }
        })
    }
    /* Sinon c'est que le collaborateur est potentiellement chef de service
    Donc nous allons chercher a récupérer l'ensemble des collaborateurs dans son service*/
    return await ServiceRepository.find({
        relations: {
            chefservice: true,
            collabs: true
        },
        where: {
            chefservice: {
                id: collab.id
            }
        }
    })
}
