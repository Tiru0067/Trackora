import bcrypt from "bcrypt";

import { prisma } from "#/config/db.js";
import AppError from "#/utils/AppError.js";

export const registerService = async (input) => {
  if (input === undefined) {
    throw new Error("registerService: input is required");
  }

  if (input === null || typeof input !== "object" || Array.isArray(input)) {
    throw new Error("Request input must be an Object");
  }

  const { name, email, baseCurrency, password } = input;

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new AppError("Email is already registered", 409);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    return await prisma.user.create({
      data: {
        name,
        email,
        baseCurrency,
        password: hashedPassword,
      },
      omit: { password: true },
    });
  } catch (error) {
    console.log(error);
    if (error?.code === "P2002") {
      throw new AppError("Email is already registered", 409);
    }

    throw error;
  }
};

export const loginService = async (input) => {
  if (input === undefined) {
    throw new Error("loginService: input is required");
  }

  const { email, password } = input;
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new AppError("Invalid email or password", 401);
  }

  const passwordMatches = await bcrypt.compare(password, user.password);

  if (!passwordMatches) {
    throw new AppError("Invalid email or password", 401);
  }

  const { password: _password, ...safeUser } = user;

  return safeUser;
};

export const getCurrentUserService = async (id) => {
  if (id === undefined) {
    throw new Error("getCurrentUserService: user ID is required");
  }

  const user = await prisma.user.findUnique({
    where: { id },
    omit: { password: true },
  });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  return user;
};

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
    throw new AppError("User not found", 404);
  }

  const updatedUser = await prisma.user.update({ where: { id }, data });
  return updatedUser;
};
