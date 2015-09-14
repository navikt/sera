var _ = require('lodash')
var Unit = require('../models/unitmongo')

exports.createUnit = function () {
    var applicationIsMappedToOtherUnits = function (incomingUnitName, existingUnits) {
        if (existingUnits.length === 0){ // application doesnt exist in any unit
            return false
        } else if (existingUnits.length === 1 && existingUnits[0].name === incomingUnitName){ // we are updating a existing unit
            return false
        } else { // some other unit has this application mapped
            return true
        }
    };

    return function (req, res, next) {
        var unit = Unit.createFromObject(req.body)
        Unit.find({applications: {$in: unit.applications}}, function (err, units) {
            if (err) return next(err)
            if (applicationIsMappedToOtherUnits(unit.name, units)) {
                res.status(400)
                res.send("application(s) already exists in unit(s): " + units)
            } else {
                Unit.find({name: unit.name}, function (err, oldUnits) {
                    oldUnits.forEach(remove)
                    unit.save(function (err, unit) {
                        if (err) return next(err)
                        res.status(201).send(unit)
                    })
                })
            }
        })
    }
}

exports.getUnits = function () {
    return function (req, res, next) {
        var query = (req.params.unitid) ? {name: req.params.unitid} : {}
        Unit.find(query, function (err, units) {
            if (err) return next(err)

            if (units.length === 0) {
                res.status(404)
                res.send('no units found')
            } else {
                res.header('Content-Type', 'application/json; charset=utf-8')
                res.json(units)
            }
        })
    }
}

exports.deleteUnit = function () {
    return function (req, res, next) {
        var unitName = req.params.unitid;
        Unit.find({name: unitName}, function (err, units) {
            if (err) return next(err)

            if (units.length === 0) {
                res.status(404)
                res.send("no unit found with id " + unitName)
            } else {
                units.forEach(function (unit) {
                    unit.remove()
                })
                res.status(204)
                res.send("successfully removed unit " + unitName)
            }
        })
    }
}

var remove = function (unit) {
    unit.remove(function (err) {
        if (err) {
            throw new Error("Error during removal of unit: " + err)
        }
    })
};