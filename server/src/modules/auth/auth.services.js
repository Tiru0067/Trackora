import bcrypt from "bcrypt";
import { prisma } from "#/config/db.js";
import AppError from "#/utils/AppError.js";
import {
  emailAlreadyExists,
  invalidCredentials,
  getUserByEmailOrThrow,
} from "./auth.helpers.js";
import {
  issueVerificationToken,
  assertResendAllowed,
  sendVerificationWithCooldown,
} from "./verification.services.js";

// ─── Register Service ────────────────────────────────────────────────────────────
export const registerService = async (input) => {
  const { name, email, baseCurrency, password } = input;

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) throw emailAlreadyExists();

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = await prisma.user.create({
      data: { name, email, baseCurrency, password: hashedPassword },
      select: { name: true, email: true },
    });

    try {
      const tokenResult = await issueVerificationToken(user);
      return { ...user, ...tokenResult };
    } catch (error) {
      console.error("Failed to send verification email:", error);
    }
  } catch (error) {
    if (error?.code === "P2002") throw emailAlreadyExists();
    throw error;
  }
};

// ─── Login service ───────────────────────────────────────────────────────────────
export const loginService = async (input) => {
  const { email, password } = input;

  const user = await getUserByEmailOrThrow(email, {
    onNotFound: invalidCredentials,
  });

  const passwordMatches = await bcrypt.compare(password, user.password);
  if (!passwordMatches) throw invalidCredentials();

  if (!user.emailVerifiedAt) {
    let cooldownData = {
      verificationEmailResendBlockedUntil:
        user.verificationEmailResendBlockedUntil,
      verificationEmailResendCount: user.verificationEmailResendCount,
    };

    try {
      const state = assertResendAllowed(user);
      cooldownData = await sendVerificationWithCooldown(user, state);
    } catch (error) {
      if (error instanceof AppError && error.statusCode === 429) {
        throw error;
      }
      console.error(error.message);
    }

    throw new AppError(
      "Please verify your email. We've sent you a new verification email.",
      403,
      "EMAIL_NOT_VERIFIED",
      cooldownData,
    );
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    baseCurrency: user.baseCurrency,
    emailVerifiedAt: user.emailVerifiedAt,
    verificationEmailResendCount: user.verificationEmailResendCount,
    verificationEmailResendBlockedUntil:
      user.verificationEmailResendBlockedUntil,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
};

// ─── Get current user ────────────────────────────────────────────────────────────
export const getCurrentUserService = async (id) => {
  if (id === undefined) {
    throw new Error("getCurrentUserService: user ID is required");
  }

  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      baseCurrency: true,
      emailVerifiedAt: true,
      verificationEmailResendCount: true,
      verificationEmailResendBlockedUntil: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    throw new AppError("User not found", 404, "USER_NOT_FOUND");
  }

  return user;
};

// ─── Update user ───────────────────────────────────────────────────────────────
export const updateUserService = async (input) => {
  if (input === undefined) {
    throw new Error("updateUserService: input is required");
  }

  const { id, ...data } = input;
  const existingUser = await prisma.user.findUnique({
    where: { id },
    omit: { password: true },
  });

  if (!existingUser) {
    throw new AppError("User not found", 404, "USER_NOT_FOUND");
  }

  const updatedUser = await prisma.user.update({
    where: { id },
    data,
    omit: { password: true },
  });
  return updatedUser;
};
