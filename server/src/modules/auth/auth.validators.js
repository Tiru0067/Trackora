import AppError from "#/utils/AppError.js";
import sendResponse from "#/utils/response.js";
import {
  getMissingFields,
  isValidEmail,
  isValidCurrency,
  isValidPassword,
} from "#/utils/validation.js";

const sendValidationError = (res, missingFields, invalidFields) => {
  return sendResponse(res, {
    statusCode: 400,
    code: "VALIDATION_ERROR",
    message: "Validation failed",
    errors: {
      ...(missingFields.length > 0 && { missingFields }),
      ...(Object.keys(invalidFields).length > 0 && { invalidFields }),
    },
  });
};

const validateName = (name, invalidFields) => {
  if (typeof name !== "string") {
    invalidFields.name = "Name must be a string";
  } else if (name.trim().length < 2) {
    invalidFields.name = "Name must be at least 2 characters";
  }
};

const validateEmail = (email, invalidFields) => {
  if (!isValidEmail(email)) {
    invalidFields.email = "Enter a valid email address";
  }
};

const validateBaseCurrency = (baseCurrency, invalidFields) => {
  if (!isValidCurrency(baseCurrency)) {
    invalidFields.baseCurrency = "Enter a valid currency code";
  }
};

const validatePassword = (password, invalidFields) => {
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
};

export const validateRegister = (req, res, next) => {
  const requiredFields = ["name", "email", "baseCurrency", "password"];
  const missingFields = getMissingFields(req.body, requiredFields);

  const { name, email, baseCurrency, password } = req.body;
  const invalidFields = {};

  if (!missingFields.includes("name")) {
    validateName(name, invalidFields);
  }

  if (!missingFields.includes("email")) {
    validateEmail(email, invalidFields);
  }

  if (!missingFields.includes("baseCurrency")) {
    validateBaseCurrency(baseCurrency, invalidFields);
  }

  if (!missingFields.includes("password")) {
    validatePassword(password, invalidFields);
  }

  if (missingFields.length > 0 || Object.keys(invalidFields).length > 0) {
    return sendValidationError(res, missingFields, invalidFields);
  }

  req.body.name = name.trim();
  req.body.email = email.trim().toLowerCase();
  req.body.baseCurrency = baseCurrency.trim().toUpperCase();

  next();
};

export const validateLogin = (req, res, next) => {
  const requiredFields = ["email", "password"];
  const missingFields = getMissingFields(req.body, requiredFields);

  const { email, password } = req.body;
  const invalidFields = {};

  if (!missingFields.includes("email")) {
    validateEmail(email, invalidFields);
  }

  if (!missingFields.includes("password")) {
    if (typeof password !== "string") {
      invalidFields.password = "Password must be a string";
    } else if (password.length > 128) {
      invalidFields.password = "Password must not exceed 128 characters";
    }
  }

  if (missingFields.length > 0 || Object.keys(invalidFields).length > 0) {
    return sendValidationError(res, missingFields, invalidFields);
  }

  req.body.email = email.trim().toLowerCase();

  next();
};

export const validateUpdateCurrentUser = (req, res, next) => {
  const { name, email, baseCurrency } = req.body;
  const providedFields = Object.keys(req.body);
  const invalidFields = {};

  if (providedFields.includes("name")) {
    validateName(name, invalidFields);
  }

  if (providedFields.includes("email")) {
    validateEmail(email, invalidFields);
  }

  if (providedFields.includes("baseCurrency")) {
    validateBaseCurrency(baseCurrency, invalidFields);
  }

  if (Object.keys(invalidFields).length > 0) {
    return sendValidationError(res, [], invalidFields);
  }

  if (providedFields.includes("name")) {
    req.body.name = name.trim();
  }

  if (providedFields.includes("email")) {
    req.body.email = email.trim().toLowerCase();
  }

  if (providedFields.includes("baseCurrency")) {
    req.body.baseCurrency = baseCurrency.trim().toUpperCase();
  }

  next();
};
