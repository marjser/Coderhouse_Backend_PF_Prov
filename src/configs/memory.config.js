require('dotenv').config()



module.exports = {
    path: process.env.MEMORY_PATH,
    usersPath: process.env.USERS_MEMORY,
    cartsPath: process.env.CARTS_MEMORY,
    productsPath: process.env.PRODUCTS_MEMORY,
    ticketsPath: process.env.TICKETS_MEMORY
}


