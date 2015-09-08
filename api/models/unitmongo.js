var mongoose = require('mongoose')
var serverDefinition = require('./server')

var createMongoSchemaDefinitionFrom = function (serverDefinition) {
  var mongoSchema = {}

  for (var key in serverDefinition) {
    mongoSchema[key] = {type: serverDefinition[key].type}
  }

  return new mongoose.Schema(mongoSchema)
}

var mongoServerSchema = createMongoSchemaDefinitionFrom(serverDefinition)

mongoServerSchema.set('toJSON', {
  transform: function (doc, ret, options) {
    delete ret._id
  }
})

module.exports = mongoose.model('Server', mongoServerSchema)
