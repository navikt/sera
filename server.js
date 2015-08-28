'use strict'

var server = require('./api')
var port = require('./api/config/config').port

server.listen(port, function () {
  console.log('RDY 4 EBIZ @ %d', port)
})
