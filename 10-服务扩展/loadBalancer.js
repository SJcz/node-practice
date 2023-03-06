const { Router } = require('express');
const http = require('http');
const consul = require('consul')();
const httpProxy = require('http-proxy');
const proxyServer = httpProxy.createProxyServer({});

const routing = [
    {
        path: '/api',
        service: 'api-service',
        index: 0
    },
    {
        path: '/',
        service: 'webapp-service',
        index: 0
    }
]

http.createServer((req, res) => {
    const route = routing.find(item => req.url.indexOf(item.path) === 0);
    console.log(route);
    consul.agent.service.list((err, services) => {
        const servers = [];
        console.log(services);
        Object.values(services).forEach(service => {
            if (service.Tags.includes(route.service)) servers.push(`http://${service.Address}:${service.Port}`)
        });
        if (!servers.length) return res.writeHead(502).end('Bad gateway');
        route.index = (route.index + 1) % servers.length;
        proxyServer.web(req, res, { target: servers[route.index]});
    });
}).listen(9090, () => {
    console.log('loadBalancer is runing in 9090');
})