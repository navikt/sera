module.exports = function (app) {
    const servers = require('../controllers/servers');
    const metrics = require('../controllers/metrics');
    const timestamp = require('../controllers/timestamp');

    app.post('/api/v1/servers', servers.registerServers());
    app.get('/api/v1/servers', servers.getServers());

    app.get('/metrics', metrics.getMetrics());
    app.get('/isalive', metrics.isAlive());

    //datakvalitet
    app.get('/api/v1/hoursSinceLastUpdate', timestamp.getHoursSinceLastDbUpdate());

    //for testing
    app.post('/api/v1/timestamp', timestamp.createTimestamp());
    app.delete('/api/v1/timestamp', timestamp.deleteTimestamp());
    app.get('/api/v1/timestamp', timestamp.getTimestamp());
};
