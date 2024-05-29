
const publicAccess = require('./publicAccess.middleware')
const privateAccess= require('./privateAccess.middleware')
const upload = require('./multer.middleware')
const roleAccess = require('./role-access.middleware')
const fileHandler = require('./file-handler.middleware')
const premiumAccess = require('./premium.middleware')


module.exports = {
	publicAccess,
	privateAccess,
	upload,
	roleAccess,
	fileHandler,
	premiumAccess
}


