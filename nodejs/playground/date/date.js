let date = new Date()

let year    = date.getUTCFullYear() - 2000  //year from 0-99
let month   = date.getUTCMonth() + 1        //months from 1-12
let day     = date.getUTCDate()
let hour    = date.getUTCHours()
let minutes = date.getUTCMinutes()
let seconds = date.getUTCSeconds()

console.log(year)
console.log(month)
console.log(day)
console.log(hour)
console.log(minutes)
console.log(seconds)