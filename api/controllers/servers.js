var Server = require('../models/server')

exports.registerServers = function () {
    return function (req, res, next) {
        var servers = createServerObjects(req.body)

        Server.model.collection.insert(servers, function (err, docs) {
            if (err) {
                return next(err)
            } else {
                res.status(201)
                res.write(docs.ops.length + ' servers created')
                res.send()
            }
        })
    }
}

exports.getServers = function () {
    return function (req, res, next) {
        Server.model.find({hostname: req.query.hostname}, function (err, docs) {
            if (err) {
                return next(err)
            } else if (docs.length === 0) {
                res.status(404)
                res.send()
            } else {
                res.header('Content-Type', 'application/json; charset=utf-8')
                res.status(200)
                res.send(JSON.stringify(docs))
            }
        })
    }
}

exports.deleteServers = function () {
    return function (req, res, next) {
        var hostname = req.query.hostname;
        Server.model.remove({hostname: hostname}, function (err) {
            if (err) {
                return next(err)
            } else {
                res.sendStatus(204)
            }
        })
    }
}

var createServerObjects = function (objects) {
    return objects.map(function (obj) {
        return Server.create(obj)
    })
}
