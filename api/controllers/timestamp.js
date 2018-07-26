const {ServerMongoSchema} = require('../models/serverMongoSchema')
const logger = require('../logger')

exports.getHoursSinceLastDbUpdate = () => {
    return (req, res) => {
        try {
            ServerMongoSchema.find((err, servers) => {
                if (err) throw err
                else {
                    logger.info(`Last DB save at ${servers[0].timestamp}`)
                    const timestamp = servers[0].timestamp
                    const serverTime = new Date()
                    const hoursSinceLastUpdate = (Math.floor(Math.abs(serverTime - timestamp) / 3600000)).toString();
                    logger.info(`Request for time since last update: ${hoursSinceLastUpdate} hours ago.`)
                    res.status(200).send(hoursSinceLastUpdate)
                }
            })
        } catch (err) {
            logger.error(err)
            res.status(500).send(err)
        }
    }}