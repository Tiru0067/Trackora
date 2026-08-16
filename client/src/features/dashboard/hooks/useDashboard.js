import { useState, useEffect, useCallback } from "react";
import { getDashboardData } from "../api/dashboard";
import { useToast } from "@/hooks/useToast";

export const useDashboard = () => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [range, setRange] = useState("30d");
  const { addToast } = useToast();

  const fetchDashboardData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getDashboardData(range);
      setData(response);
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Failed to load dashboard data";
      setError(errorMessage);
      addToast(errorMessage, "error");
    } finally {
      setIsLoading(false);
    }
  }, [range, addToast]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchDashboardData();
  }, [fetchDashboardData]);

  return {
    data,
    isLoading,
    error,
    range,
    setRange,
    refetch: fetchDashboardData,
  };
};
