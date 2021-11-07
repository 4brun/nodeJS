const fs = require('fs')
const path = require('path');
const http = require('http')

let content = ``;

const isDirectory = dirname => {
   const stat = fs.lstatSync(dirname)
   return stat.isDirectory()
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

   res.end(content);
})

server.listen(3001);