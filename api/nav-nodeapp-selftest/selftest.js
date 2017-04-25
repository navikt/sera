const fs = require('fs')
const parseString = require('xml2js').parseString
const request = require('request')
const async = require('async')
const TimestampModel = require('../models/timestamp')
const logger = require('../logger')
const config = require('../config/config')

let selftestResponse = {}
let checks = []
let endpoint = []
let datasource = []
let baseUrl = []

exports.selftest = function () {
    return function (req, res) {
        checks = []
        readAppInfo()
    }
}

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
            console.log(selftestResponse)
        })
    })
}

const readAppConfig = function (testFunc) {
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

const requestRestEndpoint = function (endpoint) {
    async.each(endpoint, function (currentEndpoint, callback) {
        const currentRestEndpoint = currentEndpoint + '_url'
        const url = process.env[currentRestEndpoint] || 'http://navet.adeo.no/' // use dummy URL if running locally
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
                checks.push({
                    endpoint: url,
                    result: 1,
                    errorMessage: response.statusCode,
                    responseTime: response.elapsedTime
                })
                callback()
            }
        })
    }, function(err) {
        requestBaseUrl(baseUrl)
    })
}

const requestBaseUrl = function (baseUrl) {
    async.each(baseUrl, function (currentEndpoint, callback) {
        const currentRestEndpoint = currentEndpoint + '_url'
        const url = process.env[currentRestEndpoint] || 'http://influxdb.adeo.no:8086' // use dummy URL if running locally
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
                checks.push({
                    endpoint: url,
                    result: 1,
                    errorMessage: response.statusCode,
                    responseTime: response.elapsedTime
                })
                callback()
            }
        })
    }, function(err) {
        console.log(checks)
    })
}

// exports.database = function () {
//     return function (request, res, next) {
//         TimestampModel.find({}, function (error, response) {
//             if (error) {
//                 res.status(500).send(error)
//             } else {
//                 res.header('Content-Type', 'application/json; charset=utf-8')
//                 res.json(response)
//                 res.status(200).send()
//             }
//         })
//     }
// }


