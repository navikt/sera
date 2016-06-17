'use strict'

var test = require('tape')
var nock = require('nock')
var request = require('supertest')
var mongoose = require('mongoose')
var Server = require('../api/models/servermongo')
var config = require('../api/config/config')
var api = require('../api')

test('prepare server', function (t) {
    mongoose.createConnection(config.dbUrl)

    Server.remove({}, function (err) {
        if (err) throw Error(err)
        console.log("deleted all servers");
    })

    initMocks();

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
        .send(createServerPayload(['a01apvl069.devillo.central', 'a01apvl069.devillo.central']))
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


test('cleanup servers', function (t) {
    mongoose.disconnect()
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

function initMocks() {
    var fasit = nock('https://fasit.adeo.no/conf')
        .get('/nodes')
        .reply(200,
            [
                {
                    "ref": "https://fasit.adeo.no/conf/nodes/b27wasl00113.preprod.local",
                    "hostname": "b27wasl00113.preprod.local",
                    "ipAddress": "10.53.90.157",
                    "environmentName": "q0",
                    "environmentClass": "q",
                    "applicationMappingName": "applikasjonsgruppe:gsak og gsynk",
                    "applicationName": [
                        "gsak",
                        "gsynk"
                    ],
                    "username": "deployer",
                    "name": null,
                    "zone": null,
                    "domain": "PreProd",
                    "passwordRef": "https://fasit.adeo.no/conf/secrets/secret-371152",
                    "password": null,
                    "platformType": "WAS",
                    "status": null,
                    "accessAdGroup": null,
                    "httpsPort": 0,
                    "shortName": "b27wasl00113"
                }]
        );


    var coca = nock('http://coca.adeo.no/api')
        .post('/v1/calculator/')
        .reply(200,
            [{
                "type": "appliance",
                "environment": "p",
                "count": 1,
                "total": 7848,
                "calculations": {
                    "esx": 176,
                    "blade": 114,
                    "backup": 1250,
                    "memory": 1488,
                    "cpu": 320,
                    "classification": 4500,
                    "os": 0,
                    "disk": 0
                }
            }, {
                "type": "appliance",
                "environment": "p",
                "count": 1,
                "total": 7848,
                "calculations": {
                    "esx": 176,
                    "blade": 114,
                    "backup": 1250,
                    "memory": 1488,
                    "cpu": 320,
                    "classification": 4500,
                    "os": 0,
                    "disk": 0
                }
            }]
        );

    var nora = nock('http://nora.adeo.no/api')
        .get('/v1/units')
        .reply(200,
            [{
                "name": "unit69",
                "applications": ["a", "b", "c"]
            }]
        );
}