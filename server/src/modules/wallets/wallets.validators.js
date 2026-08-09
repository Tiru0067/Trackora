import { z } from "zod";
import {
  sendZodValidationError,
  nameSchema,
  currencyCodeSchema,
  hexColorSchema,
  iconSchema,
} from "#/utils/validators.js";

export const createWalletSchema = z.object({
  name: nameSchema,
  currency: currencyCodeSchema,

  initialBalance: z.number({ invalid_type_error: "Initial balance must be a number" })
    .nonnegative("Initial balance cannot be negative")
    .optional(),

  color: hexColorSchema,
  icon: iconSchema,

  isPrimary: z.boolean({ invalid_type_error: "isPrimary must be a boolean" })
    .optional(),

  pinnedAt: z.string().datetime().nullable().optional(),
}).strict("Unrecognized fields are not allowed");

export const updateWalletSchema = createWalletSchema.omit({ currency: true }).partial().strict("Unrecognized fields are not allowed");

export const validateCreateWallet = (req, res, next) => {
  const result = createWalletSchema.safeParse(req.body);

  if (!result.success) {
    return sendZodValidationError(res, result.error);
  }

  req.body = result.data;
  
  next();
};

export const validateUpdateWallet = (req, res, next) => {
  const result = updateWalletSchema.safeParse(req.body);

  if (!result.success) {
    return sendZodValidationError(res, result.error);
  }

  // Ensure at least one field is provided
  if (Object.keys(result.data).length === 0) {
    return res.status(400).json({
      success: false,
      statusCode: 400,
      code: "VALIDATION_ERROR",
      message: "At least one field must be provided to update",
    });
  }

  req.body = result.data;
  
  next();
};
