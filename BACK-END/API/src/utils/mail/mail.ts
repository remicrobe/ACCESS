import * as nodemailer from 'nodemailer';
import config from '../../config'

const transporter = nodemailer.createTransport({
    host: config.SMTP,  // Utilisation du serveur SMTP fourni dans les variables d'environnement
    port: 587,  // Port SMTP standard
    secure: false,  // Utilisation de TLS
    auth: {
        user: config.EMAIL,
        pass: config.PASSWORD,
    },
});





export async function sendActivationMail(activationcode, mail, name) {
    return new Promise((resolve, reject) => {
        const activationLink = config.WEBSITEURL + '/activate/' + activationcode; // Replace with your actual activation URL
        const mailOptions = {
            from: 'finaltraining@remi-weil.fr',
            to: mail,
            subject: 'Your activation link',
            text: `Welcome ${name} to OpenDisk. Please click the following link to activate your account: ${activationLink}`,
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

export async function sendRecoveryMail(recovery, mail, name) {
    return new Promise((resolve, reject) => {
        const activationLink = config.WEBSITEURL + '/recovery/' + recovery; // Replace with your actual activation URL
        const mailOptions = {
            from: config.EMAIL,
            to: mail,
            subject: 'Your recovery link',
            text: `Welcome ${name} on ACCESS. This is a link to recover your password : ${activationLink}`,
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

export async function sendInfoMail(mail, name, content) {
    return new Promise((resolve, reject) => {
        const mailOptions = {
            from: config.EMAIL,
            to: mail,
            subject: 'Information mail',
            text: `Welcome ${name} in ACCESS. ${content}`,
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
