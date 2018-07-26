module.exports = function (app) {
    const servers = require('../controllers/servers')
    const csv = require('../controllers/csvExport')
    const metrics = require('../controllers/metrics')
    const timestamp = require('../controllers/timestamp')
    const selftest = require('../selftest/selftest')
    const refresh = require('../controllers/refresh')


    // app.post('/api/v1/servers', )∕

    app.post('/api/v1/servers', servers.postServers())
    app.get('/api/v1/servers', servers.getServers())
    app.get('/api/v1/csv', csv.getCSV())

    app.get('/api/v1/refresh', refresh.refresh())

    // app.get('/selftest', selftest.selftest())

    //datakvalitet
    app.get('/api/v1/hoursSinceLastUpdate', timestamp.getHoursSinceLastDbUpdate())

    //for testing
    // app.post('/api/v1/timestamp', timestamp.createTimestamp())
    // app.delete('/api/v1/timestamp', timestamp.deleteTimestamp())
    // app.get('/api/v1/timestamp', timestamp.getTimestamp())
}
