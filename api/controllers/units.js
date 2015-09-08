var _ = require('lodash')

exports.getUnits = function () {
    return function (req, res, next) {
        res.header('Content-Type', 'application/json; charset=utf-8')
        res.json(units)
    }
}

var units = [
    {
        "name": "brukerdialog",
        "applications": ["modiabrukerdialog", "dittnav", "navno"]
    },
    {
        "name": "pensjon",
        "applications": ["pensjon-fss", "pensjon-sbs", "trafikanten"]
    }
]