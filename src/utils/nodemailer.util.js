const nodemailer = require('nodemailer')
const {nodemailerConfig} = require('../configs/mail.config')

const transport = nodemailer.createTransport({
    host: nodemailerConfig.host,
    service: nodemailerConfig.service,
    tls: {
        rejectUnauthorized: false
    },
    port: nodemailerConfig.port,
    auth: {
        user: nodemailerConfig.user,
        pass: nodemailerConfig.pass
    }
})


module.exports = transport