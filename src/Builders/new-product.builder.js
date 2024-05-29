const productsInfo = require("../configs/products-info.code")


class ProductBuilder {
	owner = null 
	title = null 
	description = null
	code = null
	price = null
	stock = null
    category = null
    image = null
	
	checkCode(code) {
        if (code.length != 6) {return 'cantidad digitos incorrecta'} 
        const codeString = code.slice(0, 3) 
        const codeNumbSlice = code.slice(-3)
        const codeNumber = Number(codeNumbSlice)
        if (!codeNumber) {return 'Codigo nro invalido'} 
        const codeUpper = codeString.toUpperCase() 
        const codeConcat = codeUpper.concat(codeNumbSlice) 
        
        if (!productsInfo.codeCategories.includes(codeUpper)) {return 'codigo letra invalido'} 

        this.code = codeConcat
		return this 
    }

    checkCategory(category) {
        if (!productsInfo.categories.includes(category)) {return 'categoria inválida'}
		this.category = category
		return this 
	}

    setData(userOwner, title, description, code, price, stock, category, image) {
        this.owner = userOwner
        const priceN = Number(price)
        const stockN = Number(stock)
        this.title = title
        this.description = description
        this.price = priceN
        this.stock = stockN
        this.image = image   
        return this 
    }
    
	build() {
		return {
    owner: this.owner,
	title: this.title,
	code: this.code,
	description: this.description,
	price: this.price,
	stock: this.stock,
    category: this.category,
    image: this.image
        }
	}
}

module.exports = ProductBuilder

