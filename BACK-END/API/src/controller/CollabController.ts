import {typeCollab, Collaborateur} from '../database/entity/Collab';
import {AppDataSource} from "../database/datasource";

export async function creerCollab(prenom: string, nom: string, mail: string, motdepasse: string, date: Date, grade: typeCollab) {
    const utilisateurExistant = await AppDataSource.getRepository(Collaborateur).findOneBy({ mail: mail });
    if (utilisateurExistant) {
        return null;
    }

    let utilisateur = new Collaborateur();
    utilisateur.prenom = prenom;
    utilisateur.nom = nom;
    utilisateur.mail = mail;
    utilisateur.date = date;
    utilisateur.grade = grade;
    return await AppDataSource.getRepository(Collaborateur).save(utilisateur)
}

export function setCollabGrade(utilisateur: Collaborateur, nouveauGrade: typeCollab) {
    utilisateur.grade = nouveauGrade;
    return utilisateur
}

