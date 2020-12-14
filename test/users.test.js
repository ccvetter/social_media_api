process.env.NODE_ENV = 'test';

let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let User = require('../users/user.model').User;
let should = chai.should();
let bcrypt = require('bcryptjs');

chai.use(chaiHttp);

describe('Users', () => {
    before((done) => {
        let newUser = new User({
            firstName: 'Joe',
            lastName: 'Montana',
            email: 'joe@test.com',
            password: bcrypt.hashSync('test', 10)
        });
        newUser.save((err) => {
            done();
        });
    });
    
    after((done) => {
        User.collection.drop().then(() => {
            console.log('Users dropped');
        }).catch(() => {
            console.warn('Error with dropping Users, may not exist');
        });
        done();
    });

    describe('/POST unauthenticated user', () => {
        it('should register a user', (done) => {
            chai.request(server)
                .post('/api/users/register')
                .send({
                    'firstName': 'Smithgall',
                    'lastName': 'Woods',
                    'email': 'swoods@test.com',
                    'password': 'test'
                })
                .end((err, res) => {
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

        it('should send a message if invalid user', (done) => {
            chai.request(server)
                .post('/api/users/authenticate')
                .send({
                    'email': 'none@test.com',
                    'password': 'test'
                })
                .end((err, res) => {
                    res.should.have.status(400);
                    should.equal(JSON.parse(res.error.text).message, "Email or password is incorrect");
                    done();
                });
        });

        it('should authenticate a user and receive a token', (done) => {
            chai.request(server)
                .post('/api/users/authenticate')
                .send({
                    'email': 'joe@test.com',
                    'password': 'test'
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('token')
                    done();
                });
        })
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