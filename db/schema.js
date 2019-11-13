import mongoose from 'mongoose'
const Schema = mongoose.Schema

const userScehma = new Schema({
  name: String
})

const User = mongoose.model('User', userScehma)

export default User