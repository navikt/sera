#Server information application

## Generating self-signed certificate
```
openssl req -newkey rsa:2048 -nodes -keyout localhost.key -x509 -days 999 -out localhost.crt -config openssl.cnf
```
## Local variables
Local variables are stored in ./localvars.json. You need to create this file, and  it needs to have the following properties:

    "dbUrl": "mongodb://localhost:27017/sera",
    "dbUser": "",
    "dbPassword": "",
    "influxUrl": "http://influxdb.adeo.no:8086",
    "influxUser": "",
    "influxPassword": ""
   

