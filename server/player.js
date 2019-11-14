//temp
import Schema from "../db/schema.js"
import Game from "./game.js"
const User = Schema.User

let count = 0

export default class Player {

  constructor(socket) {
    this.id = count
    this.socket = socket
    this.potted = false
    this.shots = 0

    Player.all[this.id] = this
    count++
  }

  get game() {
    return Game.all[this.gameId]
  }

  get playerName() {
    return this.name ? this.name : this.id
  }

  async joinGame() {
    const game = await Game.findOrCreateGame()
    this.gameId = game.id
    this.ball = game.createBall()

    game.players.push(this)

    this.socket.emit('initPlayer', {playerId: this.playerName, hole: game.map.hole, mapObjects: game.map.mapObjects, messages: game.messages})
  }

  reset() {
    this.potted = false
    this.shots = 0
  }

  disconnect() {
    delete Player.all[this.id]
  }

  persistStats(game){
    const playerName = this.playerName
  
    User.findOne({name: playerName}, (err, user)=>{
      if(err) throw err
      
      if(user){
        const playerShots = this.shots
        const gameMap = game.map.id
        const newStats = user.stats
        newStats.push({[gameMap]: playerShots})
        
        User.findByIdAndUpdate(user._id, { $push: { stats: newStats }},(err)=>{
          if(err) throw err
        })
      }
    })

  }

  static getPlayerBySocketId(socketId) {
    for(const playerId in Player.all){
      if(Player.all[playerId].socket.id === socketId){
        return Player.all[playerId]
      }
    }
  }

  static onConnect(socket) {
    const player = new Player(socket)
  
    player.joinGame()
  
    socket.on('mouseClick', (packet) => {
      if (player.ball.speed < 0.1) {
        player.shots++
        player.game.mouseClicked(player.ball, packet)
      }
    })
  
    socket.on('playAgain', () => {
      const player = Player.getPlayerBySocketId(socket.id)
  
      player.reset()
      player.joinGame()
    })
  
    socket.on('login', (name) => {
      const player = Player.getPlayerBySocketId(socket.id)
  
      User.find({name: name}, (err, user) => {
        if(err) throw err
  
        if(user.length > 0) {
          player.name = user[0].name
          socket.emit('successfulLogin', {
            name: player.name
          })
        } else {
          const playerToSave = new User({
            name: name
          })
  
          playerToSave.save((err, user) => {
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

  static handleDisconnect(socketId) {
    const player = this.getPlayerBySocketId(socketId)
    player.game && player.game.removePlayer(player)
    player.disconnect()
  }
  
}

Player.all = {}





