import {Token, tokenType} from '../database/entity/Token'; // Assurez-vous d'importer la bonne entité Token
import {AppDataSource} from '../database/datasource';
import {In} from "typeorm";
import {randomUUID} from "crypto";

export async function setAuthToken(collab) {
    // Créez un nouveau token pour l'utilisateur
    const token = new Token();
    token.collab = collab;
    token.type = tokenType.auth; // Type de token de connexion
    token.actif = true;
    token.token = 'jwt'
    token.datecreation = new Date();
    return await AppDataSource.getRepository(Token).save(token);
}

export async function delAllAuthToken(collab) {
    await AppDataSource.getRepository(Token).update({collab, type: tokenType.auth}, {actif: false});
}

export async function checkAuthToken(token) {
    return await AppDataSource.getRepository(Token).findOneByOrFail({
        type: tokenType.auth,
        token: token,
        actif: true,
    })
}

export async function setTokenCardQrCode(collab) {

    await AppDataSource.getRepository(Token).update({collab, type: tokenType.cardqrcode}, {actif: false});

    const token = new Token();
    token.collab = collab;
    token.type = tokenType.cardqrcode; // Type de token de connexion
    token.actif = true;
    token.token = randomUUID()
    token.datecreation = new Date();
    return await AppDataSource.getRepository(Token).save(token);
}

export async function getTokenCardQrCode(collab) {
    // Récupérez le token de type 'cardqrcode' de l'utilisateur
    return await AppDataSource.getRepository(Token).findOneBy({collab, type: tokenType.cardqrcode, actif: true});
}

export async function setTokenAppQrCode(collab) {
    await AppDataSource.getRepository(Token).update({collab, type: tokenType.appqrcode}, {actif: false});

    const token = new Token();
    token.collab = collab;
    token.type = tokenType.appqrcode; // Type de token de connexion
    token.actif = true;
    token.token = randomUUID()
    token.datecreation = new Date();
    return await AppDataSource.getRepository(Token).save(token);
}


export async function setTokenPassword(collab) {
    const token = new Token();
    token.collab = collab;
    token.type = tokenType.recoverpassword;
    token.actif = true;
    token.token = randomUUID()
    return await AppDataSource.getRepository(Token).save(token);
}


export async function checkTokenPassword(collab, token2check) {
    // Récupérez le token de type 'recoverpassword' de l'utilisateur
    const token = await AppDataSource.getRepository(Token).findOneByOrFail({
        collab,
        type: tokenType.recoverpassword,
        actif: true
    });

    if (token) {
        const expirationDate = new Date(token.datecreation);
        expirationDate.setHours(expirationDate.getHours() + 24); // L'expiration est définie à 24 heures après la création

        const currentDate = new Date();
        if (currentDate <= expirationDate && token.token === token2check) {
            token.actif = false
            await AppDataSource.getRepository(Token).save(token)
            return true;
        }
    }

    return null;
}

export async function checkQRCode(collab, tokenToCheck) {
    // Vérifiez si le tokenToCheck correspond à un token de type 'appqrcode' ou 'cardqrcode' actif pour le collaborateur
    const token = await AppDataSource.getRepository(Token).findOneByOrFail(
        {
            collab,
            type: In([tokenType.appqrcode, tokenType.cardqrcode]),
            actif: true, token: tokenToCheck
        },
    );

    if (token) {
        // Le token correspond et est actif
        return true;
    }

    // Aucun token correspondant n'a été trouvé
    return false;
}
