const path = require('path')
const rootPath = path.normalize(__dirname + '/..')
const localVars = require('../../localvars.json')

const config = {
    root: rootPath,
    port: process.env['PORT'] || 80,
    dbUrlTest: 'mongodb://localhost:27017/test',
    dbUrl: process.env['SERADB_URL'] || localVars.dbUrl,
    dbUser: process.env['SERADB_USERNAME'] || localVars.dbUser,
    dbPassword: process.env['SERADB_PASSWORD'] || localVars.dbPassword,
    fasitNodesUrl: process.env['FASIT_NODES_V2_URL'] || 'https://fasit.adeo.no/api/v2/nodes',
    cocaUrl: localVars.cocaUrl || 'http://coca/api/v2/calculator/',
    noraUrl: localVars.noraUrl || 'http://nora/api/v1/units',
    influxUrl: 'http://influxdb.adeo.no:8086',
    influxUser: process.env['INFLUXDB_USERNAME'] || localVars.influxUser,
    influxPassword: process.env['INFLUXDB_PASSWORD'] || localVars.influxPassword,
    orchestratorUrl: process.env['ORCPRODSERVICE'] || 'https://orcprod.adeo.no:443/vco/api/',
    workflowID: process.env['WORKFLOWID'] || 'ID=4e70e990-7096-4f00-b811-a2f35a8de726',
    srvseraUser: process.env['SRVSERA_USERNAME'] || localVars.srvseraUser,
    srvseraPassword: process.env['SRVSERA_PASSWORD'] || localVars.srvseraPassword
}

module.exports = config