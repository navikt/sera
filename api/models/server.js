var mongoose = require('mongoose')

var Server = {}

var serverSchema = mongoose.Schema({
    hostname: {type: String},
    ipAddress: {type: String},
    environment: {type: String},
    environmentClass: {type: String},
    application: {type: String},
    type: {type: String},
    owner: {type: String},
    cpu: {type: Number},
    disk: {type: Number},
    memory: {type: Number},
    notes: {type: String},
    os: {type: String},
    site: {type: String}
});

serverSchema.set('toJSON', {
    transform: function (doc, ret, options) {
        delete ret._id;
    }
});

Server.model = mongoose.model('Server', serverSchema)

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
        memory: obj.memory,
        notes: obj.notes,
        os: obj.os,
        site: obj.site
    }
}

module.exports = Server
