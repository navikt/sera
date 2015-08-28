'use strict'

var test = require('tape')
var request = require('supertest')
var api = require('../api')

test('first test', function (t) {
    t.plan()
    request(api)
        .get('/test')
        .expect(404)
        .end(function(err, res){
            t.equals(res.status, 404)
            t.end()
        })


})