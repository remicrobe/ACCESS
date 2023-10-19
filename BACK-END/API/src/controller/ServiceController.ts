import {AppDataSource} from '../database/datasource';
import {Collaborateur} from "../database/entity/Collab";
import {Service} from "../database/entity/Service";
import {In} from "typeorm";

// Ajouter des collaborateurs à un service
export async function addCollab(collaborateurs: Collaborateur[], service: Service) {
    service.collabs = service.collabs.concat(collaborateurs);
    return await AppDataSource.getRepository(Service).save(service);
}

// Supprimer des collaborateurs d'un service
export async function removeCollab(collaborateurs: Collaborateur[], service: Service) {
    service.collabs = service.collabs.filter((collab) => !collaborateurs.includes(collab));
    return await AppDataSource.getRepository(Service).save(service);
}

// Éditer un service existant (chefService facultatif)
export async function editService(service: Service, nomService: string, chefService?: Collaborateur) {
    service.nomservice = nomService;
    return await AppDataSource.getRepository(Service).save(service);
}


// Créer un nouveau service avec des collaborateurs (chefService facultatif)
export async function createService(nomService: string, collaborateurs: number[], chefService?: Collaborateur) {
    const service = new Service();
    service.nomservice = nomService;
    service.chefservice = chefService || null; // Utilisation du chefService s'il est fourni, sinon null

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
    return AppDataSource.getRepository(Service).findOneBy({chefservice: chefService});
}

export async function isSuperior(chefService: Collaborateur, collaborateur: Collaborateur) {
    const serviceRepository = AppDataSource.getRepository(Service);
    const chefServiceServices = await serviceRepository.findBy({ chefservice: chefService });

    // Vérifier si le collaborateur est rattaché à l'un des services dirigés par chefService
    for (const service of chefServiceServices) {
        if (service.collabs.some((c) => c.id === collaborateur.id)) {
            return true;
        }
    }

    return false;
}
