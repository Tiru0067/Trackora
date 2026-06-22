import { Router } from "express";
import { register, login, logout, me } from "./auth.controllers.js";
import { validateRegister } from "./auth.validators.js";

const router = Router();

router.post("/register", validateRegister, register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", me);

export default router;
