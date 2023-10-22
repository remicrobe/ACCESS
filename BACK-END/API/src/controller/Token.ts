import {Token, tokenType} from '../database/entity/Token'; // Assurez-vous d'importer la bonne entité Token
import {AppDataSource} from '../database/datasource';
import {In} from "typeorm";
import {createHash, randomUUID} from "crypto";
import {sendRecoveryMail} from "../utils/mail/mail";
import {Collaborateur} from "../database/entity/Collab";
import * as jwt from 'jsonwebtoken'
import config from '../config'

export async function setAuthToken(collab) {
    // Créez un nouveau token pour l'utilisateur
    const token = new Token();
    token.collab = collab;
    token.type = tokenType.auth; // Type de token de connexion
    token.actif = true;
    token.token = 'jwt'
    token.datecreation = new Date();
    let generatedToken = await AppDataSource.getRepository(Token).save(token);

    // Contenue du JWT
    const jwtPayload = {
        tokenId: generatedToken.id,
        collabId: collab.id,
        hashedPassword: collab.password
    };

    const jwtToken = jwt.sign(jwtPayload, config.JWT_SECRET);

    return {jwtToken, collab}
}

// Cette méthode est utilisée dans le middleware, il est conseillé de ne pas y toucher
export async function checkJwtToken(jwtToken) {
    // Vérifier le JWT
    let decoded;
    try {
        decoded = jwt.verify(jwtToken, config.JWT_SECRET);
    } catch (err) {
        return false
    }

    // Récupérer le token de la base de données
    const token = await AppDataSource.getRepository(Token).findOne(
        {
            where:
                {
                    type: tokenType.auth,
                    id: decoded.tokenId,
                    actif: true
                },
            relations: {
                collab: true
            }
        }
    );
    if (!token) {
        return false
    }
    // Retourner le collaborateur
    return token.collab;
}

// Méthode pour que, par exemple, au démarrage de l'application l'utilisateur demande ces infos
export async function getCollabInfoFromToken(jwtToken) {
    // Vérifier le JWT
    let decoded;
    try {
        decoded = jwt.verify(jwtToken, config.JWT_SECRET);
    } catch (err) {
        return false
    }

    // Récupérer le token de la base de données
    const token = await AppDataSource.getRepository(Token).findOne(
        {
            where:
                {
                    type: tokenType.auth,
                    id: decoded.tokenId,
                    actif: true
                },
            relations: {
                collab: {
                    horaire: true,
                    horairesdefault: true,
                    service: {
                        chefservice: true
                    },
                }
            }
        }
    );
    if (!token) {
        return false
    }
    // Retourner le collaborateur
    return token.collab;
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


export async function setTokenPasswordAndSendMail(collab) {
    await AppDataSource.getRepository(Token).update({collab, type: tokenType.recoverpassword}, {actif: false});
    let token = new Token();
    token.collab = collab;
    token.type = tokenType.recoverpassword;
    token.actif = true;
    token.token = randomUUID()
    token = await AppDataSource.getRepository(Token).save(token);
    return (await sendRecoveryMail(token.token, collab.mail, collab.prenom))
}


export async function checkTokenPassword(token2check, password) {
    // Récupérez le token de type 'recoverpassword' de l'utilisateur
    const token = await AppDataSource.getRepository(Token).findOneOrFail({
        where: {
            token: token2check,
            type: tokenType.recoverpassword,
            actif: true,
            collab: {
                actif: true
            }
        },
        relations: {
            collab: true
        }
    });


    if (token && token.collab && password) {
        let collab = token.collab
        const expirationDate = new Date(token.datecreation);
        expirationDate.setHours(expirationDate.getHours() + 24); // L'expiration est définie à 24 heures après la création

        const currentDate = new Date();
        if (currentDate <= expirationDate && token.token === token2check) {
            token.actif = false
            collab.valide = true
            collab.motdepasse = createHash('sha256').update(password).digest('hex');
            await AppDataSource.getRepository(Token).save(token)
            await AppDataSource.getRepository(Collaborateur).save(collab)
            return true;
        }
    }

    return null;
}

export async function checkQRCode(tokenToCheck) {
    // Vérifiez si le tokenToCheck correspond à un token de type 'appqrcode' ou 'cardqrcode' actif pour le collaborateur
    const token = await AppDataSource.getRepository(Token).findOneOrFail(
        {
            where: {
                type: In([tokenType.appqrcode, tokenType.cardqrcode]),
                actif: true,
                token: tokenToCheck
            }, relations: {
                collab: {
                    horaire: true,
                    horairesdefault : true
                }
            }
        },
    );
    return token.collab
}
