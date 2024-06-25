const http = require('http');
const url = require('url');
const totalTimes = require('./totalTimes');
const totalTimesBatch = require('./totalTimesBatch');
const totalTimesCache = require('./totalTimesCache');

// 预先写入测试内容到文件
const fs = require('fs');
let content = '';
for (let i = 0; i < 1000000; i++) {
    content += '0123456789abcdefg';
}
fs.writeFileSync('./test.txt', content);

const server = http.createServer((req, res) => {
    const query = url.parse(req.url).query;
    if (req.method === 'GET' && req.url.match(/times\?chat=/)) {
        return totalTimesCache(query.split('=')[1], (err, times) => {
            if (err) {
                return res.writeHead(500).end(`Error` + err.message);
            }
            res.writeHead(200).end(`${times}`);
        });
    }
    res.writeHead(404).end(`Not Found`);
});
server.listen(8080, () => {
    console.log(`server is running in 8080`);
})