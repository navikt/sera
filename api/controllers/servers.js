const {validator, removeDuplicates} = require('./common')
const {enrichWithFasitData} = require('./sources/fasit')
// const {enrichWithCocaData} = require('./sources/coca')
const {enrichWithNoraData} = require('./sources/nora')
const {enrichWithInfluxData} = require('./sources/influx')
const serverDefinition = require('../models/serverDefinition')
const {ServerMongoSchema} = require('../models/serverMongoSchema')
const {TimestampMongoSchema} = require('../models/timestampMongoSchema')
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
            let servers = removeDuplicates(body)
            logger.info(`Verified ${servers.length} elements`)
            servers = await enrichWithFasitData(servers)
            logger.info(`Enriched elements with data from Fasit: ${servers.length}`)
            // Coca skrudd av.
            // servers = await enrichWithCocaData(servers)
            // logger.info(`Enriched elements with data from Coca: ${servers.length}`)
            servers = await enrichWithNoraData(servers)
            logger.info(`Enriched elements with data from Nora: ${servers.length}`)
            servers = await enrichWithInfluxData(servers)
            logger.info(`Enriched elements with data from InfluxDB: ${servers.length}`)
            ServerMongoSchema.remove({}, err => {
                if (err) throw err
                else {
                    logger.info(`Cleared database...`)
                    ServerMongoSchema.collection.insert(servers, (err, docs) => {
                        if (err) throw err
                        else {
                            logger.info(`${docs.ops.length} elements written to database`)
                            TimestampMongoSchema.remove({}, err => {
                                logger.info('Timestamp cleared')
                                if (err) throw err
                                else {
                                    timestampSchema = new TimestampMongoSchema()
                                    timestampSchema.save()
                                    logger.info('New timestamp set')
                                    res.status(201).send(`${docs.ops.length} elements written to database`)
                                }
                            })
                        }
                    })
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
        try {
            if (Object.keys(req.query).length > 0) {
                ServerMongoSchema.find(req.query, (err, servers) => {
                    if (err) throw err
                    logger.info(`Retrieved ${servers.length} elements from database based on query`)
                    res.status(200).send(servers)
                })
            } else {
                ServerMongoSchema.find((err, servers) => {
                    if (err) throw err
                    else {
                        logger.info(`Retrieved ${servers.length} elements from database`)
                        res.status(200).send(servers)
                    }
                })
            }
        } catch (err) {
            logger.error(err)
            res.status(500).send(err)
        }
    }
}
