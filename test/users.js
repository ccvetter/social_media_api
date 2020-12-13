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

    describe('/POST user', () => {
        it('should register a user', (done) => {
            chai.request(server)
                .post('/api/users/register')
                .send({
                    'firstName': 'Smithgall',
                    'lastName': 'Woods',
                    'email': 'swoods@test.com',
                    'password': 'test'
                })
                .end(function(err, res) {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('firstName');
                    res.body.should.have.property('lastName');
                    res.body.should.have.property('email');
                    res.body.should.have.property('password');
                    res.body.should.have.property('_id');
                    done();
                });
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