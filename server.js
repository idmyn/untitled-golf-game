const express = require('express')
const app = express()
const http = require('http').createServer(app)
app.use('/client', express.static('client'))

const io = require('socket.io')(http)

const Player = require('./server/player')
const Game = require('./server/game')
const Map = require('./server/map')


app.get('/', function(req, res) {
  res.sendFile(__dirname + '/client/index.html')
})

http.listen(3000, function() {
  console.log('listening on *:3000')
})

// Start a game on server start
const game = new Game()
const map = Map.map1()
game.map = map
game.initialize()
game.run()
game.initMap()

io.on('connection', function(socket) {
  const player = Player.onConnect(socket, game)
  game.players.push(player)
  console.log('a user connected')

  socket.on('newMessage', (packet) => {
    const player = Player.getPlayerBySocketId(packet.socketId)
    const newMessage = `${player.id}: ${packet.message}`  // in the future it would be nice if this was their name
    game.sendMessage(newMessage)
  })
  
  socket.on('disconnect', () => {
    game.removePlayer(Player.all[player.id])
    console.log('a user disconnected')
  })
})


