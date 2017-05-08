'use strict';
const nock = require('nock')
const chai = require('chai')
const chaiHttp = require('chai-http')
// const api = require('../../production_server')
const api = require('../../api/index')
const should = chai.should();
const request = require('request')

const seraHost = 'https://localhost:8443'

chai.use(chaiHttp);

initMocks();

// Timestamps
describe('DELETE /api/v1/timestamp', () => {
    it('It should DELETE all timestamps from database', (done) => {
        request.delete({
            url: (seraHost + '/api/v1/timestamp')
        }, function (error, res) {
            res.statusCode.should.equal(200)
            res.body.should.be.a('string')
            res.body.should.include("Timestamps cleared")
            done()
        })
    });
    it('it should POST new timestamp in database', (done) => {
        request.post({
            url: (seraHost + '/api/v1/timestamp')
        }, function (error, res) {
            res.statusCode.should.equal(200)
            res.body.should.be.a('string')
            res.body.length.should.be.above(1)
            done()
        })
    });
});

describe('GET /api/v1/hoursSinceLastUpdate', () => {
    it('it should GET time since last update of database', (done) => {
        request.get({
            url: (seraHost + '/api/v1/hoursSinceLastUpdate')
        }, function (error, res) {
            console.log(res.body)
            res.statusCode.should.equal(200)
            res.body.should.be.a('string')
            res.body.should.be.eql('0')
            done();
        })
    });
});
// Servers
describe('POST /api/v1/servers', () => {
    it('should successfully POST two servers', (done) => {
        chai.request(api)
            .post('/api/v1/servers')
            .send(createServerPayload(['a01apvl069.devillo.central', 'a01apvl096.devillo.central']))
            .end((err, res) => {
                res.should.have.status(201) // successfully creating servers yields http 201
                res.text.should.be.a('string')
                res.text.should.include('2 servers created') // when creating servers it returns count
                done();
            });
    });
});

describe('POST /api/v1/servers (same hostname as existing)', () => {
    it('should NOT successfully POST a new server with the same hostname as existing', (done) => {
        chai.request(api)
            .post('/api/v1/servers')
            .send(createServerPayload(['a01apvl069.devillo.central', 'a01apvl069.devillo.central']))
            .end((err, res) => {
                res.should.have.status(400) // posting a new server with the same hostname as existing yields http 400
                done();
            });
    });
});

describe('GET /api/v1/servers', () => {
    it('should successfully GET server object, server count and NO _id field', (done) => {
        chai.request(api)
            .get('/api/v1/servers')
            .end((err, res) => {
                res.should.have.status(200) // successfully retrieving servers yields http 200
                res.body.should.be.an('array')
                res.body.length.should.be.eql(2) // returns expected server count
                should.equal(res.body[0]._id, undefined) // property _id should be removed
                done()
            });
    });
    // Influx query not yet defined
    // it('should have enriched server object with data fields from influxDB for only one server', (done) => {
    //     chai.request(api)
    //         .get('/api/v1/servers')
    //         .end((err, res) => {
    //             res.should.have.status(200) // successfully retrieving servers yields http 200
    //             res.body.should.be.an('array')
    //             res.body.length.should.be.eql(2) // returns expected server count
    //             should.equal(res.body[0].rpm_time, '2017-03-08T07:56:12Z')
    //             should.equal(res.body[0].rpm_cluster, 'applikasjonsgruppe:helfoCluster')
    //             should.equal(res.body[0].rpm_rpm, 'jboss-eap7')
    //             should.equal(res.body[0].rpm_version, '7.0.4.2-1')
    //             should.equal(res.body[1].rpm, 'n/a') // not listed in influxdb
    //             done()
    //         });
    // });
});



describe('GET /api/v1/servers?hostname=:hostname single', () => {
    it('should successfully GET single server, even with partial hostname', (done) => {
        chai.request(api)
            .get('/api/v1/servers?hostname=a01apvl069.devillo')
            .end((err, res) => {
                res.should.have.status(200) // successfully retrieving server yields http 200
                res.body.should.be.an('array')
                res.body.length.should.be.eql(1) // returns requested server by partial hostname
                should.equal(res.body[0].os, 'rhel') // string-input is loweroquaied
                done();
            });
    });
});

describe('GET /api/v1/servers?hostname=blabla (nonexistent)', () => {
    it('should GET empty array when requesting nonexstent server', (done) => {
        chai.request(api)
            .get('/api/v1/servers?hostname=blabla')
            .end((err, res) => {
                res.should.have.status(200) // retrieving nonexistent server yields 200
                res.body.length.should.be.eql(0) // no servers found gives empty array
                done();
            });
    });
});



let createServerPayload = function (hostnames) {
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
    });
};

function initMocks() {
    const fasit = nock('https://fasit.adeo.no/api/v2')
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
        )

    const coca = nock('http://coca.adeo.no/api')
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
        )

    const nora = nock('http://nora.adeo.no/api')
        .get('/v1/units')
        .reply(200,
            [{
                "name": "unit69",
                "applications": ["a", "b", "c"]
            }]
        )

    const influx = nock(/influxdb\.adeo.no/)
        .persist()
        .get("/query")
        .query(true)
        .reply(200,
            {
                "results": [
                    {
                        "statement_id": 0,
                        "series": [
                            {
                                "name": "rpm.install",
                                "columns": [
                                    "time",
                                    "cluster",
                                    "environment",
                                    "hostname",
                                    "op",
                                    "rpm",
                                    "version"
                                ],
                                "values": [
                                    [
                                        "2017-03-08T07:56:12Z",
                                        "applikasjonsgruppe:helfoCluster",
                                        "u3",
                                        "a01apvl069.devillo.central",
                                        "upgrade",
                                        "jboss-eap7",
                                        "7.0.4.2-1"
                                    ]
                                ]
                            }
                        ]
                    },
                    {
                        "statement_id": 1
                    }
                ]
            }
        )
}

