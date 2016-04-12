module.exports = function (app) {
    var servers = require('../controllers/servers')
    var metrics = require('../controllers/metrics')

    app.post('/api/v1/servers', servers.registerServers())
    app.get('/api/v1/servers', servers.getServers())

    app.get('/metrics', metrics.getMetrics())
}
