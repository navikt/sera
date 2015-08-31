var path = require('path')
var rootPath = path.normalize(__dirname + '/..')

var config = {
  root: rootPath,
  port: process.env['PORT'] || 6969,
  dbUrl: process.env['seraDb_url'] || 'mongodb://localhost:27017/servers',
  dbUser: process.env['seraDb_username'] || 'sera',
  dbPassword: process.env['seraDb_password'] || 'sera'
}

module.exports = config
