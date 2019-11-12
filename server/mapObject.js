module.exports = MapObject
let count = 0

function MapObject(x,y,width, height){
  this.id = count
  this.x = x
  this.y = y
  this.width = width
  this.height = height

  count++

  this.addToMap = function(map){
    map.mapObjects.push(this)
  }
}

