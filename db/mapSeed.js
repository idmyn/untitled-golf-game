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

    const spawnPoint1 = {x:250, y:250}

    const spawnPoint2 = {x:350, y:350}

    const testMap = new Map(count,[obj1,obj2,obj3],hole, [spawnPoint1, spawnPoint2])
    testMap.pushToDB()
  
    count++
    return testMap
  }

  Map.map2 = function(){
    const obj1 = new MapObject(200, 100, 200, 20)
    const obj2 = new MapObject(200, 300, 200, 20)
    const obj3 = new MapObject(200, 500, 200, 20)

    const spawnPoint1 = {x:300, y:300}

    const spawnPoint2 = {x:200, y:200}
   
    const hole =  {x:200,y:300,radius:20}
    const testMap = new Map(count,[obj1,obj2,obj3],hole, [spawnPoint1, spawnPoint2])
    testMap.pushToDB()
  
    count++
    return testMap
  }

  console.log(Map.map1(), Map.map2())
