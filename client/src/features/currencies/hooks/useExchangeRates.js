import { useState, useEffect, useCallback } from "react";
import { getExchangeRates } from "../api/currencies";

export const useExchangeRates = () => {
  const [ratesData, setRatesData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRates = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await getExchangeRates();
      setRatesData(data);
    } catch (err) {
      setError(err.message || "Failed to fetch exchange rates");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchRates();
  }, [fetchRates]);

  const convertCurrency = useCallback(
    (amount, fromCurrency, toCurrency) => {
      if (fromCurrency === toCurrency) return amount;
      if (!ratesData) return null;

      const { base, rates } = ratesData;
      let amountInBase = amount;
      
      // Convert from source currency to base currency (EUR)
      if (fromCurrency !== base) {
        if (!rates[fromCurrency]) return null;
        amountInBase = amount / rates[fromCurrency];
      }

      // Convert from base currency (EUR) to target currency
      if (toCurrency !== base) {
        if (!rates[toCurrency]) return null;
        return amountInBase * rates[toCurrency];
      }

      return amountInBase;
    },
    [ratesData]
  );

  return {
    ratesData,
    isLoading,
    error,
    fetchRates,
    convertCurrency,
  };
};
