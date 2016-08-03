var path = require('path')
var rootPath = path.normalize(__dirname + '/..')

var config = {
    root: rootPath,
    port: process.env['PORT'] || 8443,
    dbUrl: process.env['seraDb_url'] || 'mongodb://localhost:27017/sera',
    dbUser: process.env['seraDb_username'] || 'sera',
    dbPassword: process.env['seraDb_password'] || 'sera',
    tlsPrivateKey: process.env['TLS_PRIVATE_KEY'] || "localhost.key",
    tlsCert: process.env['TLS_CERT'] || "localhost.crt",
    fasitNodesUrl: process.env['fasitnodes_url'] || 'https://fasit.adeo.no/conf/nodes',
    cocaUrl: process.env['coca_url'] || 'https://coca.adeo.no/api/v1/calculator/',
    noraUrl: process.env['nora_url'] || 'https://nora.adeo.no/api/v1/units'
}

module.exports = config