import mongoose from 'mongoose'
const Schema = mongoose.Schema

const userScehma = new Schema({
  name: String,
  stats: Array
})

const mapSchema = new Schema({
  mapObjects: Array,
  hole: Object,
  spawnPoints: Array
})

const User = mongoose.model('User', userScehma)
const MapSchema = mongoose.model('Map', mapSchema)


export default { User, MapSchema }