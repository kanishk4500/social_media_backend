const userModel = require('../model/userModel')


//getUser
module.exports.getUser = async function getUser(req, res) {
    try {
        const id = req.id;
        const user = await userModel.findById(id)
        if (!user) {
            res.json({
                msg: 'no such user exists'
            })
        }
        res.json({
            'user id' : user._id,
            'user name': user.email,
            'number of followers': user.follower.length,
            'number of followings': user.following.length
        })
    }
    catch (err) {
        res.json({
            error: err.message
        })
    }
}




//follow

module.exports.follow = async function follow(req, res) {
    try {
        const follower_id = req.id;
        const following_id = req.params.id;
        console.log(following_id);

        const user = await userModel.findById(following_id)
        if (!user) {
            res.json({
                msg: 'no such user exists'
            })
        }



        const followingUser = await userModel.findById(follower_id)
        
        //cannot follow himself

        if(follower_id==following_id){
            res.json({
                msg:'user cannot follow himself'
            })
        }

        //check if user has already followed 

        for(var i=0;i<followingUser.following.length;i++)
        {
            if(followingUser.following[i]==following_id){
                return res.json({
                    msg:'cannot follow a user more than once'
                })
            }
        }



        
        followingUser.following.push(following_id)

        user.follower.push(follower_id);

        await user.save()
        await followingUser.save()
        res.json({
            msg: 'user followed'
        });
    }
    catch (err) {
        res.json({
            error: err.message
        })
    }
}

//unfollow

module.exports.unfollow = async function unfollow(req, res) {
    try {
        const follower_id = req.id;
        const following_id = req.params.id;
        const user = await userModel.findById(follower_id)

        const followingUser = await userModel.findById(following_id)

        if (!followingUser) {
            res.json({
                msg: 'no such user exists'
            })
        }

        var arr = [];
        for (var i = 0; i < user.following.length; i++) {
            if (user.following[i] == following_id) {
                continue;
            }
            arr.push(user.following[i]);
        }
        user.following = arr;
        await user.save();
        arr = []
        for (var i = 0; i < followingUser.following.length; i++) {
            if (followingUser.follower[i] == follower_id) {
                continue;
            }
            arr.push(followingUser.follower[i]);
        }
        followingUser.follower = arr;
        await followingUser.save()
        res.json({
            msg: 'user unfollowed'
        })
    }
    catch (err) {
        res.json({
            error: err.message
        })
    }
}















