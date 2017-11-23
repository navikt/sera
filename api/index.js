const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const config = require('./config/config')
const logger = require('./logger')

const cors = function (req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*")
    return next();
};
logger.debug("Overriding, 'Express' logger");
app.use(require('morgan')('short', {stream: logger.stream}))

app.use(cors)

app.use(bodyParser.json({type: '*/*', limit: '50mb'}))
require('./config/routes')(app)
app.set('port', config.port)

const logError = function (err, req, res, next) {
    logger.error('Error: %s', err.message);
    return next(err)
};

const errorHandler = function (err, req, res, next) {
    res.send({
        status: 500,
        message: err.message || 'internal error'
    })
};

app.use(logError)
app.use(errorHandler)

if (process.env.NODE_ENV === 'production') {
    mongoose.connect(config.dbUrl)
    mongoose.connection.on('error', console.error.bind(console, 'connection error:'))
    console.log('Running SERA in production environment')
    console.log('Using MongoDB URL', config.dbUrl)
} else if (process.env.NODE_ENV === 'development') {
    mongoose.connect(config.dbUrl)
    mongoose.connection.on('error', console.error.bind(console, 'connection error:'))
    logger.info('Running SERA in development environment')
    logger.info('Using MongoDB URL', config.dbUrl)
} else if (process.env.NODE_ENV === 'test') {
    mongoose.connect(config.dbUrlTest)
    mongoose.connection.on('error', console.error.bind(console, 'connection error:'))
    logger.info('Running SERA in test environment')
    logger.info('Using MongoDB URL', config.dbUrlTest)
}

module.exports = app