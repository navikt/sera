'use strict'

var test = require('tape')
var request = require('supertest')
var mongoose = require('mongoose')
var Server = require('../api/models/servermongo')
var api = require('../api')
var config = require('../api/config/config')

test('prepare server', function(t){
    mongoose.createConnection(config.dbUrl)

    Server.remove({}, function (err) {
        if (err) throw Error(err)
        console.log("deleted all servers");
    })

    t.end()
})

test('POST /api/v1/servers', function (t) {
    request(api)
        .post('/api/v1/servers')
        .send(createServerPayload(['a01apvl069.devillo.central', 'a01apvl096.devillo.central']))
        .end(function (err, res) {
            t.equals(res.status, 201, 'successfully creating servers yields http 201')
            t.equals(res.text, '2 servers created', 'when creating servers, it says how many')
            t.end()
        })
})

test('POST /api/v1/servers (same hostname as existing)', function (t) {
    request(api)
        .post('/api/v1/servers')
        .send(createServerPayload(['a01apvl069.devillo.central', 'a01apvl069.devillo.central' ]))
        .end(function (err, res) {
            t.equals(res.status, 400, 'posting a new server with the same hostname as existing yields http 400')
            t.end()
        })
})

test('POST /api/v1/servers (non-unique hostnames)', function (t) {
    request(api)
        .post('/api/v1/servers')
        .send(createServerPayload(['duplicate.devillo.central', 'duplicate.devillo.central']))
        .end(function (err, res) {
            t.equals(res.status, 400, 'posting a two servers with the same hostname yields http 400')
            t.end()
        })
})

test('GET /api/v1/servers', function (t) {
    request(api)
        .get('/api/v1/servers')
        .end(function (err, res) {
            t.equals(res.status, 200, 'successfully retrieving server yields http 200')
            t.equals(res.body.length, 2, 'returns expected server count')
            t.false(res.body[0]._id, 'server object has no _id field')
            t.end()
        })
})

test('GET /api/v1/servers?hostname=:hostname single', function (t) {
    request(api)
        .get('/api/v1/servers?hostname=a01apvl069.devillo')
        .end(function (err, res) {
            t.equals(res.status, 200, 'successfully retrieving servers yields http 200')
            t.equals(res.body.length, 1, 'returns requested server by partial hostname')
            t.equals(res.body[0].os, 'rhel', 'string-input is loweroquaied')
            t.end()
        })
})


test('GET /api/v1/servers?hostname=blabla (nonexistent)', function (t) {
    request(api)
        .get('/api/v1/servers?hostname=blabla')
        .end(function (err, res) {
            t.equals(res.status, 200, 'retrieving nonexistent server yields 200')
            t.equals(res.body.length, 0, 'no servers found gives empty array')
            t.end()
        })
})



test('cleanup servers', function(t){
    mongoose.connection.close()
    t.end()
})

var createServerPayload = function (hostnames) {
    return hostnames.map(function (hostname) {
        return {
            hostname: hostname,
            ipAddress: '10.0.69.96',
            owner: 'jOhAN yUmYuM',
            application: 'SERA',
            environment: 'DEV',
            cpu: 2,
            memory: 16,
            type: 'WAS',
            os: 'rhel',
            site: 'so8',
            disk: 100,
            srm: false,
            custom: true,
            status: 'poweredOn',
            environmentClass: 'p'
        }
    })
}