const Users = require('../../models/user.model')
const CustomError = require('../../handlers/CustomError')
const EErrors = require('../../handlers/errors/enum-errors')
const TYPE_ERRORS = require('../../handlers/errors/types-errors')
const ticketGenerator = require('../../utils/ticket-genetaror.util')
const winstonLogger = require('../../utils/winston/devLogger.winston')
const UserOutputMongo = require('../../DTO/user-dao-mongo-output.dto')


class NewUserDao {

    async getUsers () {
        try {
            const users = await Users.find({})
                .populate({
                    path: 'carts.cart',
                    populate: {path: 'products.product'}
                })  
                .populate({path: 'sales.sale'})
                .populate({path: 'products.product'})


            if (!users) {
                CustomError.createError({
                    name: TYPE_ERRORS.INTERNAL_SERVER_ERROR,
                    cause: 'Error with DB',
                    message: 'Error with DB',
                    code: EErrors.INTERNAL_SERVER_ERROR  
                })
            }

            const usersReturn = []
            
            users.forEach(user => {
                const userDtoRaw = new UserOutputMongo(user)

                const userDto = userDtoRaw.returnUserObject()
                usersReturn.push(userDto)
            })

            return usersReturn
        } catch (error) {
            throw error
            
        }
    }

    async getUser (username) {
        try {
            const userRaw = await Users.findOne({ email: username })
                .populate({
                    path: 'carts.cart',
                    populate: {path: 'products.product'}
                })  
                .populate({path: 'sales.sale'})
                .populate({path: 'products.product'})

            if (!userRaw) {
                CustomError.createError({
                    name: TYPE_ERRORS.BAD_REQUEST,
                    cause: 'Se ingresaron datos incorrectos de usuario',
                    message: 'Invalid user or password',
                    code: EErrors.BAD_REQUEST    
                })
            }
            const {_id, first_name, last_name, age, email, role, carts, password} = userRaw

            let cartOk
            for (const cart of carts) {
                if (cart.status) {
                    cartOk = cart.cart.toString()
                }
            }
            
            const user = {
                id: _id.toString(),
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

    async getSomeUsersByIds (arrayOfIds) {
        try {
        
            const users = await Users.find({_id: { $in: arrayOfIds}})

            const usersReturn = []

            users.forEach(user => {
                const userDtoRaw = new UserOutputMongo(user)

                const userDto = userDtoRaw.returnUserObject()
                usersReturn.push(userDto)
            })

            return usersReturn

        } catch (error) {
            throw error
        }
    }

    async checkUser (emailInput) {        
        try {

            const userRaw = await Users.findOne({ email: emailInput })
                .populate({
                    path: 'carts.cart',
                    populate: {path: 'products.product'}
                })  
                .populate({path: 'sales.sale'})
                .populate({path: 'products.product'})

            if (!userRaw) {
                return userRaw
            }


            const userDtoRaw = new UserOutputMongo(userRaw)

            const userCheck = userDtoRaw.returnUserObject()

            return userCheck
        } catch (error) {
            throw error
        }
    }

    async checkUserName (username) {        
        try {
            const userRaw = await Users.findOne({ userName: username })
                .populate({
                    path: 'carts.cart',
                    populate: {path: 'products.product'}
                })  
                .populate({path: 'sales.sale'})
                .populate({path: 'products.product'})

            if (!userRaw) return userRaw

            const userDtoRaw = new UserOutputMongo(userRaw)
            const userCart = userDtoRaw.findCartActive()

            const userReturn = userDtoRaw.returnUserObject()
            userReturn.cart = userCart


            return userReturn
        } catch (error) {
            throw error
        }
    }

    async createNewUser (userData) {
        try {

            const data = await Users.create(userData)

            const {_doc} = data
            const {_id, __v, ...otherData} = _doc

            const newUser = {
                id: _id.toString(),
                ...otherData
            }
            
            return newUser
        } catch (error) {
            throw error
        }
    }


    async getUserById (id) {
        try {
            const data = await Users.findById(id)
                .populate({
                    path: 'carts.cart',
                    populate: {path: 'products.product'}
                })  
                .populate({path: 'sales.sale'})
                .populate({path: 'products.product'})

            if (!data) return data

            const {_doc} = data

            const userDtoRaw = new UserOutputMongo(_doc)
            const userCart = userDtoRaw.findCartActive()

            const userReturn = userDtoRaw.returnUserObject()
            userReturn.cart = userCart


            return userReturn
        } catch (error) {
            throw error
        }
    }

    async changeRoleDao(userId, newRole) {
        try {
            const user = await Users.findById(userId)

            if (!user) {
                return 'error'
            }

            const {_id, role } = user

            if (newRole === role) {
                return 'error'
            }

            user.role = newRole

            const {acknowledged} = await Users.updateOne({_id: _id}, user)

            if (!acknowledged) {
                return 'error'
            }

            const userReturn = {
                id: _id.toString(),
                role: newRole
            }
            
            winstonLogger.info(`FROM new-user-dao.mongo: User id ${userReturn.id} changed role ${role} to ${newRole}`)

            const message = 'succesfull'

            return userReturn
        } catch (error) {
            throw error
        }
    }

    async addCartToUserDao (cartId, userId) {
        try {
            const user = await Users.findById(userId)
                .populate({
                    path: 'carts.cart',
                    populate: {path: 'products.product'}
                })  
                .populate({path: 'sales.sale'})
                .populate({path: 'products.product'})

            for (const cart of user.carts) {
                let cartIdUser = cart.cart.toString()

                if (cartId === cartIdUser) {
                    return 'cart Exists'
                }
            }
            
            user.carts.push({cart: cartId})
            const userUpdated = await Users.updateOne({_id: user._id}, user)

            
        } catch (error) {
            throw error
        }
    }

    async deleteCartFromUserDao (cartId, userId) {
        try {
            const user = await Users.findById(userId)
                .populate({
                    path: 'carts.cart',
                    populate: {path: 'products.product'}
                })  
                .populate({path: 'sales.sale'})
                .populate({path: 'products.product'})
           
            for (const cart of user.carts) {
                let cartIdUser = cart.cart.toString()

                if (cartId === cartIdUser) {
                    cart.status = false
                }
            }
            
            const {acknowledged} = await Users.updateOne({_id: user._id}, user)
        
            if (!acknowledged) {
                return console.log('error seteando status offline al carrito')
            }

            winstonLogger.info(`FROM new-user-dao.mongo: Cart id ${cartId} from user ${userId} set to offline`)
        } catch (error) {
            throw error
        }
    }

    async addProductToUserDao (userId, productId) {
        try {
            const user = await Users.findById(userId)
            
            user.products.push({product: productId})

            const {acknowledged} = await Users.updateOne({ _id: userId}, user)

            if (!acknowledged) {
                return console.log('AGREGAR ERROR: error actualizando last_connection')
            }

            winstonLogger.info(`FROM new-user-dao.mongo: Product id ${productId} inserted to user ${userId}`)
        } catch (error) {
            throw error
        }
    }

    async addTicketToUserDao (userId, saleId) {
        try {
            const user = await Users.findById(userId)
            
            user.sales.push({sale: saleId})
            const userUpdated = await Users.updateOne({_id: user._id}, user)

            winstonLogger.info(`FROM new-user-dao.mongo: Ticket id ${saleId} inserted to user ${userId}`)
        } catch (error) {
            throw error
        }
    }

    async updateUserDao (userId, user) {
        try {

            const {acknowledged} = await Users.updateOne({ _id: userId}, user)

            if (!acknowledged) {
                return 'error'
            }

            const userUpdated = await Users.findById(userId)
            
            return userUpdated
        } catch (error) {
            throw error
        }
    }

    async checkUserCartDao (userId) {
        try {
            const user = await Users.findById(userId)
            const { carts } = user
            const cartOk = carts.find(obj => obj.status === true)

            if (cartOk) {
                const cartId = cartOk.cart.toString()
                return cartId
                } else {return null}
        } catch (error) {
            throw error
        }
    }

    async getUserTickets (userId) {
        try {
            const {sales} = await Users.findById({ _id: userId , status: true }).populate('sales.sale')
            
            const salesOutput = []
            for (const sale of sales) {
                const saleRaw = sale.sale

                salesOutput.push({
                    id: saleRaw._id.toString(),
                    code: saleRaw.code,
                    saleDesc: saleRaw.saleDescription,
                    total: saleRaw.total,
                    user: saleRaw.user,
                    createdAt: saleRaw.createdAt
                }) 

            }
            
            const [lastSale, ...oldSales] = salesOutput.reverse()

            return {lastSale, oldSales}
        } catch (error) {
            throw error
        }
    }

    async addDocToUser (userId, document, path) {
        try {
            const userRaw = await Users.findById({ _id: userId , status: true })

            if (!userRaw) {
                new Error ('User does not exists')
            }

            const { _id } = userRaw

            if (userRaw.documents.length == 3) {
                console.log('documents full')
                return 'documents full'
            }

            const documentsPrueba = []

            if (userRaw.documents.length >= 1) {
                    const {documents} = userRaw
    
                    for (const userDocument of documents) {

                        const docName = userDocument.name
                        documentsPrueba.push(docName)
                  
                    } 
            }

            const docIndex = documentsPrueba.findIndex(doc => doc === document)

            if (docIndex == -1) {
                console.log('el documento no está')
                userRaw.documents.push({
                    name: document,
                    reference: path
                })
            }
            
            if (userRaw.documents.length == 0) {
                userRaw.documents.push({
                    name: document,
                    reference: path
                })
            }
            
            
            const {acknowledged} = await Users.updateOne({ _id: _id}, userRaw)
            
            
            if (!acknowledged) {
                new Error ('error uploading doc to user')
            }
            
            console.log(`document ${document} added to user ${userId}`)

        } catch (error) {
            throw error
        }
    }

    async deleteUserDao (userId) {
        try {
            const user = await Users.findById({_id: userId, status: true})

            if (!user) {
                console.log('CREAR ERROR - USER DOES NOT EXISTS')                     
            }

            user.status = false

            winstonLogger.info(`SE ELIMINA USER ${user._id.toString()}, FALTA AGREGAR STATUS Y MODIFICAR ESTE UPDATE`)

        } catch (error) {
            throw error
        }
    }
}

module.exports = NewUserDao