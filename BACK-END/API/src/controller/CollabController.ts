import {typeCollab, Collaborateur} from '../database/entity/Collab';
import {AppDataSource} from "../database/datasource";
import {Horaires} from "../database/entity/Horaires";

export async function creerCollab(prenom: string, nom: string, mail: string, date: Date, grade: typeCollab) {
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

export async function assignerHoraire(collaborateur: Collaborateur, horaires: Horaires) {
    if (!collaborateur || !horaires) {
        return false;
    }

    collaborateur.horaires = horaires;

    return await AppDataSource.getRepository(Collaborateur).save(collaborateur);
}

