'use strict'

var test = require('tape')
var request = require('supertest')
var api = require('../api')
var mongoose = require('mongoose')

test('GET /api/v1/servers', function (t) {
    t.plan(2)
    request(api)
        .get('/api/v1/servers')
        .end(function(err, res){
            t.equals(res.status, 200, 'http status code is 200')
            t.equals(res.body.length, 2, 'array length is 2')
            mongoose.connection.close()
            t.end()
        })
})

