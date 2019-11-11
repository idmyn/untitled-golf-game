module.exports = Game

const Player = require('./player')

const Matter = require('matter-js/build/matter.js')

const Engine = Matter.Engine,
  World = Matter.World,
  Bodies = Matter.Bodies,
  Body = Matter.Body,
  Vector = Matter.Vector

function Game() {
  this.initialize = () => {
    global.window = {} // https://github.com/liabru/matter-js/issues/101#issuecomment-161618366
    const engine = Engine.create()
    this.world = engine.world
    // world.gravity.y = 0

    Engine.run(engine)

    const ground = Bodies.rectangle(400, 610, 810, 60, { isStatic: true })
    World.add(this.world, ground)

    // function updateMatter(){
    //   Matter.Events.trigger(engine, 'tick', { timestamp: engine.timing.timestamp })
    //   Matter.Engine.update(engine, engine.timing.delta)
    //   Matter.Events.trigger(engine, 'afterTick', { timestamp: engine.timing.timestamp })
    // }
  }

  this.run = () => {
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
  }

  this.createBall = () => {
    const ball = Bodies.circle(300, 300, 15)
    World.add(this.world, ball)
    return ball
  }
}
