const {fetch} = require('../common')
const config = require('../../config/config')
const logger = require('../../logger')


exports.enrichWithCocaData = async (incomingDataElements) => {
    try {
        logger.info('Querying Coca...')
        const cocaRequestData = await buildCocaRequest(incomingDataElements)
        const cocaData = await fetch(config.cocaUrl, {
            method: 'POST',
            body: JSON.stringify(cocaRequestData)
        })
        logger.info('Got data from Coca...')
        return incomingDataElements.map((e, i) => {
            e.calculations = cocaData[i].calculations
            return e
        })
    } catch (err) {
        throw('ERROR enriching servers with data from Coca: ' + err.toString())
    }
}


const buildCocaRequest = (elements)  => {
    const returnTypeFromOS = (os) => {
        if (os.match(/2008/g)) {
            return 'win2008'
        } else if (os.match(/2012/g)) {
            return 'win2012'
        } else if (os.match(/red hat/g || os.match(/rhel/g))) {
            return 'rhel6'
        } else {
            return 'appliance'
        }
    }
    return elements.map(element => {
        const costElement = {}
        costElement.cpu = element.cpu
        costElement.memory = element.memory
        costElement.environment = element.environmentClass
        const validTypes = ['jboss', 'was', 'was_dmgr', 'bpm', 'bpm_dmgr', 'liberty', 'wildfly']
        if (validTypes.includes(element.type)) {
            costElement.type = element.type
        } else {
            costElement.type = returnTypeFromOS(element.os)
        }
        if (element.custom) {
            costElement.classification = 'custom'
        } else {
            costElement.classification = 'standard'
        }
        const itcamEnvironments = ['p', 'q0', 'q1', 'q3', 't3']
        if (itcamEnvironments.includes(element.environmentName)) {
            costElement.scapm = true
        }
        return costElement
    })
}
