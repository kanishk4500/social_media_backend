const { findById } = require('../model/postModel')
const postModel = require('../model/postModel')
const userModel = require('../model/userModel')
const { post } = require('../router/apiRouter')

//create post
module.exports.createPost = async function createPost(req, res) {
    const newPost = new postModel({
        title: req.body.title,
        content: req.body.content,
        createdBy: req.id
    })
    await newPost.save()
        .then(async function (post) {

            const id = req.id;
            const user = await userModel.findById(id)

            user.postCreated.push(post._id)

            await user.save()

            res.json({
                id: post._id,
                title: post.title,
                createdAt: post.createdTime
            })
        })
        .catch((err) => {
            res.json({
                error: err.message
            })
        })
}

//delete post
module.exports.deletePost = async function deletePost(req, res) {
    try {
        const postId = req.params.id
        const id = req.id
        const user = await userModel.findById(id)
        postModel.findOneAndDelete({ _id: postId }, async function (err, doc) {
            if (err) {
                res.json({
                    error: err.message
                })
            }

            var arr = []
            for (var i = 0; i < user.postCreated.length; i++) {
                if (user.postCreated[i] == postId) {
                    continue
                } else {
                    arr.push(user.postCreated[i]);
                }
            }

            user.postCreated = arr;

            await user.save();

            res.json({
                msg: 'post deleted'
            })
        })
    }
    catch (err) {
        res.json({
            error: err.message
        })
    }
}

//like a post

module.exports.like = async function like(req, res) {
    try {
        const postId = req.params.id;
        const userId = req.id;

        const post = await postModel.findById({ _id: postId });

        const user = await userModel.findById({ _id: userId });

        user.liked.push(postId)

        post.likes.push(userId)

        await user.save()
        await post.save()

        res.json({
            msg: 'post liked'
        })
    }
    catch (err) {
        res.json({
            error: err.message
        })
    }

}

//unlike a post


module.exports.unlike = async function unlike(req, res) {
    try {
        const postId = req.params.id;
        const userId = req.id;

        const post = await postModel.findById({ _id: postId });

        const user = await userModel.findById({ _id: userId });

        var arr = [];
        for (var i = 0; i < user.liked.length; i++) {
            if (user.liked[i] == postId) {
                continue;
            }
            arr.push(user.liked[i]);
        }
        user.liked = arr;
        await user.save();
        arr = []
        for (var i = 0; i < post.likes.length; i++) {
            if (post.likes[i] == userId) {
                continue;
            }
            arr.push(post.likes[i]);
        }
        post.likes = arr;

        await user.save()
        await post.save()

        res.json({
            msg: 'post unliked'
        })
    }
    catch (err) {
        res.json({
            error: err.message
        })
    }

}

//post comment by id

module.exports.comment = async function comment(req, res) {
    try {
        const postId = req.params.id;
        const userId = req.id;

        const post = await postModel.findById(postId)
        const user = await userModel.findById(userId)


        const newComment = {
            comment: req.body.comment,
            createdBy: userId,
            createdAt: Date.now()
        }

        post.comment.push(newComment)

        await post.save();

        user.comment.push(postId)

        await user.save()

        const id = post.comment[post.comment.length - 1]._id;

        res.json({
            msg: 'comment posted',
            comment_id: id
        })
    }
    catch (err) {
        res.json({
            error: err.message
        })
    }


}

//get post by id

module.exports.getPost = async function getPost(req, res) {
    try {
        const postId = req.params.id;
        const post = await postModel.findById(postId);
        if (!post) {
            res.json({
                'msg': 'post not found'
            })
        }
        else {
            res.json({
                'msg': 'post found',
                'post title': post.title,
                'post content': post.content,
                'post likes': post.likes.length,
                'post comments': post.comment.length
            })
        }
    }
    catch (err) {
        res.json({
            error: err.message
        })
    }

}


//get all post for a user
module.exports.getAllPosts = async function getAllPosts(req, res) {
    try {
        const userId = req.id;
        const user = await userModel.findById(userId)
        var createdPost = []
        createdPost = user.postCreated
        // console.log(createdPost)

        var posts = []

        for (var i = 0; i < createdPost.length; i++) {
            const post = await postModel.findById(createdPost[i]);
            posts.push(post);
        }

        posts.sort((a, b) => {
            return a.createdTime < b.createdTime;
        })

        console.log(posts)

        res.json({
            'msg': 'got all post', posts
        })
    }
    catch (err) {
        res.json({
            error: err.message
        })
    }
}
