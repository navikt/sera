const HTTPRequest = require('request');
const logger = require('../logger');
const config = require('../config/config')


exports.enrichWithDataFromInflux = function (servers, writeToDb, incomingDataResponse) {
    logger.info("Querying influxDB metrics / rpm.install for data...")
    buildRequestString(servers, makeHttpRequest, writeToDb, incomingDataResponse)
}

const buildRequestString = function (servers, makeHttpRequest, writeToDb, incomingDataResponse) {
    logger.info("Building query string...")
    const baseUrl = config.influxUrl + "/query?q="
    let requestString = ""
    servers.forEach(function (e) {
        const request = "SELECT+*+FROM+%22rpm.install%22+WHERE+%22hostname%22+%3D+'" + e.hostname + "'+ORDER+BY+time+DESC+LIMIT+1%3B"
        requestString = requestString + request
    })
    requestString = baseUrl + (requestString.slice(0, -4)) + "+1&db=metrics"
    makeHttpRequest(requestString, servers, mergeData, writeToDb, incomingDataResponse)
}

const makeHttpRequest = function (requestString, servers, mergeData, writeToDb, incomingDataResponse) {
    logger.info("Sending request to influxDB...")
    const options = {
        url: requestString,
        auth: {
            'user': config.influxUser,
            'pass': config.influxPassword        }
    }

    HTTPRequest(options, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            const influxResponse = JSON.parse(body)
            mergeData(servers, influxResponse, writeToDb, incomingDataResponse)
        } else {
            logger.error("ERROR", response)
        }
    })
}

const mergeData = function (servers, influxResponse, writeToDb, incomingDataResponse) {
    logger.info("Merging data...")
    let enrichedElementsCounter = 0

    servers.forEach(function (e, i) {
        if (typeof (influxResponse.results[i].series) === 'undefined') {
            e.rpm = 'n/a'
        } else {
            e.rpm_time = influxResponse.results[i].series[0].values[0][0]
            e.rpm_cluster = influxResponse.results[i].series[0].values[0][1]
            e.rpm_environment = influxResponse.results[i].series[0].values[0][2]
            e.rpm_hostname = influxResponse.results[i].series[0].values[0][3]
            e.rpm_op = influxResponse.results[i].series[0].values[0][4]
            e.rpm_rpm = influxResponse.results[i].series[0].values[0][5]
            e.rpm_version = influxResponse.results[i].series[0].values[0][6]
            enrichedElementsCounter++
        }
    })
    logger.info("Enriched elements with data from influxDB:", enrichedElementsCounter)
    writeToDb(servers, incomingDataResponse)
}


