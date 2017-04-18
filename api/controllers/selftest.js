const HTTPRequest = require('request');
const logger = require('../logger');
const config = require('../config/config')


exports.selftest = function(){
    return function (req, res, next) {

        res.header('Content-Type', 'application/json; charset=utf-8')
        res.json('Selftest!')
        res.status(200).send()

    }
}