var _ = require('lodash')
var Server = require('../models/servermongo')

exports.getMetrics = function () {
    return function (req, res, next) {
        Server.find({}, function (err, servers) {
            res.json({
                servers: {
                    count: servers.length
                }
            })
        })
    }
}