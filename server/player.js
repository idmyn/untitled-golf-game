/* eslint-disable no-debugger */
module.exports = Player

let count = 1

function Player(socket, ball) {
  this.id = count
  this.socket = socket
  this.ball = ball

  Player.all[this.id] = this
  count++
}

Player.all = {}

// ground should only be created once (on server start?)
Player.onConnect = (socket) => {
  const ball = Bodies.circle(300, 300, 15)
  const player = new Player(socket, ball)

  var ground = Matter.Bodies.rectangle(400, 610, 810, 60, { isStatic: true })
  World.add(world, [ball, ground])
}

setInterval(() => {
  const pack = []
  for (const playerId in Player.all) {
    const player = Player.all[playerId]
    const ballPos = player.ball.position
    pack.push(ballPos)
  }
  sendPackets(pack)
}, 1000/25)

function sendPackets(pack){
  for(const playerId in Player.all){
    const player = Player.all[playerId]
    player.socket.emit('ballPositions', pack)
  }
}

 global.window = {} // https://github.com/liabru/matter-js/issues/101#issuecomment-161618366
 const Matter = require('matter-js/build/matter.js')

 const Engine = Matter.Engine,
   World = Matter.World,
   Bodies = Matter.Bodies,
   Body = Matter.Body,
   Vector = Matter.Vector

 const engine = Engine.create()
 const world = engine.world
 // world.gravity.y = 0

 Engine.run(engine)

// function updateMatter(){
//   Matter.Events.trigger(engine, 'tick', { timestamp: engine.timing.timestamp })
//   Matter.Engine.update(engine, engine.timing.delta)
//   Matter.Events.trigger(engine, 'afterTick', { timestamp: engine.timing.timestamp })
// }
