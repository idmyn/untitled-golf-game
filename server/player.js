module.exports = Player

let count = 1

function Player(socket) {
  this.id = count
  this.x = 200
  this.y = 500
  this.radius = 15
  this.socket = socket

  this.update = () =>{

  }
   
  Player.all[this.id] = this
  count++
}

Player.all = {}

 
Player.onConnect = (socket) => {
  const player = new Player(socket)
  
  const ball = Bodies.circle(player.x, player.y, player.radius)
  var ground = Matter.Bodies.rectangle(400, 610, 810, 60, { isStatic: true })
  World.add(world, [ball, ground])
  playerJoined(ball)
}

Player.update = () => {
  for (const playerIndex in Player.all){
    Player.all[playerIndex].update()
  }
}

function playerJoined(ball){
  setInterval(()=>{
    updateMatter()
    const ballPos = ball.position
    Player.all[1].socket.emit('position', ballPos)
  }, 1000/25)
}
  

global.window = {} // https://github.com/liabru/matter-js/issues/101#issuecomment-161618366
const Matter = require('matter-js/build/matter.js')

const Engine = Matter.Engine,
  World = Matter.World,
  Bodies = Matter.Bodies,
  Body = Matter.Body,
  Vector = Matter.Vector

// assume dimensions of canvas = 400, 600

const engine = Engine.create()
const world = engine.world
// world.gravity.y = 0

Engine.run(engine)

function updateMatter(){
  Matter.Events.trigger(engine, 'tick', { timestamp: engine.timing.timestamp })
  Matter.Engine.update(engine, engine.timing.delta)
  Matter.Events.trigger(engine, 'afterTick', { timestamp: engine.timing.timestamp })
}

