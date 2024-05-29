
function roleAccess (req, res, next)  {
	if (req.session.user) {
		if (req.session.user.role == 'admin') {
			
			return res.status(403).json({error: 'Forbidden', message: 'admins do not have access'})
	
			}

	}
	
	next()
}


module.exports = roleAccess