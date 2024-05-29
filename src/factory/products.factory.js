const { environment } = require('../configs/app.config')

switch (environment) {
	case 'dev':
		module.exports = require('../DAO/filesystem/product-dao.filesystem')
		break

	case 'prod':
		module.exports = require('../DAO/mongo/product-dao.mongo')
		break

	default:
		break
}
