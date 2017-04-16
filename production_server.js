'use strict'
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser')
const fs = require('fs')
const https = require('https')
const mongoose = require('mongoose')
const logger = require('./api/logger')
const config = require('./api/config/config')

const app = new express();

logger.debug("Overriding, 'Express' logger");
app.use(require('morgan')('short', {stream: logger.stream}))

app.use(express.static(__dirname + "/dist"))
app.use(bodyParser.json({type: '*/*', limit: '50mb'}))
require('./api/config/routes')(app)

const logError = function (err, req, res, next) {
    logger.error('Error: %s', err.message);
    return next(err)
}

const errorHandler = function (err, req, res, next) {
    res.send({
        status: 500,
        message: err.message || 'internal error'
    })
}

app.use(logError)
app.use(errorHandler)

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './dist/index.html'));
})

const httpsServer = https.createServer({
    key: fs.readFileSync(config.tlsPrivateKey),
    cert: fs.readFileSync(config.tlsCert)
}, app);

if (process.env.NODE_ENV === 'production') {
    mongoose.connect(config.dbUrl)
    mongoose.connection.on('error', console.error.bind(console, 'connection error:'))
    logger.info('Running SERA in production environment')
    logger.info('Using MongoDB URL', config.dbUrl)
    logger.info('Using port', config.port)
    httpsServer.listen(config.port, function () {
        logger.info('SERA is up and ready to go!')
    })
} else if (process.env.NODE_ENV === 'test') {
    mongoose.connect(config.dbUrlTest)
    mongoose.connection.on('error', console.error.bind(console, 'connection error:'))
    logger.info('Running SERA in test environment')
    logger.info('Using MongoDB URL', config.dbUrlTest)
    httpsServer.listen(8869, function () {
        logger.info('SERA is up and ready to go!')
    })
}

module.exports = app