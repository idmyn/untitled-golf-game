module.exports = Player

let count = 1

function Player(socket, ball) {
  this.id = count
  this.socket = socket
  this.ball = ball
  this.shots = 0

  Player.all[this.id] = this
  count++

  this.sendMessage = function(message){
    socket.emit('newMessage', {message: message})
  }
}

Player.all = {}

Player.onConnect = (socket, game) => {
  const ball = game.createBall()
  const player = new Player(socket, ball)

  socket.emit('initPlayer', {playerId: player.id, hole: game.map.hole, mapObjects: game.map.mapObjects, messages: game.messages})

  socket.on('mouseClick', (packet) =>{
    if (ball.speed < 0.1) {
      player.shots++
      game.mouseClicked(ball, packet)
    }
  })
  return player
}

Player.getPlayerBySocketId = function(socketId){
  for(const playerId in Player.all){
    if(Player.all[playerId].socket.id === socketId){
      return Player.all[playerId]
    }
  }
}
