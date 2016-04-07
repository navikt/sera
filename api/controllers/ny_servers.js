var request = require('request')


exports.registerServers = function () {
    return function (req, res, next) {
        var validation = schemaValidateRequest(req.body)
        if (validation.errors.length > 0) {
            return res.status(400).send('JSON schema validation failed with the following errors: ' + validation.errors)
        }

        function getFasitNodes(element){
            function fasitCallback (err, res, body){
                if (err) {
                    return console.error(err)
                } else {
                    var fasitData = JSON.parse(body)
                    console.log(fasitData[0])
                }
            }

            var request_options = {
                url: 'http://fasit.adeo.no/conf/nodes/',
                headers: {'Accept': 'application/json'}
            }
            request(request_options, fasitCallback(err, res, body));
/*
        var totalElementsCount = req.body.length
        var enrichedElements = [];

        function enrichElementWithData(element, enrichedElements, totalElementsCount) {
            var serviceCallCount = 0;
            var serviceCalls = 2;

            function getFasitData(element) {
                var request_options = {
                    url: 'http://fasit.adeo.no/conf/nodes/' + element.hostname,
                    headers: {'Accept': 'application/json'}
                }
                request(request_options, function (err, res, body) {
                    if (err) {
                        return console.error(err)
                    } else {
                        if (!body.match(/Node/g)) {
                            var fasitData = JSON.parse(body)
                            element.application = fasitData.applicationMappingName
                            element.environmentName = fasitData.environmentName
                        }
                    }
                    serviceCallCount++

                    if (serviceCallCount === serviceCalls) {
                        enrichedElements.push(element)
                        if (enrichedElements.length === totalElementsCount) {
                            console.log(enrichedElements)
                        }

                    }
                })
            }

            function getCocaData(element) {
                request("http://coca.adeo.no/api/v1/calculator/prices", function (err, res, body) {
                    if (err) {
                        console.error(err)
                    } else {
                        var cocaData = JSON.parse(body)
                        element.cost = cocaData.custom
                    }
                    serviceCallCount++

                    if (serviceCallCount === serviceCalls) {
                        enrichedElements.push(element)
                        if (enrichedElements.length === totalElementsCount) {
                            console.log(enrichedElements)
                        }

                    }
                })
            }

            getFasitData(element)
            getCocaData(element)
        }

        for (var i = 0; i < totalElementsCount; i++) {
            enrichElementWithData(req.body[i], enrichedElements, totalElementsCount)
        }
        */


        res.sendStatus(201, "cheers")
    }
}

var schemaValidateRequest = function (request) {
    var validate = require('jsonschema').validate
    var ServerJsonSchema = require('../models/serverschema')
    return validate(request, ServerJsonSchema)
}

