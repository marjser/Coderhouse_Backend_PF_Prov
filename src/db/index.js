const mongoose = require('mongoose')
const { dbPassword, dbHost, dbName, dbUser } = require('../configs/db.config')
const winstonLogger = require('../utils/winston/devLogger.winston')


const uri = `mongodb+srv://${dbUser}:${dbPassword}@${dbHost}/${dbName}?retryWrites=true&w=majority`

const mongoConnect = async () =>{
    try {
        await mongoose.connect(uri)
        winstonLogger.info(`\x1b[32mINTERNAL: DB is connected\x1b[0m`)
    } catch (error) {
        winstonLogger.error('INTERNAL: MongoDB is not connecting')
    }
    
}

module.exports = mongoConnect

