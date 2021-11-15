const fs = require('fs')
const path = require('path');
const http = require('http')
const socket = require('socket.io')
const worker_threads = require('worker_threads')

let content = ``;
let clients = 0;

const isDirectory = dirname => {
   const stat = fs.lstatSync(dirname)
   return stat.isDirectory()
}

const searchString = async (data) => {
   return new Promise((res, rej) => {
      const worker = new worker_threads.Worker('./worker.js', {
         workerData: data
      })

      worker.on('message', res)
      worker.on('error', rej)
   })
}

const getResult = async (data) => {
   let result = await searchString(data)
   console.log('result', result) // тут всё норм, возвращает строку, всё ок
   return result
}

const server = http.createServer((req, res) => {
   if (req.url === "/favicon.ico") { // долго мучался, почему то падало всё из за этого favicon.ico
      res.writeHead(200, {
         "Content-Type": "image/x-icon",
         "Cache-Control": "max-age=31536000",
      });
      res.end();
      return;
   }
   res.writeHead(200, {
      "Content-Type": "text/html"
   });

   let somePath = req.url !== "" ? req.url : "";
   const fullPath = path.resolve(process.cwd(), somePath);

   if (!isDirectory(fullPath)) {
      content = fs.readFileSync(fullPath, "utf-8");
   } else {
      const list = fs.readdirSync(fullPath);
      let prep = req.url;
      let up = "";

      if (prep.length > 1) {
         prep += "/";
         const backUrl = "/" + prep.split("/").slice(1, -2).join("/");
         up = `<li><a href=${backUrl}>..</a></li>`;
      }

      content = `<ul>${up}`;
      for (let i = 0; i < list.length; i++) {
         content += `<li><a href=${prep}${list[i]}>${list[i]}</a></li>`
      }
      content += `</ul>`
   }
   finalContent = fs.readFileSync(path.join(__dirname, 'fileMan.html'), 'utf-8')
      .replace('##dir', content);
   res.end(finalContent);
})

const io = socket(server)

io.on('connection', client => {
   clients++
   client.broadcast.emit('new-user', clients)
   client.emit('new-user', clients)
   client.on('disconnect', () => {
      clients--
      client.broadcast.emit('user-off', clients)
   })
   client.on('client-search', (data) => {
      const result = getResult(data)

      client.emit('server-msg', result) // Почему то возвращает Promise { <pending> }
   })
})
server.listen(3002);