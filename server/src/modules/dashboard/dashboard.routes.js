import { Router } from "express";
import { getDashboard } from "./dashboard.controllers.js";

const router = Router();

router.get("/", getDashboard);

export default router;
