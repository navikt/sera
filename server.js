'use strict'

var express = require('express')
var app = express()
var server = require('./api')
var port = require('./api/config/config').port

// serve static html
server.use(express.static(__dirname + "/frontend/build"));

server.listen(port, function () {
  console.log('RDY 4 EBIZ @ %d', port)
})
