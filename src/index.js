const express = require('express')
const handlebars = require('express-handlebars')
const session = require('express-session')
const passport = require('passport')
const fs = require('fs')
const {Server} = require('socket.io')

const router = require('./router')
const mongoConnect = require('./db')
const { syncMemory } = require('./memory')
const AppConfig = require('./configs/app.config')
const initializePassport = require('./configs/passport.config')
const sessionConfig = require('./configs/session.config')
const errorMiddleware = require('./middlewares/errors')
const logger = require('./middlewares/winston-logger.middleware')
const sessionDestroy = require('./middlewares/sessionDestroy.middleware')

const generateProduct = require('./utils/products-mock.util')
const winstonLogger = require('./utils/winston/devLogger.winston')

const app = express()

app.engine('handlebars', handlebars.engine())
app.set('views', process.cwd() + '/src/views')
app.set('view engine', 'handlebars') 

app.use(express.json()) 
app.use(express.static(AppConfig.publicPath)) 
app.use(express.urlencoded({ extended: true }))


if (AppConfig.sessionSet) {
    app.use(session(sessionConfig))
}

initializePassport()



app.use(passport.initialize())



mongoConnect()
syncMemory()


// LOGGER

app.use(logger)



router(app)


winstonLogger.info(`\x1b[32mINTERNAL: Environment: ${AppConfig.environment}\x1b[0m`)

const httpServer = app.listen(AppConfig.port, ()=> {
    winstonLogger.info(`\x1b[32mINTERNAL: Server is running at port ${AppConfig.port}\x1b[0m`)
})


const io = new Server(httpServer)



let messages = []

const { saveMessage } = require('./services/chat.service')


io.on('connection', async socket=>{
    try {
        console.log('Nuevo Cliente conectado')
        socket.on('message', data=>{
            saveMessage(data)
            messages.push(data)
            io.emit('messageLogs', messages)
        })
        
    } catch (error) {
        throw error
    }
})