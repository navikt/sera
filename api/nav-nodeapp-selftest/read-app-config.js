const fs = require('fs')
const parseString = require('xml2js').parseString


exports.readAppConfig = function () {
    return function (req, res) {
        fs.readFile( 'app-config/src/main/resources/app-config.xml', function(err, data) {
                if (err) {
                    throw err
                }
                parseString(data.toString(), function(err, result) {
                    result.application.resources[0].rest.forEach(function (e, i) {
                        console.log(e.$.alias)
                    })





                    console.log(result.application.resources[0].rest.$)
                    res.header('Content-Type', 'application/json; charset=utf-8')
                    res.status(200).send(result.application.resources[0])

                })
        })
    }
}
