import { formatCurrency } from "@/utils/currency";
import { useAuth } from "@/features/auth/hooks/useAuth";
import * as PhosphorIcons from "@phosphor-icons/react";

const getCategoryIcon = (category) => {
  if (category.emoji) {
    return <span className="leading-none text-[16px]">{category.emoji}</span>;
  }
  if (category.icon) {
    let parsedIcon;
    try {
      if (typeof category.icon === "string" && category.icon.startsWith("{")) {
        parsedIcon = JSON.parse(category.icon);
      } else if (typeof category.icon === "object") {
        parsedIcon = category.icon;
      } else {
        parsedIcon = { type: "icon", value: category.icon };
      }
    } catch {
      parsedIcon = { type: "icon", value: category.icon };
    }

    if (parsedIcon?.type === "emoji") {
      return <span className="leading-none text-sm">{parsedIcon.value}</span>;
    }

    if (parsedIcon?.type === "icon" && PhosphorIcons[parsedIcon.value]) {
      const IconComponent = PhosphorIcons[parsedIcon.value];
      return <IconComponent size={18} strokeWidth={1.75} />;
    }

    const fallbackValue =
      typeof category.icon === "string" ? category.icon : parsedIcon?.value;
    if (typeof fallbackValue === "string") {
      return <span className="leading-none text-sm">{fallbackValue}</span>;
    }
  }
  return (
    <div
      className="w-2.5 h-2.5 rounded-full"
      style={{ backgroundColor: category.color }}
    ></div>
  );
};

export const DashboardTopCategories = ({ data }) => {
  const { user } = useAuth();
  const currency = user?.baseCurrency || "USD";

  if (!data.categoryBreakdown || data.categoryBreakdown.length === 0) {
    return (
      <section
        aria-labelledby="top-categories-empty-heading"
        className="bg-(--bg-card) border border-(--line) rounded-2xl p-5 shadow-sm w-full mt-6"
      >
        <h3
          id="top-categories-empty-heading"
          className="text-base font-semibold text-(--ink) mb-4 tracking-tight"
        >
          Top Categories
        </h3>
        <p className="text-sm text-(--ink-soft)">
          No expenses yet this period.
        </p>
      </section>
    );
  }

  const totalExpense = data.categoryBreakdown.reduce(
    (sum, item) => sum + item.value,
    0,
  );

  const limit = 3;
  let displayCategories;

  if (data.categoryBreakdown.length > limit) {
    displayCategories = data.categoryBreakdown.slice(0, limit - 1);
    const othersValue = data.categoryBreakdown
      .slice(limit - 1)
      .reduce((sum, cat) => sum + cat.value, 0);

    if (othersValue > 0) {
      displayCategories.push({
        name: "Others",
        value: othersValue,
        color: "#9ca3af",
        icon: "DotsThree",
        emoji: null,
      });
    }
  } else {
    displayCategories = data.categoryBreakdown;
  }

  return (
    <section
      aria-labelledby="top-categories-heading"
      className="bg-(--bg-card) border border-(--line) rounded-2xl p-5 shadow-sm w-full mt-6"
    >
      <header className="flex justify-between items-center mb-6">
        <h3
          id="top-categories-heading"
          className="text-base font-semibold text-(--ink) tracking-tight"
        >
          Top Categories
        </h3>
      </header>

      <ol className="flex flex-col gap-6 m-0 p-0 list-none">
        {displayCategories.map((category, index) => {
          const percentage =
            totalExpense > 0
              ? Math.round((category.value / totalExpense) * 100)
              : 0;
          return (
            <li key={index} className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                    style={{
                      backgroundColor: `${category.color}15`,
                      color: category.color,
                    }}
                  >
                    {getCategoryIcon(category)}
                  </div>
                  <span className="text-[13px] font-semibold text-(--ink)">
                    {category.name}
                  </span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[13px] font-bold text-(--ink)">
                    {formatCurrency(category.value, currency)}
                  </span>
                  <span className="text-xs font-medium text-(--ink-muted)">
                    {percentage}%
                  </span>
                </div>
              </div>
              <div className="w-full h-1 bg-(--line-soft) rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-1000 ease-out"
                  style={{
                    width: `${percentage}%`,
                    backgroundColor: category.color,
                  }}
                ></div>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
};
