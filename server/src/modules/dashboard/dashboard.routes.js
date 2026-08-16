import { Router } from "express";
import { getDashboardData } from "./dashboard.controllers.js";
import { authenticate } from "#/middlewares/authenticate.js";

const router = Router();

router.use(authenticate);

router.route("/").get(getDashboardData);

export default router;
