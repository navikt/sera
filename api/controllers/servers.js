const request = require('request')
const _ = require('lodash')
const jsonToCSV = require('json-csv')
const mongoose = require('mongoose')
const ServerMongoModel = require('../models/servermongo')
const ServerDefinition = require('../models/server')
const timestamp = require('../controllers/timestamp')
const influx = require('./influx')
const mongo = require('./mongo')
const config = require('../config/config')
const logger = require('../logger')


exports.registerServers = function () {
    return function (req, res, next) {
        var validation = schemaValidateRequest(req.body)
        if (validation.errors.length > 0) {
            return res.status(400).send('JSON schema validation failed with the following errors: ' + validation.errors)
        }
        logger.info("Received elements in request: ", req.body.length)
        enrichElements(req.body, res)
    }
}

exports.getServers = function () {
    return function (req, res, next) {
        ServerMongoModel.find(createMongoQueryFromRequest(req.query), function (err, servers) {
            if (err) return next(err)

            servers = JSON.parse(JSON.stringify(servers)) // doc -> json

            if (req.query.csv === 'true') {
                returnCSVPayload(servers, res)
            } else {
                res.header('Content-Type', 'application/json; charset=utf-8')
                res.json(servers)
            }
        })
    }
}

var schemaValidateRequest = function (request) {
    var validate = require('jsonschema').validate
    var ServerJsonSchema = require('../models/serverschema')
    return validate(request, ServerJsonSchema)
}

function enrichElements(incomingDataElements, incomingDataResponse) {
    incomingDataElements.forEach(function (incomingDataElement) {
        if (incomingDataElement.Notes2) {
            incomingDataElement.notes = incomingDataElement.Notes2 // change key Notes to notes
            delete incomingDataElement.Notes2
        } else if (incomingDataElement.Notes) {
            incomingDataElement.notes = incomingDataElement.Notes // change key Notes2 to notes
            delete incomingDataElement.Notes
        }
    })

    // Requesting all Node elements from Fasit
    request({url: config.fasitNodesUrl, headers: {'Accept': 'application/json'}}, function (err, res, body) {
        if (err) {
            return console.error("Unable to retrieve data from Fasit", err)
        } else {
            var fasitData = JSON.parse(body)
            logger.info("Got data from fasit")

            var fasitEnrichedElements = incomingDataElements.map(function (incomingDataElement) {
                var fasitElement = fasitData.filter(function (fasitElement) {
                    return fasitElement.hostname === incomingDataElement.hostname
                })
                if (!(fasitElement.length == 0)) {
                    incomingDataElement.application = fasitElement[0].applicationMappingName;
                    incomingDataElement.environmentName = fasitElement[0].environmentName;
                    return incomingDataElement
                } else if (!incomingDataElement.application) {
                    incomingDataElement.application = "n/a"
                } else if (!incomingDataElement.environmentName) {
                    incomingDataElement.environmentName = "n/a"
                }
                return incomingDataElement
            })
            logger.info("Enriched elements with data from Fasit: ", fasitEnrichedElements.length)

            // Requesting calculations for all items from Coca
            var cocaRequestData = buildCocaRequest(fasitEnrichedElements)

            request({
                method: "POST",
                url: config.cocaUrl,
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(cocaRequestData)
            }, function (err, res, body) {
                if (err) {
                    return logger.error("Unable to retrieve data from Coca", err)
                } else {
                    logger.info("Got data from Coca")
                    var cocaData = JSON.parse(body)
                    var cocaEnrichedElements = fasitEnrichedElements.map(function (fasitEnrichedElement, index) {
                        fasitEnrichedElement.calculations = cocaData[index].calculations
                        return fasitEnrichedElement
                    })
                    logger.info("Enriched elements with data from Coca: ", cocaEnrichedElements.length)

                    // Requesting Application to Organization mapping from NORA
                    request({url: config.noraUrl, headers: {'Accept': 'application/json'}}, function (err, res, body) {
                        if (err) {
                            return logger.error("Unable to retrieve data from Nora", err)
                        } else {
                            logger.info("Got data from Nora")
                            var units = JSON.parse(body)
                            var noraEnrichedElements = cocaEnrichedElements.map(function (cocaEnrichedElement) {
                                var application = cocaEnrichedElement.application
                                if (!application) {
                                    cocaEnrichedElement.unit = 'n/a'
                                    return cocaEnrichedElement
                                }
                                units.forEach(function (unit) {
                                    if (unit.applications.indexOf(application) > -1) {
                                        cocaEnrichedElement.unit = unit.name
                                        return cocaEnrichedElement
                                    }
                                })
                                return cocaEnrichedElement
                            });
                            logger.info("Enriched elements with data from Nora: ", noraEnrichedElements.length)
                            influx.fetchData(noraEnrichedElements, mongo.updateDatabase, incomingDataResponse)
                       }
                    })
                }
            })
        }
    })
}
var buildCocaRequest = function (elements) {
    var returnTypeFromOS = function (os) {
        if (os.match(/2008/g)) {
            return 'win2008'
        } else if (os.match(/2012/g)) {
            return 'win2012'
        } else if (os.match(/red hat/g || os.match(/rhel/g))) {
            return 'rhel6'
        } else {
            return 'appliance'
        }
    };
    return elements.map(function (element) {
        var costElement = {}
        costElement.cpu = element.cpu;
        costElement.memory = element.memory;
        costElement.environment = element.environmentClass;
        var validTypes = ['jboss', 'was', 'was_dmgr', 'bpm', 'bpm_dmgr', 'liberty', 'wildfly']
        if (_.contains(validTypes, element.type)) {
            costElement.type = element.type;
        } else {
            costElement.type = returnTypeFromOS(element.os)
        }

        if (element.custom) {
            costElement.classification = "custom";
        } else {
            costElement.classification = "standard";
        }

        var itcamEnvironments = ['p', 'q0', 'q1', 'q3', 't3']
        if (_.contains(itcamEnvironments, element.environmentName)) {
            costElement.scapm = true
        }
        return costElement


    })
}

var returnCSVPayload = function (servers, res) {
    // dynamically create CSV mapping object (csv-header) based on js-object
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

