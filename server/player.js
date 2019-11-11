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

Player.onConnect = (socket, game) => {
  const ball = game.createBall()
  const player = new Player(socket, ball)

  socket.emit('initPlayer', {playerId: player.id})

  socket.on('mouseClick', (packet) =>{
    if (ball.speed < 0.1) {
      game.mouseClicked(ball, packet)
    }
  })
  return player
}
