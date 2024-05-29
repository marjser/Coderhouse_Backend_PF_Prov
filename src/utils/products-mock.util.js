const { faker } = require("@faker-js/faker");
const productData = require("../configs/faker.config");


const generateProducts = numProducts => {
    const products = []
    
    for(let i = 0; i < numProducts; i++) {
        products.push(generateProduct())

    }
    return products
}


const arrayCodes = ['TOO', 'FIJ']
const arrayCategories = ['fijacion', 'herramientas']

const generateProduct = () => {
    const codeString = faker.string.fromCharacters(arrayCodes)
    const productTitle = faker.helpers.arrayElements(productData, 1)[0]
    const codeNumber = faker.string.numeric(3)
    return {
        id: faker.database.mongodbObjectId(),
        title: productTitle,
        code: codeString.concat(codeNumber),
        description: faker.lorem.text().slice(0, 30),
        stock: faker.number.int({min: 500, max: 10000}),
        price: faker.number.int({min: 20, max:15000}),
        category: faker.string.fromCharacters(arrayCategories)

    }
}





module.exports = generateProducts