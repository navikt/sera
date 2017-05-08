const request = require('request')
const logger = require('../logger')
const config = require('../config/config')

// Funksjon for eksekvering av orchestrator workflow extract all vms. Workflow ID angir miljø hvilket
// miljø payload sendes til

// Rest kall for API
exports.refresh = function () {
    return function (req, response, next) {
        request.post({
            auth: {
                user: config.srvseraUser,
                pass: config.srvseraPassword
            },
            url: config.orchestratorUrl + 'workflows/' + config.workflowID.substring(3) + '/executions', // Fjerner key felt fra application property
            json: true,
            body: {
                "parameters": [
                    {}
                ]
            }
        }, function (err, res) {
            if (!err && res.statusCode === 202) {
                logger.info('Orchestrator execution of workflow extract all VMs ID:', config.workflowID.substring(3), 'started')
                response.status(200).send('Orchestrator execution of workflow extract all VMs ID:', config.workflowID.substring(3), 'started')
            } else {
                if (!err) {
                    logger.error(res.statusCode)
                    logger.error(res.body)
                    response.status(500).send(res.body)
                } else {
                    logger.error(err)
                    response.status(500).send(err)
                }
            }
        })
    }
}

exports.callOrchestrator = function () {
    return function () {
        request.post({
            auth: {
                user: config.srvseraUser,
                pass: config.srvseraPassword
            },
            url: config.orchestratorUrl + 'workflows/' + config.workflowID.substring(3) + '/executions',
            json: true,
            body: {
                "parameters": [
                    {}
                ]
            }
        }, function (err, res) {
            if (!err && res.statusCode === 202) {
                logger.info('Orchestrator execution of workflow extract all VMs ID:', config.workflowID.substring(3), 'started')
            } else {
                if (!err) {
                    logger.error(res.body)
                } else {
                    logger.error(err)
                }
            }
        })
    }
}
