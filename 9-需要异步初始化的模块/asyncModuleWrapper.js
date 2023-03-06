// asyncModule 的代理模块, 因为通常来说, 我们不太可能去修改需要异步初始化的模块(无论这个模块是第三方包还是其他人负责的模块)
// 因此我们需要去创建一个外围的代理模块来实现我们的需求
// 整个原理是在异步模块未初始化完成时, 使用队列缓存请求, 在初始化完成后, 再依次执行缓存的请求
// 使用 状态模式 实现.

const asyncModule = require('./asyncModule');
const asyncModuleWrapper = module.exports;

asyncModuleWrapper.initialized = false;

let pending = [];

// 未初始化完成的状态
const notInitializedState = {
    initialize: callback => {
        asyncModule.initialize(() => {
            asyncModuleWrapper.initialized = true; // 记录异步模块已初始化完毕
            activeState = initializedState; // 更改当前 state 为已经初始化的状态
            pending.forEach(req => {
                activeState[req.method].apply(activeState, req.arguments);
            });
            pending = [];
            callback();
        });
    },
    tellMeSomething: function() {
        pending.push({
            method: 'tellMeSomething',
            arguments: arguments
        });
    }
}

// 已初始化完成的状态
const initializedState = asyncModule;

asyncModuleWrapper.initialize = function() {
    console.log(arguments)
    activeState.initialize.apply(activeState, arguments);
}
asyncModuleWrapper.tellMeSomething = function() {
    activeState.tellMeSomething.apply(activeState, arguments);
}

let activeState = notInitializedState;

