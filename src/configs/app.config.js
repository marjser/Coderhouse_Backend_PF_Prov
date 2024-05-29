require('dotenv').config()


const session = {
	config: false
}

if (process.env.ENVIRONMENT === 'prod') {
	session.config = true 
}

module.exports = {
	port: process.env.PORT || 3000, 
	environment: process.env.ENVIRONMENT,
	sessionSet: session.config,
	publicPath: process.cwd() + '/src/public'
}

