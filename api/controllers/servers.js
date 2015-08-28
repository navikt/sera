var Server = require('../models/server')

exports.registerServers = function () {
  return function (req, res, next) {
    var servers = createServerObjects(req.body)

    Server.model.remove({}, function (err) {
      if (err) {
        return next(err)
      } else {
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
    })
  }
}

exports.getServers = function () {
  return function (req, res, next) {
    Server.model.find({}, function (err, docs) {
      if (err) {
        return next(err)
      }

      res.header('Content-Type', 'application/json; charset=utf-8')
      res.status(200)
      res.write(JSON.stringify(docs))
      res.send()
    })
  }
}

exports.getServer = function () {
  return function (req, res, next) {
    Server.model.find({hostname: req.params.hostname}, function (err, docs) {
      if (err) {
        return next(err)
      }

      if (docs.length === 0) {
        res.status(404)
        res.send()
      } else {
        res.header('Content-Type', 'application/json; charset=utf-8')
        res.status(200)
        res.write(JSON.stringify(docs))
        res.send()
      }
    })
  }
}

var createServerObjects = function (objects) {
  return objects.map(function (obj) {
    return Server.create(obj)
  })
}
