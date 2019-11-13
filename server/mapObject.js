
let count = 0

export default class MapObject{
  constructor(x,y,width, height){
    this.id = count
    this.x = x
    this.y = y
    this.width = width
    this.height = height  

    count++
  }


  

  addToMap(map) {
    map.mapObjects.push(this)
  }
}

