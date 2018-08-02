const mongoose = require('mongoose')


const ServerSchema = new mongoose.Schema({
    items: [{
        hostname: {type: String},
        os: {type: String},
        environmentClass: {type: String},
        type: {type: String},
        site: {type: String},
        memory: {type: Number},
        cpu: {type: Number},
        disk: {type: Number},
        status: {type: String, enum: ['poweredOn', 'poweredOff', 'suspended']},
        ipAddress: {type: String},
        custom: {type: Boolean},
        owner: {type: String},
        application: {type: String},
        environment: {type: String},
        created: {type: String},
        environmentName: {type: String},
        calculations: {type: Object},
        unit: {type: String, default: 'n/a'},
        rpm_rpm: {type: String, default: 'n/a'},
        rpm_version: {type: String, default: 'n/a'},
        rpm_time: {type: String, default: 'n/a'},
    }],
    timestamp: {type: Date, default: Date.now}
})

exports.ServerMongoSchema = mongoose.model('Server', ServerSchema)
