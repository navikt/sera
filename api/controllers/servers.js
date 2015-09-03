var Server = require('../models/server')
var _ = require('lodash')
var calculateServerCost = require('./costcalculator')
var jsonToCSV = require('json-csv');

exports.registerServers = function () {
    return function (req, res, next) {
        var servers = createServerObjects(req.body)

        Server.model.collection.insert(servers, function (err, docs) {
            if (err) {
                return next(err)
            } else {
                res.status(201)
                res.send(docs.ops.length + ' servers created')
            }
        })
    }
}

var returnCSVPayload = function (servers, res) {
    jsonToCSV.csvBuffered(servers, jsonToCSVMapping, function (err, csv) {
        if (err) {
            res.statusCode = 500;
            throw new Error(err);
        }
        res.header("Content-Type", "text/plain; charset=utf-8");
        res.send(csv);
    });
}

exports.getServers = function () {
    return function (req, res, next) {
        Server.model.find(createMongoQueryFromRequest(req.query), function (err, servers) {
            if (err) {
                return next(err)
            }

            var serversWithCost = enrichWithCost(servers);

            if (req.query.csv === 'true') {
                returnCSVPayload(serversWithCost, res)
            } else {
                res.header('Content-Type', 'application/json; charset=utf-8')
                res.json(serversWithCost)
            }
        })
    }
}

exports.deleteServers = function () {
    return function (req, res, next) {
        var query = (req.params.hostname) ? {hostname: req.params.hostname} : {}

        Server.model.remove(query, function (err) {
            if (err) {
                return next(err)
            } else {
                res.sendStatus(204)
            }
        })
    }
}

var createMongoQueryFromRequest = function (request) {
    var numbers = ['cpu', 'disk', 'memory']
    var excluded = ['csv']
    var query = {}

    for (var queryParam in request) {
        if (excluded.indexOf(queryParam) > -1) {
            continue;
        } else if (numbers.indexOf(queryParam) > -1) { // if numeric value we do exact match
            query[queryParam] = request[queryParam]
        } else {
            query[queryParam] = new RegExp(request[queryParam], 'i')
        }
    }

    return query
}

var createServerObjects = function (objects) {
    return objects.map(function (obj) {
        return Server.create(obj)
    })
}


var enrichWithCost = function (docs) {
    docs = JSON.parse(JSON.stringify(docs))
    var docsWithCost = docs.map(calculateServerCost)

    return docsWithCost
}

var jsonToCSVMapping = {
    fields: [
        {name: "hostname", label: "hostname"},
        {name: "environment", label: "environment"},
        {name: "environmentClass", label: "environmentClass"},
        {name: "application", label: "application"},
        {name: "ipAddress", label: "ipAddress"},
        {name: "type", label: "type"},
        {name: "owner", label: "owner"},
        {name: "cpu", label: "cpu"},
        {name: "disk", label: "disk"},
        {name: "memory", label: "memory"},
        {name: "notes", label: "notes"},
        {name: "os", label: "os"},
        {name: "site", label: "site"},
        {name: "custom", label: "custom"},
        {name: "srm", label: "srm"},
        {name: "cost.cpu", label: "cost.cpu"},
        {name: "cost.memory", label: "cost.memory"},
        {name: "cost.disk", label: "cost.disk"},
        {name: "cost.os", label: "cost.os"},
        {name: "cost.mw", label: "cost.mw"},
        {name: "cost.itcam", label: "cost.itcam"},
        {name: "cost.baseCost", label: "cost.baseCost"},
        {name: "cost.total", label: "cost.total"}
    ]
};