const socket = io()

const canvas = document.querySelector('#game')
const ctx = canvas.getContext('2d')

socket.on('position', (pack)=> {
  ctx.clearRect(0,0,400,600)
  pack.forEach(ballPos => {
    ctx.beginPath()
    ctx.arc(ballPos.x, ballPos.y, 15, 0, 2 * Math.PI)
    ctx.stroke()
  })

})
