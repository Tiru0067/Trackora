import { Router } from "express";
import {
  register,
  login,
  resendVerificationEmail,
  verifyEmail,
  logout,
  getCurrentUser,
  updateCurrentUser,
  forgotPassword,
  resetPassword,
  changePassword,
} from "./auth.controllers.js";

import {
  validateLogin,
  validateRegister,
  validateUpdateCurrentUser,
  validateForgotPassword,
  validateResetPassword,
  validateChangePassword,
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

router.post(
  "/resend-verify-email",
  validateBody,
  allowFields("email"),
  resendVerificationEmail,
);

router.post("/verify-email", validateBody, allowFields("token"), verifyEmail);

router.post(
  "/forgot-password",
  validateBody,
  allowFields("email"),
  validateForgotPassword,
  forgotPassword,
);

router.post(
  "/reset-password",
  validateBody,
  allowFields("token", "password"),
  validateResetPassword,
  resetPassword,
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

router
  .route("/me/password")
  .all(authenticate)
  .patch(
    validateBody,
    allowFields("oldPassword", "newPassword"),
    validateChangePassword,
    changePassword,
  );

export default router;
