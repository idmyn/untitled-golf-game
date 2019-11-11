global.window = {} // https://github.com/liabru/matter-js/issues/101#issuecomment-161618366
const express = require('express')
const app = express()
app.use('/client', express.static('client'))
const http = require('http').createServer(app)
const io = require('socket.io')(http)

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/client/index.html')
})

http.listen(3000, function() {
  console.log('listening on *:3000')
})

io.on('connection', function(socket) {
  const ball = Bodies.circle(200, 500, 15)
  var ground = Matter.Bodies.rectangle(400, 610, 810, 60, { isStatic: true })
  World.add(world, [ball, ground])

  playerJoined(ball)

  console.log('a user connected')
})


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

function playerJoined(ball){
  setInterval(()=>{
    updateMatter()
    let ballPos = ball.position
    io.emit('position', ballPos)
  }, 1000/25)
}
