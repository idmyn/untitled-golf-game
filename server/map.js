import Schema from "../db/schema.js"
const MapSchema = Schema.MapSchema
let count = 0
export default class Map {
  constructor(id,mapObjects,hole, spawnPoints) {
    this.id = id
    this.mapObjects = mapObjects
    this.hole = hole
    this.spawnPoints = spawnPoints

    Map.all[this.id] = this
  }

  pushToDB(){
    const newMap = new MapSchema({mapObjects: this.mapObjects, hole: this.hole, spawnPoints: this.spawnPoints})
    newMap.save((err)=>{
      if(err) throw err
    })
  }


static async getRandomMap(){
  const maps = await MapSchema.find((err)=>{
    if(err) throw err
  })
  return this.unpackFromDB(randomElement(maps))
}

static unpackFromDB(newMap){ 
  return new Map(newMap._id, newMap.mapObjects, newMap.hole, newMap.spawnPoints)
}
}

Map.all = {}

const randomElement = (array) => {
  const rand = Math.floor(Math.random() * array.length)
  return array[rand]
}



