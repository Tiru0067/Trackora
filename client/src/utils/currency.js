import { BASE_CURRENCY } from "@/constants/currency";

export const getLocale = (currency = BASE_CURRENCY) =>
  currency === "INR" ? "en-IN" : "en-US";

/**
 * Returns the currency symbol for a given currency code
 * @param {string} currency - ISO currency code (e.g., "INR", "USD")
 * @returns {string} Currency symbol (e.g., "₹", "$")
 */
export const getCurrencySymbol = (currency = BASE_CURRENCY) => {
  return (
    new Intl.NumberFormat(getLocale(currency), {
      style: "currency",
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })
      .formatToParts(0)
      .find((part) => part.type === "currency")?.value ?? ""
  );
};

/**
 * Returns the display name of a currency code
 * @param {string} code - ISO currency code
 * @param {string} locale - Locale for translation (default: "en")
 * @returns {string} Human-readable currency name
 */
export const getCurrencyName = (code, locale = "en") => {
  try {
    const formatter = new Intl.DisplayNames([locale], { type: "currency" });
    const name = formatter.of(code);
    return name || "Unknown Currency";
  } catch {
    return "Unknown Currency";
  }
};

/**
 * Formats a numeric amount into a localized currency string
 * @param {number} amount - The numeric value to format
 * @param {string} currency - ISO currency code (e.g., "INR", "USD")
 * @returns {string} Formatted currency string (e.g., ₹1,000)
 */

export const formatCurrency = (amount = 0, currency = BASE_CURRENCY) => {
  const locale = getLocale(currency);
  const abs = Math.abs(amount);
  const formatted = new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(abs);
  return amount < 0 ? `- ${formatted}` : formatted;
};

/**
 * Converts a raw currency amount into compact format
 * Example: 1200, "INR" → ₹1.2K | 1500000, "INR" → ₹1.5L
 *
 * @param {number} amount - Raw numeric amount (e.g., 1200)
 * @param {string} currency - Currency code (e.g., "INR", "USD")
 * @returns {string} Compact formatted string
 */

export const formatCompact = (amount, currency = BASE_CURRENCY) => {
  const locale = getLocale(currency);
  const abs = Math.abs(amount);
  const formatted = new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(abs);
  return amount < 0 ? `- ${formatted}` : formatted;
};
