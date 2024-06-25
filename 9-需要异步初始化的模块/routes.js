const asyncModuleWrapper = require('./asyncModuleWrapper');

module.exports.say = (req, res) => {
    asyncModuleWrapper.tellMeSomething((err, something) => {
        if (err) {
            return res.writeHead(500).end('Error' + err.message);
        }
        res.writeHead(200).end(something);
    })
}