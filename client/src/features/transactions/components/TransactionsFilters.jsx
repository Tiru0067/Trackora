import { useState, useEffect } from "react";
import {
  Search,
  ArrowRightLeft,
  ArrowDownLeft,
  ArrowUpRight,
  ChevronDown,
} from "lucide-react";
import DropdownMenu from "@/components/ui/DropdownMenu";
import ComboBox from "@/components/ui/ComboBox";
import DatePicker from "@/components/ui/DatePicker";

const TYPE_OPTIONS = [
  { value: "", label: "All Status" },
  {
    value: "INCOME",
    label: "Income",
    icon: <ArrowDownLeft size={14} className="text-emerald-500" />,
  },
  {
    value: "EXPENSE",
    label: "Expense",
    icon: <ArrowUpRight size={14} className="text-red-500" />,
  },
  {
    value: "TRANSFER",
    label: "Transfer",
    icon: <ArrowRightLeft size={14} className="text-(--ink-soft)" />,
  },
];

const TransactionsFilters = ({ filters, onChange, categories, wallets }) => {
  const [localSearch, setLocalSearch] = useState(filters.search || "");

  useEffect(() => {
    if (filters.search === undefined || filters.search === "") {
      //eslint-disable-next-line
      setLocalSearch("");
    }
  }, [filters.search]);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (localSearch !== (filters.search || "")) {
        onChange({ ...filters, search: localSearch, page: 1 });
      }
    }, 400);
    return () => clearTimeout(handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localSearch]);

  const handleFilterChange = (key, value) => {
    onChange({ ...filters, [key]: value, page: 1 });
  };

  const currentType =
    TYPE_OPTIONS.find((t) => t.value === filters.type) || TYPE_OPTIONS[0];

  return (
    <section
      aria-label="Transaction filters"
      className="grid grid-cols-[repeat(auto-fit,minmax(120px,1fr))] gap-3"
    >
      {/* Search Bar */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search size={14} className="text-(--ink-muted)" />
        </div>
        <input
          type="text"
          placeholder="Search..."
          aria-label="Search transactions"
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              setLocalSearch("");
            }
          }}
          className="w-full h-9 pl-9 pr-3 text-[13px] rounded-lg border border-(--line) bg-transparent hover:bg-(--line-soft) focus:outline-none focus:ring-1 focus:ring-(--accent) focus:border-(--accent) text-(--ink) placeholder:text-(--ink-muted) transition-colors"
        />
      </div>

      {/* Status (Type) Dropdown */}

      <DropdownMenu
        placement="bottom-start"
        minWidth="w-full min-w-40"
        trigger={
          <button
            aria-label="Filter by status"
            className="flex items-center justify-between gap-2 h-9 px-3 w-full rounded-lg border border-(--line) bg-transparent hover:bg-(--line-soft) transition-colors text-[13px] font-medium text-(--ink-soft)"
          >
            <span className="text-(--ink) truncate">{currentType.label}</span>
            <ChevronDown size={14} className="text-(--ink-muted) shrink-0" />
          </button>
        }
        items={TYPE_OPTIONS.map((opt) => ({
          id: opt.value || "all",
          label: opt.label,
          icon: opt.icon,
          onClick: () => handleFilterChange("type", opt.value),
        }))}
      />

      {/* Wallets Dropdown */}
      {wallets && (
        <ComboBox
          id="walletId"
          value={filters.walletId}
          onChange={(val) => handleFilterChange("walletId", val)}
          options={wallets.map((w) => ({
            value: w.id,
            label: w.name,
            color: w.color,
          }))}
          placeholder="Wallets"
          clearable={true}
          className="w-full h-9 py-0 bg-transparent! hover:bg-(--line-soft)! text-[13px] shadow-none"
        />
      )}

      {/* Categories Dropdown */}

      <ComboBox
        id="categoryId"
        value={filters.categoryId}
        onChange={(val) => handleFilterChange("categoryId", val)}
        options={
          categories?.map((c) => ({
            value: c.id,
            label: c.name,
            color: c.color,
            icon: c.icon,
          })) || []
        }
        placeholder="Categories"
        clearable={true}
        className="w-full h-9 py-0 bg-transparent! hover:bg-(--line-soft)! text-[13px] shadow-none"
      />

      {/* Date Filter */}
      <div className="flex items-center gap-1 col-span-2">
        <DatePicker
          id="startDate"
          name="startDate"
          value={filters.startDate || ""}
          onChange={(e) => handleFilterChange("startDate", e.target.value)}
          className="h-9 flex-1 min-w-0 px-2 text-[12px] bg-transparent hover:bg-(--line-soft) shadow-none"
          placeholder="Start Date"
          aria-label="Start date"
        />
        <span className="text-(--ink-muted) text-xs shrink-0">-</span>
        <DatePicker
          id="endDate"
          name="endDate"
          value={filters.endDate || ""}
          onChange={(e) => handleFilterChange("endDate", e.target.value)}
          className="h-9 flex-1 min-w-0 px-2 text-[12px] bg-transparent hover:bg-(--line-soft) shadow-none"
          placeholder="End Date"
          aria-label="End date"
        />
      </div>
    </section>
  );
};

export default TransactionsFilters;
