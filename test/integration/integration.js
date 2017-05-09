'use strict';
const chai = require('chai')
const should = chai.should();
const request = require('request')

//Disse variablebe må endres manuelt hvis f.eks endepunkt endres eller testserverene slettes.
const seraHost = 'https://e34apvl00182:8446/'
const testServers = ['a01apvl00006.adeo.no', 'e34apvl00182.devillo.no']


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
            res.statusCode.should.equal(200)
            res.body.should.be.a('string')
            // res.body.should.be.eql('0')
            done();
        })
    });
});
// Servers
describe('POST /api/v1/servers', () => {
    it('should successfully POST two servers', (done) => {
        request.post({
            url: (seraHost + '/api/v1/servers'),
            json: true,
            body: createServerPayload(testServers)
        }, function (error, res) {
            res.statusCode.should.equal(201) // successfully creating servers yields http 201
            res.body.should.be.a('string')
            res.body.should.include('2 servers created') // when creating servers it returns count
            done();
        })
    });
});

describe('POST /api/v1/servers (same hostname as existing)', () => {
    it('should NOT successfully POST a new server with the same hostname as existing', (done) => {
        request.post({
            url: (seraHost + '/api/v1/servers'),
            json: true,
            body: createServerPayload([testServers[0], testServers[0]])
        }, function (error, res) {
            res.statusCode.should.equal(400) // posting a new server with the same hostname as existing yields http 400
            done();
        })
    });
});

describe('GET /api/v1/servers', () => {
    it('should successfully GET server object, server count and NO _id field', (done) => {
        request.get({
            url: (seraHost + '/api/v1/servers')
        }, function (error, res) {
            res.statusCode.should.equal(200) // successfully retrieving servers yields http 200
            const body = JSON.parse(res.body)
            body.length.should.be.eql(2) // returns expected server count
            should.equal(res.body[0]._id, undefined) // property _id should be removed
            done();
        })
    });
    //
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
        request.get({
            url: (seraHost + '/api/v1/servers?hostname=' + testServers[0].substring(17, 0)),
        }, function (error, res) {
            res.statusCode.should.equal(200) // successfully retrieving server yields http 200
            res.body.should.be.a('string')
            const body = JSON.parse(res.body)
            body.length.should.be.eql(1) // returns requested server by partial hostname
            should.equal(body[0].os, 'rhel') // string-input is loweroquaied
            done();
        })
    });
});

describe('GET /api/v1/servers?hostname=blabla (nonexistent)', () => {
    it('should GET empty array when requesting nonexstent server', (done) => {
        request.get({
            url: (seraHost + '/api/v1/servers?hostname=blabla'),
        }, function (error, res) {
            res.statusCode.should.equal(200) // successfully retrieving server yields http 200
            res.body.should.be.a('string')
            const body = JSON.parse(res.body)
            body.length.should.be.eql(0) // returns requested server by partial hostname
            done();
        })
    });
});


const createServerPayload = function (hostnames) {
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
