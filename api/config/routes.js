module.exports = function (app) {
    var servers = require('../controllers/servers')
    var ny_servers = require('../controllers/ny_servers')
    var units = require('../controllers/units')
    var metrics = require('../controllers/metrics')

    app.post('/api/v1/ny_servers', ny_servers.registerServers())
    app.post('/api/v1/servers', servers.registerServers())
    app.get('/api/v1/servers', servers.getServers())
    app.delete('/api/v1/servers/:hostname', servers.deleteServers())
    app.delete('/api/v1/servers', servers.deleteServers())

    app.get('/api/v1/units', units.getUnits())
    app.get('/api/v1/units/:unitid', units.getUnits())
    app.put('/api/v1/units/:unitid', units.createUnit())
    app.delete('/api/v1/units/:unitid', units.deleteUnit())

    app.get('/metrics', metrics.getMetrics())
}
