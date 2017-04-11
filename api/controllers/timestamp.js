const TimestampModel = require('../models/timestamp')
const logger = require('../logger');

// Constructor for timestamp object.
const Timestamp = function (obj) {
    this._id = "";
    this.timestamp = "";
    this.__v = "";
    for (let prop in obj) this[prop] = obj[prop]
};

exports.createTimestamp = function () {
    return function (request, res) {
        const now = new Date()
        const jsonDate = now.toJSON();
        const time = new TimestampModel({
            timestamp: jsonDate
        });
        time.save(function (err) {
            if (err) {
                res.status(500).send("Error creating timestamp: " + err)
            } else {
                logger.info("Request to create new timestamp received, timestamp created");
                res.header('Content-Type', 'application/json; charset=utf-8')
                res.json(jsonDate)
            }
        });
    }
};

exports.deleteTimestamp = function () {
    return function (request, res) {
        TimestampModel.remove({}, function (err) {
            if (err) {
                res.status(500).send("Error clearing timestamp: " + err)
            } else {
                logger.info("Request to clear timestamp received, timestamp cleared");
                res.header('Content-Type', 'application/json; charset=utf-8')
                res.json('Timestamps cleared')
            }
        })
    }
};

exports.getTimestamp = function () {
    return function (request, res, next) {
        TimestampModel.find({}, function (err, result) {
            if (err) {
                res.status(500).send("Error reading timestamp: " + err)
            } else {
                const timestampObj = new Timestamp(JSON.parse(JSON.stringify(result[0])));
                const timestamp = new Date(timestampObj.timestamp);
                logger.info("Request for timestamp received from client, returned: " + timestampObj.timestamp);
                res.header('Content-Type', 'application/json; charset=utf-8')
                res.json(timestampObj.timestamp)
            }
        })
    }
};

exports.getHoursSinceLastDbUpdate = function () {
    return function (request, res, next) {
        TimestampModel.find({}, function (err, result) {
            if (err) {
                res.status(500).send("Server error: " + err)
            } else {
                const timestampObj = new Timestamp(JSON.parse(JSON.stringify(result[0])));
                const serverTime = new Date();
                const timestamp = new Date(timestampObj.timestamp);
                const hoursSinceLastUpdate = (Math.floor(Math.abs(serverTime - timestamp) / 3600000));
                logger.info("Request for time since last DB update from client, returned(hours): " + hoursSinceLastUpdate);
                res.header('Content-Type', 'application/json; charset=utf-8')
                res.json(hoursSinceLastUpdate)
            }
        });
    }
};
