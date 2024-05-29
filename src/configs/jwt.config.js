require('dotenv').config()

const jwtConfig = {
    PRIVATE_KEY: process.env.JWT_PRIVATE_KEY
}

module.exports = jwtConfig