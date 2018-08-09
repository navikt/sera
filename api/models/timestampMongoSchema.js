const mongoose = require('mongoose')


const TimestampSchema = new mongoose.Schema({
    timestamp: {type: Date, default: Date.now}
})

exports.TimestampMongoSchema = mongoose.model('Timestamp', TimestampSchema)