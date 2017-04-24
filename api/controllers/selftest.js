const request = require('request')
const Server = require('../models/servermongo')
const TimestampModel = require('../models/timestamp')
const logger = require('../logger')
const config = require('../config/config')

let selftestResponse = {
    application: 'sera',
    version: '1.1.1'
}

exports.selftest = function () {
    return function (req, res) {
        res.header('Content-Type', 'application/json; charset=utf-8')
        res.json('Selftest!')
        res.status(200).send()
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
