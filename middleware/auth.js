/**
 * Authentication middleware
 */

// Middleware to check if user is logged in
const isAuthenticated = (req, res, next) => {
  if (req.session && req.session.user) {
    return next();
  }
  
  // Store the original URL they were trying to access
  req.session.returnTo = req.originalUrl;
  res.redirect('/admin/login');
};

// Middleware to check if user is an admin
const isAdmin = (req, res, next) => {
  if (req.session && req.session.user && req.session.user.role === 'admin') {
    return next();
  }
  
  return res.status(403).render('error', {
    title: 'Access Denied',
    status: 403,
    message: 'You do not have permission to access this page.',
    error: { status: 403 }
  });
};

// Middleware to add user data to response locals for all views
const setUserLocals = (req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
};

module.exports = {
  isAuthenticated,
  isAdmin,
  setUserLocals
}; 