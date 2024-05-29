const { environment } = require('../configs/app.config')

switch (environment) {
	case 'dev':
		module.exports = require('../DAO/filesystem/cart-dao.filesystem')
		break

	case 'prod':
		module.exports = require('../DAO/mongo/cart-dao.mongo')
		break

	default:
		break
}

