import { Collaborateur } from '../database/entity/Collaborateur';
import * as express from "express";
import { jwtMiddleware, jwtMiddlewareFullInfo } from "../middleware/jwt";
import { getTokenCardQrCode, setTokenAppQrCode, setTokenCardQrCode } from "../controller/Token";
import { isARH, isDRH, isRH } from "../controller/CollabController";
import * as fs from "fs";
import { PDFDocument, StandardFonts } from 'pdf-lib';
import * as QRCode from "qrcode";
import { ErrorHandler } from "../utils/error/error-handler";
import { isSuperior } from "../controller/ServiceController";
import {CollaborateurRepository} from "../database/repository/CollaborateurRepository";

const tokenRouter = express.Router();

// Générer un QR Code pour une carte
tokenRouter.post('/genererCarteQrCode/:collabId', jwtMiddleware, async (req, res) => {
    /*  #swagger.tags = ['Token']
        #swagger.path = '/token/genererCarteQrCode/{collabId}'
        #swagger.method = 'post'
        #swagger.description = 'Générer un QR Code pour une carte de collaborateur'
        #swagger.parameters['collabId'] = {
            in: 'path',
            description: 'ID du collaborateur',
            required: true,
            type: 'integer'
        }
        #swagger.responses[200] = {
            description: 'QR Code généré.',
            schema: { $ref: '#/definitions/Token' }
        }
        #swagger.responses[401] = {
            description: 'Accès non autorisé.'
        }
        #swagger.responses[404] = {
            description: 'Collaborateur non trouvé.'
        }
    */
    try {
        const connectedCollab: Collaborateur = req.body.connectedCollab;
        const collabId = parseInt(req.params.collabId);
        const collab = await CollaborateurRepository.findOneByOrFail({ id: collabId });

        if (!isDRH(connectedCollab) && !isARH(connectedCollab) && isRH(connectedCollab)) {
            res.sendStatus(401);
        } else {
            res.send(await setTokenCardQrCode(collab));
        }
    } catch (e) {
        ErrorHandler(e, req, res);
    }
});

// Obtenir le pdf avec la carte du collaborateur
tokenRouter.get('/genererPDFCarteQrCode/:collabId', jwtMiddleware, async (req, res) => {
    /*  #swagger.tags = ['Token']
        #swagger.path = '/token/genererPDFCarteQrCode/{collabId}'
        #swagger.method = 'get'
        #swagger.description = 'Obtenir le PDF avec la carte du collaborateur et QR Code'
        #swagger.parameters['collabId'] = {
            in: 'path',
            description: 'ID du collaborateur',
            required: true,
            type: 'integer'
        }
        #swagger.responses[200] = {
            description: 'PDF généré avec succès.',
            content: {
                'application/pdf': {
                    schema: {
                        type: 'string',
                        format: 'binary'
                    }
                }
            }
        }
        #swagger.responses[401] = {
            description: 'Accès non autorisé.'
        }
        #swagger.responses[404] = {
            description: 'Collaborateur non trouvé.'
        }
    */
    try {
        const connectedCollab: Collaborateur = req.body.connectedCollab;
        const collabId = parseInt(req.params.collabId);
        const collab = await CollaborateurRepository.findOneOrFail({
            where: { id: collabId },
            relations: { service: { chefservice: true } }
        });
        if (!isDRH(connectedCollab) && !isARH(connectedCollab) && !isRH(connectedCollab) && !await isSuperior(connectedCollab, collab)) {
            res.sendStatus(401);
        } else {
            let tokenCard = await getTokenCardQrCode(collab);
            if (!tokenCard) {
                tokenCard = await setTokenCardQrCode(collab);
            }

            if (!isDRH(collab) && !isARH(collab) && isRH(collab)) {
                res.sendStatus(401);
            } else {
                const pdfBytes = await fs.promises.readFile('PDF/MNS-COLLAB-TEMPLATE.pdf');
                const pdfDoc = await PDFDocument.load(pdfBytes);
                const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

                let service = collab.service ? collab.service.id.toString() : 'aucun';

                const qrCodeDataUrl = await QRCode.toDataURL(`idService:${service};idCollab:${collab.id};token:${tokenCard.token}`);
                const qrCodeImageBytes = Buffer.from(qrCodeDataUrl.split(',')[1], 'base64');
                const qrCodeImage = await pdfDoc.embedPng(qrCodeImageBytes);

                const pages = pdfDoc.getPages();
                const firstPage = pages[0];

                firstPage.drawText(`Nom : ${collab.nom}`, { x: 190, y: 610, size: 10, font: helveticaFont });
                firstPage.drawText(`Prénom : ${collab.prenom}`, { x: 190, y: 595, size: 10, font: helveticaFont });
                firstPage.drawText(`ID Collab : ${collab.id}`, { x: 190, y: 580, size: 10, font: helveticaFont });
                firstPage.drawText(`Fonction : ${collab.fonction}`, { x: 190, y: 565, size: 10, font: helveticaFont });

                firstPage.drawText(`${tokenCard.datecreation.toLocaleString()}`, {
                    x: 365,
                    y: 660,
                    size: 8,
                    font: helveticaFont
                });

                firstPage.drawImage(qrCodeImage, {
                    x: 195,
                    y: 630,
                    width: 75,
                    height: 75
                });

                const pdfBytesModified = await pdfDoc.save();

                res.writeHead(200, {
                    'Content-Length': Buffer.byteLength(pdfBytesModified),
                    'Content-Type': 'application/pdf'
                })
                    .end(pdfBytesModified);
            }
        }
    } catch (e) {
        ErrorHandler(e, req, res);
    }
});

// Générer un QR Code pour l'application
tokenRouter.post('/genererAppQrCode', jwtMiddlewareFullInfo, async (req, res) => {
    /*  #swagger.tags = ['Token']
        #swagger.path = '/token/genererAppQrCode'
        #swagger.method = 'post'
        #swagger.description = 'Générer un QR Code pour l\'application'
        #swagger.responses[200] = {
            description: 'QR Code pour l\'application généré.',
            schema: { type: 'string' }
        }
        #swagger.responses[401] = {
            description: 'Accès non autorisé.'
        }
    */
    try {
        const collab = req.body.connectedCollab;

        const newToken = await setTokenAppQrCode(collab);

        let accessString = `idService:${newToken.collab.service.id};token:${newToken.token};idCollab:${collab.id}`

        return res.send(accessString);
    } catch (e) {
        ErrorHandler(e, req, res);
    }
});

export { tokenRouter };
