var express = require('express')
var app = express()
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');
var config = require('./config/config');

app.use(bodyParser.json());
app.use(morgan('combined'));
require('./config/routes')(app);
app.set('port', config.port);

var logError = function (err, req, res, next) {
    console.log("Error: %s", err.message);
    return next(err);
}

var errorHandler = function (err, req, res, next) {
    res.send({
        status: res.statusCode,
        message: err.message || "internal error"
    });
};

app.use(logError);
app.use(errorHandler);

mongoose.connect(config.dbUrl);
mongoose.connection.on('error', console.error.bind(console, 'connection error:'));
console.log("Using MongoDB URL", config.dbUrl);

module.exports = app;