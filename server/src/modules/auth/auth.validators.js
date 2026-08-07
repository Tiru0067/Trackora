import { z } from "zod";
import { isValidPassword } from "#/utils/validation.js";
import {
  sendZodValidationError,
  nameSchema,
  currencyCodeSchema,
} from "#/utils/validators.js";

const emailSchema = z
  .string({ required_error: "Email is required" })
  .trim()
  .toLowerCase()
  .email("Enter a valid email address");

const passwordSchema = z
  .string({ required_error: "Password is required" })
  .min(8, "Password must be at least 8 characters")
  .max(128, "Password must not exceed 128 characters")
  .refine(
    isValidPassword,
    "Password must include uppercase, lowercase, number, and symbol",
  );

const registerSchema = z
  .object({
    name: nameSchema,
    email: emailSchema,
    baseCurrency: currencyCodeSchema,
    password: passwordSchema,
  })
  .strict();

export const validateRegister = (req, res, next) => {
  const result = registerSchema.safeParse(req.body);
  if (!result.success) return sendZodValidationError(res, result.error);
  req.body = result.data;
  next();
};

const loginSchema = z
  .object({
    email: emailSchema,
    password: z
      .string({ required_error: "Password is required" })
      .max(128, "Password must not exceed 128 characters"),
  })
  .strict();

export const validateLogin = (req, res, next) => {
  const result = loginSchema.safeParse(req.body);
  if (!result.success) return sendZodValidationError(res, result.error);
  req.body = result.data;
  next();
};

const forgotPasswordSchema = z
  .object({
    email: emailSchema,
  })
  .strict();

export const validateForgotPassword = (req, res, next) => {
  const result = forgotPasswordSchema.safeParse(req.body);
  if (!result.success) return sendZodValidationError(res, result.error);
  req.body = result.data;
  next();
};

const resetPasswordSchema = z
  .object({
    token: z
      .string({ required_error: "Token is required" })
      .min(1, "Token is required"),
    password: passwordSchema,
  })
  .strict();

export const validateResetPassword = (req, res, next) => {
  const result = resetPasswordSchema.safeParse(req.body);
  if (!result.success) return sendZodValidationError(res, result.error);
  req.body = result.data;
  next();
};

const resendVerificationSchema = z
  .object({
    email: emailSchema,
  })
  .strict();

export const validateResendVerificationEmail = (req, res, next) => {
  const result = resendVerificationSchema.safeParse(req.body);
  if (!result.success) return sendZodValidationError(res, result.error);
  req.body = result.data;
  next();
};

const verifyEmailSchema = z
  .object({
    token: z
      .string({ required_error: "Token is required" })
      .min(1, "Token is required"),
  })
  .strict();

export const validateVerifyEmail = (req, res, next) => {
  const result = verifyEmailSchema.safeParse(req.body);
  if (!result.success) return sendZodValidationError(res, result.error);
  req.body = result.data;
  next();
};

const updateCurrentUserSchema = z
  .object({
    name: nameSchema.optional(),
    email: emailSchema.optional(),
    baseCurrency: currencyCodeSchema.optional(),
  })
  .strict()
  .refine(
    (data) => Object.keys(data).length > 0,
    "At least one field must be provided to update",
  );

export const validateUpdateCurrentUser = (req, res, next) => {
  const result = updateCurrentUserSchema.safeParse(req.body);
  if (!result.success) return sendZodValidationError(res, result.error);
  req.body = result.data;
  next();
};

const changePasswordSchema = z
  .object({
    oldPassword: z.string({ required_error: "Old password is required" }),
    newPassword: passwordSchema,
  })
  .strict();

export const validateChangePassword = (req, res, next) => {
  const result = changePasswordSchema.safeParse(req.body);
  if (!result.success) return sendZodValidationError(res, result.error);
  req.body = result.data;
  next();
};
