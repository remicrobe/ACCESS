import * as nodemailer from 'nodemailer';
import config from '../../config'
import * as path from "path";
import * as fs from "fs";
import {Collaborateur} from "../../database/entity/Collab";
import {Access} from "../../database/entity/Access";
import {Absence} from "../../database/entity/Absence";
import {obtenirDateFR} from "../date/date";

const transporter = nodemailer.createTransport({
    host: config.SMTP,  // Utilisation du serveur SMTP fourni dans les variables d'environnement
    port: parseInt(config.PORTSMTP),  // Port SMTP standard
    secure: false,  // Utilisation de TLS
    auth: {
        user: config.EMAIL,
        pass: config.PASSWORD,
    },
    tls: {
        rejectUnauthorized:false
    }
});



export async function sendRecoveryMail(recovery, mail, name) {
    return new Promise((resolve, reject) => {
        const activationLink = config.WEBSITEURL + '/login/reset-password/' + recovery;
        const logoPath = 'mail-template/mns-fulllogo.png'; // Remplacez par le chemin de votre logo

        fs.readFile('mail-template/recover-account.html', 'utf8', (err, data) => {
            if (err) {
                reject(err);
            } else {
                let htmlContent = data.replace('LINK', activationLink).replace('PRENOM', name);

                const mailOptions = {
                    from: config.EMAIL,
                    to: mail,
                    subject: 'Aide à la connexion',
                    html: htmlContent,
                    attachments: [{
                        filename: 'logo.png',
                        path: logoPath,
                        cid: 'logo' // Identique à l'attribut 'cid' dans le src de l'image dans le HTML
                    }]
                };

                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(info);
                    }
                });
            }
        });
    });
}

export async function sendNewCongeMail(collab:Collaborateur, chefService: Collaborateur, demande:Absence) {
    return new Promise((resolve, reject) => {
        const link = config.WEBSITEURL + '/demande-collab'
        const logoPath = 'mail-template/mns-fulllogo.png'; // Remplacez par le chemin de votre logo

        fs.readFile('mail-template/request-absence.html', 'utf8', (err, data) => {
            if (err) {
                reject(err);
            } else {
                let htmlContent = data.replace('LINK', link)
                    .replace('PRENOMCHEF', chefService.prenom)
                    .replace('NOMCOLLAB', collab.nom)
                    .replace('PRENOMCOLLAB', collab.prenom)
                    .replace('DATEDEB', obtenirDateFR(demande.datedeb))
                    .replace('DATEFIN', obtenirDateFR(demande.datefin))
                    .replace('RAISONDEMANDE', demande.description)

                const mailOptions = {
                    from: config.EMAIL,
                    to: chefService.mail,
                    cc: collab.mail,
                    subject: 'Une nouvelle demande a été créée',
                    html: htmlContent,
                    attachments: [{
                        filename: 'logo.png',
                        path: logoPath,
                        cid: 'logo' // Identique à l'attribut 'cid' dans le src de l'image dans le HTML
                    }]
                };

                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(info);
                    }
                });
            }
        });
    });
}

export async function sendAbsenceMail(collab:Collaborateur, idIncident: number, date:Date) {
    return new Promise((resolve, reject) => {
        const logoPath = 'mail-template/mns-fulllogo.png'; // Remplacez par le chemin de votre logo

        fs.readFile('mail-template/collab-no-present.html', 'utf8', (err, data) => {
            if (err) {
                reject(err);
            } else {
                let htmlContent = data.replace('PRENOMCOLLAB', collab.prenom)
                    .replace('DATE', date.toLocaleDateString('fr-FR'))

                const mailOptions = {
                    from: config.EMAIL,
                    to: collab.mail,
                    replyTo: 'incident-' + idIncident + '@access-link.tech',
                    subject: 'Une absence irrégulière est survenue',
                    html: htmlContent,
                    attachments: [{
                        filename: 'logo.png',
                        path: logoPath,
                        cid: 'logo' // Identique à l'attribut 'cid' dans le src de l'image dans le HTML
                    }]
                };

                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(info);
                    }
                });
            }
        });
    });
}

export async function sendNotGoodHourMail(collab:Collaborateur, idIncident: number, hdeb:Date, hfin:Date, hdebreel:Date, hfinreel:Date, date:Date) {
    return new Promise((resolve, reject) => {
        const logoPath = 'mail-template/mns-fulllogo.png'; // Remplacez par le chemin de votre logo

        fs.readFile('mail-template/collab-hour-not-correct.html', 'utf8', (err, data) => {
            if (err) {
                reject(err);
            } else {
                let htmlContent = data
                    .replace('DATE', date.toLocaleDateString('fr-FR'))
                    .replace('PRENOMCOLLAB', collab.prenom)
                    .replace('HEUREDEBUTATTENDUE',obtenirDateFR(hdeb))
                    .replace('HEUREFINATTENDUE',obtenirDateFR(hfin))
                    .replace('HEUREDEBUTREELLE',obtenirDateFR(hdebreel))
                    .replace('HEUREFINREELLE',obtenirDateFR(hfinreel))

                const mailOptions = {
                    from: config.EMAIL,
                    to: collab.mail,
                    replyTo: 'incident-' + idIncident + '@access-link.tech',
                    subject: 'Une incohérence dans les horaires a été remarqué',
                    html: htmlContent,
                    attachments: [{
                        filename: 'logo.png',
                        path: logoPath,
                        cid: 'logo' // Identique à l'attribut 'cid' dans le src de l'image dans le HTML
                    }]
                };

                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(info);
                    }
                });
            }
        });
    });
}

export async function sendResponseConge(collab:Collaborateur, accepteur: Collaborateur, demande:Absence) {
    return new Promise((resolve, reject) => {
        const logoPath = 'mail-template/mns-fulllogo.png'; // Remplacez par le chemin de votre logo

        fs.readFile('mail-template/response-request-absence.html', 'utf8', (err, data) => {
            if (err) {
                reject(err);
            } else {
                let htmlContent = data
                    .replace('NOMACCEPTEUR', accepteur.nom)
                    .replace('PRENOMACCEPTEUR', accepteur.prenom)
                    .replace('PRENOMCOLLAB', collab.prenom)
                    .replace('DATEDEB', obtenirDateFR(demande.datedeb))
                    .replace('DATEFIN', obtenirDateFR(demande.datefin))
                    .replace('STATUS', demande.accepte ? 'Accepté' : 'Refusé')

                const mailOptions = {
                    from: config.EMAIL,
                    to: collab.mail,
                    cc: accepteur.mail,
                    replyTo: accepteur.mail,
                    subject: 'Une réponse a votre demande a été apportée',
                    html: htmlContent,
                    attachments: [{
                        filename: 'logo.png',
                        path: logoPath,
                        cid: 'logo' // Identique à l'attribut 'cid' dans le src de l'image dans le HTML
                    }]
                };

                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(info);
                    }
                });
            }
        });
    });
}

export async function sendEditConge(collab:Collaborateur, editeur: Collaborateur, demande:Absence, OLDdemande:Absence) {
    return new Promise((resolve, reject) => {
        const logoPath = 'mail-template/mns-fulllogo.png'; // Remplacez par le chemin de votre logo

        fs.readFile('mail-template/edit-request-absence.html', 'utf8', (err, data) => {
            if (err) {
                reject(err);
            } else {
                let htmlContent = data
                    .replace('NOMDONNEURODRE', editeur.nom)
                    .replace('PRENOMDONNEURORDRE', editeur.prenom)
                    .replace('PRENOMCOLLAB', collab.prenom)
                    .replace('DATEDEB', obtenirDateFR(demande.datedeb))
                    .replace('DATEFIN', obtenirDateFR(demande.datefin))
                    .replace('OLDDD', obtenirDateFR(OLDdemande.datedeb))
                    .replace('OLDDF', obtenirDateFR(OLDdemande.datefin))

                const mailOptions = {
                    from: config.EMAIL,
                    to: collab.mail,
                    cc: editeur.mail,
                    replyTo:  editeur.mail,
                    subject: 'Votre demande a été modifiée',
                    html: htmlContent,
                    attachments: [{
                        filename: 'logo.png',
                        path: logoPath,
                        cid: 'logo' // Identique à l'attribut 'cid' dans le src de l'image dans le HTML
                    }]
                };

                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(info);
                    }
                });
            }
        });
    });
}

export async function sendunauthorizedAccessMail(collab:Collaborateur, chefService: Collaborateur, access:Access) {
    return new Promise((resolve, reject) => {
        const link = config.WEBSITEURL + '/access-history';
        const logoPath = 'mail-template/mns-fulllogo.png'; // Remplacez par le chemin de votre logo

        fs.readFile('mail-template/access-unauthorized.html', 'utf8', (err, data) => {
            if (err) {
                reject(err);
            } else {
                let htmlContent = data
                    .replace('LINK', link)
                    .replace('NOMCOLLAB', collab.nom)
                    .replace('PRENOMCOLLAB', collab.prenom)
                    .replace('ACCESSPOINTNAME', access.nompoint)
                    .replace('NOMRECEVEUR', chefService.prenom);

                const mailOptions = {
                    from: config.EMAIL,
                    to: chefService.mail,
                    subject: 'Accès non autorisé',
                    html: htmlContent,
                    attachments: [{
                        filename: 'logo.png',
                        path: logoPath,
                        cid: 'logo' // Identique à l'attribut 'cid' dans le src de l'image dans le HTML
                    }]
                };

                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(info);
                    }
                });
            }
        });
    });
}


export async function sendInfoMail(mail, name, content) {
    return new Promise((resolve, reject) => {
        const mailOptions = {
            from: config.EMAIL,
            to: mail,
            subject: 'Mail d\'information',
            text: `Bonjour ${name}. ${content}`,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                reject(error); // Reject with the error
            } else {
                resolve(info); // Resolve with the success info
            }
        });
    });
}
