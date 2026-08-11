import { ArrowDownLeft, ArrowUpRight, ArrowRightLeft } from "lucide-react";
import { formatCurrency } from "@/utils/currency";
import { format } from "date-fns";
import LoadingThreeDots from "@/components/ui/LoadingThreeDots";
import { cn } from "@/utils/cn";

const TransactionList = ({ transactions, isLoading, currency }) => {
  if (isLoading) {
    return (
      <div className="p-8 min-h-50 border border-dashed border-(--line) rounded-xl flex items-center justify-center w-full">
        <LoadingThreeDots fullScreen={false} className="p-0" />
      </div>
    );
  }

  if (!transactions || transactions.length === 0) {
    return (
      <div className="p-8 text-center border border-dashed border-(--line) rounded-xl text-(--ink-soft)">
        No transactions found for this wallet.
      </div>
    );
  }

  return (
    <ul className="flex flex-col gap-3" aria-label="Recent transactions">
      {transactions.map((tx) => {
        const isIncome =
          tx.type === "INCOME" ||
          (tx.type === "TRANSFER" && tx.transferDirection === "IN");
        const isExpense =
          tx.type === "EXPENSE" ||
          (tx.type === "TRANSFER" && tx.transferDirection === "OUT");

        return (
          <li
            key={tx.id}
            className="flex items-center justify-between p-4 bg-white dark:bg-(--bg-card) border border-(--line) rounded-xl shadow-sm hover:border-(--line-soft) transition-colors"
          >
            <div className="flex items-center gap-4">
              <div
                className={cn(
                  "p-2 rounded-full",
                  isIncome
                    ? "bg-emerald-500/10 text-emerald-500"
                    : isExpense
                      ? "bg-red-500/10 text-red-500"
                      : "bg-blue-500/10 text-blue-500",
                )}
                aria-hidden="true"
              >
                {tx.type === "INCOME" ? (
                  <ArrowDownLeft size={20} />
                ) : tx.type === "EXPENSE" ? (
                  <ArrowUpRight size={20} />
                ) : (
                  <ArrowRightLeft size={20} />
                )}
              </div>
              <div className="flex flex-col">
                <span className="font-medium text-(--ink)">
                  <span className="sr-only">
                    {tx.type === "INCOME"
                      ? "Income: "
                      : tx.type === "EXPENSE"
                        ? "Expense: "
                        : "Transfer: "}
                  </span>
                  {tx.title}
                </span>
                <span className="text-xs text-(--ink-soft)">
                  {format(new Date(tx.date), "MMM d, yyyy")}
                </span>
              </div>
            </div>

            <div
              className={cn(
                "font-semibold tabular-nums",
                isIncome
                  ? "text-emerald-500"
                  : isExpense
                    ? "text-red-500"
                    : "text-(--ink)",
              )}
            >
              {isIncome ? "+" : isExpense ? "-" : ""}
              {formatCurrency(tx.amount, currency)}
            </div>
          </li>
        );
      })}
    </ul>
  );
};

export default TransactionList;
