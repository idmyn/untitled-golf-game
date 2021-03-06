//temp
import Schema from "../db/schema.js"
import Game from "./game.js"
const User = Schema.User

let count = 0
const colours =['red','white','yellow','pink','purple','lime','blue','cyan', 'white', 'grey']

export default class Player {
  constructor(socket) {
    this.id = count
    this.socket = socket
    this.potted = false
    this.shots = 0
    this.boost = false
    this.colour = randomElement(colours)

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
    const messages = game.messages.slice()
    messages.push("\n\n")
    messages.push("Instructions:")
    messages.push("- Click where you want to move 🕹")
    messages.push("- Hold shift and click to use boost ⇧")
    messages.push("- Boosting will count as 2 shots unless you hit a player ⛳️")
    messages.push("\n")
    this.socket.emit('initPlayer', {playerId: this.playerName, hole: game.map.hole, mapObjects: game.map.mapObjects, messages: messages})
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
      if (err) throw err

      if (user) {
        const playerShots = this.shots
        const gameMap = game.map.id
        const newStats = {[gameMap]: playerShots}

        User.findByIdAndUpdate(user._id, { $push: { stats: newStats } }, (err) => {
          if (err) throw err
        })
      }
    })
  }

  static getPlayerBySocketId(socketId) {
    for (const playerId in Player.all) {
      if (Player.all[playerId].socket.id === socketId) {
        return Player.all[playerId]
      }
    }
  }

  static onConnect(socket) {
    const player = new Player(socket)

    player.joinGame()

    socket.on('mouseClick', (pack) => {
      if (player.ball.speed < 0.1) {
        player.boost ? [player.shots += 2, player.boosting = true] : player.shots++
        player.game.mouseClicked(player.ball, pack, player.boost)
      }
    })

    socket.on('boost', (pack) => {
      player.boost = pack
    })

    socket.on('playAgain', () => {
      const player = Player.getPlayerBySocketId(socket.id)
      player.reset()
      player.joinGame()
    })

    socket.on('login', (name) => {
      const validation = validateName(name)
      const player = Player.getPlayerBySocketId(socket.id)

      if (validation === true) {
        User.find({name: name}, (err, user) => {
          if(err) throw err
          if(user.length > 0) {
            player.name = user[0].name
            socket.emit('successfulLogin', {
              name: player.name
            })
          } else {
            const playerToSave = new User({ name: name })

            playerToSave.save((err, user) => {
              if (err) throw err
              player.name = user.name
              socket.emit('successfulLogin', {
                name: player.name
              })
            })
          }
        })
      } else {
        socket.emit('loginError', `ERROR: ${validation}`)
      }
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

const validateName = (name) => {
  return name.length > 0 && name.length <= 10 ? true : "Usernames must be between 1 and 10 characters long!"
}

const randomElement = (array) => {
  const rand = Math.floor(Math.random() * array.length)
  return array[rand]
}
