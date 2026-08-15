import { useState, useEffect, useCallback, useRef } from "react";
import { transactionsApi } from "../api/transactions";
import { useToast } from "@/hooks/useToast";

export const useTransactions = (initialFilters = {}) => {
  const [transactions, setTransactions] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, limit: 50, total: 0, totalPages: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToast } = useToast();

  const initialFiltersStr = JSON.stringify(initialFilters);

  const currentRequestId = useRef(0);

  const fetchTransactions = useCallback(async (filters = {}) => {
    const requestId = ++currentRequestId.current;
    const baseFilters = JSON.parse(initialFiltersStr);
    setIsLoading(true);
    setError(null);
    try {
      const response = await transactionsApi.getAll({ ...baseFilters, ...filters });
      if (requestId !== currentRequestId.current) return;

      setTransactions(response.data);
      setPagination(response.pagination);
    } catch (err) {
      if (requestId !== currentRequestId.current) return;

      const errorMessage = err.response?.data?.message || "Failed to fetch transactions";
      setError(errorMessage);
      addToast(errorMessage, "error");
    } finally {
      if (requestId === currentRequestId.current) {
        setIsLoading(false);
      }
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
      setTransactions((prev) => prev ? prev.filter((t) => t.id !== id) : null);
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
