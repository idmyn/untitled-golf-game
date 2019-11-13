import MapObject from "./mapObject.js"

let count = 0
export default class Map {
  constructor() {
    this.id = count
    this.mapObjects = []

    Map.all[this.id] = this
    count++
  }
}

Map.all = {}

Map.map1 = function(){
  const testMap = new Map()
  const obj1 = new MapObject(100, 100, 200, 20)
  const obj2 = new MapObject(100, 300, 200, 20)
  const obj3 = new MapObject(100, 500, 200, 20)
  obj1.addToMap(testMap)
  obj2.addToMap(testMap)
  obj3.addToMap(testMap)
  testMap.hole =  {x:200,y:50,radius:20}
  return testMap
}
