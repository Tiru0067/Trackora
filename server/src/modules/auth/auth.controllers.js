import asyncHander from "#/utils/asyncHandler.js";
import sendResponse from "#/utils/response.js";

import { registerService } from "./auth.services.js";

export const register = asyncHander(async (req, res) => {
  const { name, email, baseCurrency, password } = req.body;
  const user = await registerService({ name, email, baseCurrency, password });

  sendResponse(res, {
    statusCode: 201,
    message: "Registration successful",
    data: user,
  });
});

export const login = (req, res) => {
  sendResponse(res, { statusCode: 200, message: "Login route" });
};

export const logout = (req, res) => {
  sendResponse(res, { statusCode: 200, message: "Logout route" });
};

export const me = (req, res) => {
  sendResponse(res, { statusCode: 200, message: "Me route" });
};
