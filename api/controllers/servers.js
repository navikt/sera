const {createFields, removeKeys, validator} = require('./common')
const {enrichWithFasitData} = require('./sources/fasit')
const {enrichWithCocaData} = require('./sources/coca')
const {enrichWithNoraData} = require('./sources/nora')
const {enrichWithInfluxData} = require('./sources/influx')
const serverDefinition = require('../models/serverDefinition')
const {ServerMongoSchema} = require('../models/serverMongoSchema')
const logger = require('../logger')


exports.postServers = () => {
    return async (req, res) => {
        try {
            const {body} = req
            logger.info(`Received payload...`)
            const validation = validator(body, serverDefinition)
            if (!validation.valid) {
                logger.error('POST: JSON validation failed:', validation)
                res.status(422).json(validation)
                return null
            }
            logger.info(`Verified ${body.length} elements`)
            let servers = await enrichWithFasitData(body)
            logger.info(`Enriched elements with data from Fasit: ${servers.length}`)
            servers = await enrichWithCocaData(servers)
            logger.info(`Enriched elements with data from Coca: ${servers.length}`)
            servers = await enrichWithNoraData(servers)
            logger.info(`Enriched elements with data from Nora: ${servers.length}`)
            servers = await enrichWithInfluxData(servers)
            logger.info(`Enriched elements with data from InfluxDB: ${servers.length}`)
            ServerMongoSchema.remove({}, err => {
                if (err) throw err
                else {
                    logger.info(`Cleared database...`)
                    let serverSchema = new ServerMongoSchema()
                    servers.forEach(e => serverSchema.items.push(e))
                    serverSchema.save(err => {
                        if (err) throw err
                    })
                    logger.info(`${serverSchema.items.length} elements written to database`)
                    res.status(201).send(`${serverSchema.items.length} elements written to database`)
                }
            })
        } catch (err) {
            logger.error(err)
            res.status(500).send(err)
        }
    }
}

exports.getServers = () => {
    return (req, res) => {
        ServerMongoSchema.find((err, servers) => {
            if (err) throw err
            else {
                logger.info(`Retrieved ${servers[0].items.length} elements from database`)
                res.status(200).send(servers[0].items)
            }
        })
    }
}