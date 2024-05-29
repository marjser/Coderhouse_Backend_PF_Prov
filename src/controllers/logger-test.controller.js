const { Router } = require("express");

const router = Router()

const data = 'router de logger'

router.get('/', (req, res, next) => {
    try {
        req.logger.debug('logger debug')
        req.logger.info(`Logger desde ${data}`)
        req.logger.warning('Warning! You are accesing to products')
        req.logger.error('Error! You are accesing to products')
        req.logger.fatal('Error fatal')
        //throw new Error('Un error')
        
    } catch (error) {
        res.status(500).json({message: 'internal server error'})
    }
})

module.exports = router