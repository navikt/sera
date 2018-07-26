const {fetch} = require('../common')
const config = require('../../config/config')
const logger = require('../../logger')


exports.enrichWithNoraData = async (incomingDataElements) => {
    try {
        logger.info('Querying Nora...')
        const units = await fetch(config.noraUrl)
        logger.info('Got data from Nora...')
        return incomingDataElements.map(enrichedElement => {
            const application = enrichedElement.application
            if (!application) {
                enrichedElement.unit = 'n/a'
                return enrichedElement
            }
            units.forEach(unit => {
                if (unit.applications.indexOf(application) > -1) {
                    enrichedElement.unit = unit.name
                    return enrichedElement
                }
            })
            return enrichedElement
        })
    } catch(err) {
        throw('ERROR enriching servers with data from Nora: ' + err.toString())
    }
}