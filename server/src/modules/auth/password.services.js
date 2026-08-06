import crypto from "crypto";
import bcrypt from "bcrypt";
import { prisma } from "#/config/db.js";
import AppError from "#/utils/AppError.js";
import { generateToken, getUserByEmailOrThrow } from "./auth.helpers.js";
import { sendPasswordResetEmail } from "./email.services.js";

const RESEND_COOLDOWN_MS = 1 * 60 * 1000;
const RESEND_LOCKOUT_MS = 24 * 60 * 60 * 1000;

const issuePasswordResetToken = async (user, resendCount = 1) => {
  const { token, tokenHash, tokenExpiresAt } = generateToken();

  await sendPasswordResetEmail({ name: user.name, email: user.email, token });
  const passwordResetState = await prisma.user.update({
    where: { email: user.email },
    data: {
      passwordResetTokenHash: tokenHash,
      passwordResetTokenExpiresAt: tokenExpiresAt,
      passwordResetLastSentAt: new Date(),
      passwordResetResendCount: resendCount,
      passwordResetBlockedUntil: new Date(Date.now() + RESEND_COOLDOWN_MS),
    },
    select: {
      passwordResetLastSentAt: true,
      passwordResetResendCount: true,
      passwordResetBlockedUntil: true,
    },
  });

  return passwordResetState;
};

export const assertPasswordResetAllowed = (user) => {
  const now = new Date();

  if (user.passwordResetBlockedUntil && now < user.passwordResetBlockedUntil) {
    const remainingMs =
      user.passwordResetBlockedUntil.getTime() - now.getTime();
    const message = "Too many requests. Please try again later";

    if (remainingMs > 60 * 60 * 1000) {
      const hours = Math.ceil(remainingMs / (60 * 60 * 1000));
      message = `Too many requests. Please try again in ${hours} hours`;
    } else if (remainingMs > 60 * 1000) {
      const minutes = Math.ceil(remainingMs / (60 * 1000));
      message = `Too many requests. Please try again in ${minutes} minutes`;
    } else {
      const seconds = Math.ceil(remainingMs / 1000);
      message = `Too many requests. Please try again in ${seconds} seconds`;
    }

    throw new AppError(message, 429, "TOO_MANY_REQUESTS", {
      passwordResetBlockedUntil: user.passwordResetBlockedUntil,
      passwordResetResendCount: user.passwordResetResendCount,
    });
  }

  const isNewWindow =
    !user.passwordResetLastSentAt ||
    now - user.passwordResetLastSentAt > RESEND_LOCKOUT_MS;
  const currentCount = isNewWindow ? 0 : user.passwordResetResendCount || 0;

  return { isNewWindow, currentCount, now };
};

export const sendPasswordResetWithCooldown = async (
  user,
  { isNewWindow, currentCount, now },
) => {
  if (currentCount >= 3) {
    const blockedUntil = new Date(now.getTime() + RESEND_LOCKOUT_MS);
    await prisma.user.update({
      where: { email: user.email },
      data: { passwordResetBlockedUntil: blockedUntil },
    });

    throw new AppError(
      `Too many requests. Please try again in 24 hours`,
      429,
      "TOO_MANY_REQUESTS",
      {
        passwordResetBlockedUntil: user.passwordResetBlockedUntil,
        passwordResetResendCount: user.passwordResetResendCount,
      },
    );
  }

  await issuePasswordResetToken(user, isNewWindow ? 1 : currentCount + 1);

  const blockedUntil = new Date(now.getTime() + RESEND_COOLDOWN_MS);
  const data = await prisma.user.update({
    where: { email: user.email },
    data: { passwordResetBlockedUntil: blockedUntil },
    select: { passwordResetResendCount: true, passwordResetBlockedUntil: true },
  });

  return data;
};

// ─── Forgot password service ──────────────────────────────────────────
export const forgotPasswordService = async (email) => {
  if (!email) throw new AppError("Email is required", 400, "EMAIL_REQUIRED");

  const user = await getUserByEmailOrThrow(email);
  const state = assertPasswordResetAllowed(user);

  try {
    const data = await sendPasswordResetWithCooldown(user, state);
    return data;
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError("Failed to send reset email.", 500, "EMAIL_SEND_FAILED");
  }
};

export const resendPasswordResetEmailService = async (email) => {
  return await forgotPasswordService(email);
};

export const resetPasswordService = async (token, newPassword) => {
  if (!token || !newPassword) {
    throw new AppError(
      "Token and new password required",
      400,
      "TOKEN_REQUIRED",
    );
  }

  // Hash the incoming token from the URL
  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

  const user = await prisma.user.findFirst({
    where: {
      passwordResetTokenHash: tokenHash,
      passwordResetTokenExpiresAt: { gt: new Date() },
    },
  });

  if (!user) {
    throw new AppError(
      "Invalid or expired reset token",
      400,
      "INVALID_OR_EXPIRED_TOKEN",
    );
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: hashedPassword,
      passwordResetTokenHash: null,
      passwordResetTokenExpiresAt: null,
    },
  });

  return { message: "Password reset successfully" };
};

export const changePasswordService = async (userId, oldPassword, newPassword) => {
  if (!userId || !oldPassword || !newPassword) {
    throw new AppError("Missing required fields", 400, "BAD_REQUEST");
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new AppError("User not found", 404, "USER_NOT_FOUND");
  }

  const isMatch = await bcrypt.compare(oldPassword, user.password);
  if (!isMatch) {
    throw new AppError("Incorrect current password", 400, "INCORRECT_PASSWORD");
  }

  const isSamePassword = await bcrypt.compare(newPassword, user.password);
  if (isSamePassword) {
    throw new AppError("New password must be different from the current password", 400, "SAME_PASSWORD");
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: { id: userId },
    data: { password: hashedPassword },
  });

  return { message: "Password changed successfully" };
};
