const fs = require('fs')
const path = require('path');
const inquirer = require('inquirer');
let directory = process.cwd()

const isDirectory = dirname => {
   const stat = fs.lstatSync(dirname)
   return stat.isDirectory()
}

const fileList = dirname => fs.readdirSync(dirname)

const searhString = date => {
   inquirer.prompt([{
      name: 'searchString',
      type: 'input',
      message: ' Введите строку для поиска в файле: '
   }])
      .then(answer => {
         const index = date.indexOf(answer.searchString) // ищем строку в файле
         if (index !== -1) {
            console.log('Найдено: \n' + date.slice((index - 10), (index + 25)));
         } else {
            console.log("Ничего не найдено");
         }
      })
      .catch(error => console.log(error))
}

const getList = directory => inquirer.prompt([
   {
      name: 'filename',
      type: 'list',
      message: 'Выберете файл или папку для чтения: ',
      choices: fileList(directory)
   }
])
   .then(answer => {
      directory = path.resolve(directory, answer.filename) // перезаписываем путь для текущей дирректории

      if (isDirectory(directory)) {
         getList(directory) // запускаем рекурсию с новой дирректории
      } else {
         const date = fs.readFileSync(directory, 'utf-8')
         console.log(date) // выводим содержимое в консоль
         searhString(date) // запускаем поиск строки
      }
   })

getList(directory)