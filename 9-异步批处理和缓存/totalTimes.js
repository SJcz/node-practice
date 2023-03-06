
// 计算文件内某个字符出现的总字数, 这个文件内容可能随时变更

// 该类模块的特点是异步操作耗时比较长, 可以想象成 DB 查询操作, redis 查询操作等等
// 如果我们正在调用这类模块的异步函数, 并且还有另一个同样的异步函数正在等待, 在相同查询参数的情况下, 两个异步的结果一定是相同的
// (除非有别的线程或者程序恰好在这两个异步的中间更改了数据库数据)
const fs = require('fs');
module.exports = function totalTimes(chat, callback) {
    const readStream = fs.createReadStream('./test.txt');
    let times = 0;
    readStream.on('data', (chunk) => {
        for (let i = 0; i < chunk.length; i++) {
            if (String.fromCharCode(chunk[i]) == chat) times++;
        }
    });
    readStream.on('end', () => {
        callback(null, times);
    });
    readStream.on('error', (err) => {
        callback(err);
    });
}
