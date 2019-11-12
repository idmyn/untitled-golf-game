module.exports = Player
//temp
const User = require('../db/schema')
const Game = require('./game')


let count = 0

function Player(socket, gameId, ball) {
  this.id = count
  this.socket = socket
  this.gameId = gameId
  this.ball = ball
  this.potted = false
  this.shots = 0

  Player.all[this.id] = this
  count++

  this.sendMessage = function(message){
    socket.emit('newMessage', {message: message})
  }

  this.playerName = function(){
    return this.name ? this.name : this.id
  }
}

Player.all = {}

Player.onConnect = (socket, game) => {
  const ball = game.createBall()
  const player = new Player(socket, game.id, ball)

  socket.emit('initPlayer', {playerId: player.id, hole: game.map.hole, mapObjects: game.map.mapObjects, messages: game.messages})

  socket.on('mouseClick', (packet) => {
    if (ball.speed < 0.1) {
      player.shots++
      game.mouseClicked(ball, packet)
    }
  })

  socket.on('playAgain', () => {
    const game = Player.joinNextAvailableGame()
    const player = Player.getPlayerBySocketId(socket.id)
    player.gameId = game.id
    player.potted = false
    player.shots = 0
    player.ball = game.createBall()
    game.players.push(player)

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

/*
Player.gameWon = function(winningPlayer, game){
  console.log("FAES")
  game.players.forEach(player => {
    player.socket.emit('gameWon', {winningPlayer: winningPlayer})
  })
  
  console.log(Game.all)
}*/

Player.joinNextAvailableGame = function(){
  if(Object.keys(Game.all).length === 0){
    return Game.newGame()
  }else{
    for(const gameId in Game.all){
      return Game.all[gameId]
    }
  }
}
