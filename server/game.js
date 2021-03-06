import Player from "./player.js";
import Map from "./map.js";
import Matter from "matter-js/build/matter.js";

const Engine = Matter.Engine,
  World = Matter.World,
  Bodies = Matter.Bodies,
  Body = Matter.Body,
  Vector = Matter.Vector

let count = 0

export default class Game {
  constructor() {
    this.id = count
    Game.all[this.id] = this
    count++
  }

  initialize() {
    global.window = {} // https://github.com/liabru/matter-js/issues/101#issuecomment-161618366
    const engine = Engine.create()
    this.world = engine.world
    this.world.gravity.y = 0
    this.players = []
    this.messages = []

    Engine.run(engine)

    const topWall = Bodies.rectangle(400 / 2, 0 - 25, 400, 50, {isStatic: true}),
      bottomWall = Bodies.rectangle(400 / 2, 600 + 25, 400, 50, {isStatic: true}),
      leftWall = Bodies.rectangle(0 - 25, 600 / 2, 50, 600, {isStatic: true}),
      rightWall = Bodies.rectangle(400 + 25, 600 / 2, 50, 600, {isStatic: true})

    const bodies = [topWall, bottomWall, leftWall, rightWall]
    bodies.forEach(body => body.restitution = 0.6)

    World.add(this.world, bodies)
  }

  run() {
    this.gameTick = setInterval(() => {
      this.checkIfWon()

      const pack = []

      this.players.forEach((player) => {
        if (!player.potted) {
          if(player.boosting){
            const gamePlayers = this.players.filter(gamePlayer => gamePlayer !== player)
            gamePlayers.forEach(playerToCollide => {
              const collision = Matter.SAT.collides(player.ball, playerToCollide.ball)
              if (collision.collided) {
                player.boosting = false
                player.shots -= 2
              }
            })
          }

          const ballPos = player.ball.position
          const shots = player.shots
          const name = player.playerName
          const colour = player.colour
          pack.push({
            [player.id]: {
              ballPos: ballPos,
              shots: shots,
              name: name,
              colour: colour
            }
          })
          this.checkIfPotted(player)
        }
      })
      this.sendPackets("ballPositions",pack)
    }, 1000/25)
  }

  sendPackets(packName, pack){
    this.players.forEach((player) =>{
      player.socket.emit(packName, pack)
    })
  }

  checkIfWon() {
    this.players.length
      ? this.players.every(player => player.potted) && this.finish()
      : delete Game.all[this.id]
  }

  createBall() {
    const spawnPoint = this.map.spawnPoints[0]
    this.map.spawnPoints.shift()
    this.map.spawnPoints.push(spawnPoint)

    const ball = Bodies.circle(spawnPoint.x, spawnPoint.y, 15)
    ball.frictionAir = 0.03
    World.add(this.world, ball)
    return ball
  }

  createRect(mapObject) {
    const rect = Bodies.rectangle(
      mapObject.x + mapObject.width / 2,
      mapObject.y + mapObject.height / 2,
      mapObject.width,
      mapObject.height,
      {isStatic: true})

    rect.restitution = 0.6
    World.add(this.world, rect)
    return rect
  }

  mouseClicked(ball, mousePosition, boost){
    const distance = distanceBetween(ball.position, mousePosition)
    const angle = Vector.angle(ball.position, mousePosition)
    const forceMultiplier = boost ? distance / 50 + 100 : distance / 50 + 1
    const force = 0.005 * forceMultiplier > 0.1 ? 0.1 : 0.005 * forceMultiplier
    // https://stackoverflow.com/a/45118761
    Body.applyForce(ball, ball.position, {
      x: Math.cos(angle) * force,
      y: Math.sin(angle) * force
    })
  }

  initMap() {
    const hole = this.map.hole
    this.holePos = {x:hole.x,y:hole.y}
    this.holeRadius = hole.radius
    const mapObjects = this.map.mapObjects

    for(const mapObjectId in mapObjects){
      this.createRect(mapObjects[mapObjectId])
    }
  }

  checkIfPotted(player) {
    if (distanceBetween(player.ball.position, this.holePos) < this.holeRadius
        && player.ball.speed < 3) {
      World.remove(this.world, player.ball)
      const playerName = player.playerName
      player.potted = true
      this.sendPackets('playerPots', {[playerName]: player.shots})
    }
  }

  finish() {
    clearInterval(this.gameTick)

    const pack = {}
    this.players.forEach(player => {
      player.persistStats(this)
      pack[player.playerName] = {shots: player.shots}
    })

    this.sendPackets('gameWon', pack)

    delete Game.all[this.id]
  }

  removePlayer(curPlayer){
    this.players = this.players.filter(player => player != curPlayer)
    World.remove(this.world, curPlayer.ball)
  }

  sendMessages(pack, player){
    const playerName = player.playerName
    if(pack[0] !== "/"){
    const preparedMessage = `${playerName}: ${pack}`
    const validation = validMessage(pack)

    validation === true 
      ? [this.sendPackets('newMessage', preparedMessage), this.messages.push(preparedMessage)] 
      : player.socket.emit('errorMessage', `ERROR: ${validation}`)
    }else{
      const command = pack.slice(1)
      let message
      switch(command){
        case "stats":
          message = "Stats coming soon"
          break
        case "map":
          message = this.map.name
          break
        case "help":
          message = "Commands: map, stats"
          break
        default:
          message = "Unkown command"
          break
      }
      this.sendPackets('newMessage', message)
    }
  }

  static handleMessage(packet,socketId){
    const player = Player.getPlayerBySocketId(socketId)
    const game = player.game
    game.sendMessages(packet, player)
  }

  static async newGame() {
    const respMaps = await Map.getRandomMap()

    const game = new Game()
    game.map = respMaps
    game.initialize()
    game.run()
    game.initMap()
    return game
  }

  static async findOrCreateGame() {
    for (const gameId in this.all) {
      const game = this.all[gameId]
      if (game.players.length < 4) { //4 hard coded player count, could be dynamic?
        return game
      }
    }
    return await this.newGame()
  }
}

Game.all = {}

const distanceBetween = (vectorA, vectorB) => {
  // Pythagorean theorem time
  return Math.sqrt(Math.pow(vectorA.x - vectorB.x, 2) + Math.pow(vectorA.y - vectorB.y, 2))
}

const validMessage = (message) => {
  if(message.length === 0 || message.length > 30){
    return "Messages must be between 1 and 30 characters long!"
  }else{
    return true
  }
}
