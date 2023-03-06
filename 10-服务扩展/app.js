const http = require('http');
const cluster = require('cluster');
const os = require('os');
const pid = process.pid;

// if (cluster.isMaster) {
//     const cpus = os.cpus();
//     for (let i = 0; i < cpus.length; i++) {
//         cluster.fork();
//     }
// } else {
//     const server = http.createServer((req, res) => {
//         for (let i = 1e7; i > 0; i--){}
//         console.log(`Handling request from ${pid}`);
//         res.end(`Hello from ${pid}\n`);
//     });
//     server.listen(8000, () => {
//         console.log('server is running');
//     });
// }

    



