'use strict'

var test = require('tape')
var request = require('supertest')
var api = require('../api')
var mongoose = require('mongoose')

test('POST /api/v1/servers', function (t) {
  request(api)
    .post('/api/v1/servers')
    .send([{
      hostname: 'a01apvl069.devillo.central',
      ipAddress: '10.0.69.96',
      owner: 'johan yumyum',
      application: 'sera',
      environment: 'dev',
      cpu: '2',
      memory: '16',
      type: 'was',
      disk: 100,
      environmentClass: 'p'
    },
      {
        hostname: 'a01apvl096.devillo.central',
        ipAddress: '10.0.69.96',
        owner: 'johan lee',
        application: 'sera',
        environment: 'dev',
        cpu: '4',
        environmentClass: 'q',
        type: 'jboss',
        disk: 100,
        memory: '16'
      }
    ]).end(function (err, res) {
    t.equals(res.status, 201, 'successfully creating servers yields http 201')
    t.equals(res.text, '2 servers created', 'when creating servers, it says how many')
    t.end()
  })
})

test('GET /api/v1/servers', function (t) {
  request(api)
    .get('/api/v1/servers')
    .end(function (err, res) {
      t.equals(res.status, 200, 'successfully retrieving servers yields http 200')
      t.equals(res.body.length, 2, 'returns all registered servers')
      t.end()
    })
})

test('GET /api/v1/servers/:hostname', function (t) {
  request(api)
    .get('/api/v1/servers/a01apvl069.devillo.central')
    .end(function (err, res) {
      t.equals(res.status, 200, 'successfully retrieving server yields http 200')
      t.equals(res.body.length, 1, 'returns only matching servers')
      t.equals(res.body[0].hostname, 'a01apvl069.devillo.central', 'with matching hostname')
      t.end()
    })
})

test('GET /api/v1/servers/:hostname (nonexistent)', function (t) {
  request(api)
    .get('/api/v1/servers/doesntexist')
    .end(function (err, res) {
      t.equals(res.status, 404, 'retrieving nonexistent server yields 404')
      mongoose.connection.close()
      t.end()
    })
})
