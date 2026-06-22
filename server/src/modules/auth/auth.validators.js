import AppError from "#/utils/AppError.js";
import sendResponse from "#/utils/response.js";
import {
  hasBody,
  getMissingFields,
  isValidEmail,
  isValidCurrency,
  isValidPassword,
} from "#/utils/validation.js";

export const validateRegister = (req, res, next) => {
  if (!hasBody(req.body)) {
    return sendResponse(res, {
      statusCode: 400,
      message: "Request body is required",
    });
  }

  const requiredFields = ["name", "email", "baseCurrency", "password"];
  const missingFields = getMissingFields(req.body, requiredFields);

  const { name, email, baseCurrency, password } = req.body;
  const invalidFields = {};

  if (!missingFields.includes("name")) {
    if (typeof name !== "string") {
      invalidFields.name = "Name must be a string";
    } else if (name.trim().length < 2) {
      invalidFields.name = "Name must be at least 2 characters";
    }
  }

  if (!missingFields.includes("email") && !isValidEmail(email)) {
    invalidFields.email = "Enter a valid email address";
  }

  if (
    !missingFields.includes("baseCurrency") &&
    !isValidCurrency(baseCurrency)
  ) {
    invalidFields.baseCurrency = "Enter a valid currency code";
  }

  if (!missingFields.includes("password")) {
    if (typeof password !== "string") {
      invalidFields.password = "Password must be a string";
    } else if (password.length < 8) {
      invalidFields.password = "Password must be at least 8 characters";
    } else if (password.length > 128) {
      invalidFields.password = "Password must not exceed 128 characters";
    } else if (!isValidPassword(password)) {
      invalidFields.password =
        "Password must include uppercase, lowercase, number, and symbol";
    }
  }

  if (missingFields.length > 0 || Object.keys(invalidFields).length > 0) {
    return sendResponse(res, {
      statusCode: 400,
      message: "Validation failed",
      errors: {
        ...(missingFields.length > 0 && { missingFields }),
        ...(Object.keys(invalidFields).length > 0 && { invalidFields }),
      },
    });
  }

  next();
};
