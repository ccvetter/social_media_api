process.env.NODE_ENV = 'test';

let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let User = require('../users/user.model').User;
let Comment = require('../comments/comment.model').Comment;
let Post = require('../posts/post.model').Post;
let should = chai.should();
let bcrypt = require('bcryptjs');

chai.use(chaiHttp);

const userCredentials = {
    email: 'joe@test.com', 
    password: 'test'
}

let authenticatedUser;
let newPost;
let newComment;

describe('Comments', () => {
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
                    
                    newPost = new Post({
                        'text': 'This is a new post',
                        'userId': authenticatedUser._id,
                        'user': authenticatedUser
                    });
                    newPost.save((err, res) => {
                        done();
                    });
                });
        });
    });
    
    after((done) => {
        User.collection.drop().then(() => {
            console.log('Users dropped');
        }).catch(() => {
            console.warn('Error dropping Users, may not exist');
        });
        Post.collection.drop().then(() => {
            console.log('Posts dropped');
        }).catch(() => {
            console.warn('Error dropping Posts');
        });
        Comment.collection.drop().then(() => {
            console.log('Comments dropped');
        }).catch(() => {
            console.warn('Error dropping Comments');
        });
        done();
    });

    describe('/POST a comment', () => {
        it('should not add a comment without an authorized user', (done) => {
            chai.request(server)
                .post('/api/comments')
                .send({
                    'text': 'This is the text',
                    'postId': newPost._id
                })
                .end((err, res) => {
                    res.should.have.status(401);
                    done();
                }); 
        });

        it('should add a comment with an authorized user', (done) => {
            chai.request(server)
                .post('/api/comments')
                .send({
                    'text': 'This is the text',
                    'postId': newPost._id
                })
                .set({ Authorization: `Bearer ${authenticatedUser.token}` })
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });
    });

    describe('/GET comment', () => {
        it('should get a 401 without a token', (done) => {
            chai.request(server)
                .get('/api/comments')
                .end((err, res) => {
                    res.should.have.status(401);
                    JSON.parse(res.error.text).message.should.be.eql('Invalid Token')
                    done();
                });
        });

        it('should get all comments', (done) => {
            chai.request(server) 
                .get(`/api/comments/${newPost._id}`)
                .set({ Authorization: `Bearer ${authenticatedUser.token}` })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body[0].should.have.property('text');
                    res.body[0].text.should.be.eql('This is the text');
                    res.body[0].should.have.property('postId');
                    done();
                })
        })
    });
});