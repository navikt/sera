const path = require('path')
const rootPath = path.normalize(__dirname + '/..')
const localVars = require('../../localvars')

const config = {
    root: rootPath,
    port: 80,
    dbUrlTest: 'mongodb://localhost:27017/test',
    dbUrl: process.env['SERADB_URL'] || localVars.dbUrl,
    dbUser: process.env['SERADB_USERNAME'] || localVars.dbUser,
    dbPassword: process.env['SERADB_PASSWORD'] || localVars.dbPassword,
    fasitNodesUrl: process.env['FASIT:NODES_V2_URL'] || 'https://fasit.adeo.no/api/v2/nodes',
    cocaUrl: process.env['COSTSERVICE_URL'] || 'https://coca.adeo.no/api/v1/calculator/',
    // noraUrl: process.env['units_v1_url'] || 'https://nora.adeo.no/api/v1/units',
    noraUrl: 'https://nora.adeo.no/api/v1/units',
    influxUrl: process.env['INFLUXDB_URL'] || localVars.influxUrl,
    influxUser: process.env['INFLUXDB_USERNAME'] || localVars.influxUser,
    influxPassword: process.env['INFLUXDB_PASSWORD'] || localVars.influxPassword,
    orchestratorUrl: process.env['ORCPRODSERVICE'] || 'https://orcprod.adeo.no:443/vco/api/',
    workflowID: process.env['WORKFLOWID'] || 'ID=4e70e990-7096-4f00-b811-a2f35a8de726',
    srvseraUser: process.env['SRVSERA_USERNAME'] || localVars.srvseraUser,
    srvseraPassword: process.env['SRVSERA_PASSWORD'] || localVars.srvseraPassword
}

module.exports = config