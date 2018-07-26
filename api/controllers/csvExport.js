const {createFields, removeKeys} = require('./common')
const {ServerMongoSchema} = require('../models/serverMongoSchema')
const logger = require('../logger')


exports.getCSV = () => {
    return async (req, res) => {
        try {
            ServerMongoSchema.find((err, servers) => {
                if (err) throw err
                else {
                    logger.info(`Retrieved ${servers[0].items.length} elements from database`)
                    const csv = convertToCsv(servers[0].items.toObject())
                    res.status(200).send(csv)
                }
            })
        }
        catch (err) {
            logger.error(err)
            res.status(500).send(err)
        }
    }
}

const convertToCsv = (items) => {
    const servers = removeKeys(items, ['_id'])
    const fields = getFieldsFromArr(servers)
    return generateCSV(servers, fields)
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
    logger.info('Generating CSV...')
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
    logger.info('CSV Complete!')
    return csv
}
