import * as dotenv from 'dotenv';
dotenv.config()
export default {
    PORT: process.env.PORT,
    DBHOST: process.env.DBHOST,
    DBNAME: process.env.DBNAME,
    DBUSER: process.env.DBUSER,
    DBPASSWORD: process.env.DBPASSWORD,
    EMAIL: process.env.EMAIL,
    PASSWORD: process.env.PASSWORD,
    SMTP: process.env.SMTP,
    PORTSMTP: process.env.PORTSMTP,
    WEBSITEURL: process.env.WEBSITEURL,
};
