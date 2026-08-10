import { z } from "zod";
import { sendZodValidationError } from "#/utils/validators.js";

export const createTransactionSchema = z
  .object({
    type: z.preprocess(
      (val) => (typeof val === "string" ? val.toUpperCase() : val),
      z.enum(["INCOME", "EXPENSE", "TRANSFER"])
    ),
    walletId: z.string().uuid().optional(),
    fromWalletId: z.string().uuid().optional(),
    toWalletId: z.string().uuid().optional(),
    categoryId: z.string().uuid().nullable().optional(),
    amount: z.number().positive(),
    destinationAmount: z.number().positive().optional(),
    date: z.string().datetime(),
    title: z.string().min(1).max(255),
    note: z.string().nullable().optional(),
  })
  .strict()
  .superRefine((data, ctx) => {
    if (data.type === "TRANSFER") {
      if (!data.fromWalletId || !data.toWalletId) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "fromWalletId and toWalletId are required for transfers",
          path: ["type"],
        });
      }
      if (data.fromWalletId === data.toWalletId) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Cannot transfer to the same wallet",
          path: ["toWalletId"],
        });
      }
      if (data.walletId || data.categoryId) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Transfers cannot have a walletId or categoryId",
          path: ["type"],
        });
      }
    } else {
      if (!data.walletId) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "walletId is required for income and expense",
          path: ["walletId"],
        });
      }
      if (data.fromWalletId || data.toWalletId) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Income and expense cannot have fromWalletId or toWalletId",
          path: ["type"],
        });
      }
      if (data.destinationAmount) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "destinationAmount is only valid for transfers",
          path: ["destinationAmount"],
        });
      }
    }
  });

export const updateTransactionSchema = z
  .object({
    amount: z.number().positive().optional(),
    date: z.string().datetime().optional(),
    title: z.string().min(1).max(255).optional(),
    note: z.string().nullable().optional(),
    categoryId: z.string().uuid().nullable().optional(),
  })
  .strict();

export const validateCreateTransaction = (req, res, next) => {
  const result = createTransactionSchema.safeParse(req.body);

  if (!result.success) {
    return sendZodValidationError(res, result.error);
  }

  req.validatedBody = result.data;
  next();
};

export const validateUpdateTransaction = (req, res, next) => {
  const result = updateTransactionSchema.safeParse(req.body);

  if (!result.success) {
    return sendZodValidationError(res, result.error);
  }

  if (Object.keys(result.data).length === 0) {
    return res.status(400).json({
      success: false,
      statusCode: 400,
      code: "VALIDATION_ERROR",
      message: "At least one field must be provided for update",
    });
  }

  req.validatedBody = result.data;
  next();
};
