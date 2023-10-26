export const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated() && req.user.rol === 'admin') {
      return next();
    }
    res.redirect('/login');
  };
