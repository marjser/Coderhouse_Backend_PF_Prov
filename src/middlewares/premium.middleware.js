function premiumAccess (req, res, next) {
	if (req.session.user) {
		if (req.session.user.role === 'premium') {			
			return res.redirect('/profile') 	
			}
	}

    next()
}

module.exports = premiumAccess