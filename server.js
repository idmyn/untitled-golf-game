/* eslint-disable no-debugger */
const express = require('express')
const app = express()
const http = require('http').createServer(app)
app.use('/client', express.static('client'))

const io = require('socket.io')(http)

const Player = require('./server/player')
const Game = require('./server/game')

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/client/index.html')
})

http.listen(3000, function() {
  console.log('listening on *:3000')
})

// Start a game on server start
const game = new Game()
game.initialize()
game.run()

io.on('connection', function(socket) {
  const player = Player.onConnect(socket, game)
  console.log('a user connected')

  socket.on('disconnect', () => {
    delete Player.all[player.id]
    console.log('a user disconnected')
  })
})
