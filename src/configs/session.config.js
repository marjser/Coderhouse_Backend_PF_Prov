require('dotenv').config()
const MongoStore = require("connect-mongo");
const { dbUser, dbPassword, dbHost, dbSession } = require("./db.config")


const sessionConfig = {
    secret: process.env.SESSION_SECRET,
    store: MongoStore.create({
        mongoUrl: `mongodb+srv://${dbUser}:${dbPassword}@${dbHost}/${dbSession}?retryWrites=true&w=majority`,
        ttl: 60000
    }),
    resave: false,
    saveUninitialized: false,		
}

module.exports = sessionConfig
