someNumber = 42.008;
someNumber = Math.round( someNumber * 1e2 ) / 1e2;
//someNumber === 42.01;

// if you need 3 digits, replace 1e2 with 1e3 etc.
// or just copypaste this function to your code:

function toFixedNumber(num, digits, base){
  var pow = Math.pow(base||10, digits);
  return Math.round(num*pow) / pow;
}