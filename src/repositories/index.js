const UsersFactory = require('../factory/users.factory')
const CartsFactory = require('../factory/carts.factory')

const ProductsFactory = require('../factory/products.factory')
const SalesFactory = require('../factory/sales.factory')

const UsersRepository = require("./users.repository")
const CartsRepository = require("./carts.repository")
const ProductsRepository = require('./products.repository')
const SalesRepository = require('./sales.repository')


const usersRepository = new UsersRepository( new UsersFactory() )
const productsRepository = new ProductsRepository ( new ProductsFactory())
const cartsRepository = new CartsRepository ( new CartsFactory())
const salesRepository = new SalesRepository ( new SalesFactory())

module.exports = { 
    usersRepository, 
    productsRepository, 
    cartsRepository, 
    salesRepository
}
