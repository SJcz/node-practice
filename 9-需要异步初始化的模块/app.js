const http = require('http');
const routes = require('./routes');
const asyncModuleWrapper = require('./asyncModuleWrapper');
asyncModuleWrapper.initialize(() => {
    console.log(`asyncModuleWrapper 初始化完成`)
})

const server = http.createServer((req, res) => {
    console.log(req.url, req.method);
    if (req.method === 'GET' && req.url === '/say') {
        return routes.say(req, res);
    }
    res.writeHead(404).end(`Not Found`)
});
server.listen(8080, () => {
    console.log(`server is running in 8080`);
})