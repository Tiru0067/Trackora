/**
 * Returns required fields that are absent, null, undefined,
 * or empty strings
 *
 * @param {object} body
 * @param {string[]} requiredFields
 * @returns {string[]}
 */
export const getMissingFields = (body, requiredFields) => {
  if (body === undefined || body === null) {
    throw new Error("body is required");
  }

  if (typeof body !== "object" || Array.isArray(body)) {
    throw new Error("body must be an object");
  }

  if (requiredFields === undefined || requiredFields === null) {
    throw new Error("requiredFields is required");
  }

  if (!Array.isArray(requiredFields)) {
    throw new Error("requiredFields must be an array");
  }

  return requiredFields.filter((field) => {
    const value = body[field];

    return (
      !Object.hasOwn(body, field) ||
      value === null ||
      value === undefined ||
      (typeof value === "string" && value.trim() === "")
    );
  });
};

/**
 * @param {string} email
 * @returns {boolean}
 */
export const isValidEmail = (email) => {
  if (email === undefined) {
    throw new Error("email is required");
  }
  if (typeof email !== "string") return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
};

const validCurrencies = new Set(Intl.supportedValuesOf("currency"));

/**
 * @param {string} currency
 * @returns {boolean}
 */
export const isValidCurrency = (currency) => {
  if (currency === undefined) {
    throw new Error("currency is required");
  }

  if (typeof currency !== "string") return false;

  return validCurrencies.has(currency.trim().toUpperCase());
};

export const isValidPassword = (password) => {
  if (password === undefined) {
    throw new Error("password is required");
  }

  if (typeof password !== "string") return false;

  const passwordRegex =
    /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,128}$/;

  return passwordRegex.test(password);
};
