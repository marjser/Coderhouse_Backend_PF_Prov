const CustomError = require('../../handlers/CustomError')
const TYPE_ERRORS = require('../../handlers/errors/types-errors')
const Products = require('../../models/product.model')
const errorLibrary = require('../../constants/errors-library.constant')
const winstonLogger = require('../../utils/winston/devLogger.winston')
const fs = require('fs')
const { memoryPaths } = require('../../memory')
const {v4: uuidv4} = require('uuid')





class ProductsDAO {
    async allProd (page, limit, sort, cat, query) {
        try {
            
            const categories = []
            let productsReturn 
            const products = {}
            const pagination = {}

            const productsJSON = await fs.promises.readFile(memoryPaths.productsPath, memoryPaths.encoder)
            const productsFiles = JSON.parse(productsJSON)

            //const totalPages = 

            pagination.totalDocs = productsFiles.length
            // pagination.totalDocs = 15
            pagination.limit = limit || 10
            pagination.totalPages = Math.round(pagination.totalDocs/pagination.limit)
            if (pagination.totalPages == 0) {
                pagination.totalPages = 1
            }
            pagination.page = page || 1
            pagination.pagingCounter = 1
            
            let hasPrevPage
            let hasNextPage
            
            
            if (pagination.totalPages == 1 && pagination.page == 1) {
                pagination.hasNextPage = false
                pagination.nextPage = null
                pagination.hasPrevPage = false
                pagination.prevPage = null
                
            } else if (pagination.totalPages > 1) {
                if (pagination.page == 1) {
                    pagination.hasNextPage = true
                    pagination.nextPage = pagination.page + 1
                    pagination.hasPrevPage = false
                    pagination.prevPage = false
                } else if (pagination.page == pagination.totalPages) {
                    pagination.hasNextPage = false
                    pagination.nextPage = null
                    pagination.hasPrevPage = true
                    pagination.prevPage = pagination.page - 1
                } else {
                    pagination.hasNextPage = true
                    pagination.nextPage = pagination.page + 1
                    pagination.hasPrevPage = true
                    pagination.hasPrevPage = pagination.page - 1
                }
                
            }
                
            //     if (!cat || !sort || !limit || !query ){
            //     console.log('no query')
            //     const products = await Products.paginate ({status: true}, { page, limit: 10 }) 
            //     productsReturn = products
            // }
            

            for (const prod of productsFiles) {
                const cat = prod.category

                if (!categories.find((cate) => cate == cat)) {
                    categories.push(cat)
                }
            }

            products.categories = categories
            products.productsDocs = productsFiles
            products.pagination = pagination

            return products            
        } catch (error) {
            CustomError.createError(errorLibrary.ERROR_500.products_DB_Mongo)
        }
    }

    async prodId (id) {
        try {
            // const {_id, __v, title, description, code, price, stock, category, status} = await Products.findOne({ _id: id , status: true })

            const productsJSON = await fs.promises.readFile(memoryPaths.productsPath, memoryPaths.encoder)
            const products = JSON.parse(productsJSON)

            const product = products.find((product) => product.id === product)

            

            // const productOutput = {
            //     id: _id.toString(),
            //     title: title[0].toUpperCase()+title.slice(1),
            //     description,
            //     code,
            //     price,
            //     stock,
            //     category,
            //     status
            // }

            return product
        } catch (error) {
            throw error
        }
    }


    async addProd (newProdInfo) {
        try {
            const { code } = newProdInfo

            if (!newProdInfo.title || !newProdInfo.description || !newProdInfo.code || !newProdInfo.price || !newProdInfo.price || !newProdInfo.stock || !newProdInfo.category) {
                return 'Missing Input Data'
            }
            
            const productsJSON = await fs.promises.readFile(memoryPaths.productsPath, memoryPaths.encoder)
            const products = JSON.parse(productsJSON)

            const product = products.find((product) => product.code === code)


            if(!product) {
                newProdInfo.id = uuidv4()
                newProdInfo.status = true
                products.push(newProdInfo)
                
                const productsJson = JSON.stringify(products)
    
                fs.promises.writeFile(memoryPaths.productsPath, productsJson, memoryPaths.encoder, (err) => {
                    if (err) {
                        console.error('Error writing file:', err);
                        return;
                    }
                }) 
                // const newProd = await Products.create(newProdInfo)
                winstonLogger.info(`FROM fileSystemDao: New Product added`)
                return 'Se creó nuevo producto'
            } else {
                return 'Invalid code'
            }
        } catch (error) {
            throw error
        }
        
    }

    async setOfflineProduct (prodId) {
        try {
            // await Products.updateOne({ _id: prodId}, {status: false})
            const productsJSON = await fs.promises.readFile(memoryPaths.productsPath, memoryPaths.encoder)
            const products = JSON.parse(productsJSON)

            const productIndex = products.findIndex((product) => product.id === prodId)

            products[productIndex].status = false

            const productsJson = JSON.stringify(products)

            fs.promises.writeFile(memoryPaths.productsPath, productsJson, memoryPaths.encoder, (err) => {
                if (err) {
                    console.error('Error writing file:', err);
                    return;
                }
            }) 


            winstonLogger.info(`From fileSystemDao: Product ${prodId} offline for Stock 0`)
        } catch (error) {
            throw error
        }
    }

    async setProductStockDao (prodId, newStock) {
        try {
            // const product = await Products.findById(prodId)
            const productsJSON = await fs.promises.readFile(memoryPaths.productsPath, memoryPaths.encoder)
            const products = JSON.parse(productsJSON)

            const productIndex = products.findIndex((product) => product.id === prodId)



            
            const oldStock = products[productIndex].stock
            products[productIndex].stock += newStock
            
            if (!products[productIndex].status) {
                products[productIndex].status = true
            }
            
            // const ret = await Products.updateOne({ _id: prodId}, product ) 

            const productsJson = JSON.stringify(products)

            fs.promises.writeFile(memoryPaths.productsPath, productsJson, memoryPaths.encoder, (err) => {
                if (err) {
                    console.error('Error writing file:', err);
                    return;
                }
            }) 

            // console.log(ret)
            // const {_id, __v, title, description, code, price, stock, category, status} = await Products.findById(prodId)

            const {id, title, description, code, price, stock, category, status} = products[productIndex]

            const productUpdated = {
                id,
                title: title[0].toUpperCase()+title.slice(1),
                description,
                code,
                price,
                stock,
                category,
                status
            }

            return {productUpdated, oldStock}
        } catch (error) {
            throw error
        }
    }

}






module.exports = ProductsDAO