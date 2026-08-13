import { useState, useMemo, useRef } from "react";
import { Plus, Tag, SearchX, ArrowUpDown, ArrowUp, ArrowDown, Filter, Check, Search } from "lucide-react";
import { motion as Motion, AnimatePresence, LayoutGroup } from "motion/react";
import { useCategories } from "../hooks/useCategories";
import { useExchangeRates } from "@/features/currencies/hooks/useExchangeRates";
import { useAuth } from "@/features/auth/hooks/useAuth";
import CategoryFormModal from "../components/CategoryFormModal";
import CategoryCard from "../components/CategoryCard";
import EmptyState from "@/components/ui/EmptyState";
import Skeleton from "@/components/ui/Skeleton";
import Popover from "@/components/ui/Popover";
import { cn } from "@/utils/cn";

const CategoriesPage = () => {
  const { user } = useAuth();
  const { convertCurrency } = useExchangeRates();
  const { categories, isLoading, error, deleteCategory } = useCategories();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [usageFilter, setUsageFilter] = useState("all"); // 'all' | 'active' | 'unused'
  const [sortBy, setSortBy] = useState("default"); 

  const sortRef = useRef(null);
  const [isSortOpen, setIsSortOpen] = useState(false);

  const filterRef = useRef(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const filteredCategories = useMemo(() => {
    // 1. Map to include calculated stats for easier sorting & filtering
    const categoriesWithStats = categories.map((c) => {
      let totalBaseAmount = 0;
      if (c.stats?.balancesByCurrency) {
        for (const [currency, amount] of Object.entries(
          c.stats.balancesByCurrency,
        )) {
          const converted = convertCurrency(amount, currency, user?.baseCurrency);
          if (converted !== null) {
            totalBaseAmount += converted;
          } else if (currency === user?.baseCurrency) {
            totalBaseAmount += amount;
          }
        }
      }
      return {
        ...c,
        totalBaseAmount,
        transactionCount: c.stats?.transactionCount || 0,
      };
    });

    // 2. Filter
    let result = categoriesWithStats;

    if (searchQuery) {
      result = result.filter((c) =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    if (usageFilter !== "all") {
      result = result.filter((c) => {
        if (usageFilter === "active") return c.transactionCount > 0;
        if (usageFilter === "unused") return c.transactionCount === 0;
        return true;
      });
    }

    // 3. Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case "amount-desc": {
          const aUsed = a.transactionCount > 0;
          const bUsed = b.transactionCount > 0;
          if (aUsed && !bUsed) return -1;
          if (!aUsed && bUsed) return 1;
          return b.totalBaseAmount - a.totalBaseAmount;
        }
        case "amount-asc": {
          const aUsed = a.transactionCount > 0;
          const bUsed = b.transactionCount > 0;
          if (aUsed && !bUsed) return -1;
          if (!aUsed && bUsed) return 1;
          return a.totalBaseAmount - b.totalBaseAmount;
        }
        case "usage-desc":
          return b.transactionCount - a.transactionCount;
        case "usage-asc": {
          const aUsed = a.transactionCount > 0;
          const bUsed = b.transactionCount > 0;
          if (aUsed && !bUsed) return -1;
          if (!aUsed && bUsed) return 1;
          return a.transactionCount - b.transactionCount;
        }
        case "name-desc":
          return b.name.localeCompare(a.name);
        case "name-asc":
          return a.name.localeCompare(b.name);
        case "date-asc":
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case "date-desc":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        default:
          return b.transactionCount - a.transactionCount;
      }
    });

    return result;
  }, [
    categories,
    searchQuery,
    usageFilter,
    sortBy,
    convertCurrency,
    user?.baseCurrency,
  ]);

  const handleCreate = () => {
    setSelectedCategory(null);
    setIsModalOpen(true);
  };

  const handleEdit = (category) => {
    setSelectedCategory(category);
    setIsModalOpen(true);
  };

  const handleDelete = async (category) => {
    if (window.confirm(`Are you sure you want to delete "${category.name}"?`)) {
      await deleteCategory(category.id);
    }
  };

  return (
    <div>
      <header className="page-header lg:flex-row lg:justify-between gap-3 lg:items-end items-start">
        <div>
          <span className="page-section">Categories</span>
          <h1 className="page-title">Manage Categories</h1>
          <p className="page-subtitle">
            Organize your spending and income into different categories
          </p>
        </div>
        {!isLoading && categories.length > 0 && (
          <button
            type="button"
            onClick={handleCreate}
            className="inline-flex items-center gap-1.5 h-9 bg-(--ink) text-(--bg) px-3.5 rounded-[9px] text-[13px] font-medium hover:bg-(--ink)/80 transition-all shadow-sm"
          >
            <Plus size={16} />
            <span>New Category</span>
          </button>
        )}
      </header>

      {isLoading ? (
        <div className="w-full">
          <div className="flex justify-between mb-4">
            <Skeleton className="h-9 w-64" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 pt-4">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full hidden md:block" />
            <Skeleton className="h-16 w-full hidden lg:block" />
            <Skeleton className="h-16 w-full hidden lg:block" />
          </div>
        </div>
      ) : error ? (
        <div className="p-4 text-red-500">{error}</div>
      ) : (
        <>
          {categories.length > 0 && (
            <section
              aria-label="Filters and Search"
              className="flex gap-2 sm:gap-3 mb-6"
            >
              <search className="relative flex-1" aria-label="Search categories">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-(--ink-muted)"
                  aria-hidden="true"
                />
                <input
                  type="search"
                  aria-label="Search categories"
                  placeholder="Search categories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 h-10 bg-(--bg-card) border border-(--line) rounded-lg text-sm focus:outline-none focus:border-(--accent) focus:ring-1 focus:ring-(--accent) transition-colors placeholder:text-(--ink-muted) text-(--ink)"
                />
              </search>

              <div className="flex gap-2 shrink-0">
                {/* Filter Menu */}
                <div className="relative">
                  <button
                    ref={filterRef}
                    type="button"
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    aria-expanded={isFilterOpen}
                    aria-haspopup="menu"
                    className="flex items-center justify-center sm:justify-start gap-2 px-3 py-2 h-10 bg-(--bg-card) border border-(--line) hover:border-(--line-soft) rounded-lg text-sm text-(--ink) transition-colors sm:min-w-36"
                    title="Filter usage"
                  >
                    <Filter size={14} className="text-(--ink-muted)" aria-hidden="true" />
                    <span className="hidden sm:inline">
                      {usageFilter === "all" ? "All Usage" : usageFilter === "active" ? "Active Only" : "Unused"}
                    </span>
                  </button>
                  <Popover
                    open={isFilterOpen}
                    onOpenChange={setIsFilterOpen}
                    anchorRef={filterRef}
                    placement="bottom-end"
                  >
                    {({ close }) => (
                      <menu className="bg-(--bg-card) border border-(--line) rounded-xl shadow-lg p-1.5 w-44 flex flex-col gap-1 m-0">
                        <div className="px-2 py-1 text-xs font-medium text-(--ink-muted) uppercase tracking-wider" role="presentation">Usage</div>
                        {[
                          { id: "all", label: "All Usage" },
                          { id: "active", label: "Active Only" },
                          { id: "unused", label: "Unused" },
                        ].map((opt) => (
                          <li key={opt.id} role="none">
                            <button
                              role="menuitem"
                              onClick={() => {
                                setUsageFilter(opt.id);
                                close();
                              }}
                              className={cn(
                                "w-full flex items-center justify-between px-3 py-2 text-[13px] rounded-lg transition-colors",
                                usageFilter === opt.id ? "bg-(--line-soft) text-(--ink)" : "text-(--ink-soft) hover:text-(--ink) hover:bg-(--line-soft)/50"
                              )}
                            >
                              <span>{opt.label}</span>
                              {usageFilter === opt.id && <Check size={14} aria-hidden="true" />}
                            </button>
                          </li>
                        ))}
                      </menu>
                    )}
                  </Popover>
                </div>

                {/* Sort Menu */}
                <div className="relative">
                  <button
                    ref={sortRef}
                    type="button"
                    onClick={() => setIsSortOpen(!isSortOpen)}
                    aria-expanded={isSortOpen}
                    aria-haspopup="menu"
                    className="flex items-center justify-center sm:justify-start gap-2 px-3 py-2 h-10 bg-(--bg-card) border border-(--line) hover:border-(--line-soft) rounded-lg text-sm text-(--ink) transition-colors sm:min-w-40"
                    title="Sort categories"
                  >
                    <ArrowUpDown size={14} className="text-(--ink-muted)" aria-hidden="true" />
                    <span className="hidden sm:inline">
                      {sortBy === "default" && "Default Sort"}
                      {sortBy.startsWith("name") && "Name"}
                      {sortBy.startsWith("amount") && "Amount"}
                      {sortBy.startsWith("usage") && "Usage"}
                      {sortBy.startsWith("date") && "Date Added"}
                    </span>
                  </button>
                  <Popover
                    open={isSortOpen}
                    onOpenChange={setIsSortOpen}
                    anchorRef={sortRef}
                    placement="bottom-end"
                  >
                    {({ close }) => (
                      <menu className="bg-(--bg-card) border border-(--line) rounded-xl shadow-lg p-1.5 w-48 flex flex-col gap-1 m-0">
                        {[
                          { id: "name", label: "Name", defaultDir: "asc" },
                          { id: "amount", label: "Amount", defaultDir: "desc" },
                          { id: "usage", label: "Usage", defaultDir: "desc" },
                          { id: "date", label: "Date Added", defaultDir: "desc" },
                          { id: "default", label: "Default Sort", defaultDir: null },
                        ].map((opt) => {
                          const isSelected = sortBy === opt.id || sortBy.startsWith(opt.id + "-");
                          const currentDir = isSelected && sortBy.includes("-") ? sortBy.split("-")[1] : null;

                          return (
                            <li key={opt.id} role="none">
                              <button
                                role="menuitem"
                                onClick={() => {
                                  if (opt.id === "default") {
                                    setSortBy("default");
                                  } else if (isSelected) {
                                    setSortBy(`${opt.id}-${currentDir === "asc" ? "desc" : "asc"}`);
                                  } else {
                                    setSortBy(`${opt.id}-${opt.defaultDir}`);
                                  }
                                  close();
                                }}
                                className={cn(
                                  "w-full flex items-center justify-between px-3 py-2 text-[13px] rounded-lg transition-colors",
                                  isSelected ? "bg-(--line-soft) text-(--ink)" : "text-(--ink-soft) hover:text-(--ink) hover:bg-(--line-soft)/50"
                                )}
                              >
                                <span>{opt.label}</span>
                                {isSelected && (
                                  opt.id === "default" ? (
                                    <Check size={14} className="text-(--accent)" aria-hidden="true" />
                                  ) : currentDir === "asc" ? (
                                    <ArrowUp size={14} className="text-(--accent)" aria-hidden="true" />
                                  ) : (
                                    <ArrowDown size={14} className="text-(--accent)" aria-hidden="true" />
                                  )
                                )}
                              </button>
                            </li>
                          );
                        })}
                      </menu>
                    )}
                  </Popover>
                </div>
              </div>
            </section>
          )}

          <LayoutGroup>
            <Motion.ul
              role="list"
              layout
              className="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] lg:grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-3"
            >
              <AnimatePresence mode="popLayout">
                {categories.length === 0 ? (
                  <EmptyState
                    key="empty-categories"
                    icon={Tag}
                    title="No categories yet"
                    description="Create your first category to start organizing your transactions."
                    actionLabel="Create Category"
                    onAction={handleCreate}
                  />
                ) : filteredCategories.length === 0 ? (
                  <EmptyState
                    key="empty-search"
                    icon={SearchX}
                    title="No categories found"
                    description="We couldn't find any categories matching your search."
                  />
                ) : (
                  filteredCategories.map((category) => (
                    <CategoryCard
                      key={category.id}
                      category={category}
                      handleEdit={handleEdit}
                      handleDelete={handleDelete}
                    />
                  ))
                )}
              </AnimatePresence>
            </Motion.ul>
          </LayoutGroup>
        </>
      )}

      <CategoryFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        category={selectedCategory}
      />
    </div>
  );
};

export default CategoriesPage;
