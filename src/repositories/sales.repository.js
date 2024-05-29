
class SalesRepository {
    constructor(dao) {
        this.dao = dao
    }

    async saleInput (userInput, cartDocs) {
        try {
            return this.dao.saleInput(userInput, cartDocs)
        } catch (error) {
            throw error
        }
    }

    async findSaleById (id) {
        try {
            return this.dao.findSaleById(id)
        } catch (error) {
            throw error
        }
    }

}

module.exports = SalesRepository