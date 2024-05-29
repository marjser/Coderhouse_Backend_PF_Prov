const ProductBuilder = require("../Builders/new-product.builder");
const ProductArrayDTO = require("../DTO/product-array-res.dto");
const { productsRepository } = require("../repositories");
const generateProducts = require("../utils/products-mock.util");
const winstonLogger = require("../utils/winston/devLogger.winston");


const productBuilder = new ProductBuilder()


const productsFind = async (page, limit, sort, cat, query) => {
    try {


        if (sort) {
            if (sort !== 'asc' && sort !== 'desc') {
                return 'Error con sort'
            } 
        }


        const products = await productsRepository.allProd(page, limit, sort, cat, query)



        for (const product of products.productsDocs) {
            if (product.stock == 0) {
                product.stock = 'No disponible'
            }
        }            

        return products
    } catch (error) {
        throw error
    }

}

const productId = async (id) => {
    try {
        const prodId = await productsRepository.prodId (id)
        return prodId
    } catch (error) {
        throw error
    }
}

const addProduct = async (newProdInfo) => {
    try {
        const { userOwner, title, description, code, price , stock, category, image } = newProdInfo
        productBuilder.checkCode(code)
        productBuilder.checkCategory(category)
        productBuilder.setData(userOwner, title, description, code, price, stock, category, image)
        
        const newProdData = productBuilder.build()
        
        if (!newProdData.title || !newProdData.description || !newProdData.code || !newProdData.price|| !newProdData.stock || !newProdData.category ) {return 'Falló registro'}
        
        winstonLogger.info(`FROM products.service: New Product added to list`)
        const newProd = await productsRepository.addProd(newProdData)
        return newProd
    } catch (error) {
        throw error
    }
}

const deleteProduct = async (id) => {
    try {
        const deletedProd = await productsRepository.deleteProd(id)
        return deletedProd
    } catch (error) {
        throw error
    }
}

const mockProducts = async (nro) => {
    try {
        const catArray = []
    
        const productsDocs = generateProducts(nro)
    
        productsDocs = null
    
        const totalPages = Math.round(productsDocs.length/10)
        const nextPage = 2
        let prevPage = nextPage-2
    
        if (prevPage < 0) {prevPage = null}
    
    
        for (const prod of productsDocs) {
            const cat = prod.category
    
            if (!catArray.find((cate) => cate == cat)) {
                catArray.push(cat)
            }
        }
    
        const products = {
            productsDocs,
            catArray,
            totalPages,
            nextPage,
            prevPage,
            hasPrevPage: null,
            hasNextPage: null,
            filter: null,
        }
    
        return products
        
    } catch (error) {
        throw error
    }
}

const offlineProduct = async (prodId) => {
    try {
        const productOffline = await productsRepository.setOfflineProductDao(prodId)
    } catch (error) {
        throw error
    }
}

const setProductStock = async (prodId, stock) => {
    try {
        const {oldStock, productUpdated} = await productsRepository.setProductStockDao(prodId, stock)

        winstonLogger.info(`FROM products.service: Product Stock Updated: product id:${prodId} / old Stock: ${oldStock} / updated stock: ${productUpdated.stock}`)

        return {oldStock, productUpdated}
    } catch (error) {
        throw error
    }
}





module.exports = {productsFind, productId, addProduct, deleteProduct, mockProducts, offlineProduct, setProductStock}