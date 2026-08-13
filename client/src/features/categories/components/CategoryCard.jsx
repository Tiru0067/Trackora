import { useState, useRef } from "react";
import { EllipsisVertical, Edit2, Trash2 } from "lucide-react";
import * as Icons from "@phosphor-icons/react";
import { motion as Motion } from "motion/react";
import Popover from "@/components/ui/Popover";
import { formatCompact } from "@/utils/currency";
import { useExchangeRates } from "@/features/currencies/hooks/useExchangeRates";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { cn } from "@/utils/cn";

// Helper component for Icon
const CategoryIcon = ({ value, color }) => {
  if (!value) return <span className="text-zinc-400 text-sm">?</span>;
  if (value.type === "emoji") {
    return <span className="text-xs">{value.value}</span>;
  }
  const Icon = Icons[value.value];
  if (!Icon) return <span className="text-zinc-400 text-sm">?</span>;
  return <Icon aria-hidden="true" size={16} color={color} />;
};

const CategoryCard = ({ category, handleEdit, handleDelete }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const triggerRef = useRef(null);

  const { user } = useAuth();
  const { convertCurrency } = useExchangeRates();

  // Calculate net amount in base currency
  let totalBaseAmount = 0;
  if (category.stats?.balancesByCurrency) {
    for (const [currency, amount] of Object.entries(
      category.stats.balancesByCurrency,
    )) {
      const converted = convertCurrency(amount, currency, user?.baseCurrency);
      if (converted !== null) {
        totalBaseAmount += converted;
      } else if (currency === user?.baseCurrency) {
        totalBaseAmount += amount;
      }
    }
  }

  const transactionCount = category.stats?.transactionCount || 0;
  const isIncome = totalBaseAmount > 0;
  const isExpense = totalBaseAmount < 0;

  return (
    <Motion.li
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.2 }}
      className="relative bg-(--bg-card) border border-(--line) hover:border-(--line-soft) rounded-xl shadow-sm hover:shadow-md transition-shadow group p-4 flex flex-col items-start gap-2"
    >
      <div
        aria-hidden="true"
        className="w-7 h-7 shrink-0 flex items-center justify-center rounded-lg"
        style={{ background: `${category.color}22` }}
      >
        <CategoryIcon value={category.icon} color={category.color} />
      </div>

      <div className="flex flex-col w-full gap-1">
        <span className="text-[13px] font-medium text-(--ink) tracking-tight truncate leading-tight">
          {category.name}
        </span>
        <span className="text-[11px] text-(--ink-muted) leading-tight">
          {transactionCount} transaction{transactionCount !== 1 && "s"}
        </span>
      </div>

      <span
        className={cn(
          "text-[15px] font-semibold tracking-tight",
          isIncome
            ? "text-emerald-500"
            : isExpense
              ? "text-red-500"
              : "text-(--ink-soft)",
        )}
      >
        {isExpense ? "- " : isIncome ? "+ " : ""}
        {formatCompact(Math.abs(totalBaseAmount), user?.baseCurrency || "USD")}
      </span>

      {/* Action Menu Trigger */}
      <button
        ref={triggerRef}
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setIsMenuOpen((prev) => !prev);
        }}
        className="btn btn-icon absolute top-2 right-2 h-7 w-7 min-w-7"
      >
        <EllipsisVertical size={16} />
      </button>

      <Popover
        open={isMenuOpen}
        onOpenChange={setIsMenuOpen}
        anchorRef={triggerRef}
        placement="bottom-end"
      >
        {({ close }) => (
          <ul className="bg-(--bg-card) border border-(--line) rounded-xl shadow-lg p-1.5 min-w-32 flex flex-col gap-1">
            <li>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleEdit(category);
                  close();
                }}
                className="w-full flex items-center gap-2 text-left px-3 py-1.5 text-sm text-(--ink) hover:bg-(--line-soft) rounded-lg transition-colors"
              >
                <Edit2 size={14} />
                <span>Edit</span>
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(category);
                  close();
                }}
                className="w-full flex items-center gap-2 text-left px-3 py-1.5 text-sm text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
              >
                <Trash2 size={14} />
                <span>Delete</span>
              </button>
            </li>
          </ul>
        )}
      </Popover>
    </Motion.li>
  );
};

export default CategoryCard;
