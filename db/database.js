
//require mongoose module
const mongoose = require('mongoose')


//require database URL from properties file
const dbURL = 'mongodb://localhost:27017/golf'

//export this function and imported by server.js
module.exports =function(){

  mongoose.connect(dbURL)

  mongoose.connection.on('connected', function(){
    console.log("Mongoose default connection is open to ", dbURL)
  })

  mongoose.connection.on('error', function(err){
    console.log("Mongoose default connection has occured "+err+" error")
  })

  mongoose.connection.on('disconnected', function(){
    console.log("Mongoose default connection is disconnected")
  })

  process.on('SIGINT', function(){
    mongoose.connection.close(function(){
      console.log("Mongoose default connection is disconnected due to application termination")
      process.exit(0)
    })
  })
}