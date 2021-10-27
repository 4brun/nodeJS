const moment = require('moment');
const EventEmitter = require('events')

const userData = process.argv[2] // час-день-месяц-год

// class Timer extends EventEmitter {
//    start(eventName, data) {
//       console.log('start');
//       this.emit(eventName, data)
//    }

//    end(eventName, cb) {
//       console.log('end');
//       this.on(eventName, cb)
//    }
// }

// const run = new Timer

const runTimer = async (time) => {
   const date = moment(time, 'HH DD MM YYYY')
   const now = moment()
   let diffTime

   if (now > date) {
      diffTime = now.diff(date)
   } else {
      diffTime = date.diff(now)
   }

   let duration = moment.duration(diffTime, 'milliseconds');
   const interval = 1000
   console.log(duration);
   setInterval(() => {
      if (duration.asMilliseconds() <= 0) {
         console.log("STOP!");
         clearInterval()
      }
      duration = moment.duration(duration.asMilliseconds() - interval, 'milliseconds');
      console.log(`Years: ${duration._data.years}, Months: ${duration._data.months}, Days: ${duration._data.days}, ${duration._data.hours}:${duration._data.minutes}:${duration._data.seconds}`);
   }, interval)
}

if (!userData) {
   console.log('Введите точку осчета в формате: "час-день-месяц-год"');
} else {
   runTimer(userData)
}