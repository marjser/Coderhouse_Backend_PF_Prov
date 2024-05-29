
class CartsRepository {
	constructor(dao) {
		this.dao = dao 
	}

    async allCarts () {
        try {
            return this.dao.allCarts()
        } catch (error) {
            throw error
        }
    }

    async cartFindId (cartId) {
        try {
            return this.dao.cartId(cartId)
        } catch (error) {
            throw error
        }
    }
    
    async addCart (userId) {
        try {
            return this.dao.addCart(userId)
        } catch (error) {
            throw error
        }
        
    }

    async addProdToCart (cid, pid) {
        try {
            return this.dao.addProdToCart(cid, pid)
        } catch (error) {
            throw error
        }
    }

    async addSomeProdsToCart (cartId, products) {
        try {
            return this.dao.addSomeProdsToCart(cartId,products )
        } catch (error) {
            throw error
        }
    }

    async addQuantityProdtoCart (cartId, productId, quantity, subtract) {
        try {
            return this.dao.addQuantityProdtoCart(cartId, productId, quantity, subtract)
        } catch (error) {
            throw error
        }
    }

    
    async deleteAllProdFromCart (cid) {
       try {
        return this.dao.deleteAllProdFromCart(cid)
        } catch (error) {
            throw error
        }
   }

   async offlineCart (cid) {
    try {
        return this.dao.offlineCart(cid)
    } catch (error) {
        throw error
    }
   }

   async deleteCart (id) {
       try {
            return this.dao.deleteCart(id)
        } catch (error) {
            throw error
        }
   }
  
   async deleteProdFromCart (cid, pid) {
        try {
            return this.dao.deleteProdFromCart (cid, pid)
        } catch (error) {
            throw error
        }

    }

    async finishCart (cartDocs, id) {
        try {
            return this.dao.finishCart (cartDocs, id)
        } catch (error) {
            throw error
        }
    }

}


module.exports = CartsRepository