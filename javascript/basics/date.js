var date = new Date('6/29/2011 4:52:48 PM UTC');
date.toString() // "Wed Jun 29 2011 09:52:48 GMT-0700 (PDT)"

console.log(date)
console.log(date.toString())

var utcDate = '2011-06-29T16:52:48.000Z';  // ISO-8601 formatted date returned from server
var localDate = new Date(utcDate);

console.log(localDate)

