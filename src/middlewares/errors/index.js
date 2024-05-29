const EErrors = require("../../handlers/errors/enum-errors")
const TYPE_ERRORS = require("../../handlers/errors/types-errors")
const winstonLogger = require("../../utils/winston/devLogger.winston")



const errorMiddleware = (error, req, res, next) => {
    const errorLog = `Code: ${error.code} / Name: ${error.name} / Origin: ${error.origin} / Cause: ${error.cause} / Message: ${error.message} / ${new Date().toUTCString()}`
    winstonLogger.error(errorLog)


    switch (error.code) {
        case EErrors.BAD_REQUEST:
            res.status(EErrors.BAD_REQUEST).json({status: error.code, message: error.name})
            break;

        case EErrors.FORBIDDEN:
            res.status(EErrors.FORBIDDEN).json({status: error.code, message: error.name})
            break;
                
        case EErrors.BAD_GATEWAY:
            res.status(EErrors.BAD_GATEWAY).json({status: error.code, message: error.name})
            break;

        case EErrors.NOT_FOUND:
            res.status(EErrors.NOT_FOUND).json({status: error.code, message: error.name})
            break;

        case EErrors.UNAUTHORIZED:
            res.status(EErrors.UNAUTHORIZED).json({status: error.code, message: error.name})
            break;

        default:
            res.status(500).json({status: 500, message: 'Internal Server Error'})
    }
}

module.exports = errorMiddleware