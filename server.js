const express = require("express")
const app = express()
app.use("/client", express.static("client"))
const http = require("http").createServer(app)

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/client/index.html")
})

http.listen(3000, function() {
  console.log("listening on *:3000")
})
