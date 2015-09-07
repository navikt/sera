var serverDefinition = require('./server')
var _ = require('lodash')

var baseJsonSchema = {
  '$schema': 'http://json-schema.org/draft-04/schema#',
  'id': '/api/v1/servers',
  'description': 'schema defining valid JSON for registering servers',
  'type': 'array',
  'uniqueItems': true,
  'items': {
    'type': 'object',
    'properties': {},
    'required': []
  }
}

var enrichWithServerDefinition = function (baseJsonSchema, serverDefinition) {
  var jsonSchema = _.cloneDeep(baseJsonSchema)

  for (var key in serverDefinition) {
    jsonSchema.items.properties[key] = {type: serverDefinition[key].schemaType}
  }

  return jsonSchema
}

module.exports = enrichWithServerDefinition(baseJsonSchema, serverDefinition)
