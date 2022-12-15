const express = require('express')
const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    email:{
        type:String,
        required:[true,'user email required'],
        unique:[true,'already registered email']
    },
     password:{
        type:String,
        required:[true,'user email required'],
    },
    follower:{
        type:[String]
    },
    following:[String],
    liked:[String],
    postCreated:[String],
    comment:[String]
})



const userModel = mongoose.model('users',userSchema)

module.exports = userModel;