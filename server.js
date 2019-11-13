import express from 'express'
import http from 'http'
import path from 'path'
import socketio from 'socket.io'
import db from './db/database.js'
import Player from './server/player.js'
import Game from './server/game.js'

db()

const app = express()
const server = http.createServer(app)
const __dirname = path.dirname(new URL(import.meta.url).pathname);
const io = socketio(server)

server.listen(3000, function() {
  console.log('listening on *:3000')
})

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/client/index.html')
})

app.use('/client', express.static('client'))

io.on('connection', function(socket) {
  Player.onConnect(socket)

  console.log('a user connected')
  
  socket.on('newMessage', (pack) => {
    Game.handleMessage(pack, socket.id)
  })
  
  socket.on('disconnect', () => {
    Player.handleDisconnect(socket.id)
  
    console.log('a user disconnected')
  })
})


