const Carts = require('../../models/cart.model')
const Products = require('../../models/product.model')
const Users = require('../../models/user.model')
const users = require('../../services/users.service')
const { productsRepository: ProductsServ } = require('../../repositories')

const winstonLogger = require('../../utils/winston/devLogger.winston')
const CONSOLER = require('../../BORRAR/consoler')

const CS = 1

class CartsDAO {
    async allCarts () {
        try {
            const carts = await Carts.find({ status: true})
            return carts            
        } catch (error) {
            throw error
        }
    }

    async cartId (id) {
        try {

            const LS = 0

            const cartId = await Carts.findOne({ _id: id , status: true }).populate('products.product')

            if (!cartId) {return null}

            const { _id, products, user} = cartId

            const cartDocs = []

            products.forEach(prod => {
                const data = prod
                const { product, quantity } = data
                const { _id, title, code, price , stock, category } = product
                const prodId = _id.toString()
                cartDocs.push({ prodId, title, code, price , stock, category, quantity })
                
            })

            const cart = {
                cartId: _id.toString(),
                cartDocs,
                userId: user.toString()
            }

            CONSOLER(CS, cart, LS)

            return cart
        }
        catch (error) {
            throw error
        }
    }
    


    async addCart (userId) {
        try {

            const cart = {
                products: [],
                user: userId || null}
            const newCart = await Carts.create(cart)

            const newCartReturn = {
                products: newCart.products,
                status: newCart.status,
                user: null,
                cartId: newCart._id.toString()
            }

            if (newCart.user) {
                newCartReturn.user = newCart.user.toString()
            }

            const newCartId = newCart._id.toString()
            winstonLogger.info(`FROM cart-dao.mongo: New Cart created. id: ${newCartId} for user ${userId}`)


            return newCartReturn
        } catch (error) {
            throw error
        }
        
    }

    async addProdToCart (cid, pid) {
        try {
            if (!ProductsServ.productId(pid)) {
                return res.status(400).send({status:"error", error:"Incorrect Id Product"})
            } else {
                const cart = await Carts.findById(cid).populate('products.product')
                const { id, title } = await ProductsServ.productId(pid)
                

                const products = cart.products
                
                let prodOk = false

                for (const prod of cart.products) {
                    let prodId = prod.product.toString()
                    
                    if (prodId === pid) {
                        prod.quantity++
                        prodOk = true
                        break
                    }
                }
                

                if (!prodOk) {cart.products.push({product: pid, quantity: 1})}
                
                const prodAdd = await Carts.updateOne({ _id: cart._id}, cart ) 
                
                const cartId = _id.toString()
                const prodMessage = `Product ${title} added to cart`
                
                return { cartId, prodMessage}
            }
        } catch (error) {
            throw error
        }
    }

    async addSomeProdsToCart (cartId, products) {
        try {
            const cart = await Carts.findById(cartId)

            for (const product of products) {
                const { prodId, quantity} = product

                cart.products.push({product: prodId, quantity: quantity})
            }

            const prodAdd = await Carts.updateOne({ _id: cart._id}, cart ) 

            winstonLogger.info(`FROM cart-dao.mongo: Cart ${cartId} filled with products`)

            return cart
        } catch (error) {
            
        }
    }

    // MÉTODO PARA AGREGAR CANTIDAD DE PRODUCTOS DESDE REQ.BODY

    async addQuantityProdtoCart (cartId, productId, quantity, subtract) {
        try {
            const cart = await Carts.findById(cartId).populate('products.product')

            let prodName 
                
            for (const prod of cart.products) {
                let prodId = prod.product._id.toString()
                
                if (prodId === productId) {
                    prodName = prod.product.title
                    
                    if (subtract) {
                        console.log('subtract')
                        if (quantity >= prod.quantity) {
                            throw 'quantity error'
                        }
                        prod.quantity -= Number(quantity)

                    } else {
                        prod.quantity += Number(quantity)

                    }
                    const prodAdd = await Carts.updateOne({ _id: cart._id}, cart ) 
                    console.log(`Se agregó/substrajo cantidad ${quantity} de producto ${prodName}`)
                    return prodAdd

                }

            }

            cart.products.push({product: productId, quantity: quantity})

           const prodAdd = await Carts.updateOne({ _id: cart._id}, cart ) 

           console.log(`Se agregó la cantidad de ${quantity} al carrito ${cart._id.toString()}`)
            
            return {quantity, cartId}
        } catch (error) {
            throw error
        }
    }

    async deleteAllProdFromCart (cid) {
       try {
            const cart = await Carts.findById(cid)

            cart.products = []

            await Carts.updateOne({ _id: cart._id}, cart)
            return 'All products deleted'
        } catch (error) {
            throw error
        }
   }

   async offlineCart (cid) {
    try {

        const {acknowledged} = await Carts.updateOne({ _id: cid}, { $set: { status: false }})

        
        if (!acknowledged) {
            return console.log('error seteando status offline al carrito')
        }

        winstonLogger.info(`FROM cart-dao.mongo: Cart id: ${cid} set to offline`)
    } catch (error) {
        throw error
    }
   }

   async deleteCart (id) {
       try {
            const cart = await Carts.findById(id)



            
            await Carts.deleteOne({ _id: id})

            winstonLogger.info(`From cart-dao.mongo: Cart ${id} from user ${cart.user._id.toString()} deleted`)

           return 'Cart deleted'
        } catch (error) {
            throw error
        }
   }
  
   async deleteProdFromCart (cid, pid) {
        try {
            if (!Products.findById(pid)) {
                return res.status(400).send({status:"error", error:"Incorrect Id Product"})
            } else {
                const cart = await Carts.findById(cid)

                const {title} = await Products.findById(pid)
                
                const prodIds = []
                
                for (const prod of cart.products) {
                    let prodId = prod.product.toString()
                    prodIds.push(prodId)
                    
                    if (prodId === pid) {
                        const delIndex = prodIds.findIndex(prod => prod === pid)
                        cart.products.splice(delIndex, 1)
                        break
                    }
                }


                let prodAdd = await Carts.updateOne({ _id: cart._id}, cart ) 



                return `Product ${title} deleted from Cart`
            }
        } catch (error) {
            throw error
        }

    }

    async finishCart (cartDocs, id) {
        try {
            const cartFinished = []
            const productsStock = []
    
            for (let product of cartDocs) {
                const { quantity, prodId } = product
    
                const productData = await Products.findById(prodId)
                if (productData.stock >= quantity) {
                    productData.stock -= quantity

                    if(productData.stock == 0) {
                        productData.status = false
                    }
    
                    const prodPurch = await Products.updateOne({ _id: prodId}, productData )
                    
                    const { _id, title, description, code, price, stock, category, status} = productData

                    const productUpdated = {
                        id: _id.toString(),
                        title,
                        description, 
                        code,
                        price,
                        stock,
                        category,
                        status, 
                        quantity: quantity
                    }

                    cartFinished.push(productUpdated)
                } else {
                    productsStock.push({prodId, quantity})

                }
            }
            let message
            if (productsStock.length > 0) {message='The unavailable products were given back'}
            winstonLogger.info(`FROM cart-dao.mongo: Cart ${id} Finished .${message} `)

            return {cartFinished, productsStock}
        } catch (error) {
            throw error
        }
    }

}



module.exports = CartsDAO