const userModel = require('../model/userModel')
const jwt = require('jsonwebtoken')
require('dotenv').config()
const JWT_KEY = process.env.JWT_KEY
//login(authenticate)
module.exports.authenticate = async function authenticate(req, res) {
    try {
        let userEmail = req.body.email;
        let password = req.body.password;

        //check if incoming email is valid

        const userData = await userModel.findOne({ email: userEmail })


        if (!userData) {
            res.json({
                msg: "user not found"
            })
        }

        if (userData.password != password) {
            res.json({
                msg: "password incorrect"
            })
        }

        const uid = userData._id
        //set httponly : true
        const token = jwt.sign({ payload: uid }, JWT_KEY);
        res.cookie('isLoggedin', token)
        res.json({
            jwt: token
        })
    }
    catch (err) {
        res.json({
            error: err.message
        })
    }
}
//protect route
module.exports.protected = async function protected(req, res, next) {
    // console.log(req.cookies.isLoggedin)
    try {
        if (req.cookies.isLoggedin) {
            const token = req.cookies.isLoggedin
            //after decrypting the token uid is obtained
            //uid is the object id of the user
            //which can be used for db queries
            const uid = jwt.verify(token, JWT_KEY).payload
            const userData = await userModel.findById(uid)
            if (userData) {
                req.id = userData._id
                next()
            }
            else {
                res.json({
                    msg: "cookie not verified"
                })
            }
        }
        else {
            res.json({
                msg: "user not logged in"
            })
        }
    }
    catch (err) {
        res.json({
            error: err.message
        })
    }
}