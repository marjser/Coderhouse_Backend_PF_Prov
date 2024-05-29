
class ProductsRepository {
    constructor(dao) {
        this.dao = dao
    }

    async allProd (page, limit, sort, cat, query) {
        try {
            return this.dao.allProd (page, limit, sort, cat, query)
        } catch (error) {
            throw error
        }
    }
    async prodId (id) {
    try {
        return this.dao.prodId (id)        
    } catch (error) {
        throw error
    }

    }
    async addProd (newProdInfo) {
        try {
            return this.dao.addProd(newProdInfo)
        } catch (error) {
            throw error
        }
    }
    async setOfflineProduct (prodId) {
        try {
            return this.dao.setOfflineProduct(prodId)
        } catch (error) {
            throw error
        }
    }
    async setProductStockDao (prodId, newStock) {
        try {
            return this.dao.setProductStockDao(prodId, newStock)
        } catch (error) {
            throw error
        }
    }
}

module.exports = ProductsRepository