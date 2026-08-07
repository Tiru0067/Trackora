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
