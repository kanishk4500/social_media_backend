const express = require('express')
const apiRouter = express.Router()
const {authenticate,protected} =require('../controller/authController')

const {follow,unfollow,getUser} = require('../controller/userController')

const {createPost,deletePost,like,unlike,comment, getPost, getAllPosts} = require('../controller/postController.js')





apiRouter.route('/authenticate')
.post(authenticate)

apiRouter.use(protected)

apiRouter.route('/follow/:id')
.post(follow)

apiRouter.route('/unfollow/:id')
.post(unfollow)

apiRouter.route('/user')
.get(getUser)

apiRouter.route('/posts')
.post(createPost)

apiRouter.route('/posts/:id')
.delete(deletePost)

apiRouter.route('/like/:id')
.post(like)

apiRouter.route('/unlike/:id')
.post(unlike)

apiRouter.route('/comment/:id')
.post(comment)

apiRouter.route('/posts/:id')
.get(getPost)

apiRouter.route('/all_posts')
.get(getAllPosts)

module.exports = apiRouter