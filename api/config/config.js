const path = require('path')
const rootPath = path.normalize(__dirname + '/..')

const config = {
    root: rootPath,
    port: process.env['PORT'] || 8443,
    dbUser: process.env['seraDb_username'],
    dbPassword: process.env['seraDb_password'],
    tlsPrivateKey: process.env['TLS_PRIVATE_KEY'] || "localhost.key",
    tlsCert: process.env['TLS_CERT'] || "localhost.crt",
    fasitNodesUrl: process.env['fasit:nodes_v2_url'] || 'https://fasit.adeo.no/api/v2/nodes',
    cocaUrl: process.env['costService_url'] || 'https://coca.adeo.no/api/v1/calculator/',
    // noraUrl: process.env['units_v1_url'] || 'https://nora.adeo.no/api/v1/units',
    noraUrl: 'https://nora.adeo.no/api/v1/units',
    influxUrl: process.env['influxdb_url'],
    influxUser: process.env['influxdb_username'],
    influxPassword: process.env['influxdb_password']
}

module.exports = config