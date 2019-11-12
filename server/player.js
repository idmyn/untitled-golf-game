module.exports = Player
//temp
const User = require('../db/schema')


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

  socket.on('mouseClick', (packet) => {
    if (ball.speed < 0.1) {
      player.shots++
      game.mouseClicked(ball, packet)
    }
  })

  socket.on('login', (name) => {
    const player = Player.getPlayerBySocketId(socket.id)

    User.find({name: name}, function(err, user){
      if(err) throw err

      if(user.length > 0){
        player.name = user[0].name
        socket.emit('successfulLogin', {
          name: player.name
        })
      } else {
        const playerToSave = new User({
          name: name
        })

        playerToSave.save(function(err, user){
          if(err) throw err
          player.name = user.name
          socket.emit('successfulLogin', {
            name: player.name
          })
        })
      }
    })
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
