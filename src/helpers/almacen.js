export const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated() && req.user.rol === 'almacen') {
      return next();
    }
    res.redirect('/login');
  };
  
