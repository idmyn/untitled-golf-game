import MapObject from "../server/mapObject.js"
import Map from "../server/map.js"
import db from './database.js'
db()

let count = 0
Map.map1 = function(){
    const name = "The 100m Sprint"
    const obj1 = new MapObject(0, 100, 150, 20)
    const obj2 = new MapObject(250, 100, 150, 20)
    
    const obj3 = new MapObject(150, 200, 100, 20)
    
    const obj4 = new MapObject( 50, 400, 100, 20)
    const obj5 = new MapObject(250, 400, 100, 20)
   
    const hole =  {x:200,y:50,radius:20}

    const spawnPoint1 = {x:50, y:550}
    const spawnPoint2 = {x:150, y:550}
    const spawnPoint3 = {x:250, y:550}
    const spawnPoint4 = {x:350, y:550}

    const testMap = new Map(count,[obj1,obj2,obj3,obj4,obj5],hole, [spawnPoint1, spawnPoint2,spawnPoint3,spawnPoint4], name)
    testMap.pushToDB()
  
    count++
    return testMap
  }

  Map.map2 = function(){
    const name = "Battleground"

    const obj1 = new MapObject(0, 80, 75, 20)
    const obj2 = new MapObject(325, 80, 75, 20)
    const obj3 = new MapObject(0, 500, 75, 20)
    const obj4 = new MapObject(325, 500, 75, 20)

    const obj5 = new MapObject(190, 0, 20, 100)
    const obj6 = new MapObject(190, 500, 20, 100)

    const obj7 = new MapObject(150, 100, 100, 20)
    const obj8 = new MapObject(150, 480, 100, 20)

    const obj9 = new MapObject(125, 200, 150, 20)
    const obj10 = new MapObject(125, 380, 150, 20)

    const spawnPoint1 = {x:25, y:25}
    const spawnPoint2 = {x:375, y:25}
    const spawnPoint3 = {x:25, y:575}
    const spawnPoint4 = {x:375, y:575}
   
    const hole =  {x:200,y:300,radius:20}
    const testMap = new Map(count,[obj1,obj2,obj3,obj4,obj5,obj6,obj7,obj8,obj9, obj10],hole, [spawnPoint1, spawnPoint2, spawnPoint3, spawnPoint4],name)
    testMap.pushToDB()
  
    count++
    return testMap
  }

  console.log(Map.map1(), Map.map2())
