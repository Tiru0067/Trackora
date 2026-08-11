import { useState, useEffect, useCallback } from "react";
import { categoriesApi } from "../api/categories";
import { useToast } from "@/hooks/useToast";

export const useCategories = () => {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToast } = useToast();

  const fetchCategories = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await categoriesApi.getAll();
      setCategories(response);
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to fetch categories";
      setError(errorMessage);
      addToast(errorMessage, "error");
    } finally {
      setIsLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return {
    categories,
    isLoading,
    error,
    refetch: fetchCategories,
  };
};
