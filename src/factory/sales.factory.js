const { environment } = require('../configs/app.config')

switch (environment) {
	case 'dev':
		module.exports = require('../DAO/filesystem/sale-dao.filesystem')
		break

	case 'prod':
		module.exports = require('../DAO/mongo/sale-dao.mongo')
		break

	default:
		break
}