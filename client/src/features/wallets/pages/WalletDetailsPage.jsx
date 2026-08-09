import { useState, useEffect, useMemo, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Trash2, Edit2, TrendingDown } from "lucide-react";
import { LayoutGroup, motion as Motion } from "motion/react";
import { useWallets } from "../hooks/useWallets";
import WalletFormModal from "../components/WalletFormModal";
import AnimatedNumber from "@/components/ui/AnimatedNumber";
import ConfirmModal from "@/components/ui/ConfirmModal";
import { getWalletSummary } from "../utils/walletCalculation";
import { formatCurrency, getCurrencySymbol } from "@/utils/currency";
import { cn } from "@/utils/cn";
import { useToast } from "@/hooks/useToast";

const WalletDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { wallets, deleteWallet, isLoading } = useWallets();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const prevBalanceRef = useRef(0);

  const wallet = wallets.find((w) => w.id === id);

  const { totalIncome, totalExpense, totalBalance } = useMemo(
    () => getWalletSummary(wallet, []),
    [wallet],
  );

  const burnRate =
    wallet?.initialBalance > 0
      ? Math.min((totalExpense / wallet.initialBalance) * 100, 100)
      : 0;

  const burnColor =
    burnRate > 90
      ? "from-red-500 to-red-400"
      : burnRate > 70
        ? "from-amber-500 to-amber-400"
        : "from-emerald-500 to-emerald-400";

  const currencySymbol = getCurrencySymbol(wallet?.currency);

  useEffect(() => {
    // Redirect if wallet not found and we finished loading
    if (!isLoading && !wallet) {
      navigate("/wallets");
    }
  }, [isLoading, wallet, navigate]);

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
    return <div className="p-4 text-(--ink-soft)">Loading...</div>;
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

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="sm:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 text-sm bg-white dark:bg-white/5 border border-(--line) text-(--ink) rounded-md font-medium hover:bg-(--line-soft) transition-colors"
          >
            <Edit2 size={14} />
            <span>Edit</span>
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex items-center justify-center p-1.5 bg-red-500/10 text-red-500 border border-red-500/20 rounded-md hover:bg-red-500/20 transition-colors disabled:opacity-50"
            title="Delete Wallet"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </header>

      {/* Wallet Overview Stats */}
      <section className="flex flex-col gap-5 p-6 mt-6 bg-(--bg-card) border border-(--line) rounded-2xl shadow-sm">
        {/* Balance & Burn Rate */}
        <div className="flex items-end flex-wrap gap-1">
          <div className="flex flex-col gap-1 w-full sm:w-auto">
            <h2 className="text-sm font-medium text-(--ink-soft)">
              Total Balance
            </h2>
            <div
              className={cn(
                "text-2xl sm:text-[30px] font-semibold leading-none tracking-tight",
                totalBalance >= 0 ? "text-(--ink)" : "text-red-500",
              )}
            >
              {currencySymbol}
              <AnimatedNumber
                from={prevBalanceRef}
                to={totalBalance}
                currency={wallet.currency}
              />
            </div>
          </div>

          {burnRate > 0 && (
            <span
              className={cn(
                "text-xs sm:text-sm font-medium flex items-center gap-1 sm:ml-auto mb-1",
                burnRate > 90
                  ? "text-red-500"
                  : burnRate > 70
                    ? "text-amber-500"
                    : "text-emerald-500",
              )}
            >
              <TrendingDown aria-hidden="true" size={16} />
              {burnRate.toFixed(0)}%{" "}
              <span className="text-(--ink-soft) font-normal">total used</span>
            </span>
          )}
        </div>

        {/* Burn rate progress line */}
        <div
          aria-hidden="true"
          className="h-0.5 w-full bg-black/5 dark:bg-white/5 rounded-full overflow-hidden relative"
        >
          <Motion.div
            className={cn(
              "absolute top-0 left-0 h-full bg-linear-to-r transition-colors duration-700",
              burnColor,
            )}
            initial={{ width: 0 }}
            animate={{ width: `${burnRate}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </div>

        {/* Income & Expense Split Layout */}
        <div className="flex gap-8 mt-2">
          <LayoutGroup>
            <Motion.div layout>
              <Motion.div layout="position">
                <p className="text-xs font-medium text-(--ink-soft) mb-1">
                  Income
                </p>
                <p className="text-lg sm:text-xl font-semibold text-green-500 tabular-nums">
                  {formatCurrency(totalIncome, wallet.currency)}
                </p>
              </Motion.div>
            </Motion.div>

            <div aria-hidden="true" className="w-px bg-(--line)" />

            <Motion.div layout>
              <Motion.div layout="position">
                <p className="text-xs font-medium text-(--ink-soft) mb-1">
                  Expense
                </p>
                <p className="text-lg sm:text-xl font-semibold text-red-500 tabular-nums">
                  {formatCurrency(totalExpense, wallet.currency)}
                </p>
              </Motion.div>
            </Motion.div>
          </LayoutGroup>
        </div>
      </section>

      <section className="mt-8" aria-labelledby="transactions-heading">
        <h2
          id="transactions-heading"
          className="text-lg font-semibold text-(--ink) mb-4"
        >
          Recent Transactions
        </h2>
        <div className="p-8 text-center border border-dashed border-(--line) rounded-xl text-(--ink-soft)">
          Transactions functionality coming soon.
        </div>
      </section>

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
    </article>
  );
};

export default WalletDetailsPage;
