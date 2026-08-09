import AppError from "#/utils/AppError.js";

let currenciesCache = {
  data: null,
  lastChecked: 0,
};

let ratesCache = {
  data: null,
  date: null,
  lastChecked: 0,
};

const CHECK_INTERVAL = 15 * 60 * 1000;

export const getCurrenciesService = async () => {
  const now = Date.now();

  if (
    currenciesCache.data &&
    now - currenciesCache.lastChecked < 24 * 60 * 60 * 1000
  ) {
    return currenciesCache.data;
  }

  try {
    const res = await fetch("https://api.frankfurter.dev/v2/currencies");
    if (!res.ok)
      throw new Error("Failed to fetch currencies from Frankfurter API");

    const data = await res.json();

    const metals = ["XAU", "XAG", "XPD", "XPT"];

    const supportedCurrencies = new Set(
      typeof Intl.supportedValuesOf === "function"
        ? Intl.supportedValuesOf("currency")
        : data.map((item) => item.iso_code),
    );

    const formattedCurrencies = data
      .filter(
        (item) =>
          !metals.includes(item.iso_code) &&
          supportedCurrencies.has(item.iso_code),
      )
      .map((item) => ({
        code: item.iso_code,
        name: item.name,
        symbol: item.symbol,
        numeric: item.iso_numeric,
      }));

    currenciesCache.data = formattedCurrencies;
    currenciesCache.lastChecked = now;

    return currenciesCache.data;
  } catch (error) {
    if (currenciesCache.data) return currenciesCache.data;
    throw new AppError("Failed to fetch currencies", 500);
  }
};

export const getExchangeRatesService = async () => {
  const now = Date.now();
  if (ratesCache.data && now - ratesCache.lastChecked < CHECK_INTERVAL) {
    return ratesCache.data;
  }

  try {
    const res = await fetch("https://api.frankfurter.dev/v2/rates");
    if (!res.ok) throw new Error("Failed to fetch rates from Frankfurter API");

    const rawData = await res.json();
    ratesCache.lastChecked = now;

    if (!rawData || rawData.length === 0) {
      throw new Error("Empty response from Frankfurter API");
    }

    const latestDate = rawData[0].date;
    const baseCurrency = rawData[0].base;

    if (latestDate !== ratesCache.date) {
      const ratesMap = {};
      rawData.forEach((item) => {
        if (item.date === latestDate) {
          ratesMap[item.quote] = item.rate;
        }
      });

      ratesCache.data = {
        date: latestDate,
        base: baseCurrency,
        rates: ratesMap,
      };
      ratesCache.date = latestDate;
    }

    return ratesCache.data;
  } catch (error) {
    if (ratesCache.data) return ratesCache.data;
    throw new AppError("Failed to fetch exchange rates", 500);
  }
};
