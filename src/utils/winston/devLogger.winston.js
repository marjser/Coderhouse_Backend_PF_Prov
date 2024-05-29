const winston = require('winston')
const customWinston = require('./custom.winston')

const winstonLogger = winston.createLogger({
    levels: customWinston.levels,
    transports: [ 
        new winston.transports.Console({ 
            level:'debug',
            format: winston.format.combine(
                winston.format.colorize({ colors: customWinston.colors }),
                winston.format.simple()
            )
        }),
        new winston.transports.File({
            filename: './errorsDev.log', 
            level:'error',
            format: winston.format.simple()
        })      
    ]
})

module.exports = winstonLogger

