var _ = require('lodash')
var jsonToCSV = require('json-csv')
var ServerDefinition = require('../models/server')
var ServerMongoModel = require('../models/servermongo')
var calculateServerCost = require('./costcalculator')

exports.registerServers = function () {
    return function (req, res, next) {
        var body = validateRequest(req.body)
        var servers = createServerObjects(body)

        ServerMongoModel.collection.insert(servers, function (err, docs) {
            if (err) {
                return next(err)
            } else {
                res.status(201)
                res.send(docs.ops.length + ' servers created')
            }
        })
    }
}

exports.getServers = function () {
    return function (req, res, next) {
        ServerMongoModel.find(createMongoQueryFromRequest(req.query), function (err, servers) {
            if (err) return next(err)
            servers = JSON.parse(JSON.stringify(servers)) // doc -> json

            Unit.find({}, function (err, units) {
                var serversWithUnit = enrichWithUnit(servers, units);
                var serversWithCostAndUnit = serversWithUnit.map(calculateServerCost)

                if (req.query.csv === 'true') {
                    returnCSVPayload(serversWithCostAndUnit, res)
                } else {
                    res.header('Content-Type', 'application/json; charset=utf-8')
                    res.json(serversWithCostAndUnit)
                }
            })
        })
    }
}

exports.deleteServers = function () {
    return function (req, res, next) {
        var query = (req.params.hostname) ? {hostname: req.params.hostname} : {}

        ServerMongoModel.remove(query, function (err) {
            if (err) {
                return next(err)
            } else {
                res.sendStatus(204)
            }
        })
    }
}

var enrichWithUnit = function(servers, units){
    return servers.map(function(server){
        server['unit'] = '' // always set unit to something, enrich with actual unitname if match is found

        var application = server.application;
        if (!application) {
            return server
        }
        units.forEach(function (unit) {
            if (unit.applications.indexOf(application) > -1) {
                server['unit'] = unit.name
                return server
            }
        })

        return server
    });
}

var validateRequest = function (request) {
    var validate = require('jsonschema').validate
    var ServerJsonSchema = require('../models/serverschema')
    var validation = validate(request, ServerJsonSchema)

    if (validation.errors.length > 0) {
        throw new Error('JSON schema validation failed with the following errors: ' + validation.errors)
    }

    return request
}

var createMongoQueryFromRequest = function (request) {
    var query = {}

    for (var queryParam in request) {
        if (queryParam in ServerDefinition) {
            if (ServerDefinition[queryParam].type === Number) {
                query[queryParam] = request[queryParam]
            } else {
                query[queryParam] = new RegExp(request[queryParam], 'i')
            }
        } else {
            continue
        }
    }

    return query
}

var createServerObjects = function (objects) {
    var createFromRequestObject = function (object) {
        var server = {}
        _.forIn(ServerDefinition, function (value, key) {
            var incomingValue = object[key]
            if (incomingValue) {
                if (ServerDefinition[key].schemaType === 'string') {
                    incomingValue = incomingValue.toLowerCase()
                }
                server[key] = incomingValue
            }
        })
        return server
    }

    return objects.map(function (obj) {
        return createFromRequestObject(obj)
    })
}

var returnCSVPayload = function (servers, res) {
    var createCSVMapping = function (servers) {
        var createMappingObject = function (item) {
            var mappingObjectArray = []
            for (var key in item) {
                mappingObjectArray.push({name: key, label: key})
            }
            return mappingObjectArray
        }

        return {fields: createMappingObject(servers[0])}
    }

    jsonToCSV.csvBuffered(servers, createCSVMapping(servers), function (err, csv) {
        if (err) {
            res.statusCode = 500
            throw new Error(err)
        }
        res.header('Content-Type', 'text/plain; charset=utf-8')
        res.send(csv)
    })
}
