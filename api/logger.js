const winston = require('winston')

winston.emitErrs = true;

let logger = [];

if (process.env.NODE_ENV === 'development') {
    logger = new winston.Logger({
        transports: [
            new winston.transports.Console({
                level: 'debug',
                handleExceptions: true,
                json: false,
                colorize: true
            })
        ],
        exitOnError: false
    })
} else if (process.env.NODE_ENV === 'test') {
    logger = new winston.Logger({
        transports: [
            new winston.transports.File({
                level: 'debug',
                filename: './testlogs.log',
                handleExceptions: true,
                json: false,
                maxsize: 5242880, //5MB
                maxFiles: 5,
                colorize: false
            })

        ],
        exitOnError: false
    })
} else {
    logger = new winston.Logger({
        transports: [
            new winston.transports.Console({
                level: 'info',
                handleExceptions: true,
                json: false,
                colorize: false
            })
        ],
        exitOnError: false
    });
}

module.exports = logger;
module.exports.stream = {
    write: function (message, encoding) {
        logger.info(message.slice(0, -1)); // removing newline appended to each log by morgan for pretties
    }
};

