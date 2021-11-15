const worker_threads = require('worker_threads')

let result = ''
const { file, string } = worker_threads.workerData

const index = file.indexOf(string) // ищем строку в файле

if (index !== -1) {
   result = file.slice((index - 10), (index + 25))
} else {
   result = `Ничего не найдено`
}
worker_threads.parentPort.postMessage(result)