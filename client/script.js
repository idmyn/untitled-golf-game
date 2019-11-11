const socket = io()

const canvas = document.querySelector('#game')
const ctx = canvas.getContext('2d')

socket.on('position', (ballPos)=> {
  ctx.clearRect(0,0,400,600)
  ctx.beginPath()
  ctx.arc(ballPos.x, ballPos.y, 10, 0, 2 * Math.PI)
  ctx.stroke()
})
