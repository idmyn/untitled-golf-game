import MapObject from "./mapObject.js"
import Schema from "../db/schema.js"
const MapSchema = Schema.MapSchema

export default class Map {
  constructor(id,mapObjects,hole) {
    this.id = id
    this.mapObjects = mapObjects
    this.hole = hole

    Map.all[this.id] = this
  }

  pushToDB(){
    const newMap = new MapSchema({mapObjects: this.mapObjects, hole: this.hole})
    newMap.save((err,map)=>{
      if(err) throw err
    })
  }
}

Map.all = {}

Map.getRandomMap = async function(){
  return MapSchema.find((err,maps)=>{
    if(err) throw err
    if(maps){
      return Map.unpackFromDB(maps[0])
    }
  })
  
}

Map.unpackFromDB = function(newMap){ 
  return new Map(newMap._id,newMap.mapObjects, newMap.hole)
}

Map.map1 = function(){
  const obj1 = new MapObject(100, 100, 200, 20)
  const obj2 = new MapObject(100, 300, 200, 20)
  const obj3 = new MapObject(100, 500, 200, 20)
 
  const hole =  {x:200,y:50,radius:20}
  const testMap = new Map(0,[obj1,obj2,obj3],hole)
  //testMap.pushToDB()

  return testMap
}
