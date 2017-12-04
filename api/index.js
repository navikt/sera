const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const config = require('./config/config')
const logger = require('./logger')
const prometheus = require('prom-client')
prometheus.collectDefaultMetrics()

const cors = function (req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*")
    console.log("CORS")
    return next();
};
logger.debug("Overriding, 'Express' logger");
app.use(require('morgan')('short', { stream: logger.stream }))

app.use(cors)

app.get("/isready", (req, res) => {
    res.sendStatus(200)
});

app.get("/isalive", (req, res) => {
    res.sendStatus(200)
});

app.get('/metrics', (req, res) => {
    console.log("skjer det mpe her?")
    res.set('Content-Type', prometheus.register.contentType);
    res.end(prometheus.register.metrics());
});

app.use(bodyParser.json({ type: '*/*', limit: '50mb' }))
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

mongoose.Promise = require('bluebird')

if (process.env.NODE_ENV === 'production') {
    mongoose.connect(config.dbUrl, {
        useMongoClient: true
    })
    mongoose.connection.on('error', console.error.bind(console, 'connection error:'))
    console.log('Running SERA in production environment')
    console.log('Using MongoDB URL', config.dbUrl)
} else if (process.env.NODE_ENV === 'development') {
    mongoose.connect(config.dbUrl, {
        useMongoClient: true
    })
    mongoose.connection.on('error', console.error.bind(console, 'connection error:'))
    logger.info('Running SERA in development environment')
    logger.info('Using MongoDB URL', config.dbUrl)
    logger.info('Using', config.fasitNodesUrl)
    logger.info('Using', config.cocaUrl)
    logger.info('Using', config.noraUrl)
    logger.info('Using', config.influxUrl)
} else if (process.env.NODE_ENV === 'test') {
    mongoose.connect(config.dbUrlTest, {
        useMongoClient: true
    })
    mongoose.connection.on('error', console.error.bind(console, 'connection error:'))
    logger.info('Running SERA in test environment')
    logger.info('Using MongoDB URL', config.dbUrlTest)
}

module.exports = app