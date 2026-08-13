import { useState, useEffect, useCallback } from "react";
import { getCurrencies } from "../api/currencies";

export const useCurrencies = () => {
  const [currencies, setCurrencies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCurrencies = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await getCurrencies();
      setCurrencies(data);
    } catch (err) {
      setError(err.message || "Failed to fetch currencies");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchCurrencies();
  }, [fetchCurrencies]);

  return {
    currencies,
    isLoading,
    error,
    fetchCurrencies,
  };
};
