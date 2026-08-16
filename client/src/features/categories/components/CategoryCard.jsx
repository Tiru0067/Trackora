
import { useNavigate } from "react-router-dom";
import { EllipsisVertical, Edit2, Trash2 } from "lucide-react";
import * as Icons from "@phosphor-icons/react";
import { motion as Motion } from "motion/react";
import DropdownMenu from "@/components/ui/DropdownMenu";
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
  const navigate = useNavigate();

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
      className="relative bg-(--bg-card) border border-(--line) hover:border-(--line-soft) rounded-xl shadow-sm hover:shadow-md transition-shadow group"
    >
      <button
        type="button"
        onClick={() => navigate(`/categories/${category.id}`)}
        className="w-full h-full p-4 flex flex-col items-start gap-2 text-left cursor-pointer rounded-xl"
        aria-label={`View details for ${category.name}`}
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
      </button>

      {/* Action Menu Trigger */}
      <DropdownMenu
        placement="bottom-end"
        minWidth="min-w-32"
        trigger={
          <button
            type="button"
            onClick={(e) => e.stopPropagation()}
            className="btn btn-icon absolute top-2 right-2 h-7 w-7 min-w-7"
          >
            <EllipsisVertical size={16} />
          </button>
        }
        items={[
          {
            id: "edit",
            label: "Edit",
            icon: <Edit2 size={14} />,
            onClick: (e) => {
              e.stopPropagation();
              handleEdit(category);
            }
          },
          {
            id: "delete",
            label: "Delete",
            icon: <Trash2 size={14} />,
            danger: true,
            onClick: (e) => {
              e.stopPropagation();
              handleDelete(category);
            }
          }
        ]}
      />
    </Motion.li>
  );
};

export default CategoryCard;
