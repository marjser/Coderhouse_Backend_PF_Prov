const NewSaleDto = require("../../DTO/sale-input.dto")
const Sales = require("../../models/sale.model")
const generateCode = require("../../utils/generate-code.util")



class SalesDao {
    async saleInput (userInput, cartDocs) {
        try {
            const saleData = new NewSaleDto(userInput, cartDocs)

            const saleCode = generateCode(saleData.user)
            saleData.code = saleCode

            const saleDataRaw = await Sales.create(saleData)

            const { _id, __v, code, saleDescription, total, user, createdAt} = saleDataRaw

            

            const saleDataReturn = {
                saleId: _id.toString(),
                code,
                saleDescription,
                total,
                user,
                createdAt
            }
            
            return saleDataReturn
        } catch (error) {
            throw error
        }
    }

    async findSaleById (id) {
        try {

            
            const {code, saleDescription, total, user, _id, createdAt} = await Sales.findById(id)
            
            const saleDataReturn = {
                id: _id.toString(),
                code,
                saleDescription,
                total,
                user,
                createdAt
            }
            
            return saleDataReturn
        } catch (error) {
            throw error
        }
    }

}


module.exports = SalesDao

