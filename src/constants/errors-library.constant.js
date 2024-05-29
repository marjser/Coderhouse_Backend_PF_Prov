const EErrors = require("../handlers/errors/enum-errors");
const TYPE_ERRORS = require("../handlers/errors/types-errors");

const errorLibrary = {
    ERROR_403: {
        carts_controller_purchase: {
            name: TYPE_ERRORS.FORBIDDEN,
            cause: 'Cart id missmatch in cart url',
            message: 'The cart id does not match the req.session.cartId',
            origin: '',
            code: EErrors.FORBIDDEN
        }
    },
    ERROR_500: {
        products_DB_Mongo: {
            name: TYPE_ERRORS.INTERNAL_SERVER_ERROR,
            cause: 'Error in loading resources',
            message: 'Error loading products files from product-dao.mongo',
            origin: 'MongoDB',
            code: EErrors.INTERNAL_SERVER_ERROR,
        }
    }
}

module.exports = errorLibrary