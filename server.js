const express = require('express')
const app = express()
const http = require('http').createServer(app)
const db = require('./db/database')
app.use('/client', express.static('client'))

const io = require('socket.io')(http)

db()

const Player = require('./server/player')
const Game = require('./server/game')

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/client/index.html')
})

http.listen(3000, function() {
  console.log('listening on *:3000')
})

// Start a game on server start
/*
const game = new Game()
const map = Map.map1()
game.map = map
game.initialize()
game.run()
game.initMap()
*/

io.on('connection', function(socket) {
  const game = Player.joinNextAvailableGame()
  console.log(game.id)
  const player = Player.onConnect(socket, game)
  game.players.push(player)
  console.log('a user connected')

  socket.on('newMessage', (packet) => {
    const player = Player.getPlayerBySocketId(packet.socketId)
    const game = Game.all[player.gameId]
    const playerName = player.name ? player.name : player.id
    const newMessage = `${playerName}: ${packet.message}`
    game.sendMessage(newMessage)
  })
  
  socket.on('disconnect', () => {
    const player = Player.getPlayerBySocketId(socket.id)
    console.log(player.id, socket.id, player.gameId)
    const game = Game.all[player.gameId]
    game.removePlayer(player)
    
    console.log('a user disconnected')
  })
})


