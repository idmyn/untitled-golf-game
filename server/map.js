import Schema from "../db/schema.js"
const MapSchema = Schema.MapSchema
let count = 0
export default class Map {
  constructor(id,mapObjects,hole) {
    this.id = id
    this.mapObjects = mapObjects
    this.hole = hole

    Map.all[this.id] = this
  }

  pushToDB(){
    const newMap = new MapSchema({mapObjects: this.mapObjects, hole: this.hole})
    newMap.save((err)=>{
      if(err) throw err
    })
  }
}

Map.all = {}

Map.getRandomMap = async function(){
  const maps = await MapSchema.find((err)=>{
    if(err) throw err
  })
  return this.unpackFromDB(randomElement(maps))
}

Map.unpackFromDB = function(newMap){ 
  return new Map(newMap._id, newMap.mapObjects, newMap.hole)
}


const randomElement = (array) => {
  const rand = Math.floor(Math.random() * array.length)
  return array[rand]
}



