const CustomError = require('../../handlers/CustomError')
const TYPE_ERRORS = require('../../handlers/errors/types-errors')
const Products = require('../../models/product.model')
const errorLibrary = require('../../constants/errors-library.constant')
const winstonLogger = require('../../utils/winston/devLogger.winston')
const ProductArrayDTO = require('../../DTO/product-array-res.dto')



class ProductsDAO {
    async allProd (page, limit, sort, cat, query) {        
        try {

            let queryFilters 
            let queryTemplate 
            const categories = []
            let productsReturn 
            
            const querysB = {
            page: page || 1,
            limit: limit || 10,
            sort: '',
            cat: cat,
            query: query 
            }

            const querys = {
                status: true, 
            }
            
            const options = {
                select:'-__v', 
                page: page || 1 , 
                limit: limit || 10
            }

            if (!sort || sort == 'asc') {
                const sort = `, sort: { price: -1 }`
                querysB.sort = -1
                options.sort = {price: -1}
            } else if (sort == 'desc') {
                const sort = `, sort: { price: 1 }`
                querysB.sort = 1
                options.sort = {price: 1}
            }
            
            if (cat && !query) {
                productsReturn = await Products.paginate ({status: true, category: {$in:cat}}, options) 
                queryFilters += `category: ${cat}`                                
            }

            if (query) {
                console.log(query)
                let productsTitles 
                if (cat) {
                    productsTitles = await Products.find({category: {$in:cat}})
                } else {
                    productsTitles = await Products.find({})
                }


                const productsIds = []
                
                for (const product of productsTitles) {
                    
                    if (product.title.search(query) !== -1 ) {
                        productsIds.push(product._id.toString())
                    }
                } 
                
                
                productsReturn = await Products.paginate ({_id: { $in: productsIds}}, options) 
                
            }
            
            if (!cat && !query) {
                productsReturn = await Products.paginate (querys, options) 
            }

            if (productsReturn.totalDocs == 0) {
                const {docs, ...pagination} = productsReturn
                const products = {
                    categories: [],
                    productsDocs: [],
                    pagination: pagination
                }

                return products

            }

            
            const {docs, ...pagination} = productsReturn

            if (docs.length == 0) {
                return null
            }
            
            
            for (const prod of docs) {
                const cat = prod.category

                if (!categories.find((cate) => cate == cat)) {
                    categories.push(cat)
                }
            }

            const products = {}
            products.categories = categories

            const productsDocs = []
            
            docs.forEach(doc => {
                const { _id, title, description, owner, code, price , stock, category } = doc

                const prodArray = new ProductArrayDTO(doc)

                
                productsDocs.push(prodArray)
                });


            products.productsDocs = productsDocs
            products.pagination = pagination



            return products
        } catch(error) {
            throw error
        }
        
    }

    async prodId (id) {
        try {
            const {_id, __v, title, owner, description, code, price, stock, category, status} = await Products.findOne({ _id: id , status: true })
            
            const productOutput = {
                id: _id.toString(),
                title: title[0].toUpperCase()+title.slice(1),
                description,
                code,
                price,
                stock,
                owner: owner.toString(), 
                category,
                status
            }

            return productOutput
        } catch (error) {
            throw error
        }
    }


    async addProd (newProdInfo) {
        try {
            const { code, owner } = newProdInfo
            
            if (!owner) {
                newProdInfo.owner = 'admin'
            }

            if(!await Products.findOne({code: code})) {
                const data = await Products.create(newProdInfo)

                const {_doc} = data
                const {_id, __v, owner, ...otherData} = _doc
    
                const newProd = {
                    id: _id.toString(),
                    owner: owner.toString(),
                    ...otherData
                }
                return newProd
            } else {
                return 'Invalid code'
            }
        } catch (error) {
            throw error
        }
        
    }

    async setOfflineProduct (prodId) {
        try {
            await Products.updateOne({ _id: prodId}, {status: false})

            winstonLogger.info(`Product ${prodId} offline for Stock 0`)
        } catch (error) {
            throw error
        }
    }

    async setProductStockDao (prodId, newStock) {
        try {
            const product = await Products.findById(prodId)
            const oldStock = product.stock
            product.stock += newStock
            
            if (product.status == false) {
                product.status = true
            }
            
            const ret = await Products.updateOne({ _id: prodId}, product ) 
            const {_id, __v, title, description, code, price, stock, category, status} = await Products.findById(prodId)
            
            const productUpdated = {
                id: _id.toString(),
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


