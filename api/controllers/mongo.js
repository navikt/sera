const mongoose = require('mongoose')
const ServerMongoModel = require('../models/servermongo')
const TimestampModel = require('../models/timestamp')
const logger = require('../logger')


// Clear Sera Database


exports.updateDatabase = function (servers, incomingDataResponse) {
    logger.info("Clearing previous data import timestamp")
    TimestampModel.remove({}, function (err) {
        if (err) {
            logger.error("Unable to delete timestamps:", err)
        } else {
            logger.info("Timestamp cleared")
        }
    })
    ServerMongoModel.remove({}, function (err) {
        if (err) {
            logger.error("Unable to clear Sera Database:", err)
        } else {
            logger.info("Sera Database cleared")
            // Save elements to database
            logger.info("Setting timestamp for data import")
            ServerMongoModel.collection.insert(servers, function (err, docs) {
                if (err) {
                    logger.error(err.message)
                } else {
                    logger.info(docs.ops.length + ' servers created')
                    incomingDataResponse.status(201).send(docs.ops.length + " servers created")
                    // Create timestamp after successful import of data
                    const now = new Date()
                    const jsonDate = now.toJSON()
                    const time = new TimestampModel({
                        timestamp: jsonDate
                    })
                    time.save(function (err) {
                        if (err) throw err;
                        logger.info("Timestamp: " + jsonDate + " saved in database")
                    })
                }
            })
        }
    })
}
