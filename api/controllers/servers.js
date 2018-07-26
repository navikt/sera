const {createFields, removeKeys, validator} = require('./common')
const {enrichWithFasitData} = require('./sources/fasit')
const {enrichWithCocaData} = require('./sources/coca')
const {enrichWithNoraData} = require('./sources/nora')
const {enrichWithInfluxData} = require('./sources/influx')
const serverDefinition = require('../models/serverDefinition2')
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
                convertToCsv(servers[0].items.toObject())
            }
        })
    }
}

const convertToCsv = async (items) => {
    const servers = removeKeys(items, ['_id'])
    const fields = getFieldsFromArr(servers)
    const csv = generateCSV(servers, fields)
}

const getFieldsFromArr = (arr) => {
    let fields = []
    arr.forEach((e, i) => {
        const keys = createFields(e)
        keys.forEach(element => {
            if (!fields.includes(element)) fields.push(element)
        })
    })
    return fields
}

const generateCSV = (items, fields) => {
    // Create CSV header
    fields.splice(0, 1)
    fields.sort()
    fields.unshift('hostname')
    let csv = ''
    fields.forEach((e, i) => {
        if (i < fields.length - 1) csv += '"' + e + '"' + ','
        else csv += '"' + e + '"' + '\n'
    })
    // Create CSV rows
    items.forEach(e => {
        fields.forEach(field => {
            if (field.match(/([\w]+\.)+[\w]+(?=[\s]|$)/)) {
                const keys = field.split('.')
                let objectKey = e
                keys.forEach(key => {
                    objectKey = objectKey[key]
                })
                if (!objectKey) csv += '"n/a"' + ','
                else csv += '"' + objectKey + '"' + ','
            } else {
                if (!e[field]) csv += '"n/a"' + ','
                else csv += '"' + e[field] + '"' + ','
            }
        })
        csv = csv.substring(0, csv.length - 1)
        csv += '\n'
    })
    return csv
}
