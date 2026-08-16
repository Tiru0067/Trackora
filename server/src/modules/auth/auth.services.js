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
      data: {
        name,
        email,
        baseCurrency,
        password: hashedPassword,
        categories: {
          create: [
            { name: "Food & Dining", color: "#EF4444", icon: { type: "emoji", value: "🍔" } },
            { name: "Groceries", color: "#10B981", icon: { type: "emoji", value: "🛒" } },
            { name: "Transport", color: "#3B82F6", icon: { type: "emoji", value: "🚌" } },
            { name: "Shopping", color: "#8B5CF6", icon: { type: "emoji", value: "🛍️" } },
            { name: "Bills & Utilities", color: "#F59E0B", icon: { type: "emoji", value: "💡" } },
          ],
        },
        wallets: {
          create: {
            name: "Personal",
            currency: baseCurrency,
            color: "#3B82F6",
            icon: { type: "emoji", value: "💼" },
            isPrimary: true,
          },
        },
      },
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
      emailVerificationBlockedUntil: user.emailVerificationBlockedUntil,
      emailVerificationResendCount: user.emailVerificationResendCount,
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
    emailVerificationResendCount: user.emailVerificationResendCount,
    emailVerificationBlockedUntil: user.emailVerificationBlockedUntil,
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
      emailVerificationResendCount: true,
      emailVerificationBlockedUntil: true,
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

// ─── Delete user ────────────────────────────────────────────────────────────────
export const deleteUserService = async (id) => {
  if (id === undefined) {
    throw new Error("deleteUserService: user ID is required");
  }

  // Because of onDelete: Cascade on relations, Prisma will automatically
  // delete wallets, transactions, and categories when the user is deleted.
  try {
    await prisma.user.delete({
      where: { id },
    });
  } catch (error) {
    if (error?.code === "P2025") {
      throw new AppError("User not found", 404, "USER_NOT_FOUND");
    }
    throw error;
  }
};
