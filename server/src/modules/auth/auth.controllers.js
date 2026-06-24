import jwt from "jsonwebtoken";
import asyncHandler from "#/utils/asyncHandler.js";
import sendResponse from "#/utils/response.js";
import {
  registerService,
  loginService,
  getCurrentUserService,
  updateUserService,
} from "./auth.services.js";

export const authCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/api",
};

export const register = asyncHandler(async (req, res) => {
  const { name, email, baseCurrency, password } = req.body;
  const user = await registerService({ name, email, baseCurrency, password });

  sendResponse(res, {
    statusCode: 201,
    message: "Registration successful",
    data: user,
  });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await loginService({ email, password });

  const token = jwt.sign(
    {
      sub: user.id,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    },
  );

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

export const logout = (req, res) => {
  res.cookie("accessToken", authCookieOptions);

  return sendResponse(res, {
    statusCode: 200,
    message: "Logged out successfully",
  });
};

export const getCurrentUser = asyncHandler(async (req, res) => {
  const { id } = req.user;
  const user = await getCurrentUserService(id);
  return sendResponse(res, {
    statusCode: 200,
    message: "User retrieved successfully",
    data: user,
  });
});

export const updateCurrentUser = asyncHandler(async (req, res) => {
  const { name, email, baseCurrency } = req.body;
  const { id } = req.user;
  const user = await updateUserService({ id, name, email, baseCurrency });
  return sendResponse(res, {
    statusCode: 201,
    message: "updated successfully",
    data: user,
  });
});
