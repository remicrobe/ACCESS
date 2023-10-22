import {checkJwtToken, getCollabInfoFromToken} from "../controller/Token";

export async function jwtMiddleware(req, res, next) {
    // Vérifier si un JWT est passé dans l'en-tête
    const authHeader = req.headers['authorization'];
    const jwtToken = authHeader && authHeader.split(' ')[1];

    if (!jwtToken) {
        return res.sendStatus(401); // Retourner une erreur 401 si aucun JWT n'est fourni
    }

    const collab = await checkJwtToken(jwtToken);
    if (collab) {
        req.body.connectedCollab = collab;
        next();
    } else {
        res.sendStatus(401)
    }

}

export async function jwtMiddlewareFullInfo(req, res, next) {
    // Vérifier si un JWT est passé dans l'en-tête
    const authHeader = req.headers['authorization'];
    const jwtToken = authHeader && authHeader.split(' ')[1];

    if (!jwtToken) {
        return res.sendStatus(401); // Retourner une erreur 401 si aucun JWT n'est fourni
    }

    const collab = await getCollabInfoFromToken(jwtToken);
    if (collab) {
        req.body.connectedCollab = collab;
        next();
    } else {
        res.sendStatus(401)
    }

}