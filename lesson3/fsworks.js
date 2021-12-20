const fs = require("fs");
const { stdout } = require("process");
const readline = require("readline");

const FILE = "./access.log";
const sizeOfFILE = fs.statSync(FILE).size;
console.log(`Разбираем ${FILE} размером ${sizeOfFILE} байт…`);
const searchForAdresses = [
    "89.123.1.41",
    "34.48.240.111"
];
const resFileNames = searchForAdresses.map(address => `./${address}_requests.log`);
const inputStream = fs.createReadStream(FILE, {
    encoding: "utf-8",
    flags: "r",
    highWaterMark: 32 * 1048576
});
let readedSizeCounter = 0;
inputStream.on("data", chunk => {
    readedSizeCounter += chunk.length;
    stdout.cursorTo(0);
    stdout.write((readedSizeCounter * 100 / sizeOfFILE).toFixed(0) + "%");
});
inputStream.on("end", () => {
    stdout.cursorTo(0);
    console.log("Выполнено");
});
const outputStreams = resFileNames.map(filename => fs.createWriteStream(filename));
const byLine = readline.createInterface({ input: inputStream });
byLine.on("line", data => {
    searchForAdresses.forEach((addr, index) => {
        if (data.includes(addr)) outputStreams[index].write(data + "\n");
    });
});