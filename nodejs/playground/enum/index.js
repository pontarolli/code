// use it as module
const Enum = require('enum')

// define an enum with own values
const myEnum = new Enum({'A': 1, 'B': 2, 'C': 4})

//console.log(myEnum)
console.log(myEnum.A.value)
console.log(myEnum.A.key)