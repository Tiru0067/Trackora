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
  if (tx.category) {
    let parsedIcon = null;
    try {
      if (
        typeof tx.category.icon === "string" &&
        tx.category.icon.startsWith("{")
      ) {
        parsedIcon = JSON.parse(tx.category.icon);
      } else if (typeof tx.category.icon === "object") {
        parsedIcon = tx.category.icon;
      }
    } catch {
      // Ignore parsing errors, fallback to string/icon
    }

    if (parsedIcon) {
      if (parsedIcon.type === "emoji") {
        customElement = (
          <span className="leading-none text-sm">{parsedIcon.value}</span>
        );
      } else if (
        (parsedIcon.type === "icon" || parsedIcon.type === "phosphor") &&
        PhosphorIcons[parsedIcon.value]
      ) {
        const PhosphorIcon = PhosphorIcons[parsedIcon.value];
        customElement = <PhosphorIcon size={18} strokeWidth={1.75} />;
      }
    } else {
      // Handle plain string formats
      if (tx.category.icon && PhosphorIcons[tx.category.icon]) {
        const PhosphorIcon = PhosphorIcons[tx.category.icon];
        customElement = <PhosphorIcon size={18} strokeWidth={1.75} />;
      } else if (tx.category.emoji) {
        customElement = (
          <span className="leading-none text-[16px]">{tx.category.emoji}</span>
        );
      } else if (tx.category.icon && !PhosphorIcons[tx.category.icon]) {
        // Fallback if the string is just an emoji
        customElement = (
          <span className="leading-none text-[16px]">{tx.category.icon}</span>
        );
      }
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

const TransactionList = ({
  transactions,
  isLoading,
  currency, // Fallback currency
  context = "wallet", // "wallet" or "category" or "global"
  onAddTransaction,
  onRowClick,
  onViewAll,
  filtersNode,
  paginationNode,
  compact = false,
}) => {
  if (isLoading && transactions == null) {
    return (
      <Skeleton className="flex-1 h-full min-h-75 w-full rounded-2xl bg-(--bg-card) border border-(--line)" />
    );
  }

  return (
    <section
      className="w-full h-full flex-1 p-5 border border-(--line) rounded-2xl bg-(--bg-card) shadow-xs overflow-hidden flex flex-col"
      aria-labelledby="wallet-transactions-heading"
    >
      <div className="flex flex-col items-start justify-between pb-4 sm:px-2 gap-2.5">
        <div className="flex flex-row items-center justify-between w-full">
          <h2
            id="wallet-transactions-heading"
            className="text-base font-semibold text-(--ink) tracking-tight"
          >
            {context !== "global" ? "Recent Transactions" : "Transactions"}
          </h2>

          {context !== "global" && !filtersNode && (
            <button
              type="button"
              onClick={onViewAll}
              className="btn hover:bg-(--line-soft) text-(--ink) h-8 px-2 text-xs shrink-0"
            >
              View All
            </button>
          )}
        </div>

        {filtersNode && <div className="w-full">{filtersNode}</div>}
      </div>

      <div
        className={cn(
          "flex-1 overflow-y-auto overflow-x-hidden transition-opacity duration-200",
          isLoading && "opacity-50 pointer-events-none",
        )}
      >
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
              className="btn bg-(--ink) text-(--bg) hover:bg-(--ink)/80 shadow-sm"
            >
              <Plus size={16} />
              Add transaction
            </button>
          </div>
        ) : (
          <>
            {/* Desktop Table Header */}
            {!compact && (
              <div
                className={cn(
                  "sticky top-0 z-10 px-4 py-3 hidden md:grid gap-4 backdrop-blur-md bg-neutral-100 dark:bg-neutral-800 border-b border-(--line) text-[12px] font-medium text-(--ink-muted) capitalize tracking-wider",
                  context === "global" || context === "dashboard"
                    ? "grid-cols-[minmax(0,2fr)_minmax(0,1.5fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)] xl:grid-cols-[minmax(0,2fr)_minmax(0,1.5fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)]"
                    : "grid-cols-[minmax(0,2fr)_minmax(0,1.5fr)_minmax(0,1fr)_minmax(0,1fr)] xl:grid-cols-[minmax(0,2fr)_minmax(0,1.5fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)]",
                )}
              >
                <div>Payment Name</div>
                <div>Time And Date</div>
                <div className="hidden xl:block">Type</div>
                {context === "global" || context === "dashboard" ? (
                  <>
                    <div>Category</div>
                    <div>Wallet</div>
                  </>
                ) : (
                  <div>{context === "wallet" ? "Category" : "Wallet"}</div>
                )}
                <div className="text-right">Amount</div>
              </div>
            )}

            <ul
              className="flex flex-col max-lg:max-h-168 max-lg:overflow-y-auto"
              aria-label="Transaction list"
            >
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

                const contextText =
                  context === "wallet"
                    ? tx.category?.name || "-"
                    : tx.wallet?.name || "-";

                const txCurrency = tx.wallet?.currency || currency;

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
                      "grid grid-cols-[1fr_auto] items-center gap-4 transition-colors hover:bg-(--line-soft)/40 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-(--accent) focus-visible:ring-inset cursor-pointer",
                      compact
                        ? "py-3 sm:px-4 xl:px-2 xl:-mx-2 xl:rounded-lg"
                        : "sm:px-4 py-3 sm:rounded-lg",
                      !compact &&
                        (context === "global" || context === "dashboard"
                          ? "md:grid-cols-[minmax(0,2fr)_minmax(0,1.5fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)] xl:grid-cols-[minmax(0,2fr)_minmax(0,1.5fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)]"
                          : "md:grid-cols-[minmax(0,2fr)_minmax(0,1.5fr)_minmax(0,1fr)_minmax(0,1fr)] xl:grid-cols-[minmax(0,2fr)_minmax(0,1.5fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)]"),
                      index !== transactions.length - 1 &&
                        "md:border-b border-(--line)",
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
                        <div
                          className={cn(
                            "flex items-center gap-2 text-xs mt-0.5",
                            !compact && "md:hidden",
                          )}
                        >
                          {contextText !== "-" && (
                            <span className="px-1.5 py-0.5 rounded text-(--ink-muted) bg-(--line-soft) font-medium truncate">
                              {contextText}
                            </span>
                          )}
                          <span className="text-(--ink-muted) font-medium whitespace-nowrap">
                            {format(new Date(tx.date), "MMM d")}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Desktop Date */}
                    {!compact && (
                      <div className="hidden md:flex flex-col truncate">
                        <span className="text-[13px] text-(--ink) font-medium truncate">
                          {format(new Date(tx.date), "MMM dd, yyyy")}
                        </span>
                        <span className="text-xs text-(--ink-muted) truncate">
                          {format(new Date(tx.date), "hh:mm a")}
                        </span>
                      </div>
                    )}

                    {/* Desktop Type */}
                    {!compact && (
                      <div className="hidden xl:block text-[13px] text-(--ink-muted) truncate">
                        {typeText}
                      </div>
                    )}

                    {/* Desktop Category / Wallet */}
                    {!compact &&
                      (context === "global" || context === "dashboard" ? (
                        <>
                          <div className="hidden md:block text-[13px] text-(--ink-muted) truncate">
                            {tx.category?.name || "-"}
                          </div>
                          <div className="hidden md:block text-[13px] text-(--ink-muted) truncate">
                            {tx.wallet?.name || "-"}
                          </div>
                        </>
                      ) : (
                        <div className="hidden md:block text-[13px] text-(--ink-muted) truncate">
                          {contextText}
                        </div>
                      ))}

                    {/* Amount */}
                    <div
                      className={cn(
                        "text-[13px] font-medium tracking-tight whitespace-nowrap md:text-right",
                        amountClass,
                      )}
                    >
                      {isIncome ? "+" : isExpense ? "-" : ""}
                      {formatCurrency(tx.amount, txCurrency)}
                    </div>
                  </li>
                );
              })}
            </ul>
          </>
        )}
      </div>

      {paginationNode && (
        <div className="md:border-t border-(--line) shrink-0 mt-auto">
          {paginationNode}
        </div>
      )}
    </section>
  );
};

export default TransactionList;
