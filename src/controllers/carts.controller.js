const { Router } = require('express')
const { privateAccess } = require('../middlewares')
const roleAccess = require('../middlewares/role-access.middleware')

const Services = require('../services')

const CustomError = require('../handlers/CustomError')
const TYPE_ERRORS = require('../handlers/errors/types-errors')
const EErrors = require('../handlers/errors/enum-errors')
const errorLibrary = require('../constants/errors-library.constant')

const winstonLogger = require('../utils/winston/devLogger.winston')


const router = Router()

router.get('/', async (req, res) => {
    const carts = await Services.Carts.carts ()
    res.json({payload: carts})
})


router.get('/:id', roleAccess, async (req, res) => {
    try {

        const {id} = req.params
    
        const cart = await Services.Carts.cartFindId(id)

        if (!cart) {
            res.redirect('/products') 
        }

        const {cartId, cartDocs, userId} = cart

        const user = userId

        const dataJSON = JSON.stringify({ cartId, cartDocs, user})

        res.render('carts', {cartId, cartDocs, user, dataJSON})
               
    } catch (error) {
        console.log(error)
    }
})

router.get('/purchase/:id', roleAccess, privateAccess, async (req, res, next) => {
    try {

        req.logger.http(`${req.method} - ${req.url} / ${req.headers['user.agent']} - ${new Date().toUTCString()}`)
        const {id} = req.params

        const { _id, cartId, cartDocs, userId} = await Services.Carts.cartFindId(id)

        const { first_name, last_name, email} = await Services.Users.getUserById(userId)
        
        const userData = {
            first_name,
            last_name,
            email
        }

        const cartSend = JSON.stringify(cartDocs)

        const dataSend = {
            _id,
            cartId,
            cartSend,
            userData,
            cartDocs
        } 

        const jsonData = JSON.stringify(dataSend)

        res.render('cart-finish', {_id, cartId, cartSend, userData, jsonData})
    } catch (error) {
        next(error)
    }
})



router.post('/', roleAccess, async (req, res) => {
    try {

        const LS = 0

       const {userId, quantity, prodId} = req.body

        const newCart = await Services.Carts.addCart(userId)
        
        if (quantity && prodId) {
            const cartId = newCart.id
            const newCartupdated = await Services.Carts.addQuantToCart(cartId, prodId, quantity)
            console.log(newCartupdated)
        }

        if (req.session.user) {
            req.session.user.cart = newCart.id
        } 
         
        res.json({payload: newCart})

    } catch (error) {
        console.log({error})
    }
})

router.post('/:cid/product/:pid', async (req, res) => {
    const { cid, pid } = req.params
    try {

        const productAdded = await Services.Carts.addProdToCart(cid, pid)
        res.json({payload: productAdded})
    } catch (error) {
        console.log(error)    
    }
})

// ENDPOINT PARA AGREGAR CANTIDAD DE PRODUCTOS A UN CARRITO DESDE REQ.BODY

router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params

        const { quantity, prodId, subtract } = req.body

        const {prodQuant, title} = await Services.Carts.addQuantToCart(id, prodId, quantity, subtract)

        const message = `Quantity of ${prodQuant} of product ${title} added to cart`
        
        res.json({ message: message})

        
    } catch (error) {
        console.log({error})        
    }
})


router.patch('/:cid/product/:pid', async (req, res) => {
    const { cid, pid } = req.params
    const { userId } = req.body

    if (cid === 'new') {
        try {
            const { _id } = await Services.Carts.addCart(userId)

            const newCartId = _id.toString()
            const { cartId, prodMessage } = await Services.Carts.addProdToCart(newCartId, pid)


            res.json({payload: prodMessage})
        } catch (error) {
            console.log(error)    
        }
    } else {
        try {
            const productAdded = await Services.Carts.addProdToCart(cid, pid)
            res.json({payload: productAdded})
        } catch (error) {
            console.log(error)    
        }
    }
})



router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params
        if(req.session.user) {
            req.session.user.cart = null
        }

        const deletedCart = Services.Carts.deleteCart(id)
        res.json({payload: deletedCart})
        
    } catch (error) {
        console.log({error})        
    }
})


router.delete('/:id/product/:pid', async (req, res) => {
    try {
        const { id, pid } = req.params

        const deletedProdFromCart = await Services.Carts.deleteProductFromCart(id, pid)
        res.json({payload: deletedProdFromCart})
        
    } catch (error) {
        console.log({error})        
    }
})

// ENDPOINT PARA TERMINAR LA COMPRA

router.post('/purchase/:cid', privateAccess, async (req, res, next) => {
    try {

        const { cid } = req.params

        const { cart, email } = req.session.user
        const user = await Services.Users.getUser(email)

        const userCartId = await Services.Users.checkUserCart(user.id)
        
        if (!cid === cart) {
            CustomError.createError(errorLibrary.ERROR_403.carts_controller_purchase)
        }

        const {cartFinished, newCartIdReturn} = await Services.Carts.finishCart(userCartId.cartId)

        const saleData = await Services.Sales.purchase(user, cartFinished)

        if (newCartIdReturn) {
            req.session.user.cart = newCartIdReturn

        } else {
            req.session.user.cart = false
        }
        

        const {saleId} = saleData
        
        res.status(200).json({ticketId: saleId, message: 'Sale Succesful'})
        
    } catch (error) {
        next(error)
    }
})


module.exports = router
