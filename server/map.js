const MapObject = require('./mapObject')
module.exports = Map

let count = 1
function Map(){
  this.id = count
  this.mapObjects = []

  Map.all[this.id] = this
  count++
}

Map.all = {}

Map.map1 = function(){
  const testMap = new Map()
  const obj1 = new MapObject(100, 100, 200, 20)
  obj1.addToMap(testMap)
  testMap.hole =  {x:200,y:50,radius:20}
  return testMap
}



