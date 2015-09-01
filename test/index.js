'use strict'

var test = require('tape')
var request = require('supertest')
var api = require('../api')
var mongoose = require('mongoose')


test('POST /api/v1/servers', function (t) {
    request(api)
        .post('/api/v1/servers')
        .send(createServerPayload(['a01apvl069.devillo.central', 'a01apvl096.devillo.central'])).end(function (err, res) {
            t.equals(res.status, 201, 'successfully creating servers yields http 201')
            t.equals(res.text, '2 servers created', 'when creating servers, it says how many')
            t.end()
        })
})

test('GET /api/v1/servers', function (t) {
    request(api)
        .get('/api/v1/servers')
        .end(function (err, res) {
            t.equals(res.status, 200, 'successfully retrieving server yields http 200')
            t.true(res.body.length >= 2, 'returns expected server count')
            t.end()
        })
})

test('DELETE /api/v1/servers?hostname=:hostname', function (t) {
    request(api)
        .delete('/api/v1/servers?hostname=a01apvl096.devillo.central')
        .end(function (err, res) {
            t.equals(res.status, 204, 'successfully performed delete operation yields 204')
            request(api)
                .get('/api/v1/servers?hostname=a01apvl096.devillo.central')
                .end(function (err, res) {
                    t.equals(res.status, 404, 'deletes single server')
                    t.end()
                })
        })
})

test('GET /api/v1/servers', function (t) {
    request(api)
        .get('/api/v1/servers?hostname=a01apvl069.devillo')
        .end(function (err, res) {
            t.equals(res.status, 200, 'successfully retrieving servers yields http 200')
            t.equals(res.body.length, 1, 'returns requested server by partial hostname')
            t.end()
        })
})

test('GET /api/v1/servers?hostname=<hostname> (nonexistent)', function (t) {
    request(api)
        .get('/api/v1/servers?hostname=doesntexist')
        .end(function (err, res) {
            t.equals(res.status, 404, 'retrieving nonexistent server yields 404')
            t.end()
        })
})

test('DELETE /api/v1/servers', function (t) {
    request(api)
        .delete('/api/v1/servers')
        .end(function (err, res) {
            t.equals(res.status, 204, 'successfully performed delete operation yields 204')
            request(api)
                .get('/api/v1/servers')
                .end(function (err, res) {
                    t.equals(res.status, 404, 'successfully removed all servers')
                    mongoose.connection.close()
                    t.end()
                })
        })
})

var createServerPayload = function (hostnames) {
    return hostnames.map(function (hostname) {
        return {
            hostname: hostname,
            ipAddress: '10.0.69.96',
            owner: 'johan yumyum',
            application: 'sera',
            environment: 'dev',
            cpu: '2',
            memory: '16',
            type: 'was',
            os: 'rhel',
            disk: 100,
            environmentClass: 'p'
        }
    })

}
