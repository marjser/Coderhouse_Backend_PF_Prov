require('dotenv').config()


nodemailerConfig = {
    host: process.env.MAILER_HOST,
    service: process.env.MAILER_SERVICE,
    port: process.env.MAILER_PORT,
    user: process.env.MAILER_USER,
    pass: process.env.MAILER_PASS,
}

mailResponseConfig = {
    from: `ECOMMERCE PROYECT <${process.env.MAILER_USER}>`,
}

module.exports = {
    nodemailerConfig,
    mailResponseConfig
}