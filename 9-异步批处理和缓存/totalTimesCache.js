// totalTimesBatch 的缓存模块
// 请求批处理模式的一个问题是，API越快，我们获得的批量请求就越少, 可以认为，如果一个API已经很快，那么尝试用批处理优化它就没有意义了
// 然而，它仍然是应用程序的资源负载的一个因素
//
// 另外一个更有效的因素是缓存模式
// 一旦某个请求完成，我们将其结果存储在缓存中，缓存可以是变量，如数据库中的条目或专门的缓存服务器。因此，下次调用API时，可以从缓存中立即检索结果，而不是产生另一个请求
// 当然我们应该使用已经更新进的缓存机制
// 比如 LRU 来确保恒定的存储使用率
// 比如 redis 来处理不同服务或者进程共享存储

const totalTimes = require('./totalTimes');

const queues = {};
const cache = {};
module.exports = function totalTimesCache(chat, callback) {
    if (cache[chat]) {
        console.log(`击中 chat=${chat} 缓存`);
        // return callback(null, cache[chat]);
        return process.nextTick(callback.bind(null, null, cache[chat]));
    }
    if (queues[chat]) {
        console.log(`已经存在一个异步, 将次请求放入批处理队列`);
        return queues[chat].push(callback);
    }
    queues[chat] = [];
    queues[chat].push(callback);

    totalTimes(chat, (err, times) => {
        if (!err) {
            cache[chat] = times;
            console.log(`设置 chat=${chat} 缓存`);
            setTimeout(() => {
                delete cache[chat];
                console.log(`缓存 chat=${chat} 过期删除`);
            }, 30 * 1000)
        }
        queues[chat].forEach(cb => {
            cb(err, times);
        });
        queues[chat] = null;
    });
}