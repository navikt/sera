'use strict'
const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')
const fs = require('fs')
const http = require('http')
const mongoose = require('mongoose')
const logger = require('./api/logger')
const config = require('./api/config/config')
const requestData = require('./api/controllers/refresh')
const prometheus = require('prom-client')



const app = new express();

const cors = function (req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*")
    return next();
};

setInterval(requestData.callOrchestrator(), 7200000) // Starter orchestratoer worflow for import av data hver 2. time

logger.debug("Overriding, 'Express' logger")
app.use(require('morgan')('short', {stream: logger.stream}))

app.use(cors)

app.use(express.static(__dirname + "/dist"))
app.use(bodyParser.json({type: '*/*', limit: '50mb'}))

app.get("/isready", (req, res) => {
    res.sendStatus(200)
});

app.get("/isalive", (req, res) => {
    res.sendStatus(200)
});

app.get('/metrics', (req, res) => {
    res.set('Content-Type', prometheus.register.contentType);
    res.end(prometheus.register.metrics());
});

require('./api/config/routes')(app)

const logError = function (err, req, res, next) {
    logger.error('Error: %s', err.message);
    return next(err)
}

const errorHandler = function (err, req, res, next) {
    if (res.headerSent) {
        console.log(next(err))
    }
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

mongoose.connect(config.dbUrl, {server: {reconnectTries: Number.MAX_VALUE}}) // aldri gi opp reconnect
mongoose.connection.on('error', console.error.bind(console, 'connection error:'))
app.listen(config.port, function () {
    console.log(`
  ______________________________    _____   
 /   _____/\\_   _____/\\______   \\  /  _  \\  
 \\_____  \\  |    __)_  |       _/ /  /_\\  \\ 
 /        \\ |        \\ |    |   \\/    |    \\
/_______  //_______  / |____|_  /\____|__   /
        \\/         \\/         \\/         \\/ 
`)
    logger.info('Running in production environment')
    logger.info('Connected to MongoDB URL', config.dbUrl)
    logger.info('Listening on port', config.port)
})

module.exports = app