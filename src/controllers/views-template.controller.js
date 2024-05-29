const {Router} = require('express')
const { publicAccess, privateAccess, upload, roleAccess } = require('../middlewares')

const Services = require('../services')
const adminUsers = require('../configs/admin-users.config')

const CustomError = require('../handlers/CustomError')
const TYPE_ERRORS = require('../handlers/errors/types-errors')
const EErrors = require('../handlers/errors/enum-errors')
const { loadMessages } = require('../services/chat.service')


const router = Router()



// ENDPOINT PARA LOGIN

router.get('/login', publicAccess, (req, res) => {
    res.render('login.handlebars')    
})

// ENDPOINT PARA CREAR CUENTA

router.get('/signup', publicAccess, (req, res) => {
    res.render('signup.handlebars')    
})

// ENDPOINT PARA ENTRAR EL PERFIL. 

// Solo se puede ingresar si hay un session iniciada.

router.get('/profile', roleAccess, privateAccess, async (req, res) => {
    const { email } = req.session.user

    res.redirect(`/profile/${email}`)
})



// ENPOINT PARA ENTRAR AL PERFIL

router.get('/profile/:emailUser', roleAccess, privateAccess, async (req, res, next) => {
    try {

        const { emailUser } = req.params



        const user = await Services.Users.getUser(emailUser)

        const {lastSale, oldSales} = await Services.Users.getUserTickets(user.id)

        const emailSession = req.session.user.email

        if (emailSession !== emailUser ) {
            CustomError.createError({
                name: TYPE_ERRORS.FORBIDDEN,
                cause: 'Invalid user in the profile',
                message: 'Forbidden Access',
                code: EErrors.FORBIDDEN
            })
        }

        if (emailUser === adminUsers.email) {
            const user = adminUsers
            return res.render('profile.handlebars', {user})    

        }
    
        const jsonData = JSON.stringify({lastSale, oldSales, user})

        const userSales = JSON.stringify({lastSale, oldSales})
        res.render('profile.handlebars', {user, userSales, jsonData})  
    } catch (error) {
        next(error)
    }
})

router.post('/profile/:emailUser', roleAccess, privateAccess, upload.single('file'), async (req, res, next) => {
    try {

        const { emailUser } = req.params

        const user = await Services.Users.getUser(emailUser)

    
        res.status(200).json({status: 'Success', message: 'Profile photo uploaded'})  
    } catch (error) {
        next(error)
    }
})



router.get('/ticket/:tid', roleAccess, privateAccess, async (req, res) => {
    try {
        const { tid } = req.params
        const emailSession = req.session.user.email
        const { first_name, cart } = await Services.Users.getUser(emailSession)
        
        const saleData = await Services.Sales.saleFindById(tid)

        const dataSend = {
            saleData,
            first_name,
            cart: cart || null
        }

        const jsonData = JSON.stringify(dataSend)

        res.render('ticket', {saleData, first_name, cart, jsonData})
        
    } catch (error) {
        console.log(error)
    }

})

router.get('/chat/:uid', 
roleAccess, privateAccess, 
async (req, res) => {
    try {

        const { uid: chatId } = req.params
        
        const {userName} = req.session.user
        
        let messages

        messages = await Services.Chats.loadMessages(chatId)

        if (messages) {
        }

        const payloadRaw = {
            messages
        }

        const payload = JSON.stringify(payloadRaw)

        res.render('chat', {payload})        
    } catch (error) {
        console.log(error)
    }

})
router.post('/chat/:uid', 
roleAccess, privateAccess, 
async (req, res) => {
    try {
        console.log('endpoint chat')

        const { uid: userReceptorId } = req.params
        
        const {userName} = req.session.user
        
        const user = await Services.Users.checkUserName(userName)
        const userReceptor = await Services.Users.getUserById(userReceptorId)

        let messages
        let chatId

        messages = await Services.Chats.startChat(user.id, userReceptor.id)        
        if (messages) {
        }

        chatId = messages.chatId

        const payload = {
            chatId
        }

        res.status(200).json({status: 'success', payload, message:'conversación'})

    } catch (error) {
        console.log(error)
    }

})


module.exports = router