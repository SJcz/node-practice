
// totalTimes 的批处理模块, 通常当某个模块的异步函数, 在相同参数的情况下返回的结果大部分都相同时
// 可以通过批处理来提高该模块的效率, 进而提高服务的吞吐量.
// 批处理使用非常简单: 如果在调用 API 时有另一个相同的请求挂起，将把回调添加到队列中。当异步操作完成时，其队列中的所有回调将一次被调用

const totalTimes = require('./totalTimes');

const queues = {};
module.exports = function totalTimesBatch(chat, callback) {
    if (queues[chat]) {
        console.log(`已经存在一个异步, 将次请求放入批处理队列`);
        return queues[chat].push(callback);
    }
    queues[chat] = [];
    queues[chat].push(callback);

    totalTimes(chat, (err, times) => {
        queues[chat].forEach(cb => {
            cb(err, times);
        });
        queues[chat] = null;
    });
}
