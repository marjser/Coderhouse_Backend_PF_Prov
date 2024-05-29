const SaleOutputDto = require("../DTO/sale-output.dto")
const logger = require("../middlewares/winston-logger.middleware")
const ticketGenerator = require("../utils/ticket-genetaror.util")
const winstonLogger = require("../utils/winston/devLogger.winston")

const {usersRepository: Users, salesRepository: Sales} = require('../repositories/index')



const purchase = async (user, cartDocs) => {
    try {
        
        const saleData = await Sales.saleInput(user, cartDocs)
        const saleId = saleData.saleId
        const userId = user.id
        
        winstonLogger.info(`FROM Sales Service: Sale Succesfull / id: ${saleData.code} / ${new Date().toUTCString()}`)
        
        const saleUser = await Users.addTicketToUser(userId, saleId) 
        return saleData
    } catch (error) {
        throw error   
    }
}

const saleFindById = async (id) => {
    try {

        const saleData = await Sales.findSaleById(id)
        
        const ticket = ticketGenerator(saleData)
    
        return ticket
        
    } catch (error) {
        throw error
    }
}

module.exports = {purchase, saleFindById}

