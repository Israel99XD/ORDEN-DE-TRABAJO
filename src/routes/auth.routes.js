import { Router } from "express";
import {
  renderSignUpForm,
  signup,
  renderSigninForm,
  signin,
  logout,
} from "../controllers/auth.controllers.js";

const router = Router();

// Routes
router.get("/auth/signup", renderSignUpForm);

router.post("/auth/signup", signup);

router.get("/auth/signin", renderSigninForm);

router.post("/auth/signin", signin);

router.get("/auth/logout", logout);

router.get("/dashboard", (req, res) => {
  if (req.isAuthenticated()) {
    if (req.user.rol === 'admin') {
      return res.redirect("/notes");
    } 
    if (req.user.rol === 'almacen') {
      return res.redirect("/piezas");
    } 
    if (req.user.rol === 'user'){
      return res.redirect("/user/notes");
    }
  }
  res.redirect('/auth/signin');
})

export default router;
