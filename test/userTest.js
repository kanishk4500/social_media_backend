let mongoose = require("mongoose");
let userModel = require('../model/userModel');

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();

chai.use(chaiHttp);

describe('user', () => {
    // beforeEach((done) => {
    //     userModel.remove({}, (err) => {
    //         done();
    //     });
    // })
    describe('/api/authenticate', () => {
        it('it should return jwt token', (done) => {
            const body = {
                email: 'kanishk1550@gmail.com',
                password: '12345678'
            }
            chai.request(server)
                .post('/api/authenticate')
                .send(body)
                .end((err, res) => {
                    // console.log(res.body)
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.jwt.should.be.a('String');
                    describe('/api/user', () => {
                        it('should verify jwt token', (done) => {
                            // console.log(res.body.jwt)
                            chai.request(server)
                                .get('/api/user')
                                .set('Cookie', `isLoggedin=${res.body.jwt}`)
                                .end((err, res) => {
                                    console.log(res.body)
                                    res.should.have.status(200);
                                    res.body.should.be.a('object');
                                    res.body.should.have.property('user name');
                                    res.body.should.have.property('number of followers');
                                    res.body.should.have.property('number of followings');
                                    done()
                                })
                        })
                    })
                    done();
                });
        });
    });

    //=========pos==================
    //follow a user with given id

    describe('POST /api/follow/{id}', () => {
        it('logged in user should follow a valid id', (done) => {
            //getting id of following user
            const body = {
                email: 'nalin@gmail.com',
                password: '12345678'
            }
            chai.request(server)
                .post('/api/authenticate')
                .send(body)
                .end((err, res) => {
                    chai.request(server)
                        .get('/api/user')
                        .set('Cookie', `isLoggedin=${res.body.jwt}`)
                        .end((err, res) => {
                            const following_id = res.body['user id']
                            // console.log(following_id)
                            //logging in follower user
                            const body = {
                                email: 'kanishk1550@gmail.com',
                                password: '12345678'
                            }
                            chai.request(server)
                                .post('/api/authenticate')
                                .send(body)
                                .end((err, res) => {
                                    chai.request(server)
                                        .post('/api/follow/' + following_id)
                                        .set('Cookie', `isLoggedin=${res.body.jwt}`)
                                        .end((err, res) => {
                                            // console.log(res.body)
                                            res.should.have.status(200);
                                            res.body.should.be.a('object');
                                            res.body.msg.should.be.equal('user followed')
                                            done()
                                        })
                                })
                        })
                })
        })
        it('cannot like without authentication', (done) => {
            const body = {
                email: 'nalin@gmail.com',
                password: '12345678'
            }
            chai.request(server)
                .post('/api/authenticate')
                .send(body)
                .end((err, res) => {
                    chai.request(server)
                        .get('/api/user')
                        .set('Cookie', `isLoggedin=${res.body.jwt}`)
                        .end((err, res) => {
                            const id = res.body['user id']
                            chai.request(server)
                                .post('/api/like' + id)
                                .end((err, res) => {
                                    res.should.have.status(200);
                                    res.body.should.have.property('msg');
                                    res.body.msg.should.be.equal('user not logged in')
                                    done()
                                })
                        })
                })
        })
        it('cannot follow himself', (done) => {
            const body = {
                email: 'nalin@gmail.com',
                password: '12345678'
            }
            chai.request(server)
                .post('/api/authenticate')
                .send(body)
                .end((err, res) => {
                    const jwt_token = res.body.jwt;
                    chai.request(server)
                        .get('/api/user')
                        .set('Cookie', `isLoggedin=${jwt_token}`)
                        .end((err, res) => {
                            const id = res.body['user id']
                            // console.log(id)
                            chai.request(server)
                                .post('/api/follow/' + id)
                                .set('Cookie', `isLoggedin=${jwt_token}`)
                                .end((err, res) => {
                                    res.should.have.status(200);
                                    res.body.should.have.property('msg');
                                    res.body.msg.should.be.equal('user cannot follow himself')
                                    done()
                                })
                        })
                })
        })
    })

    //==========neg==================
    //cannot follow without logging in
    //cannot a follow a wrong id/fake user
    //cannot follow himself
    //cannot follow someone multiple times

})