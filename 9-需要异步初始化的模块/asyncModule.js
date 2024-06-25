
// 一个需要初始化的异步模块, 可以类比成 一个 DB 连接模块, rpc 连接模块, redis 连接模块等等
// 这类模块的特点是都需要异步初始化, 但是整个初始化时长不定, 而使用这些模块的其他模块依赖于其初始化
// 而且根据实现细节的不通, 当整个模块在未初始化的情况下调用一些函数时, 可能出现不同的问题
// 1. 一个错误提示
// 2. 丢失重要信息
// 3. 引起应用程序崩溃
// 一般来说, 我们需要避免这种情况
// 很多时候, 一些失败的请求并不会引起任何关注, 或者说这些异步模块初始化非常快, 这些问题可能永远不会出现
// 但是对于高负载服务或者可扩展云服务而言, 这两个假设很容易不成立
const asyncModule = module.exports;

asyncModule.initialized = false;
asyncModule.initialize = callback => {
    setTimeout(() => {
        asyncModule.initialized = true;
        callback();
    }, 10000)
}

asyncModule.tellMeSomething = callback => {
    if (!asyncModule.initialized) {
        return callback(new Error('asyncModule 还未初始化完成'));
    }
    callback(null, `当前时间 = ${new Date()}`);
}