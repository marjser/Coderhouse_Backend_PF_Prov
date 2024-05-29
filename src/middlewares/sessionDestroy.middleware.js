function sessionDestroy (req, res, next)  {
	if (req.session.user) {
        req.session.destroy()
		return next()
    }
    
	next()
}


module.exports = sessionDestroy