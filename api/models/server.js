var mongoose = require('mongoose')

var Server = {}

Server.model = mongoose.model('Server', mongoose.Schema({
    hostname: {type: String},
    ipAddress: {type: String},
    environment: {type: String},
    environmentClass: {type: String},
    application: {type: String},
    type: {type: String},
    owner: {type: String},
    cpu: {type: Number},
    disk: {type: Number},
    memory: {type: Number}
}))

Server.create = function (obj) {
    return {
        hostname: obj.hostname,
        ipAddress: obj.ipAddress,
        environment: obj.environment,
        environmentClass: obj.environmentClass,
        application: obj.application,
        owner: obj.owner,
        type: obj.type,
        cpu: obj.cpu,
        disk: obj.disk,
        memory: obj.memory
    }
}

module.exports = Server