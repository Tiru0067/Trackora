import {
  FileText,
  Plus,
  ArrowUpRight,
  ArrowDownLeft,
  ArrowRightLeft,
} from "lucide-react";
import * as PhosphorIcons from "@phosphor-icons/react";
import { formatCurrency } from "@/utils/currency";
import { format } from "date-fns";
import { cn } from "@/utils/cn";
import Skeleton from "@/components/ui/Skeleton";

// Helper to determine icon and colors based on category/type
const getTransactionDisplayInfo = (tx) => {
  const isIncome =
    tx.type === "INCOME" ||
    (tx.type === "TRANSFER" && tx.transferDirection === "IN");
  const isExpense =
    tx.type === "EXPENSE" ||
    (tx.type === "TRANSFER" && tx.transferDirection === "OUT");

  // Defaults based on type
  let Icon =
    tx.type === "TRANSFER"
      ? ArrowRightLeft
      : isIncome
        ? ArrowDownLeft
        : ArrowUpRight;
  let bgClass = isIncome
    ? "bg-emerald-500/10"
    : isExpense
      ? "bg-red-500/10"
      : "bg-(--line-soft)";
  let iconClass = isIncome
    ? "text-emerald-500"
    : isExpense
      ? "text-red-500"
      : "text-(--ink-soft)";
  let amountClass = isIncome
    ? "text-emerald-500"
    : isExpense
      ? "text-red-500"
      : "text-(--ink)";

  let customIconStyle = {};
  if (tx.category?.color) {
    bgClass = "";
    iconClass = "";
    customIconStyle = {
      backgroundColor: `${tx.category.color}15`, // ~8% opacity
      color: tx.category.color,
    };
  } else if (tx.type === "TRANSFER") {
    bgClass = "bg-(--line-soft)";
    iconClass = "text-(--ink-soft)";
    amountClass = "text-(--ink)";
  }

  // Handle Category Icon from Phosphor or Emojis
  let customElement = null;
  if (tx.category?.icon) {
    const iconObj = tx.category.icon;
    if (iconObj.type === "emoji") {
      customElement = (
        <span className="leading-none text-lg">{iconObj.value}</span>
      );
    } else if (iconObj.type === "phosphor" && PhosphorIcons[iconObj.value]) {
      const PhosphorIcon = PhosphorIcons[iconObj.value];
      customElement = <PhosphorIcon size={18} strokeWidth={1.75} />;
    }
  }

  return {
    Icon,
    customElement,
    bgClass,
    iconClass,
    amountClass,
    customIconStyle,
    isIncome,
    isExpense,
  };
};

const WalletTransactionList = ({
  transactions,
  isLoading,
  currency,
  onAddTransaction,
  onRowClick,
}) => {
  if (isLoading) {
    return (
      <Skeleton className="h-75 w-full rounded-2xl bg-(--bg-card) border border-(--line)" />
    );
  }

  return (
    <section
      className="w-full p-4 md:p-5 border border-(--line) rounded-2xl bg-(--bg-card) shadow-xs overflow-hidden"
      aria-labelledby="wallet-transactions-heading"
    >
      <div className="flex items-center justify-between pb-4 px-2">
        <h2
          id="wallet-transactions-heading"
          className="text-lg font-semibold text-(--ink)"
        >
          Transactions
        </h2>
        <button
          type="button"
          className="text-[13px] font-medium text-(--ink) hover:text-(--ink-soft) transition-colors"
        >
          View All
        </button>
      </div>

      <div>
        {!transactions || transactions.length === 0 ? (
          <div className="p-10 flex flex-col items-center justify-center text-center">
            <div className="w-10 h-10 rounded-xl bg-(--line-soft) flex items-center justify-center mb-4">
              <FileText size={20} className="text-(--ink-muted)" />
            </div>
            <h3 className="font-medium text-(--ink) mb-1">
              No transactions yet
            </h3>
            <p className="text-[13px] text-(--ink-soft) mb-6 max-w-65">
              Income and expenses for this wallet will show up here once you add
              one.
            </p>
            <button
              onClick={onAddTransaction}
              className="inline-flex items-center gap-1.5 h-9 bg-(--ink) text-(--bg) px-3.5 rounded-[9px] text-[13px] font-medium hover:bg-(--ink)/80 transition-all shadow-sm"
            >
              <Plus size={14} />
              Add transaction
            </button>
          </div>
        ) : (
          <>
            {/* Desktop Table Header */}
            <div className="px-4 py-3 hidden md:grid grid-cols-[minmax(0,2fr)_minmax(0,1.5fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)] gap-4 bg-(--line)/65 text-[12px] font-medium text-(--ink-muted) capitalize tracking-wider">
              <div>Payment Name</div>
              <div>Time And Date</div>
              <div>Type</div>
              <div>Categories</div>
              <div className="text-right">Amount</div>
            </div>

            <ul className="flex flex-col" aria-label="Transaction list">
              {transactions.map((tx, index) => {
                const {
                  Icon,
                  customElement,
                  bgClass,
                  iconClass,
                  amountClass,
                  customIconStyle,
                  isIncome,
                  isExpense,
                } = getTransactionDisplayInfo(tx);

                const typeText =
                  tx.type.charAt(0) + tx.type.slice(1).toLowerCase();
                const categoryText = tx.category?.name || "-";

                return (
                  <li
                    key={tx.id}
                    onClick={() => onRowClick && onRowClick(tx)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        onRowClick && onRowClick(tx);
                      }
                    }}
                    role="button"
                    tabIndex={0}
                    className={cn(
                      "grid grid-cols-[1fr_auto] md:grid-cols-[minmax(0,2fr)_minmax(0,1.5fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)] items-center gap-4 px-2 sm:px-4 py-2 transition-colors hover:bg-(--line-soft)/40 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-black dark:focus-visible:ring-white focus-visible:ring-inset cursor-pointer",
                      index !== transactions.length - 1 &&
                        "border-b border-(--line)",
                    )}
                  >
                    {/* Payment Name */}
                    <div className="flex items-center gap-3.5 truncate">
                      <div
                        className={cn(
                          "w-9 h-9 rounded-[10px] flex items-center justify-center shrink-0",
                          bgClass,
                          iconClass,
                        )}
                        style={customIconStyle}
                        aria-hidden="true"
                      >
                        {customElement ? (
                          customElement
                        ) : (
                          <Icon size={16} strokeWidth={2} />
                        )}
                      </div>
                      <div className="flex flex-col gap-0.5 truncate">
                        <span className="text-[13px] font-medium text-(--ink) truncate">
                          {tx.title}
                        </span>
                        {/* Mobile only subtext/date */}
                        <div className="flex md:hidden items-center gap-2 text-xs mt-0.5">
                          {tx.category?.name && (
                            <span className="px-1.5 py-0.5 rounded text-(--ink-muted) bg-(--line-soft) font-medium truncate">
                              {tx.category.name}
                            </span>
                          )}
                          <span className="text-(--ink-muted) font-medium whitespace-nowrap">
                            {format(new Date(tx.date), "MMM d")}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Desktop Date */}
                    <div className="hidden md:block text-[13px] text-(--ink-muted) truncate">
                      {format(new Date(tx.date), "MMM d, h:mm a")}
                    </div>

                    {/* Desktop Type */}
                    <div className="hidden md:block text-[13px] text-(--ink-muted) truncate">
                      {typeText}
                    </div>

                    {/* Desktop Category */}
                    <div className="hidden md:block text-[13px] text-(--ink-muted) truncate">
                      {categoryText}
                    </div>

                    {/* Amount */}
                    <div
                      className={cn(
                        "text-[13px] font-medium tracking-tight whitespace-nowrap md:text-right",
                        amountClass,
                      )}
                    >
                      {isIncome ? "+" : isExpense ? "-" : ""}
                      {formatCurrency(tx.amount, currency)}
                    </div>
                  </li>
                );
              })}
            </ul>
          </>
        )}
      </div>
    </section>
  );
};

export default WalletTransactionList;
