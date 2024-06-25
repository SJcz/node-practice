const http = require('http');
// const cluster = require('cluster');
const consul = require('consul')();
const pid = process.pid;
const portfinder = require('portfinder');
const serviceType = process.argv[2];

portfinder.getPort((err, port) => {
    const serviceId = serviceType + '-' + port;   
    consul.agent.service.register({
        id: serviceId,
        port,
        address: 'localhost',
        name: serviceType,
        tags: [serviceType]
    }, () => {
        const unregisterService = (err) => {
            console.log(err);
            consul.agent.service.deregister(serviceId, () => {
                console.log(`service ${serviceId} exit`);
                process.exit(err ? 1 : 0);
            });
        }
        process.on('exit', unregisterService);
        process.on('SININT', unregisterService);
        process.on('uncaughtException', unregisterService);

        const server = http.createServer((req, res) => {
            for (let i = 1e7; i > 0; i--){}
            console.log(`Handling request from ${serviceId}`);
            res.end(`Hello from ${serviceId} \n`);
        });
        server.listen(port, () => {
            console.log(`start ${serviceType} pid=${pid} on port ${port}`);
        });
    })
});



