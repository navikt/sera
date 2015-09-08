'use strict'

var test = require('tape')
var request = require('supertest')
var api = require('../api')
var mongoose = require('mongoose')
var Unit = require('../api/models/unitmongo')

Unit.remove({}, function (err) {
    if (err) throw Error(err)
    console.log("deleted all units");

    Unit.create({"name": "aunit", applications: ['1', '2', '3']}, function (err, doc) {
        if (err) throw Error(err)
        console.log("created", doc);
    })
})

test('PUT /api/v1/units/:unitid (create unit)', function (t) {
    request(api)
        .put('/api/v1/units/myUnit')
        .send({name: "myunit", applications: ['a', 'b', 'c']})
        .end(function (err, res) {
            t.equals(res.status, 201, 'successfully creating a unit yields http 201')
            t.end()
        })
})

test('PUT /api/v1/units/:unitid (create unit with same id)', function (t) {
    request(api)
        .put('/api/v1/units/myUnit')
        .send({name: "myunit", applications: ['a', 'x', 'y']})
        .end(function (err, res) {
            request(api)
                .get('/api/v1/units/myunit')
                .end(function (err, res) {
                    t.equals(res.body.length, 1, 'creating a second units with the same name overwrites')
                    t.end()
                })
        })
})

test('PUT /api/v1/units/:unitid (create different unit with same application as existing unit)', function (t) {
    request(api)
        .put('/api/v1/units/anotherunit')
        .send({name: "anotherunit", applications: ['a']})
        .end(function (err, res) {
            t.equals(res.status, 400, 'creating a unit with the same application as existing unit is not allowed')
            t.end()
        })
})

test('GET /api/v1/units/:unitid (get single unit)', function (t) {
    request(api)
        .get('/api/v1/units/myunit')
        .end(function (err, res) {
            t.equals(res.status, 200, 'successfully retrieving units yields http 200')
            t.equals(res.body.length, 1, 'returns expected unit count')
            t.equals(res.body[0].name, 'myunit', 'returned unit has expected name')

            var applications = res.body[0].applications;
            t.equals(applications.length, 3, 'returned unit has expected number of applications')
            t.equals(applications[0], 'a', 'returned units first application has expected name')
            t.end()
        })
})

test('GET /api/v1/units/:unitid (get nonexistent single unit)', function (t) {
    request(api)
        .get('/api/v1/units/nonexistent')
        .end(function (err, res) {
            t.equals(res.status, 404, 'getting nonexistent single unit yields http 404')
            t.end()
        })
})

test('GET /api/v1/units (get all units)', function (t) {
    request(api)
        .get('/api/v1/units')
        .end(function (err, res) {
            t.equals(res.status, 200, 'successfully retrieving units yields http 200')
            t.equals(res.body.length, 3, 'returns expected unit count')
            t.false(res.body[0]._id, 'unit object has no _id field')
            t.false(res.body[0].__v, 'unit object has no __v field')
            t.end()
        })
})

test('DELETE /api/v1/units/:unitid (delete unit)', function (t) {
    request(api)
        .delete('/api/v1/units/aunit')
        .end(function (err, res) {
            t.equals(res.status, 204, 'successfully deleting a unit yields http 204')
            request(api)
                .get('/api/v1/units')
                .end(function (err, res) {
                    t.equals(res.body.length, 2, 'deletes a single unit')
                    t.end()
                })
        })
})

test('DELETE /api/v1/units/:unitid (delete nonexistent unit)', function (t) {
    request(api)
        .delete('/api/v1/units/nonexistent')
        .end(function (err, res) {
            t.equals(res.status, 404, 'deleting a nonexistent unit yields http 404')
            mongoose.connection.close()
            t.end()
        })
})

