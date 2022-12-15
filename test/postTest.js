let mongoose = require("mongoose");
let userModel = require('../model/userModel');

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();

chai.use(chaiHttp);


//post creation
describe('POST /api/post',()=>{
    it('should create a post',(done)=>{
        //logging in user
        const body={
            email:'kanishk1550@gmail.com',
            password:'12345678'
        }
        chai.request(server)
        .post('/api/authenticate')
        .send(body)
        .end((err,res)=>{
            const postBody = {
                title:'post created by kanishk',
                content:'test post created by kanishk'
            }
            chai.request(server)
            .post('/api/posts')
            .send(postBody)
            .set('Cookie','isLoggedin='+res.body.jwt)
            .end((err,res)=>{
                res.should.have.status(200)
                res.body.should.have.property('id')
                res.body.should.have.property('title')
                res.body.should.have.property('createdAt')
                res.body.title.should.be.equal('post created by kanishk')
                done()
            })
        })
    })
})

//post deletion

describe('POST /api/post',()=>{
    it('should delete a post',(done)=>{
        //logging in user
        const body={
            email:'kanishk1550@gmail.com',
            password:'12345678'
        }
        chai.request(server)
        .post('/api/authenticate')
        .send(body)
        .end((err,res)=>{
            const postBody = {
                title:'post created by kanishk',
                content:'test post created by kanishk'
            }
            const token = res.body.jwt;
            chai.request(server)
            .post('/api/posts')
            .send(postBody)
            .set('Cookie','isLoggedin='+res.body.jwt)
            .end((err,res)=>{
                const postId = res.body.id
                chai.request(server)
                .delete('/api/posts/'+postId)
                .set('Cookie','isLoggedin='+token)
                .end((err,res)=>{
                    res.should.have.status(200)
                    res.body.should.have.property('msg')
                    res.body.msg.should.be.equal('post deleted')
                    done()
                })
            })
        })
    })
})


//like a post

describe('POST /api/post',()=>{
    it('should like a created post',(done)=>{
        //logging in user
        const body={
            email:'kanishk1550@gmail.com',
            password:'12345678'
        }
        chai.request(server)
        .post('/api/authenticate')
        .send(body)
        .end((err,res)=>{
            const postBody = {
                title:'post created by kanishk',
                content:'test post created by kanishk'
            }
            const token = res.body.jwt;
            // console.log('token ',token)
            chai.request(server)
            .post('/api/posts')
            .set('Cookie','isLoggedin='+res.body.jwt)
            .send(postBody)
            .end((err,res)=>{
                const postId = res.body.id
                console.log('postId ',postId)
                chai.request(server)
                .post('/api/like/'+postId)
                .set('Cookie','isLoggedin='+token)
                .end((err,res)=>{
                    res.should.have.status(200)
                    res.body.should.have.property('msg')
                    res.body.msg.should.be.equal('post liked')
                    done()
                })
            })
        })
    })
})