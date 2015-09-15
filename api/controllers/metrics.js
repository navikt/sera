var _ = require('lodash')
var Unit = require('../models/unitmongo')
var Server = require('../models/servermongo')

exports.getMetrics = function () {
    return function (req, res, next) {
        Unit.find({}, function (err, units) {
            Server.find({}, function (err, servers) {
                res.json({
                    units: {
                        count: units.length
                    },
                    servers: {
                        count: servers.length
                    }
                })
            })
        })
    }
}