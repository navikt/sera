var request = require('request')
var _ = require('lodash')
var ServerMongoModel = require('../models/servermongo')



exports.registerServers = function () {
    return function (req, res, next) {
        var validation = schemaValidateRequest(req.body)
        if (validation.errors.length > 0) {
            return res.status(400).send('JSON schema validation failed with the following errors: ' + validation.errors)
        }
        console.log("Received elements in request: ", req.body.length)
        enrichElements(req.body)
        res.sendStatus(201, "cheers")
    }
}

var schemaValidateRequest = function (request) {
    var validate = require('jsonschema').validate
    var ServerJsonSchema = require('../models/serverschema')
    return validate(request, ServerJsonSchema)
}

function enrichElements(incomingDataElements) {

    // Requesting all Node elements from Fasit
    request({url: 'http://fasit.adeo.no/conf/nodes/',headers: {'Accept': 'application/json'}}, function (err, res, body) {
        if (err) {
            return console.error("Unable to retrieve data from Fasit", err)
        } else {
            var fasitData = JSON.parse(body)
            console.log("Got data from fasit")

            var fasitEnrichedElements = incomingDataElements.map(function (incomingDataElement){
                var fasitElement = fasitData.filter(function (fasitElement){
                    return fasitElement.hostname === incomingDataElement.hostname
                })
                if (!(fasitElement.length == 0)){
                    incomingDataElement.application = fasitElement[0].applicationMappingName;
                    incomingDataElement.environmentName = fasitElement[0].environmentName;
                    return incomingDataElement
                } else if (!incomingDataElement.application){
                    incomingDataElement.application = "n/a"
                } else if (!incomingDataElement.environmentName){
                    incomingDataElement.environmentName = "n/a"
                }
                return incomingDataElement
            })
            console.log("Enriched elements with data from Fasit: ", fasitEnrichedElements.length)

            // Requesting calculations for all items from Coca
            var cocaRequestData = buildCocaRequest(fasitEnrichedElements)
            request({
                method: "POST",
                url: "http://localhost:8444/api/v1/calculator/",
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(cocaRequestData)
            }, function (err, res, body){
                if (err){
                    return console.error("Unable to retrieve data from Coca", err)
                } else {
                    console.log("Got data from Coca")
                    var cocaData = JSON.parse(body)
                    var cocaEnrichedElements = fasitEnrichedElements.map(function (fasitEnrichedElement, index) {
                        fasitEnrichedElement.calculations = cocaData[index].calculations
                        return fasitEnrichedElement
                    })
                    console.log("Enriched elements with data from Coca: ", cocaEnrichedElements.length)

                    // Requesting Application to Organization mapping from NORA
                    request({url: 'http://nora.adeo.no/api/v1/units',headrs: {'Accept': 'application/json'}}, function (err, res, body){
                        if (err){
                            return console.error("Unable to retrieve data from Nora", err)
                        } else {
                            console.log("Got data from Nora")
                            var units = JSON.parse(body)
                            var noraEnrichedElements = cocaEnrichedElements.map(function (cocaEnrichedElement) {
                                cocaEnrichedElement['unit'] = '' // always set unit to something, enrich with actual unitname if match is found

                                var application = cocaEnrichedElement.application;
                                if (!application) {
                                    return cocaEnrichedElement
                                }
                                units.forEach(function (unit) {
                                    if (unit.applications.indexOf(application) > -1) {
                                        cocaEnrichedElement['unit'] = unit.name
                                        return cocaEnrichedElement
                                    }
                                })

                                return cocaEnrichedElement
                            });
                            console.log("Enriched elements with data from Nora: ", noraEnrichedElements.length)

                            // Clear Sera Database
                            ServerMongoModel.remove({}, function (err) {
                                if (err) {
                                    console.log("Unable to clear Sera Database:", err)
                                } else {
                                    console.log("Sera Database cleared")
                                }
                            })
                            // Save elements to database
                            ServerMongoModel.collection.insert(noraEnrichedElements, function (err, docs) {
                                if (err) {
                                    console.log(err.message)
                                } else {
                                    console.log(docs.ops.length + ' servers created')
                                }
                            })
                        }

                    })

                }

            })
        }
    })
}
var buildCocaRequest = function (elements){
    var returnTypeFromOS = function (os) {
        if (os.match(/2008/g)){
            return 'win2008'
        } else if (os.match(/2012/g)){
            return 'win2012'
        } else if (os.match(/red hat/g || os.match(/rhel/g))){
            return 'rhel6'
        } else {
            return 'appliance'
        }
    };
    return elements.map(function (element){
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
        if (_.contains(itcamEnvironments, element.environmentName)){
            costElement.scapm = true
        }
        return costElement



    })
}