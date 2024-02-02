import * as Imap from 'imap';
import config from '../config';
import { AppDataSource } from '../database/datasource';
import { IncidentReponse } from '../database/entity/IncidentReponse';
import { Incident } from '../database/entity/Incident';


interface Email {
  seqno: number;
  text?: string;
  header?: Record<string, string[]>;
  parsedText?: string; // New property for parsed text
}

const emailRegex = /^incident-(\d+)@access-link\.tech$/;

function extractNumberFromEmails(emails: string[]) {
  for(let email of emails) {
    const match = email.match(emailRegex);
    if (match) {
      const numberPart = match[1];
      return parseInt(numberPart, 10); // Convert the string to an integer
    }
  }
  return null;
}

async function getMailAfterDeletion(): Promise<Email[]> {
  const imapConfig: Imap.Config = {
    user: config.EMAILAPI,
    password: config.PASSWORDEMAILAPI,
    host: config.IMAP,
    port: config.PORTIMAP,
    tls: true
  };

  const imap: Imap = new Imap(imapConfig);

  function openInbox(): Promise<Imap.Box> {
    return new Promise((resolve, reject) => {
      imap.openBox('INBOX', false, (err, box) => {
        if (err) reject(err);
        resolve(box);
      });
    });
  }

  function fetchEmails(): Promise<Email[]> {
    return new Promise((resolve, reject) => {
      const fetchOptions: Imap.FetchOptions = { bodies: ['HEADER.FIELDS (FROM TO SUBJECT DATE)', 'TEXT'], markSeen: false };
      const fetch: Imap.ImapFetch = imap.seq.fetch('1:*', fetchOptions);
      const emails: Email[] = [];

      fetch.on('message', (msg: Imap.ImapMessage, seqno: number) => {
        const email: Email = { seqno };
        msg.on('body', (stream: NodeJS.ReadableStream, info: Imap.ImapMessageBodyInfo) => {
          let buffer = '';
          stream.on('data', (chunk) => {
            buffer += chunk.toString('utf8');
          });
          stream.on('end', () => {
            if (info.which === 'TEXT') {
              email.text = buffer;
            } else {
              email.header = Imap.parseHeader(buffer);
            }
          });
        });

        msg.once('end', () => {
          emails.push(email);
        });
      });

      fetch.once('end', () => {
        resolve(emails);
      });

      fetch.once('error', (err: Error) => {
        reject(err);
      });
    });
  }

  function parseText(emails: Email[]): void {
    for (const email of emails) {
        if (email.text) {
          const regex = /Content-Type: text\/plain; charset="UTF-8"(?:\s+Content-Transfer-Encoding: quoted-printable)?\s+(.*?)\s+--/s;
    
            var match = regex.exec(email.text);

            // Afficher le contenu extrait
            if (match && match[1]) {
              email.parsedText = decodeURI(match[1].replace(/=/g,"%"));
            } 
          }
    }
  }

  function markAndDeleteEmails(emails: Email[]): Promise<void> {
    return new Promise((resolve, reject) => {
      if (emails.length > 0) {
        const sequenceNumbersToDelete: number[] = emails.map((email) => email.seqno);
        imap.seq.addFlags('1:*', '\\Deleted', (addFlagsErr) => {
          if (addFlagsErr) reject(addFlagsErr);

          imap.expunge((expungeErr) => {
            if (expungeErr) reject(expungeErr);
            resolve();
          });
        });
      } else {
        resolve(); // No emails to delete
      }
    });
  }

  function endConnection(): Promise<void> {
    return new Promise((resolve) => {
      imap.end();
      resolve();
    });
  }

  try {
    return await new Promise<Email[]>(async (resolve, reject) => {
      imap.once('ready', async () => {
        try {
          await openInbox();
          const emails: Email[] = await fetchEmails();

          // Parse the text of the emails
          parseText(emails);

          await markAndDeleteEmails(emails);
          await endConnection();
          resolve(emails);
        } catch (err) {
          reject(err);
        }
      });

      imap.once('error', (err: Error) => {
        reject(err);
      });

      imap.connect();
    });
  } catch (err) {
    console.log(err)
    return [];
    // On arrive ici dans le cas ou il y a 0 mail a traité alors on s'en balance un peu
  }
}

export async function parseMailIncident(){
  try{
    let emails = await getMailAfterDeletion();
    for(let email of emails) {
      console.log(email.text)
      let incidentNumber = extractNumberFromEmails(email.header.to);

      if(incidentNumber) {
        let incident = await AppDataSource.getRepository(Incident).findOneBy({id:incidentNumber});
        if(!incident) {
          console.log("Strange incident " + incidentNumber + ' ' + JSON.stringify(email.header) + " " + email.parsedText)
          // Creer fichier de log un jour
          continue;
        }
        let newIncidentAnswer = new IncidentReponse();
        newIncidentAnswer.incident = incident;
        newIncidentAnswer.reponse = email.header.from + ' - ' + email.parsedText;
        await AppDataSource.getRepository(IncidentReponse).save(newIncidentAnswer);

      } else {
        console.log("Strange destination " + JSON.stringify(email.header) + " " + email.parsedText)
        // Creer fichier de log un jour
      }
    }
  } catch(err) {
    console.log(err)
    // Creer fichier de log un jour
  }
}
