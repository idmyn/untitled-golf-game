import MapObject from "../server/mapObject.js"
import Map from "../server/map.js"
import db from './database.js'
db()

let count = 0
Map.map1 = function(){
    const obj1 = new MapObject(100, 100, 200, 20)
    const obj2 = new MapObject(100, 300, 200, 20)
    const obj3 = new MapObject(100, 500, 200, 20)
   
    const hole =  {x:200,y:50,radius:20}
    const testMap = new Map(count,[obj1,obj2,obj3],hole)
    testMap.pushToDB()
  
    count++
    return testMap
  }

  Map.map2 = function(){
    const obj1 = new MapObject(200, 100, 200, 20)
    const obj2 = new MapObject(200, 300, 200, 20)
    const obj3 = new MapObject(200, 500, 200, 20)
   
    const hole =  {x:200,y:300,radius:20}
    const testMap = new Map(count,[obj1,obj2,obj3],hole)
    testMap.pushToDB()
  
    count++
    return testMap
  }

  console.log(Map.map1(), Map.map2())
