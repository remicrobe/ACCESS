import * as dotenv from 'dotenv';

dotenv.config();
export default {
    PORT: process.env.PORT,
    JWT_SECRET: process.env.JWT_SECRET,
    SALAGE: process.env.SALAGE,

    DBHOST: process.env.DBHOST,
    DBNAME: process.env.DBNAME,
    DBUSER: process.env.DBUSER,
    DBPASSWORD: process.env.DBPASSWORD,

    EMAIL: process.env.EMAIL,
    PASSWORD: process.env.PASSWORD,

    EMAILAPI: process.env.EMAILAPI,
    PASSWORDEMAILAPI: process.env.PASSWORDEMAILAPI,

    SMTP: process.env.SMTP,
    IMAP: process.env.IMAP,
    PORTIMAP: parseInt(process.env.PORTIMAP),
    PORTSMTP: process.env.PORTSMTP,

    WEBSITEURL: process.env.WEBSITEURL,
    ENVIRONMENT: process.env.ENVIRONMENT,

    TEST_MAIL: process.env.TEST_MAIL,
    TEST_PASSWORD: process.env.TEST_PASSWORD,

};
