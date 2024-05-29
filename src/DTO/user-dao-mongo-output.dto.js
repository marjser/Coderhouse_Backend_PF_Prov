const ticketGenerator = require('../utils/ticket-genetaror.util')
const ProductArrayDTO = require('./product-array-res.dto')

class UserOutputMongo {
    constructor(userMongo) {
        this.id = userMongo._id.toString()
        this.first_name = userMongo.first_name
        this.last_name = userMongo.last_name
        this.age = userMongo.age
        this.userName = userMongo.userName
        this.password = userMongo.password
        this.email = userMongo.email
        this.role = userMongo.role
        this.status = userMongo.status
        this.address = userMongo.address
        this.phoneNumber = userMongo.phoneNumber
        this.profile = userMongo.profile
        this.last_connection = userMongo.last_connection
        this.documents = this.setUserDocuments(userMongo.documents)
        this.products = this.setUserProducts(userMongo.products)
        this.carts = this.setUserCart(userMongo.carts)
        this.sales = this.setUserSales(userMongo.sales)
    }

    setUserProducts = (arrayOfProducts) => {
        if (!Array.isArray(arrayOfProducts)) return null

        const products = []

        if (arrayOfProducts.length==0) return []

        arrayOfProducts.forEach(product => {

            const productRaw = product.product
            const { _id, title, description, owner, code, price , stock, category, thumbnails, status: productStatus } = productRaw


            const {status} = product
            
            const prodFile = new ProductArrayDTO(productRaw)
            const prodReturn = {
                prodFile,
                status
            }
            
            products.push(prodReturn)
        })

        return products
    }

    setUserCart = (arrayOfCarts) => {
        if (!Array.isArray(arrayOfCarts)) return null

        if (arrayOfCarts.length == 0) return []

        const userCart = []

        arrayOfCarts.forEach(cart => {
            const cartOne = cart.cart

            let cartProducts = []
            
            if (cartOne) {
                
                const {_id, products, status} = cartOne
                
                products.forEach(product => {
                    const productOne = product.product
    
                    const {_id, title, description, code, price, stock, category, status } = productOne
    
                    const productReturn = {
                        id: _id.toString(),
                        title,
                        description,
                        code,
                        price,
                        stock,
                        category,
                        status
                    }
    
                    cartProducts.push(productReturn)
    
                })
    
                const cartReturn = {
                    id: _id.toString(),
                    products: cartProducts,
                    status
                }
                
                userCart.push(cartReturn)
            }       
        })

        return userCart
    }


    setUserSales = (arrayOfSales) => {
        if (!Array.isArray(arrayOfSales)) return null

        if (arrayOfSales.length == 0) return []

        const sales = []

        arrayOfSales.forEach(sale => {
            const saleOne = sale.sale

            const {_id, code, saleDescription, total, createdAt } = saleOne
    
            const saleReturn = {
                id: _id.toString(),
                code,
                saleDescription: ticketGenerator(saleOne),
                total,
                createdAt,
            }
    
            sales.push(saleReturn)
        })
    }

    setUserDocuments = (arrayOfDocuments) => {
        if (!Array.isArray(arrayOfDocuments)) return null

        if (arrayOfDocuments.length == 0) return []

        const documents = []

        arrayOfDocuments.forEach(doc => {
            documents.push({
                name: doc.name,
                reference: doc.reference
            })
        })

        return documents
    }

    findCartActive = () => {
        const carts = this.carts

        const activeCart = carts.findIndex(cart => cart.status == true)

        if (activeCart == -1) return null

        const cartReturn = carts[activeCart].id

        return cartReturn
    }

    returnUserObject = () => {
        const userReturn = {
            id: this.id,
            first_name: this.first_name,
            last_name: this.last_name,
            age: this.age,
            userName: this.userName,
            password: this.password,
            email: this.email,
            role: this.role,
            status: this.status,
            address: this.address, 
            phoneNumber: this.phoneNumber,
            profile: this.profile,
            last_connection: this.last_connection,
            documents: this.documents,
            products: this.products,
            carts: this.carts,
            sales: this.sales,
        }
        return userReturn
    }
    
}

module.exports = UserOutputMongo






