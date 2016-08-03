'use strict'

var https = require('https')
var fs = require('fs')
var express = require('express')
var app = require('./api')
var config = require('./api/config/config')

// serve static html
app.use(express.static(__dirname + "/frontend/build"));
var httpsServer = https.createServer({
    key: fs.readFileSync(config.tlsPrivateKey),
    cert: fs.readFileSync(config.tlsCert)
}, app);

httpsServer.listen(config.port, function () {
    console.log('running on port %d', config.port)
})