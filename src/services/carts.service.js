const CartsDAO = require("../DAO/mongo/cart-dao.mongo");
const logger = require("../middlewares/winston-logger.middleware");
const winstonLogger = require("../utils/winston/devLogger.winston");
const Products = require("./products.service");
const {usersRepository: Users} = require('../repositories')



const CS = 0

const Carts = new CartsDAO()

// FUNCIÓN PARA OBTENER TODOS LOS PRODUCTOS EN EL CARRITO

const carts = async () => {
    try {
        const carts = await Carts.allCarts()
        return carts
    } catch (error) {
        throw error
    }
}

// FUNCIÓN PARA BUSCAR UN CARRITO POR SU ID

const cartFindId = async (id) => {
    try {

        const userCart = await Carts.cartId(id)

        CONSOLER(CS, userCart)

        if (!userCart) {
            return null
        }



        return userCart
    } catch (error) {
        throw error
    }
}


// FUNCIÓN PARA AGREGAR UN CARRITO

const addCart = async (userId) => {
    try {
        const newCart = await Carts.addCart(userId)
        const {user} = newCart
        if (user) {
            
            Users.addCartToUser(newCart.cartId, user)
        }
        winstonLogger.info(`FROM carts.service: New Cart created`)
        return newCart
    } catch (error) {
        throw error
    }
}

// FUNCIÓN PARA AGREGAR UN PRODUCTO AL CARRITO

const addProdToCart = async (cid, pid) => {
    try {
        const newProdInCart = await Carts.addProdToCart(cid, pid)

        winstonLogger.info(`FROM carts.service: Product added to cart id ${cid}`)
        return newProdInCart
    } catch (error) {
        throw error
    }
}

const addVariousProdsToCart = async (cid, products) => {
    try {

        const newProdInCart = await Carts.addProdToCart(cid, pid)
        return newProdInCart
    } catch (error) {
        throw error
    }
}

// FUNCIÓN PARA AGREGAR CANTIDAD DE PRODUCTOS A UN CARRITO DESDE REQ.BODY

const addQuantToCart = async (cartId, productId, quantity, subtract) => {
    try {
        
        const cartDaoReturn = await Carts.addQuantityProdtoCart(cartId, productId, quantity, subtract)
        const {title} = await Products.productId(productId)

        const prodQuant = cartDaoReturn.quantity

        winstonLogger.info(`FROM carts.service: Quantity of ${quantity} of product ${productId} added to cart ${cartDaoReturn.cartId}`)
        return {prodQuant, title}

    } catch (error) {
        throw error
    }
}

// FUNCIÓN PARA ELIMINAR UN PRODUCTO DE UN CARRITO

const deleteProductFromCart = async (id, pid) => {
    try {
        const deletedProd = await Carts.deleteProdFromCart(id, pid)

        winstonLogger.info(`FROM carts.service: Product deleted from cart ${id}`)
        return deletedProd
    } catch (error) {
        throw error
    }
}

// FUNCIÓN PARA BORRAR TODOS LOS PRODUCTOS DE UN CARRITO

const deleteAllProd = async (cid) => {
    try {
        const deletedCart = await Carts.deleteAllProdFromCart(cid)
        return deletedCart
    } catch (error) {
        throw error
    }
}

// FUNCIÓN PARA ELIMINAR UN CARRITO

const deleteCart = async (cid) => {
    try {
        const deletedCart = await Carts.deleteCart(cid)
        return deletedCart
    } catch (error) {
        throw error
    }
}

// FUNCIÓN PARA FINALIZAR CARRITO

const finishCart = async (id) => {
    try {
        const {cartId, cartDocs, userId} = await Carts.cartId(id)
        winstonLogger.info(`FROM carts.service: Executing sale from cart id ${id} from user ${userId} `)
    
        const { cartFinished, productsStock } = await Carts.finishCart(cartDocs, cartId)

        const user = await Users.deleteCartFromUser(cartId, userId)



        let newCartIdReturn

        if (productsStock.length > 0) {
            const newCart = await Carts.addCart(userId)
            const userCart = await Users.addCartToUser(newCart.cartId)
    
            const cartFilled = await Carts.addSomeProdsToCart(newCart.cartId, productsStock)
    

            newCartIdReturn = newCartId

        }



        return {cartFinished, newCartIdReturn}
    } catch (error) {
        console.log(error)
        throw error
    }


}







module.exports = {carts, cartFindId, addCart, addProdToCart, addQuantToCart, deleteProductFromCart, deleteAllProd, deleteCart, finishCart}