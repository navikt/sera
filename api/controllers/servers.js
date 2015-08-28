var Server = require('../models/server')

exports.registerServers = function () {
  return function (req, res, next) {
    var servers = createServerObjects(req.body)

    Server.model.remove({}, function (err) {
      if (err) {
        throw new Error(err)
      } else {
        Server.model.collection.insert(servers, function (err, docs) {
          if (err) {
            console.error(err)
          } else {
            res.header('Content-Type', 'application/json; charset=utf-8')
            res.status(201)
            res.write(JSON.stringify(docs.ops))
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
      if (docs.length == 0) {
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
