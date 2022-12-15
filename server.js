//om 
const express = require('express')
const cookieParser = require('cookie-parser')
const mongoose = require('mongoose')
require('dotenv').config()

const app = express()
const PORT = 8080;
const apiRouter = require('./router/apiRouter')

//connect database
app.use(express.json())
app.use(cookieParser())
//middlewares

const USER_NAME = process.env.USER_NAME;
const PASSWORD = process.env.PASSWORD;

const db_link = 'mongodb+srv://'+USER_NAME+':'+PASSWORD+'@cluster0.nq73kot.mongodb.net/?retryWrites=true&w=majority';

//promise based
mongoose.connect(db_link)
.then((db)=>{
    // console.log(db)
    console.log('db connnected')
})
.catch((err)=>{
    console.log(err);
})




//routes
app.use('/api',apiRouter)






app.listen(PORT,()=>{
    console.log('server started at '+PORT);
})

module.exports=app;