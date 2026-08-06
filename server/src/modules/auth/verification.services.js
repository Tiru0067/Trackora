import crypto from "crypto";
import { prisma } from "#/config/db.js";
import AppError from "#/utils/AppError.js";
import { sendVerificationEmail } from "./email.services.js";
import { generateToken, getUserByEmailOrThrow } from "./auth.helpers.js";

const RESEND_COOLDOWN_MS = 1 * 60 * 1000;
const RESEND_LOCKOUT_MS = 24 * 60 * 60 * 1000;

export const issueVerificationToken = async (user, resendCount = 1) => {
  const { token, tokenHash, tokenExpiresAt } = generateToken();

  await sendVerificationEmail({
    name: user.name,
    email: user.email,
    token,
  });

  const emailVerificationState = await prisma.user.update({
    where: { email: user.email },
    data: {
      emailVerificationTokenHash: tokenHash,
      emailVerificationTokenExpiresAt: tokenExpiresAt,
      emailVerificationLastSentAt: new Date(),
      emailVerificationResendCount: resendCount,
      emailVerificationBlockedUntil: new Date(Date.now() + RESEND_COOLDOWN_MS),
    },
    select: {
      emailVerificationLastSentAt: true,
      emailVerificationResendCount: true,
      emailVerificationBlockedUntil: true,
    },
  });

  return emailVerificationState;
};

// Throws if blocked, otherwise returns the count to use for this attempt
export const assertResendAllowed = (user) => {
  const now = new Date();

  if (
    user.emailVerificationBlockedUntil &&
    now < user.emailVerificationBlockedUntil
  ) {
    const remainingMs =
      user.emailVerificationBlockedUntil.getTime() - now.getTime();
    let message = "Too many requests. Please try again later";

    if (remainingMs > 60 * 60 * 1000) {
      const hours = Math.ceil(remainingMs / (60 * 60 * 1000));
      message = `Too many requests. Please try again in ${hours} hours.`;
    } else if (remainingMs > 60 * 1000) {
      const minutes = Math.ceil(remainingMs / (60 * 1000));
      message = `Too many requests. Please try again in ${minutes} minutes.`;
    } else {
      const seconds = Math.ceil(remainingMs / 1000);
      message = `Please wait ${seconds} seconds before requesting another email.`;
    }

    throw new AppError(message, 429, "TOO_MANY_REQUESTS", {
      emailVerificationBlockedUntil: user.emailVerificationBlockedUntil,
      emailVerificationResendCount: user.emailVerificationResendCount,
    });
  }

  const isNewWindow =
    !user.emailVerificationLastSentAt ||
    now - user.emailVerificationLastSentAt > RESEND_LOCKOUT_MS;
  const currentCount = isNewWindow ? 0 : user.emailVerificationResendCount || 0;

  return { isNewWindow, currentCount, now };
};

export const sendVerificationWithCooldown = async (
  user,
  { isNewWindow, currentCount, now },
) => {
  if (currentCount >= 3) {
    const blockedUntil = new Date(now.getTime() + RESEND_LOCKOUT_MS);
    await prisma.user.update({
      where: { email: user.email },
      data: { emailVerificationBlockedUntil: blockedUntil },
    });

    throw new AppError(
      `Too many requests. Please try again in 24 hours`,
      429,
      "TOO_MANY_REQUESTS",
      {
        emailVerificationResendCount: currentCount,
        emailVerificationBlockedUntil: blockedUntil,
      },
    );
  }

  await issueVerificationToken(user, isNewWindow ? 1 : currentCount + 1);

  const blockedUntil = new Date(now.getTime() + RESEND_COOLDOWN_MS);
  const data = await prisma.user.update({
    where: { email: user.email },
    data: { emailVerificationBlockedUntil: blockedUntil },
    select: {
      emailVerificationResendCount: true,
      emailVerificationBlockedUntil: true,
    },
  });

  return data;
};

// ─── Resend verification email service ──────────────────────────────────────────
export const resendVerificationEmailService = async (email) => {
  if (!email) throw new AppError("Email is required", 400, "EMAIL_REQUIRED");

  const user = await getUserByEmailOrThrow(email);

  if (user.emailVerifiedAt) {
    throw new AppError(
      "Email is already verified",
      400,
      "EMAIL_ALREADY_VERIFIED",
    );
  }

  const state = assertResendAllowed(user);

  try {
    const data = await sendVerificationWithCooldown(user, state);
    return data;
  } catch (error) {
    //    if (error instanceof AppError) throw error;
    console.error("Failed to send verification email:", error);
    throw new AppError(
      "Failed to send verification email. Please try again later.",
      500,
      "EMAIL_SEND_FAILED",
    );
  }
};

// ─── Verify email service ───────────────────────────────────────────────────────
export const verifyEmailService = async (token) => {
  if (!token) {
    throw new AppError("Verification token is required", 400, "TOKEN_REQUIRED");
  }

  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

  const user = await prisma.user.findFirst({
    where: {
      emailVerificationTokenHash: tokenHash,
      emailVerificationTokenExpiresAt: { gt: new Date() },
    },
  });

  if (!user) {
    throw new AppError(
      "Invalid or expired verification token",
      400,
      "INVALID_OR_EXPIRED_TOKEN",
    );
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      emailVerifiedAt: new Date(),
      emailVerificationTokenHash: null,
      emailVerificationTokenExpiresAt: null,
    },
  });

  return { message: "Email verified successfully" };
};
