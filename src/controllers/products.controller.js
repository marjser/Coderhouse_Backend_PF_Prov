const { Router } = require('express')
const { privateAccess, publicAccess } = require('../middlewares')

const Services = require('../services')

const HTTP_RESPONSES = require('../constants/http-responses.constant')
const winstonLogger = require('../utils/winston/devLogger.winston')

const factory = require('../utils/winston/factory')



const router = Router()



// ENDPOINT PÁGINA PRINCIPAL

router.get('/',  async (req, res, next) => {
    try {


        const { page = 1 } = req.query
        const { limit, query, sort, cat } = req.query

        let user
        let cartId 
        let cartDocs

        console.log(req.session.user)

        if (req.session.user) {
            if (req.session.user.role !== 'admin') {
                const { email } = req.session.user
                user = await Services.Users.getUser(email)
                
                const cartData = await Services.Users.checkUserCart(user.id)
                
                if (cartData) {
                    cartDocs = cartData.cartDocs
                    user.cart = cartData.cartId
                    cartId = cartData.cartId
                }

                
                
            }
            if (req.session.user.role === 'admin') {            
                console.log('el user es admin')
                user = {
                    role:'admin'}
            }
        } else {user = null}
    
                
        
        const products = await Services.Products.productsFind(page, limit, sort, cat, query)
        const {productsDocs, categories, pagination } = products
        

        const {
            totalPages, 
            hasPrevPage, hasNextPage, nextPage, prevPage, filter } = pagination
        const catArray = categories

        const prevLink = `/products?pageon=${prevPage}`
        const nextLink = `/products?pageon=${nextPage}`
        

        const data = {
            status: 'success',
            productsDocs,
            payload: productsDocs,
            totalPages,
            prevPage,
            nextPage,
            page,
            hasPrevPage, 
            hasNextPage,
            prevLink,
            nextLink,
            cartId,
            catArray,
            cat,
            user,
            cartDocs
        }

        const jsonData = JSON.stringify(data)

    
        res.status(200).render('products', {
            status: 'success',
            productsDocs,
            payload: productsDocs,
            totalPages,
            prevPage,
            nextPage,
            page,
            hasPrevPage, 
            hasNextPage,
            prevLink,
            nextLink,
            cartId,
            catArray,
            cat,
            user,
            jsonData
            })
            
        
    } catch (error) {
        next(error)
    }
})

router.get('/:pid', async (req, res)=>{
    try {
        const {pid} = req.params 

        const product = await Services.Products.productId(pid)

        let user
        let cart

        if (req.session.user) {
            const {userName} = req.session.user
            user = await Services.Users.checkUserName(userName)
            cart = await Services.Carts.cartFindId(user.cart)
        }

        const data = {
            status: 'success',
        }

        const payloadData = {
            user: user || null,
            product,
            cart
        }        


        const payload = JSON.stringify(payloadData)
        const jsonData = JSON.stringify(data)

        res.status(200).render('product', {jsonData, payload})
    } catch (error) {
        throw error
    }
})

// AGREGAR PRODUCTO NUEVO [SOLO ADMIN]

router.post('/', async (req, res) => {
    try {

        const { userOwner, title, description, code, price , stock, category, image } = req.body
        
        req.logger.http()

        const newProductData = {
            userOwner,
            title,
            description,
            code,
            price,
            stock,
            category,
            image
        }

        const {owner, id: productId} = await Services.Products.addProduct(newProductData)
        const addedToUser = await Services.Users.addProductToUser(owner, productId)
        
        const message = `Product added to list`
        res.status(201).json({payload: newProductData, message})

    } catch (error) {
        console.log({error})
        
    }
    
    
})


router.put('/:id/', async (req, res) => {
    try {
        const { id } = req.params
        const  body  = req.body

        await User.updateOne({ _id: id, status: true}, body)

        res.json({payload: 'User updated'})
        
    } catch (error) {
        console.log({error})        
    }
})

router.patch('/stock', async (req, res) => {
    try {
        const { prodId, stock } = req.body

        const {oldStock, productUpdated} = await Services.Products.setProductStock(prodId, stock)

        const message = `Product Stock Updated: product id:${prodId} / old Stock: ${oldStock} / updated stock: ${productUpdated.stock}`

        res.json({message: message})
        
    } catch (error) {
        console.log({error})        
    }
})

router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params

        const deletedProd = await Services.Products.deleteProduct(id)
        res.json({payload: deletedProd})
        
    } catch (error) {
        console.log({error})        
    }
})





// ENDPOINT PARA LOGOUT

router.post('/logout', async (req, res) => {

    try {
        
        req.session.destroy()

        const url = `/login`

        res.json({status: 'Success', message: 'LogOut Succesfull', url })
    } catch (err) {
        console.error('Error logging out:', err);
    }
    
})

// ENDPOINT PARA PRODUCTS CON FAKER

router.get('/mockingproducts', async (req, res, next) => {
    try {
        const { page = 1 } = req.query
        const {productsDocs, catArray, totalPages, hasPrevPage, hasNextPage, nextPage, prevPage, filter } =  await Services.Products.mockProducts(100)
    
    
        const prevLink = `/products?pageon=${prevPage}`
        const nextLink = `/products?pageon=${nextPage}`
    
    
        res.status(200)
            .render('products', {
            status: 'success',
            productsDocs,
            payload: productsDocs,
            totalPages,
            prevPage,
            nextPage,
            page,
            hasPrevPage, 
            hasNextPage,
            prevLink,
            nextLink,
            catArray,
            })
        
    } catch (error) {
        next(error)
    }


})

module.exports = router




