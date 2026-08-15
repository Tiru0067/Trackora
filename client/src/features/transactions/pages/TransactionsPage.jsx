import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Plus } from "lucide-react";
import { useTransactions } from "../hooks/useTransactions";
import { useWallets } from "@/features/wallets/hooks/useWallets";
import { useCategories } from "@/features/categories/hooks/useCategories";

import { useTransactionStats } from "../hooks/useTransactionStats";

import TransactionsFilters from "../components/TransactionsFilters";
import TransactionList from "../components/TransactionList";
import TransactionFormModal from "../components/TransactionFormModal";
import TransactionDetailsModal from "../components/TransactionDetailsModal";
import ConfirmModal from "@/components/ui/ConfirmModal";
import Pagination from "@/components/ui/Pagination";
import Skeleton from "@/components/ui/Skeleton";
import { formatCurrency } from "@/utils/currency";

const TransactionsPage = () => {
  const [searchParams] = useSearchParams();

  const [filters, setFilters] = useState({
    type: "",
    sortBy: "date",
    orderDir: "desc",
    walletId: searchParams.get("walletId") || "",
    categoryId: searchParams.get("categoryId") || "",
    startDate: "",
    endDate: "",
    search: "",
    limit: 10,
    page: 1,
  });

  const { transactions, pagination, isLoading, refetch, deleteTransaction } =
    useTransactions(filters);

  // Omit pagination parameters so stats don't reload when switching pages
  const { page, limit, ...statsFilters } = filters;
  const { stats, isLoading: isStatsLoading } = useTransactionStats(statsFilters);
  const { wallets, fetchWallets } = useWallets();
  const { categories, fetchCategories } = useCategories();

  // Modals state
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [isTransactionDetailsModalOpen, setIsTransactionDetailsModalOpen] =
    useState(false);
  const [transactionToEdit, setTransactionToEdit] = useState(null);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState(null);

  useEffect(() => {
    fetchWallets();
    fetchCategories();
  }, [fetchWallets, fetchCategories]);

  const confirmDelete = async () => {
    if (!transactionToDelete) return;
    setIsDeleting(true);
    try {
      await deleteTransaction(transactionToDelete);
      setIsTransactionDetailsModalOpen(false);
      setSelectedTransaction(null);
    } finally {
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
      setTransactionToDelete(null);
      refetch();
    }
  };

  return (
    <div className="flex flex-col h-full">
      <header className="page-header justify-between items-start sm:items-end flex-col sm:flex-row gap-4">
        <div>
          <span className="page-section">Transactions</span>
          <h1 className="page-title">All Transactions</h1>
          <p className="page-subtitle">
            View and manage your income and expenses across all wallets
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto mt-2 sm:mt-0 ml-auto">
          <button
            type="button"
            onClick={() => {
              setTransactionToEdit(null);
              setIsTransactionModalOpen(true);
            }}
            className="btn bg-(--ink) text-(--bg) hover:bg-(--ink)/80 shadow-sm"
          >
            <Plus size={16} />
            <span>New Transaction</span>
          </button>
        </div>
      </header>

      {/* Stats Overview */}
      <dl
        className="grid grid-cols-1 xxs:grid-cols-2 md:grid-cols-4 gap-4 mb-6"
        aria-label="Global Statistics"
      >
        <div className="flex flex-col p-5 bg-(--bg-card) border border-(--line) rounded-xl shadow-xs h-30">
          <dt className="text-[11px] uppercase tracking-wide text-(--ink-muted) font-mono mb-2">
            Total Transactions
          </dt>
          <dd className="text-[22px] font-semibold tracking-tight text-(--ink)">
            {isStatsLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              stats?.totalTransactions || 0
            )}
          </dd>
          <dd
            className="mt-auto pt-2 text-xs font-normal text-(--ink-muted)"
            aria-hidden="true"
          >
            Across all wallets
          </dd>
        </div>
        <div className="flex flex-col p-5 bg-(--bg-card) border border-(--line) rounded-xl shadow-xs h-30">
          <dt className="text-[11px] uppercase tracking-wide text-(--ink-muted) font-mono mb-2">
            Income
          </dt>
          <dd className="text-[22px] font-semibold tracking-tight text-emerald-500">
            {isStatsLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              formatCurrency(stats?.income || 0, "USD")
            )}
          </dd>
          <dd
            className="mt-auto pt-2 text-xs font-normal text-(--ink-muted)"
            aria-hidden="true"
          >
            Total Income
          </dd>
        </div>
        <div className="flex flex-col p-5 bg-(--bg-card) border border-(--line) rounded-xl shadow-xs h-30">
          <dt className="text-[11px] uppercase tracking-wide text-(--ink-muted) font-mono mb-2">
            Expenses
          </dt>
          <dd className="text-[22px] font-semibold tracking-tight text-red-500">
            {isStatsLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              formatCurrency(stats?.expense || 0, "USD")
            )}
          </dd>
          <dd
            className="mt-auto pt-2 text-xs font-normal text-(--ink-muted)"
            aria-hidden="true"
          >
            Total Expense
          </dd>
        </div>
        <div className="flex flex-col p-5 bg-(--bg-card) border border-(--line) rounded-xl shadow-xs h-30">
          <dt className="text-[11px] uppercase tracking-wide text-(--ink-muted) font-mono mb-2">
            Net
          </dt>
          <dd className="text-[22px] font-semibold tracking-tight text-(--ink)">
            {isStatsLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              formatCurrency(stats?.net || 0, "USD")
            )}
          </dd>
          <dd
            className="mt-auto pt-2 text-xs font-normal text-(--ink-muted)"
            aria-hidden="true"
          >
            Income - Expense
          </dd>
        </div>
      </dl>

      <TransactionList
        transactions={transactions}
        isLoading={isLoading}
        currency={wallets?.[0]?.currency || "USD"} // Default fallback if no wallets
        context="global"
        filtersNode={
          <TransactionsFilters
            filters={filters}
            onChange={setFilters}
            categories={categories}
            wallets={wallets}
          />
        }
        paginationNode={
          <Pagination
            page={pagination.page}
            totalPages={pagination.totalPages}
            total={pagination.total}
            limit={filters.limit}
            onPageChange={(page) => setFilters({ ...filters, page })}
            onLimitChange={(limit) =>
              setFilters({ ...filters, limit, page: 1 })
            }
          />
        }
        onAddTransaction={() => {
          setTransactionToEdit(null);
          setIsTransactionModalOpen(true);
        }}
        onRowClick={(tx) => {
          setSelectedTransaction(tx);
          setIsTransactionDetailsModalOpen(true);
        }}
      />

      <TransactionFormModal
        isOpen={isTransactionModalOpen}
        onClose={() => setIsTransactionModalOpen(false)}
        transactionToEdit={transactionToEdit}
        onSuccess={() => {
          refetch();
        }}
      />

      <TransactionDetailsModal
        isOpen={isTransactionDetailsModalOpen}
        onClose={() => {
          setIsTransactionDetailsModalOpen(false);
          setSelectedTransaction(null);
        }}
        transaction={selectedTransaction}
        onEdit={(tx) => {
          setTransactionToEdit(tx);
          setIsTransactionDetailsModalOpen(false);
          setIsTransactionModalOpen(true);
        }}
        onDelete={(txId) => {
          setTransactionToDelete(txId);
          setIsDeleteModalOpen(true);
        }}
      />

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Transaction"
        message="Are you sure you want to delete this transaction? This action cannot be undone."
        confirmText="Delete Transaction"
        isDestructive={true}
        isLoading={isDeleting}
      />
    </div>
  );
};

export default TransactionsPage;
