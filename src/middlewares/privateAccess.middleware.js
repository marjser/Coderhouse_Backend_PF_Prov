const CustomError = require("../handlers/CustomError")
const EErrors = require("../handlers/errors/enum-errors")
const TYPE_ERRORS = require("../handlers/errors/types-errors")

function privateAccess (req, res, next) {
    if (!req.session.user) {
        CustomError.createError({
            name: TYPE_ERRORS.FORBIDDEN,
            cause: 'Forbidden Access',
            message: 'You need to be logged to enter the url',
            code: EErrors.FORBIDDEN,
        })  
        return res.redirect('/login')
    }
    next()
}

module.exports = privateAccess