const fs = require('fs')
const parseString = require('xml2js').parseString
const request = require('request')
const async = require('async')
const mongoose = require('mongoose')
const ping = require('jjg-ping')
const logger = require('../logger')
const config = require('../config/config')

// Funksjon som svarer på selftest-kall mot backend. Vil gå gjennom app-config.xml og kjøre requests på rest-api og
// mongoDB hvis dette er definert. Det er også lagt inn en egen test av et kall mot influxDB. Hvis en  av testene feiler
// settes aggregateResult til 1.

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
    return function (req, res) {
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
            if (currentEndpoint === 'units_v1_url') url = 'https://nora.adeo.no/api/v1/units' // hack for nora
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
                        checks.push({ // Ved feil etter at host er tilkoblet logges dette her
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
        }, function
            () {
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
            testDatasourceConnection()
        } else {
            if (error) { // Ved feil i f.eks url logges selve feilmeldingen
                checks.push({
                    endpoint: 'http://influxdb.adeo.no:8086',
                    result: 1,
                    errorMessage: error,
                })
            } else {
                checks.push({ // Ved feil etter at host er tilkoblet logges dette her
                    endpoint: 'http://influxdb.adeo.no:8086',
                    result: 1,
                    errorMessage: response.statusCode,
                    responseTime: response.elapsedTime
                })
            }
            aggregateResult = 1
            testDatasourceConnection()
        }
    })
}
// Test av mongoDB. Oppretter ny connection i samme connection-pool. Resultat dyttes inn i checks
const testDatasourceConnection = function (datasource) {
    async.each(datasource, function (currentEndpoint, callback) {
        currentEndpoint = currentEndpoint.$.alias + '_url'
        const dbUrl = process.env[currentEndpoint] || 'mongodb://localhost:27017/test' // use dummy URL if running locally
        createConnection(dbUrl, callback)
    }, function () {
        buildAndReturnJSON()
    })
}
// Selve databaselogikk her
const createConnection = function (dbUrl, callback) {
    const dbConnection = mongoose.createConnection(dbUrl)
    dbConnection.on('connected', function () {
        checks.push({
            endpoint: dbUrl,
            description: 'Test mot mongoDb',
            result: 0,
        })
        callback()
    })
    dbConnection.on('error', function (err) {
        checks.push({
            endpoint: dbUrl,
            description: 'Test mot mongoDb',
            errorMessage: err,
            result: 1
        })
        aggregateResult = 1
        callback()
    })
    dbConnection.close()
}
// Bygger selve JSON og sender response
const buildAndReturnJSON = function () {
    logger.info('Selftest returned aggregate result of', aggregateResult)
    selftestResponse.checks = checks
    selftestResponse.aggregateResult = aggregateResult
    response.header('Content-Type', 'application/json; charset=utf-8')
    response.status(200).send(selftestResponse)
}




