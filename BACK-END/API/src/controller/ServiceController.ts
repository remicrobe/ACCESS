import {AppDataSource} from '../database/datasource';
import {Collaborateur} from "../database/entity/Collab";
import {Service} from "../database/entity/Service";
import {In} from "typeorm";
import {isARH, isDRH, isRH} from "./CollabController";


// Éditer un service existant (chefService facultatif)
export async function editService(service: Service, nomService: string,  collaborateurs: number[], chefService?: Collaborateur) {
    service.nomservice = nomService;
    if (collaborateurs && collaborateurs.length > 0) {
        service.collabs = await AppDataSource.getRepository(Collaborateur).findBy({id: In(collaborateurs)});
    }
    if(chefService){
        service.chefservice = chefService
    }
    return await AppDataSource.getRepository(Service).save(service);
}



// Créer un nouveau service avec des collaborateurs (chefService facultatif)
export async function createService(nomService: string, collaborateurs: number[], chefService?: number) {
    const service = new Service();
    service.nomservice = nomService;
    if(chefService){
        service.chefservice = await AppDataSource.getRepository(Collaborateur).findOneBy({id: chefService});
    }

    if (collaborateurs && collaborateurs.length > 0) {
        service.collabs = await AppDataSource.getRepository(Collaborateur).findBy({id: In(collaborateurs)});
    } else {
        service.collabs = null; // Aucun collaborateur spécifié
    }

    return await AppDataSource.getRepository(Service).save(service);
}





// Obtenir les collaborateurs d'un service
export async function getCollabService(service: Service) {
    return service.collabs;
}

// Obtenir le service contrôlé par un chef de service
export async function getControlService(chefService: Collaborateur) {
    return await AppDataSource.getRepository(Service).findOneBy({chefservice: chefService});
}

export async function isSuperior(chefService: Collaborateur, collaborateur: Collaborateur) {
    return (collaborateur.service.chefservice.id === chefService.id)
}

export async function ServiceUnderControl(collab:Collaborateur){
    if (
        isDRH(collab)
        || isARH(collab)
        || isRH(collab)
    ) { // Si le collab est RH alors il peut récupérer des infos sur l'ensemble des collab
        return await AppDataSource.getRepository(Service).find({
            relations: {
                chefservice:true,
                collabs: true
            }
        })
    }
    /* Sinon c'est que le collaborateur est potentiellement chef de service
    Donc nous allons chercher a récupérer l'ensemble des collaborateurs dans son service*/
    return await AppDataSource.getRepository(Service).find({
        relations: {
            chefservice:true,
            collabs: true
        },
        where: {
            chefservice:{
                id: collab.id
            }
        }
    })
}
