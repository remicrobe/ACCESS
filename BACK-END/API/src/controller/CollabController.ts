import {Collaborateur, typeCollab} from '../database/entity/Collab';
import {AppDataSource} from "../database/datasource";
import {Horaire} from "../database/entity/Horaire";
import {Service} from "../database/entity/Service";
import {HorairesModele} from "../database/entity/HorairesModele";


export async function creerCollab(prenom: string, nom: string, mail: string, grade: typeCollab, fonction: string,service:any, modelehoraire:any, horraire: any[],actif:boolean) {
    const utilisateurExistant = await AppDataSource.getRepository(Collaborateur).findOneBy({mail: mail});
    if (utilisateurExistant) {
        return null;
    }

    let utilisateur = new Collaborateur();
    utilisateur.prenom = prenom;
    utilisateur.nom = nom;
    utilisateur.mail = mail;
    utilisateur.grade = grade;
    utilisateur.actif = actif
    utilisateur.fonction = fonction

    if(modelehoraire) {
        utilisateur.horairesdefault = await AppDataSource.getRepository(HorairesModele).findOneByOrFail({id: modelehoraire.id})
    }else if (horraire) {
        utilisateur.horaire = await setCollabHoraire(utilisateur, horraire)
    }

    if(service) {
        if(service.id)
            utilisateur.service = await AppDataSource.getRepository(Service).findOneByOrFail({id:service.id})
    }


    return await AppDataSource.getRepository(Collaborateur).save(utilisateur)
}

export async function getCollabInfoFromId(id: number) {
    return await AppDataSource.getRepository(Collaborateur).findOneOrFail(
        {
            where:
                {
                    id: id
                },
            relations: {
                horaire: true,
                service: {
                    chefservice: true
                }
            }
        });
}

export async function setCollabHoraire(collaborateur:Collaborateur, collabHoraire:any){

    let newHorraire = new Horaire()
    if (collaborateur.horaire) {
        newHorraire = collaborateur.horaire
    }

    newHorraire.hDebLundi = collabHoraire.hDebLundi;
    newHorraire.hFinLundi = collabHoraire.hFinLundi;

    newHorraire.hDebMardi = collabHoraire.hDebMardi;
    newHorraire.hFinMardi = collabHoraire.hFinMardi;

    newHorraire.hDebMercredi = collabHoraire.hDebMercredi;
    newHorraire.hFinMercredi = collabHoraire.hFinMercredi;

    newHorraire.hDebJeudi = collabHoraire.hDebJeudi;
    newHorraire.hFinJeudi = collabHoraire.hFinJeudi;

    newHorraire.hDebVendredi = collabHoraire.hDebVendredi;
    newHorraire.hFinVendredi = collabHoraire.hFinVendredi;

    newHorraire.hDebSamedi = collabHoraire.hDebSamedi;
    newHorraire.hFinSamedi = collabHoraire.hFinSamedi;

    newHorraire.hDebDimanche = collabHoraire.hDebDimanche;
    newHorraire.hFinDimanche = collabHoraire.hFinDimanche;

    return await AppDataSource.getRepository(Horaire).save(newHorraire)
}
export async function modifierCollab(collaborateur:Collaborateur, prenom: string, nom: string, mail: string, grade: typeCollab, fonction: string,service:any, modelehoraire:any, horraire: any[], actif:boolean) {

    if (horraire) {
        collaborateur.horaire = await setCollabHoraire(collaborateur, horraire)
    }
    collaborateur.prenom = prenom;
    collaborateur.nom = nom;
    collaborateur.mail = mail;
    collaborateur.grade = grade;
    collaborateur.fonction = fonction
    collaborateur.actif = actif
    if(modelehoraire) {
        if(modelehoraire.id) {
            collaborateur.horairesdefault = await AppDataSource.getRepository(HorairesModele).findOneByOrFail({id: modelehoraire.id})
            collaborateur.horaire = null
        } else {
            collaborateur.horairesdefault = null
        }
    }else{
        if (horraire) {
            collaborateur.horaire = await setCollabHoraire(collaborateur, horraire)
            collaborateur.horairesdefault = null
        }
    }

    if(service) {
        if(service.id === null){
            collaborateur.service= null
        }else{
            collaborateur.service = await AppDataSource.getRepository(Service).findOneByOrFail({id:service.id})
        }
    }

    return await AppDataSource.getRepository(Collaborateur).save(collaborateur)
}

// Méthode pour récuperer les collab sous le control d'un collab
export async function getCollabUnderControl(collab: Collaborateur) {
    if (
        isDRH(collab)
        || isARH(collab)
        || isRH(collab)
    ) { // Si le collab est RH alors il peut récupérer des infos sur l'ensemble des collab
        return await AppDataSource.getRepository(Collaborateur).find({
            relations: {
                horaire: true,
                horairesdefault: true,
                service: {
                    chefservice: true,
                    collabs: false
                },
            }
        })
    }
    /* Si cette condition est valide c'est que le collaborateur est chef de son propre service
    Donc nous allons chercher a récupérer l'ensemble des collaborateurs dans ce service*/
    return await AppDataSource.getRepository(Collaborateur).find({
        relations: {
            horaire: true,
            horairesdefault: true,
            service: {
                chefservice: true,
                collabs: false
            },
        },
        where: {
            service: {
                chefservice: {
                    id: collab.id
                }
            }
        }
    })

}


// Méthode pour vérifier si un collaborateur est de grade RH
export function isRH(collab: Collaborateur): boolean {
    return collab.grade === typeCollab.rh;
}

// Méthode pour vérifier si un collaborateur est de grade DRH
export function isDRH(collab: Collaborateur): boolean {
    return collab.grade === typeCollab.drh;
}

// Méthode pour vérifier si un collaborateur est de grade ARH
export function isARH(collab: Collaborateur): boolean {
    return collab.grade === typeCollab.arh;
}

