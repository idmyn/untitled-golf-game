//temp
import User from "../db/schema.js";
import Game from "./game.js";

let count = 0

export default class Player {

  constructor(socket, gameId, ball) {
    this.id = count
    this.socket = socket
    this.gameId = gameId
    this.ball = ball
    this.potted = false
    this.shots = 0

    Player.all[this.id] = this
    count++
  }

  sendMessage(message) {
    socket.emit('newMessage', {message: message})
  }

  playerName(){
    return this.name ? this.name : this.id
  }

  findGame(){
    return Game.all[this.gameId]
  }

  initPlayer(){
    const game = this.findGame()
    this.socket.emit('initPlayer', {playerId: this.playerName(), hole: game.map.hole, mapObjects: game.map.mapObjects, messages: game.messages})
  }
}

Player.all = {}

Player.onConnect = (socket, game) => {
  let ball = game.createBall()
  const player = new Player(socket, game.id, ball)

  player.initPlayer()

  socket.on('mouseClick', (packet) => {
    ball = player.ball
    if (ball.speed < 0.1) {
      player.shots++
      player.findGame().mouseClicked(ball, packet)
    }
  })

  socket.on('playAgain', () => {
    const game = Player.joinNextAvailableGame()
    const player = Player.getPlayerBySocketId(socket.id)
    player.gameId = game.id
    player.initPlayer()
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

Player.joinNextAvailableGame = function(){
  if(Object.keys(Game.all).length === 0){
    return Game.newGame()
  }else{
    for(const gameId in Game.all){
      return Game.all[gameId]
    }
  }
}
