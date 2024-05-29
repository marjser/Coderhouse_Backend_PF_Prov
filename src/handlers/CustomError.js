
class CustomError {
    static createError({name = 'Error', cause, message, code, origin}) {
        const error = new Error(message)
        error.cause = cause
        error.name = name
        error.code = code
        error.origin = origin
        throw error
    }
}


module.exports = CustomError


