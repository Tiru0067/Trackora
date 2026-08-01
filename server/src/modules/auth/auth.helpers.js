import crypto from "crypto";
import { prisma } from "#/config/db.js";
import AppError from "#/utils/AppError.js";

export const emailAlreadyExists = () =>
  new AppError("Email is already registered", 409, "EMAIL_ALREADY_EXISTS");

export const invalidCredentials = () =>
  new AppError("Invalid email or password", 401, "INVALID_CREDENTIALS");

export const generateToken = () => {
  const token = crypto.randomBytes(32).toString("hex");
  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");  const tokenExpiresAt = new Date(Date.now() + 30 * 60 * 1000);
  return { token, tokenHash, tokenExpiresAt };
};

export const getUserByEmailOrThrow = async (email, { onNotFound } = {}) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user)
    throw onNotFound
      ? onNotFound()
      : new AppError("User not found", 404, "USER_NOT_FOUND");
  return user;
};
