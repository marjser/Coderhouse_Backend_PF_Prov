const { environment } = require('../configs/app.config')



switch (environment) {
	case 'dev':
		module.exports = require('../DAO/filesystem/user-dao.filesystem')
		break

	case 'prod':
		module.exports = require('../DAO/mongo/new-user-dao.mongo')
		break

	default:
		break
}
