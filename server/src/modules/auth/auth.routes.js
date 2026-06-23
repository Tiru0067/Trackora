import { Router } from "express";
import { register, login, logout, getCurrentUser } from "./auth.controllers.js";
import { validateLogin, validateRegister } from "./auth.validators.js";
import { authenticate } from "#/middlewares/authenticate.js";

const router = Router();

router.post("/register", validateRegister, register);
router.post("/login", validateLogin, login);
router.post("/logout", logout);
router.get("/me", authenticate, getCurrentUser);

export default router;
