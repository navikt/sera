const HTTPRequest = require('request');
const Server = require('../models/servermongo')
const logger = require('../logger');
const config = require('../config/config')


exports.selftest = function () {
    return function (req, res, next) {
        res.header('Content-Type', 'application/json; charset=utf-8')
        res.json('Selftest!')
        res.status(200).send()
    }
}

exports.database = function () {
    Server.ping({}, function (err, response) {
        res.header('Content-Type', 'application/json; charset=utf-8')
        res.json('Selftest!')
        res.json({
            response
        })
        res.status(200).send()
    })
}

