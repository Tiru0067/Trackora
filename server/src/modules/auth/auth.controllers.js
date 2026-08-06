import jwt from "jsonwebtoken";
import asyncHandler from "#/utils/asyncHandler.js";
import sendResponse from "#/utils/response.js";
import {
  registerService,
  loginService,
  getCurrentUserService,
  updateUserService,
} from "./auth.services.js";

import {
  resendVerificationEmailService,
  verifyEmailService,
} from "./verification.services.js";

import {
  forgotPasswordService,
  resetPasswordService,
  changePasswordService,
} from "./password.services.js";

// ─── Cookie Options ─────────────────────────────────────────────────────────────
export const authCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/api",
};

// ─── Register ───────────────────────────────────────────────────────────────────
export const register = asyncHandler(async (req, res) => {
  const { name, email, baseCurrency, password } = req.body;
  const user = await registerService({ name, email, baseCurrency, password });

  sendResponse(res, {
    statusCode: 201,
    message: "Registration successful",
    data: user,
  });
});

// ─── Login ──────────────────────────────────────────────────────────────────────
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await loginService({ email, password });

  const token = jwt.sign({ sub: user.id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });

  res.cookie("accessToken", token, {
    ...authCookieOptions,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return sendResponse(res, {
    statusCode: 200,
    message: "Login successful",
    data: user,
  });
});

export const resendVerificationEmail = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const data = await resendVerificationEmailService(email);

  return sendResponse(res, {
    statusCode: 200,
    message: "Verification email resent successfully",
    data,
  });
});

// ─── Verify Email ───────────────────────────────────────────────────────────────
export const verifyEmail = asyncHandler(async (req, res) => {
  const { token } = req.body;
  const result = await verifyEmailService(token);

  return sendResponse(res, {
    statusCode: 200,
    message: result.message,
  });
});

// ─── Forgot Password ────────────────────────────────────────────────────────────
export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const data = await forgotPasswordService(email);

  return sendResponse(res, {
    statusCode: 200,
    message: "Password reset email sent successfully",
    data,
  });
});

// ─── Reset Password ─────────────────────────────────────────────────────────────
export const resetPassword = asyncHandler(async (req, res) => {
  const { token, password } = req.body;
  const result = await resetPasswordService(token, password);

  return sendResponse(res, {
    statusCode: 200,
    message: result.message,
  });
});

// ─── Logout ─────────────────────────────────────────────────────────────────────
export const logout = asyncHandler(async (req, res) => {
  res.clearCookie("accessToken", authCookieOptions);

  return sendResponse(res, {
    statusCode: 200,
    message: "Logged out successfully",
  });
});

// ─── Get Current User ───────────────────────────────────────────────────────────
export const getCurrentUser = asyncHandler(async (req, res) => {
  const { id } = req.user;

  const user = await getCurrentUserService(id);

  return sendResponse(res, {
    statusCode: 200,
    message: "User retrieved successfully",
    data: user,
  });
});

// ─── Update Current User ───────────────────────────────────────────────────────
export const updateCurrentUser = asyncHandler(async (req, res) => {
  const { name, email, baseCurrency } = req.body;
  const { id } = req.user;
  const user = await updateUserService({ id, name, email, baseCurrency });
  return sendResponse(res, {
    statusCode: 200,
    message: "updated successfully",
    data: user,
  });
});

// ─── Change Password (Logged In) ────────────────────────────────────────────────
export const changePassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const { id } = req.user;

  const result = await changePasswordService(id, oldPassword, newPassword);

  return sendResponse(res, {
    statusCode: 200,
    message: result.message,
  });
});
