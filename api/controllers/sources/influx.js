const {fetch} = require('../common')
const config = require('../../config/config')
const logger = require('../../logger')


const queryString = `/query?u=${config.influxUser}&p=${config.influxPassword}&q=select+hostname%2C+rpm%2C+last(version)+from+%22rpm.install%22+where+rpm+!~+%2F%5Enav%2F+group+by+hostname%2C+rpm&db=metrics`
const requestString = config.influxUrl + queryString

exports.enrichWithInfluxData = async (incomingDataElements) => {
    try {
        logger.info('Querying InfluxDB...')
        const influxData = await fetch(requestString, {
            method: 'GET',
        })
        logger.info('Got data from InfluxDB...')
        const influxObjects = await createInfluxObjects(influxData)
        logger.info('Merging data...')
        return (enrichData(incomingDataElements, influxObjects))
    } catch (err) {
        logger.error('ERROR enriching servers with data from InfluxDB:')
        throw err
    }
}

const createInfluxObjects = (influxData) => {
    let influxObjects = []
    influxData.results[0].series.forEach(e => {
        influxObjects.push({
            hostname: e.tags.hostname,
            rpm_rpm: e.values[0][2],
            rpm_version: e.values[0][3],
            rpm_time: e.values[0][0]
        })
    })
    return influxObjects
}

const enrichData = (servers, influxObjects) => {
    return servers.map(server => {
        const results = influxObjects.filter(e => e.hostname === server.hostname)
        return (results.length > 0 ? {...results[0], ...server} : {...server})
    })
}

