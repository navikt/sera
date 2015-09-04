module.exports = ServerDefinition = {
    hostname: {
        type: String,
        schemaType: "string"
    },
    ipAddress: {
        type: String,
        schemaType: "string"
    },
    environment: {
        type: String,
        schemaType: "string"
    },
    environmentClass: {
        type: String,
        schemaType: {"enum": ["u", "t", "q", "p"]}
    },
    application: {
        type: String,
        schemaType: "string"
    },
    type: {
        type: String,
        schemaType: "string"
    },
    owner: {
        type: String,
        schemaType: "string"
    },
    cpu: {
        type: Number,
        schemaType: "number"
    },
    disk: {
        type: Number,
        schemaType: "number"
    },
    memory: {
        type: Number,
        schemaType: "number"
    },
    notes: {
        type: String,
        schemaType: "string"
    },
    os: {
        type: String,
        schemaType: {"enum": ["windows", "rhel"]}
    },
    site: {
        type: String,
        schemaType: {"enum": ["so8", "u89"]}
    },
    custom: {
        type: Boolean,
        schemaType: "boolean"
    },
    srm: {
        type: Boolean,
        schemaType: "boolean"
    }
}