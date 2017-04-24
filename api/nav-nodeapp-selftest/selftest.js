const fs = require('fs')
const parseString = require('xml2js').parseString
const request = require('request')
const TimestampModel = require('../models/timestamp')
const logger = require('../logger')
const config = require('../config/config')

let selftestResponse = {
    application: '',
    version: '',
    timestamp: '',
}

exports.selftest = function () {
    return function (req, res) {
        readAppInfo()
    }

}

const readAppInfo = function () {
    fs.readFile('app-config/pom.xml', function (err, data) {
        if (err) {
            throw err
        }
        parseString(data.toString(), function (err, result) {
            console.log(result)
        })
    })
}




exports.readAppConfig = function () {
    return function (req, res) {
        fs.readFile('app-config/src/main/resources/app-config.xml', function (err, data) {
            if (err) {
                throw err
            }
            parseString(data.toString(), function (err, result) {
                result.application.resources[0].rest.forEach(function (e, i) {
                    console.log(e.$.alias)
                })


                console.log(result.application.resources[0].rest.$)
                res.header('Content-Type', 'application/json; charset=utf-8')
                res.status(200).send(result.application.resources[0])

            })
        })
    }
}


exports.database = function () {
    return function (request, res, next) {
        TimestampModel.find({}, function (error, response) {
            if (error) {
                res.status(500).send(error)
            } else {
                res.header('Content-Type', 'application/json; charset=utf-8')
                res.json(response)
                res.status(200).send()
            }
        })
    }
}

exports.pingRestEndpoint = function () {
    return function (req, res) {
        request.get({
            url: config.fasitNodesUrl,
            time: true
        }, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                res.header('Content-Type', 'application/json; charset=utf-8')
                console.log(response.statusCode)
                console.log(response.elapsedTime)
                res.status(200).send('Fasit OK!')
            } else {
                res.header('Content-Type', 'application/json; charset=utf-8')
                console.log(error)
                console.log(response.statusCode)
                console.log(response.elapsedTime)
                res.status(200).send('Fasit nede :(')
            }

        })
    }
}
