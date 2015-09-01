module.exports = function (app) {
    var servers = require('../controllers/servers')

    app.post('/api/v1/servers', servers.registerServers())
    app.get('/api/v1/servers', servers.getServers())
    app.delete('/api/v1/servers/:hostname', servers.deleteServers())
    app.delete('/api/v1/servers', servers.deleteServers())
}
