const fs = require('fs')
const { environment } = require("../configs/app.config");
const memoryConfig = require('../configs/memory.config');



const usersPath = memoryConfig.path+memoryConfig.usersPath
const productsPath = memoryConfig.path+memoryConfig.productsPath
const cartsPath = memoryConfig.path+memoryConfig.cartsPath

const memoryPaths = {
    encoder: 'utf-8',
    usersPath: usersPath,
    productsPath: productsPath,
    cartsPath: cartsPath
}


const syncMemory = () => {
    if (environment == 'dev') {
        if(!fs.existsSync(usersPath)) {
            const users = []
            const jsonData = JSON.stringify(users, null, 2)
            fs.promises.writeFile(usersPath, jsonData, memoryPaths.encoder, (err) => {
                if (err) {
                    console.error('Error writing file:', err);
                    return;
                }
                console.log('File has been written successfully!')
            })
        } 
        if(!fs.existsSync(productsPath)) {
            const products = []
            const jsonData = JSON.stringify(products, null, 2)
            fs.promises.writeFile(productsPath, jsonData, memoryPaths.encoder, (err) => {
                if (err) {
                    console.error('Error writing file:', err);
                    return;
                }
                console.log('File has been written successfully!')
            })
        } 
        if(!fs.existsSync(cartsPath)) {
            const carts = []
            const jsonData = JSON.stringify(carts, null, 2)
            fs.promises.writeFile(cartsPath, jsonData, memoryPaths.encoder, (err) => {
                if (err) {
                    console.error('Error writing file:', err);
                    return;
                }
                console.log('File has been written successfully!')
            })
        }
        console.log('Memory Synced')
    }
    

}

module.exports = {syncMemory, memoryPaths}


