
class ProductArrayDTO {    
    constructor(product) {
        this.id = product._id.toString()
        this.status = product.status
        this.title = product.title[0].toUpperCase()+product.title.slice(1)
        this.title = product.title
        this.description = product.description
        this.code = product.code
        this.owner = product.owner.toString() || null
        this.price = product.price
        this.stock = product.stock
        this.category = product.category
        this.thumbnails = product.thumbnails
    }

}

module.exports = ProductArrayDTO