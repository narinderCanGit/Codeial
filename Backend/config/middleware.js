module.exports.setFlash = function(req, res, next){
    res.locals.flash = {
        'success': req.flash('success'),
        'error': req.flash('error')
    }
    next();
}

// Middleware to ensure user is authenticated
module.exports.ensureAuthenticated = function (req, res, next) {
  if (req.session.user) {
    return next();
  }
  return res.status(401).json({ message: 'Unauthorized' });
};
