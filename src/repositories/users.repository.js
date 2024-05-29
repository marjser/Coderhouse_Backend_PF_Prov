
class UsersRepository {
	constructor(dao) {
		this.dao = dao 
	}
    
    async getUsers() {
        try {
            return this.dao.getUsers()
        } catch (error) {
            throw error
        }
    }
    
    async getUser(email) {
        try {
            return this.dao.getUser(email)
        } catch (error) {
            throw error
        }
    }

    async getUserById(id) {
        try {
            return this.dao.getUserById(id)
        } catch (error) {
            throw error
        }
    }

    async getSomeUsersByIds(arrayOfIds) {
        try {
            return this.dao.getSomeUsersByIds(arrayOfIds)
        } catch (error) {
            throw error
        }
    }

	async checkUser(email) {
        try {
            return await this.dao.checkUser(email)
        } catch (error) {
            throw error
        }
	}

	async checkUserName(userName) {
        try {
            return await this.dao.checkUserName(userName)
        } catch (error) {
            throw error
        }
	}

    async createNewUser(userData) {
        try {
            return this.dao.createNewUser(userData)
        } catch (error) {
            throw error
        }
    }

    async changeRole(userId, newRole) {
        try {
            return this.dao.changeRoleDao(userId, newRole)
        } catch (error) {
            throw error
        }
    }


    async addCartToUser(cartId, userId) {
        try {
            return this.dao.addCartToUserDao(cartId, userId)
        } catch (error) {
            throw error
        }
    }

    async addDocToUser (userId, document, path) {
        try {
            return this.dao.addDocToUser(userId, document, path)
        } catch (error) {
            throw error
        }
    }

    async deleteCartFromUser (cartId, userId) {
        try {
            return this.dao.deleteCartFromUserDao(cartId, userId)
        } catch (error) {
            throw error
        }
    }

    async addTicketToUser(userId, saleId) {
        try {
            return this.dao.addTicketToUserDao(userId, saleId)
        } catch (error) {
            throw error
        }
    }

    async addProductToUser(userId, productId) {
        try {
            return this.dao.addProductToUserDao(userId, productId)
        } catch (error) {
            throw error
        }
    }

    async updateUser(userId, userInput) {
        try {
            return this.dao.updateUserDao(userId, userInput)
        } catch (error) {
            throw error
        }
    }

    async setLastConnection(userId) {
        try {
            return this.dao.setLastConnection(userId)
        } catch (error) {
            throw error
        }
    }

    async checkUserCartDao(userId) {
        try {
            return this.dao.checkUserCartDao(userId)
        } catch (error) {
            throw error
        }
    }

    async getUserTickets(userId) {
        try {
            return this.dao.getUserTickets(userId)
        } catch (error) {
            throw error
        }
    }

    async deleteUser(userId) {
        try {
            return this.dao.deleteUserDao(userId)
        } catch (error) {
            throw error
        }
    }
}

module.exports = UsersRepository

