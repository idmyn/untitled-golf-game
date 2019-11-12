const mongoose = require("mongoose")
const Schema = mongoose.Schema

const userScehma = new Schema({
  name: String
})

const User = mongoose.model('User', userScehma)

module.exports = User