import { useContext, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import WalletContext from "../../context/WalletContext";
import TransactionsContext from "../../context/TransactionsContext";
import { formatCurrency } from "../../utils/formatCurrency";
import { getWalletSummary } from "../../utils/walletCalculation";
import {
  Crown,
  TrendingDown,
  TrendingUp,
  Receipt,
  Clock,
  ArrowUpRight,
} from "lucide-react";

const WalletOverview = () => {
  const navigate = useNavigate();
  const { transactions } = useContext(TransactionsContext);
  const { selectedWalletId, wallets, setPrimaryWallet } =
    useContext(WalletContext);

  const primaryWallet = wallets.find((wallet) => wallet.primary);
  const selectedWallet =
    wallets.find((wallet) => wallet.id === selectedWalletId) || primaryWallet;

  const { totalIncome, totalExpense, totalBalance } = useMemo(
    () => getWalletSummary(selectedWallet, transactions),
    [selectedWallet, transactions],
  );

  const walletTransactions = useMemo(
    () => transactions.filter((t) => t.walletId === selectedWallet.id),
    [transactions, selectedWallet],
  );

  const burnRate =
    selectedWallet.initialBalance > 0
      ? Math.min((totalExpense / selectedWallet.initialBalance) * 100, 100)
      : 0;

  const lastTransaction = useMemo(() => {
    if (!walletTransactions.length) return null;
    return walletTransactions.reduce((latest, t) =>
      new Date(t.date) > new Date(latest.date) ? t : latest,
    );
  }, [walletTransactions]);

  const lastTxDate = lastTransaction
    ? new Date(lastTransaction.date).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "No transactions";

  const formattedTotalBalance = formatCurrency(
    totalBalance,
    selectedWallet.currency,
  );
  const formattedTotalIncome = formatCurrency(
    totalIncome,
    selectedWallet.currency,
  );
  const formattedTotalExpense = formatCurrency(
    totalExpense,
    selectedWallet.currency,
  );

  const burnColor =
    burnRate > 90
      ? "from-emerald-500 to-red-500"
      : burnRate > 70
        ? "from-emerald-500 to-amber-500"
        : "from-emerald-500 to-emerald-400";

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-base font-medium text-emerald-500 truncate">
          {selectedWallet.name} Overview
        </h3>
        <div className="flex items-center gap-3 shrink-0">
          {selectedWallet.currency && (
            <span className="text-xs pt-1 font-mono font-semibold text-neutral-400 dark:text-neutral-500">
              {selectedWallet.currency}
            </span>
          )}
          <button
            type="button"
            onClick={() => setPrimaryWallet(selectedWallet.id)}
            title={selectedWallet.primary ? "Primary wallet" : "Set as primary"}
            className="hover:scale-110 transition-transform"
          >
            <Crown
              size={15}
              className={
                selectedWallet.primary
                  ? "text-yellow-500"
                  : "text-neutral-600 hover:text-neutral-400"
              }
            />
          </button>
        </div>
      </div>

      {/* Giant balance */}
      <div>
        <p className="text-sm text-neutral-500 mb-2">Total Balance</p>
        <div className="flex items-end gap-3">
          <h4
            className={`text-4xl sm:text-5xl font-bold leading-none ${
              totalBalance >= 0
                ? "text-neutral-900 dark:text-neutral-100"
                : "text-red-400"
            }`}
          >
            {formattedTotalBalance}
          </h4>
          {burnRate > 0 && (
            <span
              className={`text-sm mb-1 flex items-center gap-1 ${
                burnRate > 90
                  ? "text-red-400"
                  : burnRate > 70
                    ? "text-amber-500 dark:text-amber-400"
                    : "text-neutral-500"
              }`}
            >
              <TrendingDown size={13} />
              {burnRate.toFixed(0)}% total used
            </span>
          )}
        </div>
      </div>

      {/* Thin gradient progress line */}
      <div className="h-px bg-neutral-200 dark:bg-neutral-800 relative">
        <div
          className={`absolute top-0 left-0 h-px bg-linear-to-r ${burnColor} transition-all duration-700`}
          style={{ width: `${burnRate}%` }}
        />
      </div>

      {/* Income & Expense */}
      <div className="flex gap-6">
        <div>
          <p className="text-xs text-neutral-500 mb-0.5">Income</p>

          <p className="text-xl font-bold text-emerald-400 flex items-center gap-1">
            {formattedTotalIncome}
          </p>
        </div>
        <div className="w-px bg-neutral-200 dark:bg-neutral-800" />
        <div>
          <p className="text-xs text-neutral-500 mb-0.5">Expense</p>
          <p className="text-xl font-bold text-red-400 flex items-center gap-1">
            {formattedTotalExpense}
          </p>
        </div>
      </div>

      {/* Secondary stats — subtle inline */}
      <div className="flex items-center gap-4 text-sm text-neutral-500">
        <span className="flex items-center leading-none gap-1.5">
          <Receipt size={12} />
          {walletTransactions.length} transactions
        </span>
        <span>•</span>
        <span className="flex items-center leading-none gap-1.5">
          <Clock size={12} />
          {lastTxDate}
        </span>
      </div>

      {/* View details — minimal link style */}
      <button
        type="button"
        onClick={() => navigate(`/wallets/${selectedWallet.id}`)}
        className="flex items-center gap-1.5 text-sm text-neutral-500 hover:text-emerald-400 transition-colors w-fit"
      >
        View Full Details <ArrowUpRight size={12} />
      </button>
    </div>
  );
};

export default WalletOverview;
