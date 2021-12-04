const isPrime = require('prime-number');
const colors = require('colors');

const [a, b] = process.argv.slice(2);
console.log(`Простые числа от ${a} до ${b}:`);
let ibeg = parseInt(a);
if (+a > ibeg) ibeg++;
const iend = parseInt(b);
let counter = 0;

for (let i = ibeg; i < iend; i++) {
    if (isPrime(i)) {
        if (counter % 3 === 0) {
            console.log(colors.brightRed(i));
        } else if (counter % 3 === 1) {
            console.log(colors.brightYellow(i));
        } else if (counter % 3 === 2) {
            console.log(colors.brightGreen(i));
        } 
        counter++;
    }
}
if (counter === 0) console.log(`нет простых чисел.`);