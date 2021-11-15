const socet = require('socket.io')
const http = require('http')
const path = require('path')
const fs = require('fs')

const server = http.createServer((req, res) => {
   const filePath = path.join(__dirname, './chat.html')
   const readStream = fs.createReadStream(filePath)
   readStream.pipe(res)
})

const getRandom = () => { // честно украл из интернета
   const adjs = ["autumn", "hidden", "bitter", "misty", "silent", "empty", "dry",
      "dark", "summer", "icy", "delicate", "quiet", "white", "cool", "spring"];

   const nouns = ["waterfall", "river", "breeze", "moon", "rain", "wind", "sea",
      "morning", "snow", "lake", "sunset", "pine", "shadow", "leaf", "dawn"];

   return adjs[Math.floor(Math.random() * (adjs.length - 1))] + " " + nouns[Math.floor(Math.random() * (nouns.length - 1))];
}

const io = socet(server)

io.on('connection', client => {

   const nickname = getRandom()

   client.broadcast.emit('new-user', nickname)
   client.emit('new-user', `${nickname} - будет твой ник`) // приветсвуем 

   client.on('client-msg', data => {
      const payload = {
         user: nickname,
         massage: data.massage
      }
      console.log(payload);
      client.broadcast.emit('server-msg', payload)
      client.emit('server-msg', payload)
   })

   client.on('disconnect', () => client.broadcast.emit('user-off', nickname))
})
server.listen(3001)