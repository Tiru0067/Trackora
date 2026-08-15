import jwt from "jsonwebtoken";

import AppError from "#/utils/AppError.js";
import asyncHandler from "#/utils/asyncHandler.js";
import { prisma } from "#/config/db.js";

export const authenticate = asyncHandler(async (req, res, next) => {
  const token = req.cookies.accessToken;

  if (!token) {
    throw new AppError("Authentication required", 401, "UNAUTHORIZED");
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
    });

    if (!user) {
      throw new AppError("User no longer exists", 401, "USER_NOT_FOUND");
    }

    req.user = {
      id: user.id,
    };

    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
      throw new AppError("Invalid or expired authentication", 401, "INVALID_TOKEN");
    }
    throw error;
  }
});
