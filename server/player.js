/* eslint-disable no-debugger */
module.exports = Player

const Matter = require('matter-js/build/matter.js')

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
Player.onConnect = (socket, game) => {
 // const ball = Matter.Bodies.circle(300, 300, 15)
  const ball = game.createBall()
  const player = new Player(socket, ball)

  socket.on('mouseClick', (packet) =>{
    console.log(packet)
    game.mouseClicked(ball, packet)
  })
}


