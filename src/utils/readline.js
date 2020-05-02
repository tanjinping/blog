const fs = require('fs');
const path = require('path');
const readLine = require('readline');

const fileName = path.join(__dirname, '../', '../', 'logs', 'access.log');

//创建 read stream
const readStream = fs.createReadStream(fileName);

//创建 readline 对象
const rl = readLine.createInterface({
    input: readStream
});

let chromeNumber = 0;//谷歌浏览器数量
let number = 0;//总行书

rl.on('line', lineDate => {
    if (!lineDate) {
        return;
    }
    number++;
    const arr = lineDate.split(' -- ');
    if (arr[2] && arr[2].indexOf('Chrome') > 0) {
        chromeNumber++;
    }
});
rl.on('close', () => {
    console.log(chromeNumber + '/' + number);
});
