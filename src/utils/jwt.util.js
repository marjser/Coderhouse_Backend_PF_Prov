const jwt = require('jsonwebtoken')
const jwtConfig = require('../configs/jwt.config')



const generateToken = (user) => {
    const token = jwt.sign({user}, jwtConfig.PRIVATE_KEY, {expiresIn: '1h'})
    return token
}

const authToken = (req, res, next) => {
    const authHeader = req.headers.authorization

    if (!authHeader) {
        return res.status(401).send({error: 'Not authenticated'})
    }

    const token = authHeader.split(" ")[1]

    jwt.verify(token, jwtConfig.PRIVATE_KEY, (error, credentials) => {

        if (error) return res.status(403).send({error: 'Not authorized'})

        req.user = credentials.user
        next()
    })
}

module.exports = {
    generateToken,
    authToken 
}