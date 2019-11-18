const express = require('express');
const bodyParser = require('body-parser');

//configurations and required files for db
const dbConfig= require('./configs/db.config.js');
const mongoose= require('mongoose');

mongoose.Promise=global.Promise;

//Connection transactions to DB
mongoose.connect(dbConfig.getirDBurl,{
    useNewUrlParser:true
})
.then(()=>{
    console.log("Success to db");
})
.catch(err=>{
    console.log('DB exception',err);
    process.exit();
});

//creation express application
const myApp=express();



//parsing request of content type to -urlencoded
myApp.use(bodyParser.urlencoded({extended:true}))

//parsing request of content type to JSON
myApp.use(bodyParser.json())

//need another routes
require('./routes.js')(myApp);

myApp.listen(2000,()=>{
console.log("Server is listenin on :2000");
});