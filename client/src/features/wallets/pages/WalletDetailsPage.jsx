import { useState, useEffect, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Trash2,
  Edit2,
  TrendingDown,
  Clock,
  MoreVertical,
  Plus,
} from "lucide-react";
import { useWallets } from "../hooks/useWallets";
import { walletsApi } from "../api/wallets";
import WalletFormModal from "../components/WalletFormModal";
import { useTransactions } from "../../transactions/hooks/useTransactions";
import WalletTransactionList from "../components/WalletTransactionList";
import TransactionFormModal from "../../transactions/components/TransactionFormModal";
import TransactionDetailsModal from "../../transactions/components/TransactionDetailsModal";
import ConfirmModal from "@/components/ui/ConfirmModal";
import Skeleton from "@/components/ui/Skeleton";
import Popover from "@/components/ui/Popover";
import { formatCurrency } from "@/utils/currency";
import { useToast } from "@/hooks/useToast";

const WalletDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { wallets, deleteWallet, isLoading, fetchWallets } = useWallets();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [isTransactionDetailsModalOpen, setIsTransactionDetailsModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [transactionToEdit, setTransactionToEdit] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const contextWallet = wallets.find((w) => w.id === id);
  const [wallet, setWallet] = useState(contextWallet);
  const [isWalletLoading, setIsWalletLoading] = useState(true);

  const fetchWallet = useCallback(async () => {
    setIsWalletLoading(true);
    try {
      const data = await walletsApi.getById(id);
      setWallet(data);
    } catch (err) {
      console.error("Failed to fetch wallet details:", err);
      addToast("Failed to fetch wallet details", "error");
    } finally {
      setIsWalletLoading(false);
    }
  }, [id, addToast]);

  useEffect(() => {
    //eslint-disable-next-line
    fetchWallet();
  }, [fetchWallet]);

  const {
    transactions,
    isLoading: isTransactionsLoading,
    refetch: refetchTransactions,
    deleteTransaction,
  } = useTransactions({
    walletId: id,
  });

  const {
    totalIncome = 0,
    totalExpense = 0,
    totalBalance = wallet?.initialBalance || 0,
  } = wallet?.stats || {};

  const burnRate =
    wallet?.initialBalance > 0
      ? Math.min((totalExpense / wallet.initialBalance) * 100, 100)
      : 0;

  useEffect(() => {
    // Redirect if wallet not found and we finished loading
    if (!isLoading && !isWalletLoading && !wallet) {
      navigate("/wallets");
    }
  }, [isLoading, isWalletLoading, wallet, navigate]);

  const handleDelete = () => {
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteWallet(wallet.id);
      addToast("Wallet deleted successfully");
      navigate("/wallets");
    } catch (error) {
      console.error("Failed to delete wallet:", error);
      addToast("Failed to delete wallet", "error");
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
    }
  };

  if (isLoading || !wallet) {
    return (
      <div className="w-full mt-6">
        <div className="flex flex-col gap-4">
          <Skeleton className="h-10 w-1/3" />
          <Skeleton className="h-8 w-1/4" />
        </div>
      </div>
    );
  }

  return (
    <article>
      <header className="page-header justify-between items-start sm:items-end flex-col sm:flex-row gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Link
              to="/wallets"
              className="p-1 rounded-md text-(--ink-muted) hover:text-(--ink) hover:bg-(--line-soft) transition-colors"
            >
              <ArrowLeft size={16} />
            </Link>
            <span className="text-[11px] font-semibold tracking-wider text-(--ink-muted) uppercase">
              Wallet Details
            </span>
          </div>
          <div className="flex flex-col items-start gap-0.5">
            <h1 className="page-title mb-0">{wallet.name}</h1>
            <span
              className="px-2 py-0.5 rounded-full text-[10px] font-medium"
              style={{
                backgroundColor: `${wallet.color}20`,
                color: wallet.color,
              }}
            >
              {wallet.currency}
            </span>
          </div>
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

          <Popover
            placement="bottom-end"
            trigger={<MoreVertical size={14} className="text-(--ink)" />}
            triggerClassName="flex items-center justify-center h-9 bg-(--line) rounded-[9px] hover:bg-(--line-soft) transition-colors h-[34px] w-[34px]"
          >
            {({ close }) => (
              <div className="flex flex-col w-36 bg-(--bg-card) border border-(--line) rounded-lg shadow-lg overflow-hidden py-1">
                <button
                  onClick={() => {
                    close();
                    setIsEditModalOpen(true);
                  }}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-(--ink) hover:bg-(--line-soft) transition-colors text-left"
                >
                  <Edit2 size={14} />
                  <span>Edit Wallet</span>
                </button>
                <button
                  onClick={() => {
                    close();
                    handleDelete();
                  }}
                  disabled={isDeleting}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-red-500/10 transition-colors text-left disabled:opacity-50"
                >
                  <Trash2 size={14} />
                  <span>Delete Wallet</span>
                </button>
              </div>
            )}
          </Popover>
        </div>
      </header>

      {isWalletLoading ? (
        <>
          <div className="grid grid-cols-1 xxs:grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <Skeleton className="h-30 rounded-xl" />
            <Skeleton className="h-30 rounded-xl" />
            <Skeleton className="h-30 rounded-xl" />
            <Skeleton className="h-30 rounded-xl" />
          </div>
          <div className="mt-8">
            <WalletTransactionList
              isLoading={true}
              currency={wallet.currency}
            />
          </div>
        </>
      ) : (
        <>
          {/* Wallet Stat Cards */}
          <dl
            className="grid grid-cols-1 xxs:grid-cols-2 md:grid-cols-4 gap-4 mt-6"
            aria-label="Wallet Statistics"
          >
            {/* Balance Card */}
            <div className="flex flex-col p-5 bg-(--bg-card) border border-(--line) rounded-xl shadow-xs h-30">
              <dt className="text-[11px] uppercase tracking-wide text-(--ink-muted) font-mono mb-2">
                TOTAL BALANCE
              </dt>
              <dd className="text-[22px] font-semibold tracking-tight text-(--ink)">
                <span className="sr-only">Balance is </span>
                {formatCurrency(totalBalance, wallet.currency)}
              </dd>
              <dd
                className="mt-auto pt-2 text-xs font-normal text-(--ink-muted) flex items-center gap-1.5"
                aria-hidden="true"
              >
                {burnRate > 0 ? (
                  <>
                    <TrendingDown size={12} className="opacity-70" />
                    <span>{burnRate.toFixed(0)}% total used</span>
                  </>
                ) : (
                  <span>Fully funded</span>
                )}
              </dd>
            </div>

            {/* Income Card */}
            <div className="flex flex-col p-5 bg-(--bg-card) border border-(--line) rounded-xl shadow-xs h-30">
              <dt className="text-[11px] uppercase tracking-wide text-(--ink-muted) font-mono mb-2">
                INCOME
              </dt>
              <dd className="text-[22px] font-semibold tracking-tight text-emerald-500">
                <span className="sr-only">Total Income is </span>
                {formatCurrency(totalIncome, wallet.currency)}
              </dd>
              <dd
                className="mt-auto pt-2 text-xs font-normal text-(--ink-muted)"
                aria-hidden="true"
              >
                Total Income
              </dd>
            </div>

            {/* Expense Card */}
            <div className="flex flex-col p-5 bg-(--bg-card) border border-(--line) rounded-xl shadow-xs h-30">
              <dt className="text-[11px] uppercase tracking-wide text-(--ink-muted) font-mono mb-2">
                EXPENSE
              </dt>
              <dd className="text-[22px] font-semibold tracking-tight text-red-500">
                <span className="sr-only">Total Expense is </span>
                {formatCurrency(totalExpense, wallet.currency)}
              </dd>
              <dd
                className="mt-auto pt-2 text-xs font-normal text-(--ink-muted)"
                aria-hidden="true"
              >
                Total Expense
              </dd>
            </div>

            {/* Activity Card */}
            <div className="flex flex-col p-5 bg-(--bg-card) border border-(--line) rounded-xl shadow-xs h-30">
              <dt className="text-[11px] uppercase tracking-wide text-(--ink-muted) font-mono mb-2">
                TRANSACTIONS
              </dt>
              <dd className="text-[22px] font-semibold tracking-tight text-(--ink)">
                <span className="sr-only">Total transactions are </span>
                {wallet?.stats?.transactionCount || 0}
              </dd>
              <dd
                className="mt-auto pt-2 text-xs font-normal text-(--ink-muted) flex items-center gap-1.5"
                aria-hidden="true"
              >
                {wallet?.stats?.lastTransactionDate ? (
                  <>
                    <Clock size={12} className="opacity-70" />
                    <span>
                      Last:{" "}
                      {new Date(
                        wallet.stats.lastTransactionDate,
                      ).toLocaleDateString(undefined, {
                        day: "numeric",
                        month: "short",
                      })}
                    </span>
                  </>
                ) : (
                  <span>No transactions yet</span>
                )}
              </dd>
            </div>
          </dl>

          <div className="mt-8">
            <WalletTransactionList
              transactions={transactions}
              isLoading={isTransactionsLoading}
              currency={wallet.currency}
              onAddTransaction={() => {
                setTransactionToEdit(null);
                setIsTransactionModalOpen(true);
              }}
              onRowClick={(tx) => {
                setSelectedTransaction(tx);
                setIsTransactionDetailsModalOpen(true);
              }}
            />
          </div>
        </>
      )}

      <WalletFormModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        wallet={wallet}
      />

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Wallet"
        message={`Are you sure you want to remove "${wallet.name}"?`}
        confirmText="Delete Wallet"
        isDestructive={true}
        isLoading={isDeleting}
      />

      <TransactionFormModal
        isOpen={isTransactionModalOpen}
        onClose={() => setIsTransactionModalOpen(false)}
        initialWalletId={wallet?.id}
        transactionToEdit={transactionToEdit}
        onSuccess={() => {
          fetchWallet();
          refetchTransactions();
          fetchWallets();
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
        onDelete={async (txId) => {
          await deleteTransaction(txId);
          fetchWallet();
          fetchWallets();
        }}
      />
    </article>
  );
};

export default WalletDetailsPage;
