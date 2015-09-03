var mongoose = require('mongoose')
var _ = require('lodash')

var Server = {}

var serverDefinition = {
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
    site: {type: String},
    custom: {type: Boolean},
    srm: {type: Boolean}
}

var serverSchema = mongoose.Schema(serverDefinition);

serverSchema.set('toJSON', {
    transform: function (doc, ret, options) {
        delete ret._id;
    }
});

Server.model = mongoose.model('Server', serverSchema)

Server.create = function (object) {
    var server = {}
    console.log("object", object);
    _.forIn(serverDefinition, function (value, key) {
        var incomingValue = object[key]
        console.log("inc val", incomingValue);
        if (incomingValue){
            if (serverDefinition[key].type === String && typeof incomingValue === 'string'){ //TODO: fjernes v/bruk av json-schema validering?
                incomingValue = incomingValue.toLowerCase()
            }
            server[key] = incomingValue
        }
    })
    return server
}

module.exports = Server
