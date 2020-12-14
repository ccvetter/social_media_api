process.env.NODE_ENV = 'test';

let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let User = require('../users/user.model').User;
let Post = require('../posts/post.model').Post;
let should = chai.should();
let bcrypt = require('bcryptjs');

chai.use(chaiHttp);

const userCredentials = {
    email: 'joe@test.com', 
    password: 'test'
}

let authenticatedUser;

describe('Posts', () => {
    before((done) => {
        let newUser = new User({
            firstName: 'Joe',
            lastName: 'Montana',
            email: 'joe@test.com',
            password: bcrypt.hashSync('test', 10)
        });
        newUser.save((err, user) => {
            chai.request(server)
                .post('/api/users/authenticate')
                .send(userCredentials)
                .end((err, res) => {
                    authenticatedUser = res.body;
                    
                    let newPost = new Post({
                        'text': 'This is a new post',
                        'userId': authenticatedUser._id,
                        'user': authenticatedUser
                    });
                    newPost.save((err) => {
                        done();
                    })
                });
        });
    });
    
    after((done) => {
        User.collection.drop().then(() => {
            console.log('Users dropped');
        }).catch(() => {
            console.warn('Error with dropping Users, may not exist');
        });
        Post.collection.drop().then(() => {
            console.log('Posts dropped');
        }).catch(() => {
            console.warn('Error with dropping Posts');
        });
        done();
    });

    describe('/POST a post', () => {
        it('should not add a post without an authorized user', (done) => {
            chai.request(server)
                .post('/api/posts')
                .send({
                    'text': 'This is the text',
                    'userId': '1'
                })
                .end((err, res) => {
                    res.should.have.status(401);
                    done();
                }); 
        });

        it('should add a post with an authorized user', (done) => {
            chai.request(server)
                .post('/api/posts')
                .send({
                    'text': 'This is the text',
                    'userId': authenticatedUser._id
                })
                .set({ Authorization: `Bearer ${authenticatedUser.token}` })
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });
    });

    describe('/GET post', () => {
        it('should get a 401 without a token', (done) => {
            chai.request(server)
                .get('/api/posts')
                .end((err, res) => {
                    res.should.have.status(401);
                    JSON.parse(res.error.text).message.should.be.eql('Invalid Token')
                    done();
                });
        });

        it('should get all posts', (done) => {
            chai.request(server) 
                .get(`/api/posts/${authenticatedUser._id}`)
                .set({ Authorization: `Bearer ${authenticatedUser.token}` })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body[0].should.have.property('text');
                    res.body[0].text.should.be.eql('This is a new post');
                    res.body[0].should.have.property('userId');
                    res.body[0].should.have.property('user');
                    done();
                })
        })
    });
});