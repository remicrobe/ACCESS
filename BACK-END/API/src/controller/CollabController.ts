import {typeCollab, Collaborateur} from '../database/entity/Collab';
import {AppDataSource} from "../database/datasource";



export async function creerCollab(prenom: string, nom: string, mail: string, grade: typeCollab, fonction:string) {
    const utilisateurExistant = await AppDataSource.getRepository(Collaborateur).findOneBy({ mail: mail });
    if (utilisateurExistant) {
        return null;
    }

    let utilisateur = new Collaborateur();
    utilisateur.prenom = prenom;
    utilisateur.nom = nom;
    utilisateur.mail = mail;
    utilisateur.grade = grade;
    utilisateur.fonction = fonction
    return await AppDataSource.getRepository(Collaborateur).save(utilisateur)
}

export function setCollabGrade(utilisateur: Collaborateur, nouveauGrade: typeCollab) {
    utilisateur.grade = nouveauGrade;
    return utilisateur
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

