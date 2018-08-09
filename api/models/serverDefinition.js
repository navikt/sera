module.exports = {
    type: 'object',
    properties: {
        os: {
            type: 'string'
        },
        hostname: {
            type: 'string'
        },
        environmentClass: {
            type: 'string'
        },
        type: {
            type: 'string'
        },
        site: {
            type: 'string'
        },
        memory: {
            type: 'number'
        },
        cpu: {
            type: 'number'
        },
        disk: {
            type: 'number'
        },
        status: {
            type: 'string'
        },
        ipAddress: {
            type: 'string'
        },
        custom: {
            type: 'boolean'
        },
        owner: {
            type: 'string'
        },
        application: {
            type: 'string'
        },
        environment: {
            type: 'string'
        },
        created: {
            type: 'string'
        },
        Notes: {
            type: 'string'
        },
    },
    additionalProperties: false
}
