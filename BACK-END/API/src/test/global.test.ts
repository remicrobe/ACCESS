import { Index } from '../index';
import * as chai from 'chai';
import chaiHttp = require('chai-http');
import 'mocha';
import config from '../config';

chai.use(chaiHttp);
chai.should();

let token: string;

before(done => {
    Index.app.on("ready", () => {
        done();
    });
});

describe('Authentication', () => {
    it('should log in and return a token', (done) => {
        chai.request(Index.app)
            .post('/collab/connect')
            .send({
                mail: config.TEST_MAIL,
                motdepasse: config.TEST_PASSWORD
            })
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.have.property('jwtToken');
                token = res.body.jwtToken;
                done();
            });
    });
});
