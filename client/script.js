/* eslint-disable no-debugger */
const socket = io()

const canvas = document.querySelector('#game')
const ctx = canvas.getContext('2d')

socket.on('ballPositions', (pack)=> {
  ctx.clearRect(0,0,400,600)
  //draw hole
  ctx.beginPath()
  ctx.arc(200, 50, 20, 0, 2*Math.PI)
  ctx.fillStyle = 'black'
  ctx.fill()
  ctx.lineWidth = 2
  ctx.strokeStyle = '#003300'
  ctx.stroke()
   
  pack.forEach(ballPos => {
    ctx.beginPath()
    ctx.arc(ballPos.x, ballPos.y, 15, 0, 2 * Math.PI)
    ctx.fillStyle = 'white'
    ctx.fill()
    ctx.lineWidth = 2
    ctx.strokeStyle = '#003300'
    ctx.stroke()
  })
 
})

document.addEventListener('click', (e) => {
  //https://stackoverflow.com/questions/55677/how-do-i-get-the-coordinates-of-a-mouse-click-on-a-canvas-element
  //find mouse click x,y
  let x
  let y
  if (e.pageX || e.pageY) { 
    x = e.pageX
    y = e.pageY
  }
  else { 
    x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft 
    y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop 
  } 
  const mouseClickPos = {
    x: x -= canvas.offsetLeft,
    y: y -= canvas.offsetTop
  }

  socket.emit("mouseClick", mouseClickPos)
  
})



