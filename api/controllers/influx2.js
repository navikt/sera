const request = require('request')
const logger = require('../logger')
const config = require('../config/config')

let influxObjects = []
let servers = []

const queryString = '/query?q=select+hostname%2C+rpm%2C+last(version)+from+%22rpm.install%22+where+rpm+!~+%2F%5Enav%2F+group+by+hostname%2C+rpm&db=metrics'

exports.fetchData = function (data) {
    servers = data
    const requestString = config.influxUrl + queryString
    httpRequest(requestString)
}

const httpRequest = function (requestString) {
    logger.info("Sending request to influxDB...")
    const options = {
        url: requestString,
        auth: {
            'user': config.influxUser,
            'pass': config.influxPassword
        }
    }
    request(options, function (err, res, body) {
        if (!err && res.statusCode === 200) {
            const influxResponse = JSON.parse(body)
            influxResponse.results[0].series.forEach(function (e) {
                influxObjects.push({
                    hostname: e.tags.hostname,
                    rpm: e.values[0][2],
                    version: e.values[0][3],
                    time: e.values[0][0]
                })
            })
            enrichData(servers, influxObjects)
        } else {
            logger.error("ERROR", res)
        }
    })
}

const enrichData = function (servers, influxObjects) {
    logger.info(servers.length)
    const results = servers.map((server) => {
        const influxResult = influxObjects.filter((influxObject) => {
            if (influxObject.hostname === server.hostname) {
                return true
                }
            return false
        })
        if (influxResult.length > 0) {

            console.log("Got result, will return contactenated object",Object.assign({}, server, influxResult[0]))
            return Object.assign({}, server, influxResult[0])
        }
        return server
    })
    console.log(results.length)
}
