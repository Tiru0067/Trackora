import { Router } from "express";
import {
  register,
  login,
  resendVerificationEmail,
  verifyEmail,
  logout,
  getCurrentUser,
  updateCurrentUser,
  deleteUser,
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
  validateResendVerificationEmail,
  validateVerifyEmail,
} from "./auth.validators.js";

import { authenticate } from "#/middlewares/authenticate.js";

const router = Router();

router.post("/register", validateRegister, register);

router.post("/login", validateLogin, login);

router.post(
  "/resend-verify-email",
  validateResendVerificationEmail,
  resendVerificationEmail,
);

router.post("/verify-email", validateVerifyEmail, verifyEmail);

router.post("/forgot-password", validateForgotPassword, forgotPassword);

router.post("/reset-password", validateResetPassword, resetPassword);

router.post("/logout", logout);

router
  .route("/me")
  .all(authenticate)
  .get(getCurrentUser)
  .patch(validateUpdateCurrentUser, updateCurrentUser)
  .delete(deleteUser);

router
  .route("/me/password")
  .all(authenticate)
  .patch(validateChangePassword, changePassword);

export default router;
