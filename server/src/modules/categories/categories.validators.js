import { z } from "zod";
import {
  sendZodValidationError,
  nameSchema,
  hexColorSchema,
  iconSchema,
} from "#/utils/validators.js";

export const createCategorySchema = z.object({
  name: nameSchema,
  color: hexColorSchema,
  icon: iconSchema,
  note: z.string().max(255, "Note cannot exceed 255 characters").optional().nullable(),
}).strict("Unrecognized fields are not allowed");

export const updateCategorySchema = createCategorySchema.partial().strict("Unrecognized fields are not allowed");

export const validateCreateCategory = (req, res, next) => {
  const result = createCategorySchema.safeParse(req.body);

  if (!result.success) {
    return sendZodValidationError(res, result.error);
  }

  req.body = result.data;
  
  next();
};

export const validateUpdateCategory = (req, res, next) => {
  const result = updateCategorySchema.safeParse(req.body);

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
