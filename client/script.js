const socket = io()
let mapObjects
let mapHole
///////////////////////////////////////////////////////////////////
//chatbox
const chatBoxForm = document.querySelector("#chatbox-form")
const chatBoxMessages = document.querySelector('#chatbox-messages')

chatBoxForm.onsubmit= (e) => {
  e.preventDefault()
  const message = e.target.querySelector('input[name="message"]').value
  e.target.querySelector('input[name="message"').value = ""
  socket.emit("newMessage", {socketId: socket.id, message: message})
}

socket.on('newMessage', (packet) =>{
  displayMessage(packet.message)
})

function displayMessage(message){
  const newMessage = document.createElement("li")
  newMessage.innerText = message
  chatBoxMessages.append(newMessage)
}
///////////////////////////////////////////////////////////////////

socket.on('initPlayer', (packet) => {
  packet.messages.forEach(message => displayMessage(message))

  const playerLabel = document.createElement('h2')
  playerLabel.textContent = `You are player ${packet.playerId}`
  document.querySelector('body').append(playerLabel)

  const shotCount = document.createElement('h2')
  shotCount.textContent = `You have taken 0 shots.`
  shotCount.id = "shotCount"
  document.querySelector('body').append(shotCount)

  mapObjects = packet.mapObjects
  mapHole = packet.hole
})

function drawMap(){
  ctx.beginPath()
  ctx.arc(mapHole.x, mapHole.y, mapHole.radius, 0, 2*Math.PI)
  ctx.fillStyle = 'black'
  ctx.fill()
  ctx.lineWidth = 2
  ctx.strokeStyle = '#003300'
  ctx.stroke()

  mapObjects.forEach(mapObject => {
    ctx.beginPath()
    ctx.rect(mapObject.x, mapObject.y, mapObject.width, mapObject.height)
    ctx.fillStyle = 'black'
    ctx.fill()
    ctx.stroke()
  })
}

const canvas = document.querySelector('#game')
const ctx = canvas.getContext('2d')

socket.on('ballPositions', (pack)=> {
  ctx.clearRect(0,0,400,600)
  //draw hole
  drawMap()

  pack.forEach(pack => {
    const playerId = Object.keys(pack)[0]
    const ballPos = pack[playerId].ballPos
    const playerShots = pack[playerId].shots
    ctx.beginPath()
    ctx.arc(ballPos.x, ballPos.y, 15, 0, 2 * Math.PI)
    ctx.fillStyle = 'white'
    ctx.fill()
    ctx.fillStyle = '#000000'
    ctx.fillText(playerId, ballPos.x, ballPos.y)
    ctx.lineWidth = 2
    ctx.strokeStyle = '#003300'
    ctx.stroke()
    const playerShotsH2 = document.querySelector("#shotCount")
    playerShotsH2.innerText = playerShots === 1 
      ? `You have taken ${playerShots} shot.` 
      : `You have taken ${playerShots} shots.`
    
  })
})

socket.on('playerWins', () => {alert('YOU WIN')} )

document.addEventListener('click', (e) => {
  //https://stackoverflow.com/questions/55677/how-do-i-get-the-coordinates-of-a-mouse-click-on-a-canvas-element
  //find mouse click x,y
  let x
  let y
  if (e.pageX || e.pageY) {
    x = e.pageX
    y = e.pageY
  } else {
    x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft
    y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop
  }

  const mouseClickPos = {
    x: x -= canvas.offsetLeft,
    y: y -= canvas.offsetTop
  }

  socket.emit('mouseClick', mouseClickPos)
})
