module.exports = {
    hostname: {
        mongoSchemaDefinition: {type: String, unique: true, lowercase: true},
        schemaType: 'string'
    },
    ipAddress: {
        mongoSchemaDefinition: {type: String, lowercase: true},
        schemaType: 'string'
    },
    environment: {
        mongoSchemaDefinition: {type: String, lowercase: true},
        schemaType: 'string'
    },
    environmentClass: {
        mongoSchemaDefinition: {type: String, lowercase: true},
        schemaType: {'enum': ['u', 't', 'q', 'p']}
    },
    status: {
        mongoSchemaDefinition: {type: String, lowercase: true},
        schemaType: {'enum': ['poweredOn', 'poweredon', 'poweredOff', 'poweredoff', 'suspended']}
    },
    application: {
        mongoSchemaDefinition: {type: String, lowercase: true},
        schemaType: 'string'
    },
    type: {
        mongoSchemaDefinition: {type: String, lowercase: true},
        schemaType: 'string'
    },
    owner: {
        mongoSchemaDefinition: {type: String},
        schemaType: 'string'
    },
    cpu: {
        mongoSchemaDefinition: {type: Number},
        schemaType: 'number'
    },
    disk: {
        mongoSchemaDefinition: {type: Number},
        schemaType: 'number'
    },
    memory: {
        mongoSchemaDefinition: {type: Number},
        schemaType: 'number'
    },
    os: {
        mongoSchemaDefinition: {type: String, lowercase: true},
        schemaType: 'string'
    },
    site: {
        mongoSchemaDefinition: {type: String, lowercase: true},
        schemaType: {'enum': ['so8', 'u89']}
    },
    custom: {
        mongoSchemaDefinition: {type: Boolean},
        schemaType: 'boolean'
    },
    srm: {
        mongoSchemaDefinition: {type: Boolean},
        schemaType: 'boolean'
    },
    created: {
        mongoSchemaDefinition: {type: String},
        schemaType: 'string'
    }
}
