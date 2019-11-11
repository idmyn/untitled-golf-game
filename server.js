const express = require('express')
const app = express()
app.use('/client', express.static('client'))
const http = require('http').createServer(app)
const io = require('socket.io')(http)

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/client/index.html')
})

http.listen(3000, function() {
  console.log('listening on *:3000')
})

io.on('connection', function(socket) {
  console.log('a user connected')
})
