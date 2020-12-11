process.env.NODE_ENV = 'test';

let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let User = require('../users/user.model').User;
let should = chai.should();

chai.use(chaiHttp);
describe('Users', () => {
    beforeEach((done) => {
        User.deleteMany({}, (err) => {
            done();
        });
    });

    describe('/GET user', () => {
        it('should get a 401 without a token', (done) => {
            chai.request(server)
                .get('/api/users')
                .end((err, res) => {
                    res.should.have.status(401);
                    JSON.parse(res.error.text).message.should.be.eql('Invalid Token')
                    done();
                });
        });
    });
});