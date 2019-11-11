const express = require('express')
const app = express()
const http = require('http').createServer(app)
app.use('/client', express.static('client'))

const io = require('socket.io')(http)

const Player = require('./server/player')

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/client/index.html')
})

http.listen(3000, function() {
  console.log('listening on *:3000')
})

io.on('connection', function(socket) {
  Player.onConnect(socket)
  console.log('a user connected')
})
