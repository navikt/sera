const mongoose = require('mongoose');
const config = require('../config/config')


const createTimestampSchema = function() {
    const timestampSchema = mongoose.Schema({
        timestamp: String
    });
    return timestampSchema
};

const timestampSchema = createTimestampSchema();

module.exports = mongoose.model('timestamp', timestampSchema, "timestamp");
