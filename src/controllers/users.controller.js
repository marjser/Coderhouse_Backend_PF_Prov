const {Router} = require('express')
const upload = require('../middlewares/multer.middleware')
const {privateAccess, premiumAccess} = require('../middlewares')

const Services = require('../services')

const passport = require('passport')

const CustomError = require('../handlers/CustomError')
const generateUserErrorInfo = require('../handlers/errors/generate-user-error-info')
const EErrors = require('../handlers/errors/enum-errors')
const TYPE_ERRORS = require('../handlers/errors/types-errors')
const fileHandler = require('../middlewares/file-handler.middleware')




const router = Router()

// ENDPOINT PARA CREAR USUARIO

const url = '/products'

router.get('/', async (req, res) => { 
    try {
        const users = await Services.Users.getUsers()
    
        const data = {
            status: 'success',
            payload: users,
            users,
        }
    
        const jsonData = JSON.stringify(data)
    
            res.status(200).json({users}) 
    } catch (error) {
        throw error
    }

})


router.post(
    '/', 
    passport.authenticate('register'),
    async (req, res, next) => { 
    try {

        console.log('hasta aca ok')
        
        const sessionUser = {
            first_name: req.user.first_name,
            last_name: req.user.last_name,
            email: req.user.email,
            role: req.user.role,
        }

        if (req.user.cart) {
            sessionUser.cart = req.user.cart
        } else { sessionUser.cart = null}

        req.session.user = sessionUser


        res
            .status(201)
            .json({status: 'Success', message: 'User has been register', url})

    } catch (error) {
        next(error)
    }

})

router.put('/role/:id/', async (req, res) => { 
    try {

        const { id } = req.params
        const { userId, newRole}  = req.body

        if (!id || !userId || !newRole) {
            res.status(200).json({status: 'error', message: 'Error with input data'})
        }

        if (id !== userId) {
            res.status(200).json({status: 'error', message: 'Error with input data'})
        }

        const userReturn = await Services.Users.changeRole(userId, newRole)

        res.status(201).json({status: 'success', message: 'User Updated', payload: 'User updated'})
        
    } catch (error) {
        console.log({error})        
    }
})

router.get('/:uid/documents', privateAccess, premiumAccess, async (req, res, next) => {
    try {

        const pathRaw = req.url

        const {uid} = req.params
        
        const user = await Services.Users.getUserById(uid)

        const data = {
            user,
            documents: user.documents
        }

        const jsonData = JSON.stringify(data)
        
        res.render('premium.handlebars', {jsonData})  
    } catch (error) {
        next(error)
    }
})

const uploadConfig = [
    { name:'userIdentification'},
    { name: 'userAddress'}, 
    { name: "userAccount"}
]


router.post('/:uid/documents', privateAccess, premiumAccess, upload.fields(uploadConfig), async (req, res, next) => {
    try {

        const rawData = req.files
        const {uid} = req.params

        let fileData

        if (!rawData) {
            return res.status(500).json({error: 'Problem uploading'})
        } else {
            fileDataInput = Object.values(rawData)[0]
            fileData = fileDataInput[0]
        }

        const user = await Services.Users.addDocToUser(uid, fileData.fieldname, fileData.path)
        
        res.status(200).json({status: 'Success', message: 'User Updated'})          
    } catch (error) {
        next(error)
    }
})



router.post('/premium/:uid', privateAccess, premiumAccess,  async (req, res) => {
    try {
        
        const { uid } = req.params
        
        const newRole = 'premium'

        const user = await Services.Users.changeRole(uid, newRole)

        res.status(201).json({status: 'success', message:'Usuario actualizado a premium. Debe volver a ingresar para que se actualice su rol'})
    } catch (error) {
        throw error
    }
})

router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params

        if (!id) {
            res.json({message: 'Error with USER ID'})
        }

        const userResponse = await Services.Users.deleteUser(id)


        const message = `User ${id} deleted succesfully`

        res.status(200).json({status: '200', message: message})
        
    } catch (error) {
        console.log({error})        
    }
})

router.delete('/', async (req, res) => {
    try {
        
        const deletedUsers = await Services.Users.deletedUsersInactivity()


        const message = `Users deleted succesfully`

        res.status(200).json({status: '200', message: message, payload: deletedUsers})  
    } catch (error) {
        console.log({error})        
    }
})


router.post('/logout', async (req, res) => {
    try {
        
        req.session.destroy()

        const url = `/login`

        res.json({status: 'Success', message: 'LogOut Succesfull', url })
    } catch (err) {
        console.error('Error logging out:', err);
    }
    
})





module.exports = router