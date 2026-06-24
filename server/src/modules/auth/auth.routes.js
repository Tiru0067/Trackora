import { Router } from "express";
import {
  register,
  login,
  logout,
  getCurrentUser,
  updateCurrentUser,
} from "./auth.controllers.js";

import {
  validateLogin,
  validateRegister,
  validateUpdateCurrentUser,
} from "./auth.validators.js";

import { authenticate } from "#/middlewares/authenticate.js";
import { validateBody } from "#/middlewares/validateBody.js";
import { allowFields } from "#/middlewares/allowFields.js";

const router = Router();

router.post(
  "/register",
  validateBody,
  allowFields("name", "email", "baseCurrency", "password"),
  validateRegister,
  register,
);

router.post(
  "/login",
  validateBody,
  allowFields("email", "password"),
  validateLogin,
  login,
);

router.post("/logout", logout);

router
  .route("/me")
  .all(authenticate)
  .get(getCurrentUser)
  .patch(
    validateBody,
    allowFields("name", "email", "baseCurrency"),
    validateUpdateCurrentUser,
    updateCurrentUser,
  );

export default router;
