module.exports = function (app) {
    var servers = require('../controllers/servers')
    var units = require('../controllers/units')

    app.post('/api/v1/servers', servers.registerServers())
    app.get('/api/v1/servers', servers.getServers())
    app.delete('/api/v1/servers/:hostname', servers.deleteServers())
    app.delete('/api/v1/servers', servers.deleteServers())

    app.get('/api/v1/units', units.getUnits())
    app.get('/api/v1/units/:unitid', units.getUnits())
    app.put('/api/v1/units/:unitid', units.createUnit())
    app.delete('/api/v1/units/:unitid', units.deleteUnit())
    //app.get('/test', units.test())

}
