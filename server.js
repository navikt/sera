var bodyParser = require('body-parser');
var morgan = require('morgan');
var config = require('./api/config/config');
var mongoose = require('mongoose');
var http = require('http');
var express = require('express');
var app = express();

app.use(bodyParser.json());
app.use(morgan('combined'));
app.set('port', config.port);
require('./api/config/routes')(app);

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

mongoose.connect(config.dbUrl);
console.log("Using MongoDB URL", config.dbUrl);

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

app.use(logError);
app.use(errorHandler);

var httpServer = http.createServer(app);

httpServer.listen(config.port, function () {
    console.log("Ready for e-business on port " + config.port)
});
