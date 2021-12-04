const isPrime = require('prime-number');
const colors = require('colors');

const [a, b] = process.argv.slice(2);
console.log(`Простые числа от ${a} до ${b}:`);

let ibeg = parseInt(a);
if (Number.isNaN(ibeg) || ibeg < 0) {
    console.error("Ошибка в параметрах: параметры должны быть натуральными числами.");
    return 1;
}
if (+a > ibeg) ibeg++;

const iend = parseInt(b);
if (Number.isNaN(iend) || iend < 0) {
    console.error("Ошибка в параметрах: параметры должны быть натуральными числами.");
    return 1;
}

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
if (counter === 0) console.log(colors.brightRed("нет простых чисел."));