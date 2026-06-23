import jwt from "jsonwebtoken";

import AppError from "#/utils/AppError.js";
import asyncHandler from "#/utils/asyncHandler.js";

export const authenticate = asyncHandler(async (req, res, next) => {
  const token = req.cookies.accessToken;

  if (!token) {
    throw new AppError("Authentication required", 401);
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    req.user = {
      id: payload.sub,
    };

    next();
  } catch (error) {
    throw new AppError("Invalid or expired authentication", 401);
  }
});
