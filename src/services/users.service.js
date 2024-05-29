

const NewUserDto = require('../DTO/new-user.dto')

const NewUserDao = require('../DAO/mongo/new-user-dao.mongo')
const NewUserDaoFS = require('../DAO/filesystem/user-dao.filesystem')

const CustomError = require('../handlers/CustomError')
const TYPE_ERRORS = require('../handlers/errors/types-errors')
const winstonLogger = require('../utils/winston/devLogger.winston')
const {usersRepository: Users, cartsRepository: Carts} = require('../repositories')
const transport = require('../utils/nodemailer.util')
const emailDataGenerator = require('../utils/generate-email-data.util')
const {NewUserResponse, GeneratePasswordCode, ChangePasswordConfirmed, DeletedUserResponse} = require('../constants/mail-responses')
const generateCode = require('../utils/generate-code.util')
const bcrypt = require('../utils/crypt-password.util')



    
    const getUsers = async () => {
        try {
    
            const users = await Users.getUsers() 
    
            return users
        } catch (error) {
            throw error
        }
    }

    const getUser = async (emailUser) => {
        try {
            const userDB = await Users.getUser(emailUser) 
    
            if (userDB) {
                const {first_name, last_name, age, email, role, id, cart, password } = userDB
                
                const user = {
                    id,
                    first_name,
                    last_name,
                    age,
                    email,
                    role,
                    cart,
                    password,
                }
    
                return user
    
            } else {
                return null
            }
    
        } catch (error) {
            throw error
        }
    }
        
    const getUserById = async (id) => {
        try {
            const userById = await Users.getUserById(id)
    
            return userById
        } catch (error) {
            throw error
        }
    }
    const checkUser = async (userEmail) => {
        try {
        const userCheck = Users.checkUser(userEmail)
        return userCheck
    } catch (error) {
        throw error
    }
}

const checkUserName = async (userId) => {
    try {
        const userCheck = Users.checkUserName(userId)
        return userCheck
    } catch (error) {
        throw error
    }
}

const createUser = async (userData) => {
    try {

        const {first_name, last_name, age, email, userName, password} = userData

        if (!first_name || !last_name || !age || !email || !userName || !password) {
            new Error('Information missing')
        }

        const user = await Users.checkUser(email) 
        const userNameCheck = await Users.checkUserName(userName) 

        if (user || userNameCheck) {
            new Error('User exists')
        }  
        
        if (userName.lenght > 10) {
            new Error('UserName error')
        }
    
        const newUserDto = new NewUserDto({
            first_name,
            last_name,
            age,
            email,
            userName,
            password,
        })

        const newUser = await Users.createNewUser(newUserDto)

        const responseMail = new NewUserResponse(newUser)

        const emailData = emailDataGenerator(newUser, responseMail)

        const confirmation = await transport.sendMail(emailData)
        console.log(confirmation)
        
        winstonLogger.info(`FROM users.service: New user created`)
        return newUser
        
    } catch (error) {
        throw error
    }

}


const changePassword = async (userId, newPassword) => {
    try {
        const user = await Users.getUserById(userId)

        const passwordCheck = bcrypt.useValidPassword(user, newPassword)
        
        if (passwordCheck) {
            console.log('same password')
            return 
        }
        
        const newPasswordHashed = bcrypt.createHash(newPassword)

        user.password = newPasswordHashed

        const userUpdated = Users.updateUser(userId, user)

        if (!userUpdated) {return 'error changing password'}

        winstonLogger.info(`FROM Users.Service: Password Change confirmed for user ${userUpdated.id}`)

        const responseMail = new ChangePasswordConfirmed(userUpdated)
        const emailData = emailDataGenerator(userUpdated, responseMail)
        const {response} = await transport.sendMail(emailData)
        console.log(response)

        return userUpdated
    } catch (error) {
        throw error
    }
}

const changeRole = async (userId, newRole) => {
    try {
        if (!newRole === 'client' || !newRole === 'premium') {
            console.log('AGREGAR ERROR DE INGRESO DE ROL')
        }

        if (newRole === 'premium') {
            const {documents} = await Users.getUserById(userId)

            if (documents.length != 3) {
                return 'Missing documents to confirm premium user'
            }

        }

        const userReturn = Users.changeRole(userId, newRole)
        return userReturn
    } catch (error) {
        throw error
    }
}

const forgetPassword = async (access_token, userId) => {
    try {
        const user = await Users.getUserById(userId)

        if (!user) return null

        const restoreLink = 'http://localhost:3000/auth/verify-password/'+access_token

        const responseMail = new GeneratePasswordCode(user, restoreLink)
        const emailData = emailDataGenerator(user, responseMail)
        const {response} = await transport.sendMail(emailData)
        console.log(response)

    } catch (error) {
        throw error
    }
}

const addCartToUser = async (cartId, userId) => {
    try {
        const user = await Users.getUserById(userId)

        const addedCart = await Users.addCartToUser(cartId, userId) 

        winstonLogger.info(`FROM users.service: Cart ${cartId} added to user ${userId}`)
        return 'Cart Added to user'
    } catch (error) {
        throw error
    }

}


const addDocToUser = async (userId, document, path) => {
    try {
        if (!userId || !document || !path) {
            new Error('Information missing')
        }

        if (document !== 'userIdentification' || document !== 'userAddress' || document !== 'userAccount') {
            new Error('Error with input data')
        }

        const docUpload = await Users.addDocToUser(userId, document, path)

    } catch (error) {
        throw error
    }
}

const deleteCartFromUser = async (cartId, userId) => {
    try {


        return 'Cart deleted from user'
    } catch (error) {
        throw error
    }

}

const addTicketToUser = async (userId, saleId) => {
    try {
        const user = await Users.getUserById(userId)

        const addedTicket = await Users.addTicketToUser(userId, saleId)

        winstonLogger.info(`FROM users.service: Ticket id: ${saleId} to user ${userId}`)
        return 'Cart Added to user'
    } catch (error) {
        throw error
    }
}

const addProductToUser = async (userId, productId) => {
    try {
        const user = await Users.getUserById(userId)

        const addedTicket = await Users.addProductToUser(userId, productId)

        winstonLogger.info(`FROM users.service: Product id: ${productId} added to user ${userId}`)
        return 'Cart Added to user'
    } catch (error) {
        throw error
    }
}

const updateUser = async (userId, user) => {
    try {
        const userUpdate = await Users.updateUser(userId, user)

        winstonLogger.info(`FROM users.service: User ${userId} has been updated`)
        return 'User Updated'
    } catch (error) {
        throw error
    }
}

const setLastConnection = async (userId) => {
    try {
        const userRaw = await Users.getUserById(userId)

        userRaw.last_connection = new Date()

        const userUpdated = await Users.updateUser(userId, userRaw)

        return userUpdated
    } catch (error) {
        throw error
    }
}

const checkUserCart = async (userId) => {
    try {

        const LS = 0
        const cartId = await Users.checkUserCartDao(userId)

        CONSOLER(CS, cartId, LS)

        if (!cartId) {return null}
        const cartData = await Carts.cartFindId(cartId)

        CONSOLER(CS, cartData, LS)
        
        return cartData
    } catch (error) {
        throw error
    }
}

const getUserTickets = async (userId) => {
    try {
        
        const {lastSale, oldSales} = await Users.getUserTickets(userId)

        return {lastSale, oldSales}
    } catch (error) {
        throw error
    }
}

const deleteUser = async (userId) => {
    try {
        const userResponse = await Users.deleteUser(userId)
    } catch (error) {
        throw error
    }
}

const deletedUsersInactivity = async () => {
    try {

        const usersAll = await Users.getUsers()

        const actualDate = new Date().getTime()

        const twoDays = 172800000

        const dateFactor = actualDate - twoDays


        const deleteUsersIds = []

            
        usersAll.forEach(user => {
            const {last_connection} = user
    
            const last_connectionUTC = new Date(last_connection).getTime()
    
            if (last_connectionUTC < dateFactor) {
                const userId = user.id
    
                const userResponse = Users.deleteUser(userId)

                if (!userResponse) {
                    return 'error'
                }

                deleteUsersIds.push(userId)
            }                
        })

        const usersDeleted = await Users.getSomeUsersByIds(deleteUsersIds)

        usersDeleted.forEach(deletedUser => {
            const user = Users.getUserById(deletedUser)

            const responseMail = new DeletedUserResponse(user)
            const emailData = emailDataGenerator(user, responseMail)
            const {response} = transport.sendMail(emailData)
            console.log(response)
        })
        
        return deleteUsersIds
    } catch (error) {
        throw error
    }
}

module.exports = {
    createUser, 
    getUser, 
    getUserById, 
    checkUserName, 
    getUsers, 
    changePassword,
    changeRole,
    forgetPassword,
    addCartToUser, 
    addDocToUser, 
    addProductToUser,
    updateUser, 
    setLastConnection,
    checkUserCart, 
    addTicketToUser, 
    getUserTickets, 
    checkUser, 
    deleteCartFromUser, 
    deleteUser,
    deletedUsersInactivity
} 