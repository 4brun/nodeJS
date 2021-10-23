const colors = require("colors/safe");

const num1 = process.argv[2]
const num2 = process.argv[3]
const myColors = [colors.red, colors.yellow, colors.green]
let counter = 0
let primeNum = true

if (isNaN(num1)) console.log(colors.red('Not a number'))

const simpleNumber = (num) => {
   if (num <= 1) return false

   for (let i = 2; i < num; i++)
      if (num % i === 0) return false
   return true
}

const chengeColor = () => {
   counter++
   if (counter > myColors.length - 1)
      counter = 0
}

const getMassage = (num) => {
   if (primeNum) primeNum = false
   console.log(myColors[counter](`${num}`));
   chengeColor()
}

for (let i = num1; i <= num2; i++) {
   if (simpleNumber(i)) getMassage(i)
}

