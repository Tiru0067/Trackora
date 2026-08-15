import { useState, useCallback, useEffect, useRef } from "react";
import api from "@/api/axios";

export const useTransactionStats = (filters = {}) => {
  const [stats, setStats] = useState({
    totalTransactions: 0,
    income: 0,
    expense: 0,
    net: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const currentRequestId = useRef(0);

  const filtersStr = JSON.stringify(filters);

  const fetchStats = useCallback(async () => {
    const requestId = ++currentRequestId.current;
    const parsedFilters = JSON.parse(filtersStr);
    try {
      setIsLoading(true);
      const response = await api.get("/transactions/stats", {
        params: parsedFilters,
      });
      if (requestId !== currentRequestId.current) return;

      setStats(response.data.data);
      setError(null);
    } catch (err) {
      if (requestId !== currentRequestId.current) return;

      console.error("Error fetching transaction stats:", err);
      setError(err.response?.data?.message || "Failed to fetch stats");
    } finally {
      if (requestId === currentRequestId.current) {
        setIsLoading(false);
      }
    }
  }, [filtersStr]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchStats();
  }, [fetchStats]);

  return { stats, isLoading, error, refetch: fetchStats };
};
