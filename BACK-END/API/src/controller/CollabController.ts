import {Collaborateur, typeCollab} from '../database/entity/Collab';
import {AppDataSource} from "../database/datasource";
import {Horaire} from "../database/entity/Horaire";
import {Service} from "../database/entity/Service";
import {HorairesModele} from "../database/entity/HorairesModele";
import {Absence} from "../database/entity/Absence";
import {Between, Brackets, IsNull, MoreThan, Not} from "typeorm";
import {DateTime} from "luxon";
import {isNull} from "util";
import {sendAbsenceMail, sendNotGoodHourMail} from "../utils/mail/mail";
import {systemeCreerPresence} from "./PresenceController";


export async function creerCollab(prenom: string, nom: string, mail: string, grade: typeCollab, fonction: string, service: any, modelehoraire: any, horraire: any[], actif: boolean) {
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

    if (modelehoraire) {
        utilisateur.horairesdefault = await AppDataSource.getRepository(HorairesModele).findOneByOrFail({id: modelehoraire.id})
    } else if (horraire) {
        utilisateur.horaire = await setCollabHoraire(utilisateur, horraire)
    }

    if (service) {
        if (service.id)
            utilisateur.service = await AppDataSource.getRepository(Service).findOneByOrFail({id: service.id})
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

export async function setCollabHoraire(collaborateur: Collaborateur, collabHoraire: any) {

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

export async function modifierCollab(collaborateur: Collaborateur, prenom: string, nom: string, mail: string, grade: typeCollab, fonction: string, service: any, modelehoraire: any, horraire: any[], actif: boolean) {

    if (horraire) {
        collaborateur.horaire = await setCollabHoraire(collaborateur, horraire)
    }
    collaborateur.prenom = prenom;
    collaborateur.nom = nom;
    collaborateur.mail = mail;
    collaborateur.grade = grade;
    collaborateur.fonction = fonction
    collaborateur.actif = actif
    if (modelehoraire) {
        if (modelehoraire.id) {
            collaborateur.horairesdefault = await AppDataSource.getRepository(HorairesModele).findOneByOrFail({id: modelehoraire.id})
            collaborateur.horaire = null
        } else {
            collaborateur.horairesdefault = null
        }
    } else {
        if (horraire) {
            collaborateur.horaire = await setCollabHoraire(collaborateur, horraire)
            collaborateur.horairesdefault = null
        }
    }

    if (service) {
        if (service.id === null) {
            collaborateur.service = null
        } else {
            collaborateur.service = await AppDataSource.getRepository(Service).findOneByOrFail({id: service.id})
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

export async function advertCollabHorsHeure() {
    try {
        let yesterday = DateTime.now().minus({day: 1});
        let dayOfWeek = yesterday.toJSDate().toLocaleDateString('fr-FR', {weekday: 'long'});
        let hDeb = 'hDeb' + dayOfWeek.charAt(0).toUpperCase() + dayOfWeek.slice(1);

        let presentCollab = await AppDataSource.getRepository(Collaborateur).find({
            where: [
                {
                    horaire: {
                        [hDeb]: Not('00:00:00')
                    },
                    historique: {
                        date: Between(yesterday.startOf("day").toJSDate(), yesterday.endOf("day").toJSDate()),
                        typeAction: 'Pointage'
                    }
                },
                {
                    horairesdefault: {
                        [hDeb]: Not('00:00:00')
                    },
                    historique: {
                        date: Between(yesterday.startOf("day").toJSDate(), yesterday.endOf("day").toJSDate()),
                        typeAction: 'Pointage'
                    }
                },
            ],
            relations: {
                historique: true,
                horairesdefault: true,
                horaire: true,
                service: {
                    chefservice: true
                }
            }
        })

        let noPresentCollab = await AppDataSource
            .createQueryBuilder(Collaborateur, "collaborateur")
            .leftJoinAndSelect("collaborateur.horairesdefault", "horairesdefault")
            .leftJoinAndSelect("collaborateur.horaire", "horaire")
            .leftJoinAndSelect("collaborateur.service", "service")
            .leftJoinAndSelect("service.chefservice", "chefservice")
            .leftJoin("collaborateur.historique", "historique")
            .where(new Brackets(qb => {
                qb.where(`horaire.${hDeb} != :time`, {time: '00:00:00'})
                    .andWhere("historique.date NOT BETWEEN :start AND :end", {
                        start: yesterday.startOf("day").toJSDate(),
                        end: yesterday.endOf("day").toJSDate()
                    })
                ;
            }))
            .orWhere(new Brackets(qb => {
                qb.where(`horairesdefault.${hDeb} != :time`, {time: '00:00:00'})
                    .andWhere("historique.date NOT BETWEEN :start AND :end", {
                        start: yesterday.startOf("day").toJSDate(),
                        end: yesterday.endOf("day").toJSDate()
                    })
            }))
            .orWhere(new Brackets(qb => {
                qb.where(`horairesdefault.${hDeb} != :time`, {time: '00:00:00'})
                    .andWhere("historique.date IS NULL");
            }))
            .orWhere(new Brackets(qb => {
                qb.where(`horaire.${hDeb} != :time`, {time: '00:00:00'})
                    .andWhere("historique.typeAction != 'Pointage'")
                    .andWhere('collaborateur.id NOT IN (:...idList)', {idList: presentCollab.length > 0 ? presentCollab.map((collab) => collab.id) : [-1]})
                    .andWhere("historique.date BETWEEN :start AND :end", {
                        start: yesterday.startOf("day").toJSDate(),
                        end: yesterday.endOf("day").toJSDate()
                    })
                ;
            }))
            .orWhere(new Brackets(qb => {
                qb.where(`horairesdefault.${hDeb} != :time`, {time: '00:00:00'})
                    .andWhere("historique.typeAction != 'Pointage'")
                    .andWhere('collaborateur.id NOT IN (:...idList)', {idList: presentCollab.length > 0 ? presentCollab.map((collab) => collab.id) : [-1]})
                    .andWhere("historique.date BETWEEN :start AND :end", {
                        start: yesterday.startOf("day").toJSDate(),
                        end: yesterday.endOf("day").toJSDate()
                    })
            }))
            .getMany();

        presentCollab.forEach((collab) => {
            let expectedStartString = collab.horairesdefault[hDeb];
            let expectedStart = DateTime.fromFormat(expectedStartString, 'HH:mm:ss').minus({day: 1});
            let actualStart = DateTime.fromJSDate(collab.historique[0].date);

            let diffStart = actualStart.diff(expectedStart, "hour").toObject();

            let hFin = 'hFin' + dayOfWeek.charAt(0).toUpperCase() + dayOfWeek.slice(1);
            let expectedEndString = collab.horairesdefault[hFin];
            let expectedEnd = DateTime.fromFormat(expectedEndString, 'HH:mm:ss').minus({day: 1});
            let actualEnd = DateTime.fromJSDate(collab.historique[collab.historique.length - 1].date);

            let diffEnd = actualEnd.diff(expectedEnd, "hour").toObject();
            if (Math.abs(diffStart.hours) >= 1 || Math.abs(diffEnd.hours) >= 1) { // difference is one hour or more
                sendNotGoodHourMail(collab, collab.service.chefservice, expectedStart.toJSDate(), expectedEnd.toJSDate(), actualStart.toJSDate(), actualEnd.toJSDate(), yesterday.toJSDate())
            }
            systemeCreerPresence(collab,actualStart.toFormat("HH:mm:ss"),actualEnd.toFormat("HH:mm:ss"),yesterday.toJSDate(),'Basé sur historique')
        })

        noPresentCollab.forEach((collab) => {
            sendAbsenceMail(collab, collab.service.chefservice, yesterday.toJSDate())
            systemeCreerPresence(collab,"00:00:00","00:00:00",yesterday.toJSDate(),'Basé sur historique')
        })

    } catch (e) {
        console.log(e)
    }

}

