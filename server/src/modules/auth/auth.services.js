import bcrypt from "bcrypt";

import { prisma } from "#/config/db.js";
import AppError from "#/utils/AppError.js";

export const registerService = async (input) => {
  if (input === undefined) {
    throw new Error("Registration input is required");
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
