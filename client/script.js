const socket = io()
let mapObjects
let mapHole

const chatBoxForm = document.querySelector('#chatbox-form')
const chatBoxMessages = document.querySelector('#chatbox-messages')

chatBoxForm.onsubmit = (e) => {
  e.preventDefault()
  const message = e.target.querySelector('input[name="message"]').value
  e.target.querySelector('input[name="message"').value = ''
  socket.emit('newMessage', message)
}

socket.on('newMessage', (pack) => {
  displayMessage(pack)
})

socket.on('errorMessage', (pack) =>{
  displayMessage(pack)
})

function displayMessage(message) {
  const newMessage = document.createElement('li')
  newMessage.innerText = message
  chatBoxMessages.append(newMessage)
  chatBoxMessages.scrollTo(0, chatBoxMessages.scrollHeight)
}

function clearPlayerInfo() {
  const playerName = document.querySelector('#player-name')
  while (playerName.firstChild) {
    playerName.removeChild(playerName.firstChild)
  }
  const playerShots = document.querySelector('#player-shots')
  while (playerShots.firstChild) {
    playerShots.removeChild(playerShots.firstChild)
  }
}

socket.on('initPlayer', (pack) => {
  chatBoxMessages.innerHTML = ''
  pack.messages.forEach(message => displayMessage(message))

  // clear any previous player info still hanging around
  clearPlayerInfo()

  const playerLabel = document.createElement('h2')
  playerLabel.id = 'playerName'
  playerLabel.textContent = `You are player ${pack.playerId}`
  document.querySelector('#player-name').append(playerLabel)

  const shotCount = document.createElement('h2')
  shotCount.textContent = `You have taken 0 shots`
  shotCount.id = 'shotCount'
  document.querySelector('#player-shots').append(shotCount)

  mapObjects = pack.mapObjects
  mapHole = pack.hole
})

function drawMap() {
  ctx.beginPath()
  ctx.arc(mapHole.x, mapHole.y, mapHole.radius, 0, 2*Math.PI)
  ctx.fillStyle = 'black'
  ctx.fill()

  mapObjects.forEach(mapObject => {
    ctx.beginPath()
    ctx.rect(mapObject.x, mapObject.y, mapObject.width, mapObject.height)
    ctx.fillStyle = 'grey'
    ctx.strokeStyle = '#003300'
    ctx.fill()
    ctx.stroke()
  })
}

const canvas = document.querySelector('#game')
const ctx = canvas.getContext('2d')

socket.on('ballPositions', (pack) => {
  ctx.clearRect(0, 0, 400, 600)
  //draw hole
  drawMap()

  pack.forEach(pack => {
    const playerId = Object.keys(pack)[0]
    const ballPos = pack[playerId].ballPos
    const playerShots = pack[playerId].shots
    const playerName = pack[playerId].name
    const colour = pack[playerId].colour
    ctx.beginPath()
    ctx.arc(ballPos.x, ballPos.y, 15, 0, 2 * Math.PI)
    ctx.fillStyle = colour
    ctx.fill()
    ctx.fillStyle = '#000000'
    ctx.font = '15px Rubik'
    ctx.fillText(`${playerName} - ${playerShots} shots`, ballPos.x - 20, ballPos.y + 30)
    ctx.lineWidth = 2
    ctx.strokeStyle = '#003300'
    ctx.stroke()
    const playerShotsH2 = document.querySelector('#shotCount')
    playerShotsH2.innerText = playerShots === 1
      ? `You have taken ${playerShots} shot`
      : `You have taken ${playerShots} shots`
  })
})

socket.on('playerPots', (pack) => {
  const playerName = Object.keys(pack)[0]
  const message = (pack[playerName] === 1)
    ? `${playerName} has finished in ${pack[playerName]} shot`
    : `${playerName} has finished in ${pack[playerName]} shots`

  displayMessage(message)
} )

canvas.addEventListener('click', (e) => {
  // https://stackoverflow.com/a/17130415
  const rect = canvas.getBoundingClientRect(), // abs. size of element
    scaleX = canvas.width / rect.width,    // relationship bitmap vs. element for X
    scaleY = canvas.height / rect.height  // relationship bitmap vs. element for Y

  const mouseClickPos = {
    x: (e.clientX - rect.left) * scaleX,   // scale mouse coordinates after they have
    y: (e.clientY - rect.top) * scaleY     // been adjusted to be relative to element
  }

  socket.emit('mouseClick', mouseClickPos)
})

document.addEventListener('keydown', (e) => {
  if(e.keyCode === 16){
    socket.emit('boost', true)
  }
})

document.addEventListener('keyup', (e) =>{
  if(e.keyCode === 16){
    socket.emit('boost', false)
  }
})

document.querySelector('#login').addEventListener('submit', (e) => {
  e.preventDefault()
  const form = e.target
  const name = form.querySelector('input[name="name"]').value
  socket.emit('login', name)
})

socket.on('successfulLogin', (pack) => {
  const name = pack.name
  const newPlayerName = `user: ${name}`
  document.querySelector('#playerName').textContent = newPlayerName
  document.querySelector('form').remove()
})

socket.on('loginError', (pack) => {
  alert(pack)
})

socket.on('gameWon', (pack) => {
  document.querySelector('main').classList.add('hide')

  const h2 = document.createElement('h2')
  h2.textContent = 'Scoreboard'

  const ul = document.createElement('ul')
  ul.id = 'scorelist'

  for (const playerName in pack) {
    const li = document.createElement('li')
    li.textContent = `${playerName} took ${pack[playerName].shots} shots`
    ul.append(li)
  }

  const button = document.createElement('button')
  button.classList.add('btn', 'btn-success')
  button.id = 'playAgain'
  button.textContent = 'Join new game'
  button.addEventListener('click', () => {
    socket.emit('playAgain')
    scoreboard.remove()
    document.querySelector('main').classList.remove('hide')
  })

  const scoreboard = document.createElement('div')
  scoreboard.id = 'scoreboard'
  scoreboard.append(h2, ul, button)
  document.querySelector('.container-fluid').append(scoreboard)
})
