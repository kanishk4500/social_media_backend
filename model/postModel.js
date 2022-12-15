const express = require('express')
const mongoose = require('mongoose')
require('dotenv').config()

const postSchema = mongoose.Schema({
    title:{
        type:String,
        required:[true,'title required']
    },
    content:{
        type:String,
        required:[true,'content required']
    },
    createdTime:{
        type:Date,
        default:Date.now()
    },
    createdBy:{
        type:String,
        required:true
    },
    comment:{
        type:[{
            comment:String,
            createdBy:String,
            createdAt:Date
        }]
    },
    likes:{
        type:[String]
    }
})

const postModel = mongoose.model('posts',postSchema)

module.exports = postModel