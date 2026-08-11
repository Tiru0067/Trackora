import { useState, useEffect, useCallback } from "react";
import { transactionsApi } from "../api/transactions";
import { useToast } from "@/hooks/useToast";

export const useTransactions = (initialFilters = {}) => {
  const [transactions, setTransactions] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 50, total: 0, totalPages: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToast } = useToast();

  const initialFiltersStr = JSON.stringify(initialFilters);

  const fetchTransactions = useCallback(async (filters = {}) => {
    const baseFilters = JSON.parse(initialFiltersStr);
    setIsLoading(true);
    setError(null);
    try {
      const response = await transactionsApi.getAll({ ...baseFilters, ...filters });
      setTransactions(response.data);
      setPagination(response.pagination);
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Failed to fetch transactions";
      setError(errorMessage);
      addToast(errorMessage, "error");
    } finally {
      setIsLoading(false);
    }
  }, [initialFiltersStr, addToast]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchTransactions();
  }, [fetchTransactions]);

  const loadMore = () => {
    if (pagination.page < pagination.totalPages) {
      fetchTransactions({ page: pagination.page + 1 });
    }
  };

  const deleteTransaction = async (id) => {
    try {
      await transactionsApi.delete(id);
      setTransactions((prev) => prev.filter((t) => t.id !== id));
      addToast("Transaction deleted successfully");
    } catch (err) {
      addToast(err.response?.data?.message || "Failed to delete transaction", "error");
      throw err;
    }
  };

  return {
    transactions,
    pagination,
    isLoading,
    error,
    refetch: fetchTransactions,
    loadMore,
    deleteTransaction,
  };
};
