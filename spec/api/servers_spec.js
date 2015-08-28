var frisby = require('frisby')

frisby.create('creates multiple servers')
    .post('http://localhost:6969/api/v1/servers',
    [{
        hostname: "a01apvl069.devillo.central",
        ipAddress: "10.0.69.96",
        owner: "johan lee",
        application: "sera",
        environment: "dev",
        cpu: "2",
        memory: "16",
        type: "was",
        disk: 100,
        environmentClass: "p"
    },
    {
        hostname: "a01apvl096.devillo.central",
        ipAddress: "10.0.69.96",
        owner: "johan lee",
        application: "sera",
        environment: "dev",
        cpu: "4",
        environmentClass: "q",
        type: "jboss",
        disk: 100,
        memory: "16"
    }
    ], {json: true})
    .expectStatus(201)
    .toss()

frisby.create('get on /servers returns all servers')
    .get('http://localhost:6969/api/v1/servers')
    .expectStatus(200)
    .toss()

frisby.create('get on /servers/:hostname returns server when it exists')
    .get('http://localhost:6969/api/v1/servers/a01apvl069.devillo.central')
    .expectStatus(200)
    .toss()

frisby.create("get on /servers/:hostname returns 404 when server doesn't exist")
    .get('http://localhost:6969/api/v1/servers/doesntexist')
    .expectStatus(404)
    .toss()



