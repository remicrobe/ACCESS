import * as Imap from 'imap';
import config from '../config';


interface Email {
  seqno: number;
  text?: string;
  header?: Record<string, string[]>;
  parsedText?: string; // New property for parsed text
}

async function getMailAfterDeletion(): Promise<Email[]> {
  const imapConfig: Imap.Config = {
    user: config.EMAILAPI,
    password: config.PASSWORDEMAILAPI,
    host: config.SMTP,
    port: config.PORTSMTP,
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
            // const $ = cheerio.load(email.text);
            // const bodyText = $('body').text(); // Extract text content from HTML body
    
            // // Remove any additional encoding artifacts
            // const decodedText = he.decode(bodyText, { isAttributeValue: false });
            // const cleanedText = decodedText.replace(/=\r\n/g, ''); // Remove encoded line breaks
    
            // email.parsedText = cleanedText.trim(); // Trim the text content
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
          console.log('All emails fetched:', emails);

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
    console.error('Error:', err);
    return [];
  }
}

export async function parseMailIncident(){
    let emails = await getMailAfterDeletion();
    console.log(emails)
}
