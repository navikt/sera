const {fetch} = require('../common')
const config = require('../../config/config')
const logger = require('../../logger')

exports.enrichWithFasitData = async (incomingDataElements) => {
    try {
        logger.info('Querying Fasit...')
        const fasitData = await fetch(config.fasitNodesUrl)
        logger.info('Got data from Fasit...')
        return incomingDataElements.map(function (incomingDataElement) {
            const fasitElement = fasitData.filter(function (fasitElement) {
                return fasitElement.hostname === incomingDataElement.hostname
            })
            if (!(fasitElement.length === 0)) {
                incomingDataElement.application = fasitElement[0].applicationMappingName;
                incomingDataElement.environmentName = fasitElement[0].environmentName;
                return incomingDataElement
            } else if (!incomingDataElement.application) {
                incomingDataElement.application = "n/a"
            } else if (!incomingDataElement.environmentName) {
                incomingDataElement.environmentName = "n/a"
            }
            return incomingDataElement
        })
    } catch (err) {
        throw('ERROR enriching servers with data from Fasit: ' + err.toString())
    }
}

