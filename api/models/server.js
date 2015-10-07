module.exports = {
    hostname: {
        mongoSchemaDefinition: {type: String},
        schemaType: 'string'
    },
    ipAddress: {
        mongoSchemaDefinition: {type: String},
        schemaType: 'string'
    },
    environment: {
        mongoSchemaDefinition: {type: String},
        schemaType: 'string'
    },
    environmentClass: {
        mongoSchemaDefinition: {type: String},
        schemaType: {'enum': ['u', 't', 'q', 'p']}
    },
    status: {
        mongoSchemaDefinition: {type: String},
        schemaType: {'enum': ['poweredOn', 'poweredOff', 'suspended']}
    },
    application: {
        mongoSchemaDefinition: {type: String},
        schemaType: 'string'
    },
    type: {
        mongoSchemaDefinition: {type: String},
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
    notes: {
        mongoSchemaDefinition: {type: String},
        schemaType: 'string'
    },
    os: {
        mongoSchemaDefinition: {type: String},
        schemaType: {'enum': ['windows', 'rhel']}
    },
    site: {
        mongoSchemaDefinition: {type: String},
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
