import { useState, useMemo } from "react";
import { Plus, Tag, SearchX } from "lucide-react";
import { motion as Motion, AnimatePresence, LayoutGroup } from "motion/react";
import { useCategories } from "../hooks/useCategories";
import { useExchangeRates } from "@/features/currencies/hooks/useExchangeRates";
import { useAuth } from "@/features/auth/hooks/useAuth";
import CategoryFormModal from "../components/CategoryFormModal";
import CategoryStats from "../components/CategoryStats";
import CategoryToolbar from "../components/CategoryToolbar";
import CategoryCard from "../components/CategoryCard";
import EmptyState from "@/components/ui/EmptyState";
import Skeleton from "@/components/ui/Skeleton";

const CategoriesPage = () => {
  const { user } = useAuth();
  const { convertCurrency } = useExchangeRates();
  const { categories, isLoading, error, deleteCategory } = useCategories();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [usageFilter, setUsageFilter] = useState("all"); // 'all' | 'active' | 'unused'
  const [sortBy, setSortBy] = useState("default"); 

  const stats = useMemo(() => {
    if (!categories) return { total: 0, active: 0, unused: 0 };
    
    let active = 0;
    let unused = 0;
    
    categories.forEach(c => {
      const txCount = c.stats?.transactionCount || 0;
      if (txCount > 0) active++;
      else unused++;
    });
    
    return {
      total: categories.length,
      active,
      unused
    };
  }, [categories]);

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
            className="btn bg-(--ink) text-(--bg) hover:bg-(--ink)/80 shadow-sm"
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
            <>
              <CategoryStats 
                totalCategories={stats.total} 
                activeCategories={stats.active} 
                unusedCategories={stats.unused} 
              />
              <CategoryToolbar
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                sortBy={sortBy}
                setSortBy={setSortBy}
                usageFilter={usageFilter}
                setUsageFilter={setUsageFilter}
              />
            </>
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
