const fs = require('fs')
const parseString = require('xml2js').parseString
const request = require('request')
const async = require('async')
const mongoose = require('mongoose')
const TimestampModel = require('../models/timestamp')
const logger = require('../logger')
const config = require('../config/config')

// Funksjon som svarer på selftest-kall mot backend. Vil gå gjennom app-config.xml og kjøre requests på rest-api og
// mongoDB hvis dette er definert. Det er også lagt inn en egen test av et kall mot influxDB. Hvis en  av testene feiler
// settes aggregateResult til 1. Både test mot database og influx må skrives spesifikt for sera så det er mulig
// biten også må endres på sikt.

// Definerer globale variabler
let selftestResponse = {}
let checks = []
let aggregateResult = 0
let endpoint = []
let datasource = []
let baseUrl = []
let response = {}


// Resetter variabler mellom hvert kall.
exports.selftest = function () {
    return function (req, res, next) {
        checks = []
        aggregateResult = 0
        response = res
        readAppInfo()
    }
}
// Leser app-navn og versjon fra pom.xml
const readAppInfo = function () {
    fs.readFile('app-config/pom.xml', function (err, data) {
        if (err) {
            throw err
        }
        parseString(data.toString(), function (err, result) {
            selftestResponse = {
                application: result.project.artifactId[0],
                version: result.project.version[0]
            }
            readAppConfig()
        })
    })
}
// Leser resurser fra app-config.xml og definerer arrays for senere bruk
const readAppConfig = function () {
    fs.readFile('app-config/src/main/resources/app-config.xml', function (err, data) {
        if (err) {
            throw err
        }
        parseString(data.toString(), function (err, result) {
            endpoint = result.application.resources[0].rest
            datasource = result.application.resources[0].datasource
            baseUrl = result.application.resources[0].baseUrl
            requestRestEndpoint(endpoint)
        })
    })
}
// Starter http get requests mot rest-endepunkter, resultatet blir dyttet inn i checks
const requestRestEndpoint = function (endpoint) {
    async.each(endpoint, function (currentEndpoint, callback) {
            currentEndpoint = currentEndpoint.$.alias + '_url'
            let url = process.env[currentEndpoint] || 'http://navet.adeo.no/' // use dummy URL if running locally
            if (currentEndpoint === 'units_v1_url') url = 'https://nora.adeo.no/api/v1/units' // bruker prod nora
            if (currentEndpoint === 'fasit:nodes_v2_url') url = 'https://fasit.adeo.no/api/v2/nodes' // legger inn prod-fasit
            request.get({
                url: url,
                time: true
            }, function (error, response) {
                if (!error && response.statusCode == 200) {
                    checks.push({
                        endpoint: url,
                        result: 0,
                        responseTime: response.elapsedTime
                    })
                    callback()
                } else {
                    if (error) { // Ved feil i f.eks url logges selve feilmeldingen
                        checks.push({
                            endpoint: url,
                            result: 1,
                            errorMessage: error,
                        })
                    } else {
                        checks.push({ // Ved feil etter at host svarer, logges dette her
                            endpoint: url,
                            result: 1,
                            errorMessage: response.statusCode,
                            responseTime: response.elapsedTime
                        })
                    }
                    aggregateResult = 1
                    callback()
                }
            })
        }, function () {
            testInfluxDb()
        }
    )
}
// Test av kall mot influxDB. Kjører kall mot tabell som ikke finnes. Resultat blir dyttet inn i checks
const testInfluxDb = function () {
    request.get({
        url: 'http://influxdb.adeo.no:8086/query?q=select+*+from+%22selftest%22&db=metrics',
        time: true,
        auth: {
            'user': config.influxUser,
            'pass': config.influxPassword
        }
    }, function (error, response) {
        if (!error && response.statusCode == 200) {
            checks.push({
                endpoint: 'http://influxdb.adeo.no:8086',
                result: 0,
                responseTime: response.elapsedTime
            })
        } else {
            if (error) { // Ved feil i f.eks url logges selve feilmeldingen
                checks.push({
                    endpoint: 'http://influxdb.adeo.no:8086',
                    result: 1,
                    errorMessage: error,
                })
            } else {
                checks.push({ // Ved feil etter at host svarer, logges dette her
                    endpoint: 'http://influxdb.adeo.no:8086',
                    result: 1,
                    errorMessage: response.statusCode,
                    responseTime: response.elapsedTime
                })
            }
            aggregateResult = 1
        }
        testDatasourceConnection()
    })
}
// Test av mongoDB. Leser fra eksisterende databasekobling. Resultat dyttes inn i checks. Callback fra collection.find
// timer ut etter 2 sekunder og logger egen feil. Dette er fordi det ikke vil komme feilmelding om databasen er nede.
// Når testen gjøres på denne måten vil queries fra selftesten legges i kø mot mongodb-driveren og kjøres med en gang
// databasen kommer opp igjen.
const testDatasourceConnection = function () {
    let timeoutProtect = setTimeout(function () {
        timeoutProtect = null
        checks.push({
            endpoint: config.dbUrl,
            description: 'Test mot mongoDb',
            errorMessage: 'Ingen respons fra databasespørring. Databasen er mest sannsynlig utilgjengelig.',
            result: 1
        })
        aggregateResult = 1
        buildAndReturnJSON() // hopper over test av dataimport hvis databasen er nede.
    }, 2000)
    TimestampModel.find({}, function (err, result) {
        if (!err && timeoutProtect) {
            checks.push({
                endpoint: config.dbUrl,
                description: 'Test mot mongoDb',
                result: 0,
            })
        } else {
            checks.push({
                endpoint: config.dbUrl,
                description: 'Test mot mongoDb',
                errorMessage: err,
                result: 1
            })
            aggregateResult = 1
        }
        clearTimeout(timeoutProtect)
        checkDataImport()
    })
};

const checkDataImport = function () {
    request.get({
        url: 'https://localhost:8443/api/v1/hourssincelastupdate',
        time: true
    }, function (error, response) {
        if (!error && response.body < "8") {
            checks.push({
                endpoint: '/api/v1/hourssincelastupdate',
                description: 'Test av dataimport',
                result: 0,
                responseTime: response.elapsedTime
            })
        } else {
            checks.push({
                endpoint: '/api/v1/hourssincelastupdate',
                description: 'Test av dataimport',
                result: 2,
                errorMessage: 'Serverdata er over 8 timer gammel, det kan være problemer med skeduelert utrekk fra Orchestrator/vCenter',
                responseTime: response.elapsedTime
            })
            if (aggregateResult === 0) aggregateResult = 2
        }
        buildAndReturnJSON()
    })
}
// Bygger selve JSON og sender respons
const buildAndReturnJSON = function () {
    if (!response.headersSent) { // hvis selftest kalles for ofte, venter vi til den siste er ferdig før vi sender ny respons.
        logger.info('Selftest returned aggregate result of', aggregateResult)
        selftestResponse.timestamp = new Date()
        selftestResponse.aggregateResult = aggregateResult
        selftestResponse.checks = checks
        response.header('Content-Type', 'application/json; charset=utf-8')
        response.status(200).send(JSON.stringify(selftestResponse))
    }
}
