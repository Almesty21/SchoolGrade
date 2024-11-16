function checkAuthentication(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    res.status(401).json('User not authorized');
  }
  
  module.exports = checkAuthentication;
  