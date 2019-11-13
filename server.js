import express from 'express'
const app = express()
import http from 'http'
const server = http.createServer(app)
import db from './db/database.js'
app.use('/client', express.static('client'))

import path from 'path'
const __dirname = path.dirname(new URL(import.meta.url).pathname);


server.listen(3000, function() {
  console.log('listening on *:3000')
})

import socketio from 'socket.io'

const io = socketio(server)

db()

import Player from './server/player.js'
import Game from './server/game.js'

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/client/index.html')
})

io.on('connection', function(socket) {
  const game = Player.joinNextAvailableGame()
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
    if(Game.all[player.gameId]){
      const game = Game.all[player.gameId]
      game.removePlayer(player) //remove game if empty
    }
    
    console.log('a user disconnected')
  })
})


