const CustomError = require('../../handlers/CustomError')
const EErrors = require('../../handlers/errors/enum-errors')
const TYPE_ERRORS = require('../../handlers/errors/types-errors')
const fs = require('fs')
const Users = require('../../models/user.model')
const winstonLogger = require('../../utils/winston/devLogger.winston')
const { memoryPaths } = require('../../memory')
const {v4: uuidv4} = require('uuid')



class NewUserDaoFS {
    async checkUser (email) {        
        try {
            const usersJSON = await fs.promises.readFile(memoryPaths.usersPath, memoryPaths.encoder)
            const users = JSON.parse(usersJSON)

            const user = users.find((user) => user.email === email)


            return user

        } catch (error) {
            throw error
        }
    }
    

    async createNewUser (userData) {
        try {
            userData.sales = []
            userData.carts = []
            userData.role = 'usuario'
            userData.id = uuidv4()
            
            const usersJSON = await fs.promises.readFile(memoryPaths.usersPath, memoryPaths.encoder)
            const users = JSON.parse(usersJSON)
            
            users.push(userData)
            const usersJson = JSON.stringify(users)

            fs.promises.writeFile(memoryPaths.usersPath, usersJson, memoryPaths.encoder, (err) => {
                if (err) {
                    console.error('Error writing file:', err);
                    return;
                }
            }) 
            
            return userData

        } catch (error) {
            throw error
        }
    }

    async getUser (emailInput) {
        try {

            const usersJSON = await fs.promises.readFile(memoryPaths.usersPath, memoryPaths.encoder)
            const users = JSON.parse(usersJSON)

            const userRaw = users.find((user) => user.email === emailInput)

            if (!userRaw) {
                return null

            }
            const {id, first_name, last_name, age, email, role, carts, password} = userRaw

            let cartOk
            for (const cart of carts) {
                if (cart.status) {
                    cartOk = cart.cart.toString()
                }
            }
            
            const user = {
                id,
                first_name,
                last_name,
                age,
                email,
                role,
                cart: cartOk,
                password
            }

            return user
        } catch (error) {
            throw error
            
        }
    }


    async getUserById (id) {
        try {
            const usersJSON = await fs.promises.readFile(memoryPaths.usersPath, memoryPaths.encoder)
            const users = JSON.parse(usersJSON)

            const userById = users.find((user) => user.id === id)
            return userById
        } catch (error) {
            throw error
        }
    }
    

    async addCartToUserDao (cartId, userId) {
        try {
            const usersJSON = await fs.promises.readFile(memoryPaths.usersPath, memoryPaths.encoder)
            const users = JSON.parse(usersJSON)
        
            const user = users.find((user) => user.id === userId)
            const userIndex = users.findIndex((user) => user.id === userId)
            

            for (const cart of user.carts) {
                let cartIdUser = cart.cart

                if (cartId === cartIdUser) {
                    return 'cart Exists'
                }
            }


            
            user.carts.push({cart: cartId, status: true})
            users[userIndex] = user


            const usersJson = JSON.stringify(users)

            fs.promises.writeFile(memoryPaths.usersPath, usersJson, memoryPaths.encoder, (err) => {
                if (err) {
                    console.error('Error writing file:', err);
                    return;
                }
                console.log('File has been written successfully!')
            }) 

            console.log('FROM User-DAO-FS: Cart added to user')
        } catch (error) {
            throw error
        }
    }


    async addTicketToUserDao (userId, saleId) {
        try {
            const usersJSON = await fs.promises.readFile(memoryPaths.usersPath, memoryPaths.encoder)
            const users = JSON.parse(usersJSON)
        
            const user = users.find((user) => user.id === userId)
            const userIndex = users.findIndex((user) => user.id === userId)
            
            user.sales.push({sale: saleId})

            users[userIndex] = user

            const usersJson = JSON.stringify(users)

            fs.promises.writeFile(memoryPaths.usersPath, usersJson, memoryPaths.encoder, (err) => {
                if (err) {
                    console.error('Error writing file:', err);
                    return;
                }
                console.log('File has been written successfully!')
            }) 

            winstonLogger.info(`FROM new-user-dao.mongo: Ticket id ${saleId} inserted to user ${userId}`)
        } catch (error) {
            throw error
        }
    }


    async updateUserDao (userId, userInput) {
        try {

            const usersJSON = await fs.promises.readFile(memoryPaths.usersPath, memoryPaths.encoder)
            const users = JSON.parse(usersJSON)
        
            const userIndex = users.findIndex((user) => user.id === userId)

            users[userIndex] = userInput

            const usersJson = JSON.stringify(users)

            fs.promises.writeFile(memoryPaths.usersPath, usersJson, memoryPaths.encoder, (err) => {
                if (err) {
                    console.error('Error writing file:', err);
                    return;
                }
                console.log('File has been written successfully!')
            }) 

            winstonLogger.info(`FROM new-user-dao.memory: UserId ${userId} has been updated`)
            
            return 'user updated'
        } catch (error) {
            throw error
        }
    }


    async checkUserCartDao (userId) {
        try {
            const usersJSON = await fs.promises.readFile(memoryPaths.usersPath, memoryPaths.encoder)
            const users = JSON.parse(usersJSON)
        
            const user = users.find((user) => user.id === userId)
            const userIndex = users.findIndex((user) => user.id === userId)

            const { carts } = user
            const cartOk = carts.find(obj => obj.status === true)
            if (cartOk) {
                const cartId = cartOk.cart
                return cartId
                } else {return null}
        } catch (error) {
            throw error
        }
    }


    async getUserTickets (userId) {
        try {
            winstonLogger.warning('falta hacer getUserTickets en el dao')
    
        } catch (error) {
            throw error
            }
        }
    }


module.exports = NewUserDaoFS

