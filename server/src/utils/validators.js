import { z } from "zod";
import emojiRegex from "emoji-regex";
import sendResponse from "#/utils/response.js";
import { isValidCurrency } from "#/utils/validation.js";

const strictEmojiRegex = new RegExp(`^(?:${emojiRegex().source})$`);

export const sendZodValidationError = (res, zError) => {
  const invalidFields = {};

  zError.issues.forEach((err) => {
    const fieldPath = err.path.join(".");
    invalidFields[fieldPath] = err.message;
  });

  return sendResponse(res, {
    statusCode: 400,
    code: "VALIDATION_ERROR",
    message: "Validation failed",
    errors: {
      invalidFields,
    },
  });
};

export const nameSchema = z
  .string({ required_error: "Name is required" })
  .trim()
  .min(2, "Name must be at least 2 characters");

export const currencyCodeSchema = z
  .string({ required_error: "Currency is required" })
  .trim()
  .toUpperCase()
  .refine(isValidCurrency, "Enter a valid currency code");

export const hexColorSchema = z
  .string({ required_error: "Color is required" })
  .trim()
  .toUpperCase()
  .refine(
    (val) => /^#([0-9A-F]{3}){1,2}$/i.test(val),
    "Color must be a valid hex code",
  );

export const iconSchema = z.discriminatedUnion(
  "type",
  [
    z.object({
      type: z.literal("emoji", {
        errorMap: () => ({ message: "Icon type must be 'emoji' or 'icon'" }),
      }),
      value: z
        .string()
        .refine(
          (val) => strictEmojiRegex.test(val),
          "Icon 'value' must be a valid emoji when type is 'emoji'",
        ),
    }),
    z.object({
      type: z.literal("icon"),
      value: z
        .string()
        .min(1, "Icon must have a valid 'value' string")
        .refine(
          (val) => !strictEmojiRegex.test(val),
          "Icon 'value' cannot be an emoji when type is 'icon'",
        ),
      pack: z
        .string({
          required_error:
            "Icon must have a valid 'pack' string when type is 'icon'",
        })
        .min(1, "Icon must have a valid 'pack' string when type is 'icon'"),
    }),
  ],
  {
    errorMap: () => ({
      message: "Icon must be a valid object with 'type' and 'value'",
    }),
  },
);

export const validateUUIDParam = (req, res, next) => {
  const result = z.string().uuid().safeParse(req.params.id);
  if (!result.success) {
    return sendResponse(res, {
      statusCode: 400,
      code: "VALIDATION_ERROR",
      message: "Invalid UUID format in URL parameter",
      errors: {
        invalidFields: {
          id: "Invalid UUID format",
        },
      },
    });
  }
  next();
};
