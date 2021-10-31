const fs = require('fs')
const readLine = require('readline')

const path = './access.log'
const ip1 = '89.123.1.41'
const ip2 = '34.48.240.111'

const readStream = fs.createReadStream(path, {
   flags: 'r',
   encoding: 'utf-8'
})

const writeStream1 = fs.createWriteStream(`${ip1}_requests.log`, 'utf-8')
const writeStream2 = fs.createWriteStream(`${ip2}_requests.log`, 'utf-8')

const rl = readLine.createInterface({
   input: readStream,
   terminal: true
})

rl.on('line', (line) => {
   if (line.includes(ip1)) {
      writeStream1.write(line + '\n')
   }

   if (line.includes(ip2)) {
      writeStream2.write(line + '\n')
   }
})