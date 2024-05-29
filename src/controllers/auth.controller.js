const {Router} = require('express')
const Services = require('../services')

const passport = require('passport')
const CustomError = require('../handlers/CustomError')
const TYPE_ERRORS = require('../handlers/errors/types-errors')
const EErrors = require('../handlers/errors/enum-errors')
const jwt = require('../utils/jwt.util')
const {v4: uuidv4} = require('uuid')


const router = Router()



const url = `/products`


router.post(
    '/login',
    passport.authenticate('login'),
    async (req, res, next) => {
    try {
        
        const sessionUser = {
            first_name: req.user.first_name,
            last_name: req.user.last_name,
            userName: req.user.userName,
            email: req.user.email,
            role: req.user.role,
        }

        if (req.user.cart) {
            sessionUser.cart = req.user.cart
        } else { sessionUser.cart = null}
        
        const userUpdate = await Services.Users.setLastConnection(req.user.id)

        req.session.user = sessionUser

        res.json({status: 'Success', message: 'Login Succesfull', url})

    } catch (error) {
        next(error)
    }

}
)

router.get('/fail-login', (req, res) => {
    res.json({status:'error', message: 'Login Failed' })
})

router.get('/forget-password', (req, res) => {
    try {   

        res.render('forget-password')
    } catch (error) {
        throw error
    }
})



router.post('/forget-password', async (req, res) => {
    try {   
        const body = req.body

        const {userName} = body

        const user = await Services.Users.checkUserName(userName)

        if (!user) return res.status(200).json({status: 'error', message: 'User not found'})

        const restoreCode = uuidv4()

        const userRestore = {
            userId: user.id,
            restoreCode
        }

        const access_token = jwt.generateToken(userRestore)
        
        const response = Services.Users.forgetPassword(access_token, user.id)

        console.log(user)

        res.status(200).send({status: 'success', access_token})
    } catch (error) {
        throw error
    }
})

router.get('/verify-password/:code', async (req, res) => {
        try {
            const {code} = req.params 

            res.render('verify-user')
        } catch (error) {
         throw error   
        }
    })

router.post('/verify-password/:code', async (req, res) => {
        try {
            const {code} = req.params 

            res.status(200).json({status: 'success'})
        } catch (error) {
         throw error   
        }
    })

router.get('/change-password/:code', jwt.authToken, async (req, res) => {
        try {
            console.log('change-password')

            const {code} = req.params 
            const {userId} = req.user
            
            const user = await Services.Users.getUserById(userId)

            if (!user) {
                res.status(404).json({status: 'error', message: 'user not found'})
            }

            const userRes = {
                first_name: user.first_name,
                userId: user.id                
            }

            const data = {
                status: 'success',
                userRes: userRes
            }

            const jsonData = JSON.stringify(data)

            res.render('change-password')
        } catch (error) {
         throw error   
        }
})

router.get('/change-password-prov', async (req, res) => {
    try {
        res.status(200).render('change-password')
    } catch (error) {
        throw error
    }
})

router.post('/change-password-prov', async (req, res) => {
    try {

        const body = req.body

        const {userId, newPassword} = body

        if (!userId || !newPassword) return res.status(404).json({status: 'error', message: 'missing information'})

        const user = await Services.Users.getUserById(userId)

        if (!user) return res.status(404).json({status: 'error', message: 'User not found'})
        
        const passwordReturn = await Services.Users.changePassword(user.id, newPassword)



        res.status(200).json({status:'success', message: 'New password confirmed'})
    } catch (error) {
        console.error()
        throw error
    }
})

// Endpoint que redirecciona a github para autenticar el usuario

router.get(
    '/github',
    passport.authenticate('github', { scope: ['user: email']}, (req, res) => {})
)



// Endpoint que nos retorna github con el usuario autenticado y sus datos

router.get(
    '/githubcallback',
    passport.authenticate('github', { failureRedirect: '/auth/fail-login' }),
    (req, res) => {
        req.session.user = req.user
        res.redirect('/products') 
    }
)

router.post(
    '/logout',
    async (req, res) => {
        try {
            const sessionData = req.session

            const {user} = sessionData.passport

            const userUpdate = await Services.Users.setLastConnection(user)
            console.log(`user ${user} updated last_connection`)
        
            req.session.destroy(err => {
                if (err) {
                  return res.status(500).send('Logout failed');
                }
            })
        
            res.status(200).json({status: 'success', message: 'Logged out successfully'})            
        } catch (err) {
            console.error('Error logging out:', err);
        }
    }
)





module.exports = router