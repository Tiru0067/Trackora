import { Router } from "express";
import { register, login, logout, me } from "./auth.controllers.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", me);

export default router;
