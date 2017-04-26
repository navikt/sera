const fs = require('fs')
const parseString = require('xml2js').parseString
const request = require('request')
const async = require('async/each')
const mongoose = require('mongoose')
const logger = require('../logger')
const config = require('../config/config')

let selftestResponse = {}
let checks = []
let endpoint = []
let datasource = []
let baseUrl = []
let response = {}


exports.selftest = function () {
    return function (req, res) {
        checks = []
        response = res
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
                checks.push({
                    endpoint: url,
                    result: 1,
                    errorMessage: response.statusCode,
                    responseTime: response.elapsedTime
                })
                callback()
            }
        })
    }, function () {
        requestBaseUrl(baseUrl)
    })
}

const requestBaseUrl = function (baseUrl) {
    async.each(baseUrl, function (currentEndpoint, callback) {
        currentEndpoint = currentEndpoint.$.alias + '_url'
        const url = process.env[currentEndpoint] || 'http://influxdb.adeo.no:8086' // use dummy URL if running locally
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
    }, function () {
        pingDatasource(datasource)
    })
}

const pingDatasource = function (datasource) {
    async.each(datasource, function (currentEndpoint, callback) {
        currentEndpoint = currentEndpoint.$.alias + '_url'
        const dbUrl = process.env[currentEndpoint] || 'mongodb://localhost:27017/test' // use dummy URL if running locally
        createConnection(dbUrl, callback)
    }, function () {
        buildAndReturnJSON()
    })
}

const createConnection = function(dbUrl, callback) {
    const dbConnection = mongoose.createConnection(dbUrl)
    dbConnection.on('connected', function() {
        checks.push({
            endpoint: dbUrl,
            description: 'Test mot mongoDb',
            result: 0,
        })
        callback()
    })
    dbConnection.on('error', function(err) {
        checks.push({
            endpoint: dbUrl,
            description: 'Test mot mongoDb',
            errorMessage: err,
            result: 1
        })
        callback()
    })
    dbConnection.close()
}

const buildAndReturnJSON = function() {
    selftestResponse.checks = checks
    response.header('Content-Type', 'application/json; charset=utf-8')
    response.status(200).send(selftestResponse)
}




