const User = require('./schema')
const db = require('./database')

db()

const thenewcoolchris = new User({
  name: 'chris'
})

thenewcoolchris.save(function(err){
  if(err) throw err

  console.log("USER SAVED: " + thenewcoolchris.name)
})
