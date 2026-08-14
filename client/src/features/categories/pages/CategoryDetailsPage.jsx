import { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Trash2, Edit2, MoreVertical, Plus } from "lucide-react";
import { useCategories } from "../hooks/useCategories";
import { categoriesApi } from "../api/categories";
import CategoryFormModal from "../components/CategoryFormModal";
import { useTransactions } from "../../transactions/hooks/useTransactions";
import TransactionList from "../../transactions/components/TransactionList";
import TransactionFormModal from "../../transactions/components/TransactionFormModal";
import TransactionDetailsModal from "../../transactions/components/TransactionDetailsModal";
import ConfirmModal from "@/components/ui/ConfirmModal";
import DropdownMenu from "@/components/ui/DropdownMenu";
import Skeleton from "@/components/ui/Skeleton";
import { formatCurrency } from "@/utils/currency";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useExchangeRates } from "@/features/currencies/hooks/useExchangeRates";
import { useToast } from "@/hooks/useToast";
import * as PhosphorIcons from "@phosphor-icons/react";

const CategoryDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { user } = useAuth();
  const { convertCurrency } = useExchangeRates();
  const { categories, deleteCategory, isLoading: isCategoriesLoading, fetchCategories } = useCategories();
  
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [isTransactionDetailsModalOpen, setIsTransactionDetailsModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [transactionToEdit, setTransactionToEdit] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // We find initial category from context if it exists, otherwise wait for fetch
  const contextCategory = categories.find((c) => c.id === id);
  const [category, setCategory] = useState(contextCategory);
  const [isCategoryLoading, setIsCategoryLoading] = useState(true);

  const fetchCategory = useCallback(async () => {
    setIsCategoryLoading(true);
    try {
      const data = await categoriesApi.getById(id);
      setCategory(data);
    } catch (err) {
      console.error("Failed to fetch category details:", err);
      addToast("Failed to fetch category details", "error");
    } finally {
      setIsCategoryLoading(false);
    }
  }, [id, addToast]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchCategory();
  }, [fetchCategory]);

  const {
    transactions,
    isLoading: isTransactionsLoading,
    refetch: refetchTransactions,
    deleteTransaction,
  } = useTransactions({
    categoryId: id,
  });

  // Calculate aggregated stats by converting each currency to baseCurrency
  const aggregatedStats = useMemo(() => {
    let totalBalance = 0;
    let totalIncome = 0;
    let totalExpense = 0;

    if (category?.stats) {
      const { balancesByCurrency, incomeByCurrency, expenseByCurrency } = category.stats;

      const sumCurrencies = (currencyMap) => {
        let sum = 0;
        if (!currencyMap) return sum;
        for (const [curr, amount] of Object.entries(currencyMap)) {
          const converted = convertCurrency(amount, curr, user?.baseCurrency);
          if (converted !== null) {
            sum += converted;
          } else if (curr === user?.baseCurrency) {
            sum += amount;
          }
        }
        return sum;
      };

      totalBalance = sumCurrencies(balancesByCurrency);
      totalIncome = sumCurrencies(incomeByCurrency);
      totalExpense = sumCurrencies(expenseByCurrency);
    }

    return {
      totalBalance,
      totalIncome,
      totalExpense,
    };
  }, [category?.stats, convertCurrency, user?.baseCurrency]);

  useEffect(() => {
    // Redirect if category not found and we finished loading
    if (!isCategoriesLoading && !isCategoryLoading && !category) {
      navigate("/categories");
    }
  }, [isCategoriesLoading, isCategoryLoading, category, navigate]);

  const handleDelete = () => {
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteCategory(category.id);
      addToast("Category deleted successfully");
      navigate("/categories");
    } catch (error) {
      console.error("Failed to delete category:", error);
      addToast("Failed to delete category", "error");
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
    }
  };

  if (isCategoriesLoading || !category) {
    return (
      <div className="w-full mt-6">
        <div className="flex flex-col gap-4">
          <Skeleton className="h-10 w-1/3" />
          <Skeleton className="h-8 w-1/4" />
        </div>
      </div>
    );
  }

  // Handle Category Icon
  let categoryIconElement = null;
  if (category.icon) {
    if (category.icon.type === "emoji") {
      categoryIconElement = <span className="text-xl leading-none">{category.icon.value}</span>;
    } else if (category.icon.type === "phosphor" && PhosphorIcons[category.icon.value]) {
      const PhosphorIcon = PhosphorIcons[category.icon.value];
      categoryIconElement = <PhosphorIcon size={20} weight="regular" color={category.color} />;
    }
  }

  return (
    <article>
      <header className="page-header justify-between items-start sm:items-end flex-col sm:flex-row gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Link
              to="/categories"
              className="p-1 rounded-md text-(--ink-muted) hover:text-(--ink) hover:bg-(--line-soft) transition-colors"
            >
              <ArrowLeft size={16} />
            </Link>
            <span className="text-[11px] font-semibold tracking-wider text-(--ink-muted) uppercase">
              Category Details
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm"
              style={{
                backgroundColor: `${category.color}20`,
                color: category.color,
              }}
            >
              {categoryIconElement}
            </div>
            <h1 className="page-title mb-0">{category.name}</h1>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto mt-2 sm:mt-0 ml-auto">
          <button
            type="button"
            onClick={() => {
              setTransactionToEdit(null);
              setIsTransactionModalOpen(true);
            }}
            className="btn bg-(--ink) text-(--bg) hover:bg-(--ink)/80 shadow-sm"
          >
            <Plus size={16} />
            <span>New Transaction</span>
          </button>

          <DropdownMenu
            placement="bottom-end"
            minWidth="w-40"
            trigger={
              <button className="btn btn-icon h-[34px] w-[34px] min-w-[34px] bg-(--bg-card) border border-(--line) shadow-sm hover:border-(--line-soft)">
                <MoreVertical size={14} className="text-(--ink)" />
              </button>
            }
            items={[
              {
                id: "edit",
                label: "Edit Category",
                icon: <Edit2 size={14} />,
                onClick: () => setIsEditModalOpen(true)
              },
              {
                id: "delete",
                label: "Delete Category",
                icon: <Trash2 size={14} />,
                danger: true,
                onClick: handleDelete
              }
            ]}
          />
        </div>
      </header>

      {isCategoryLoading ? (
        <>
          <div className="grid grid-cols-1 xxs:grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <Skeleton className="h-30 rounded-xl" />
            <Skeleton className="h-30 rounded-xl" />
            <Skeleton className="h-30 rounded-xl" />
            <Skeleton className="h-30 rounded-xl" />
          </div>
          <div className="mt-8">
            <TransactionList isLoading={true} context="category" currency={user?.baseCurrency} />
          </div>
        </>
      ) : (
        <>
          {/* Category Stat Cards */}
          <dl
            className="grid grid-cols-1 xxs:grid-cols-2 md:grid-cols-4 gap-4 mt-6"
            aria-label="Category Statistics"
          >
            {/* Balance Card */}
            <div className="flex flex-col p-5 bg-(--bg-card) border border-(--line) rounded-xl shadow-xs h-30">
              <dt className="text-[11px] uppercase tracking-wide text-(--ink-muted) font-mono mb-2">
                NET BALANCE
              </dt>
              <dd className="text-[22px] font-semibold tracking-tight text-(--ink)">
                <span className="sr-only">Net Balance is </span>
                {formatCurrency(aggregatedStats.totalBalance, user?.baseCurrency)}
              </dd>
              <dd
                className="mt-auto pt-2 text-xs font-normal text-(--ink-muted) flex items-center gap-1.5"
                aria-hidden="true"
              >
                In {user?.baseCurrency}
              </dd>
            </div>

            {/* Income Card */}
            <div className="flex flex-col p-5 bg-(--bg-card) border border-(--line) rounded-xl shadow-xs h-30">
              <dt className="text-[11px] uppercase tracking-wide text-(--ink-muted) font-mono mb-2">
                TOTAL INCOME
              </dt>
              <dd className="text-[22px] font-semibold tracking-tight text-emerald-500">
                <span className="sr-only">Total Income is </span>
                {formatCurrency(aggregatedStats.totalIncome, user?.baseCurrency)}
              </dd>
              <dd
                className="mt-auto pt-2 text-xs font-normal text-(--ink-muted)"
                aria-hidden="true"
              >
                In {user?.baseCurrency}
              </dd>
            </div>

            {/* Expense Card */}
            <div className="flex flex-col p-5 bg-(--bg-card) border border-(--line) rounded-xl shadow-xs h-30">
              <dt className="text-[11px] uppercase tracking-wide text-(--ink-muted) font-mono mb-2">
                TOTAL EXPENSE
              </dt>
              <dd className="text-[22px] font-semibold tracking-tight text-red-500">
                <span className="sr-only">Total Expense is </span>
                {formatCurrency(aggregatedStats.totalExpense, user?.baseCurrency)}
              </dd>
              <dd
                className="mt-auto pt-2 text-xs font-normal text-(--ink-muted)"
                aria-hidden="true"
              >
                In {user?.baseCurrency}
              </dd>
            </div>

            {/* Transactions Card */}
            <div className="flex flex-col p-5 bg-(--bg-card) border border-(--line) rounded-xl shadow-xs h-30">
              <dt className="text-[11px] uppercase tracking-wide text-(--ink-muted) font-mono mb-2">
                TRANSACTIONS
              </dt>
              <dd className="text-[22px] font-semibold tracking-tight text-(--ink)">
                <span className="sr-only">Total transactions are </span>
                {category?.stats?.transactionCount || 0}
              </dd>
              <dd
                className="mt-auto pt-2 text-xs font-normal text-(--ink-muted) flex items-center gap-1.5"
                aria-hidden="true"
              >
                Count
              </dd>
            </div>
          </dl>

          <div className="mt-8">
            <TransactionList
              transactions={transactions}
              isLoading={isTransactionsLoading}
              currency={user?.baseCurrency}
              context="category"
              onAddTransaction={() => {
                setTransactionToEdit(null);
                setIsTransactionModalOpen(true);
              }}
              onRowClick={(tx) => {
                setSelectedTransaction(tx);
                setIsTransactionDetailsModalOpen(true);
              }}
            />
          </div>
        </>
      )}

      <CategoryFormModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        category={category}
        onSuccess={() => {
          fetchCategory();
          fetchCategories();
        }}
      />

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Category"
        message={`Are you sure you want to remove "${category?.name}"? This category will be removed from all associated transactions.`}
        confirmText="Delete Category"
        isDestructive={true}
        isLoading={isDeleting}
      />

      <TransactionFormModal
        isOpen={isTransactionModalOpen}
        onClose={() => setIsTransactionModalOpen(false)}
        initialCategoryId={category?.id}
        transactionToEdit={transactionToEdit}
        onSuccess={() => {
          fetchCategory();
          refetchTransactions();
        }}
      />

      {selectedTransaction && (
        <TransactionDetailsModal
          isOpen={isTransactionDetailsModalOpen}
          onClose={() => {
            setIsTransactionDetailsModalOpen(false);
            setSelectedTransaction(null);
          }}
          transaction={selectedTransaction}
          onEdit={(tx) => {
            setTransactionToEdit(tx);
            setIsTransactionDetailsModalOpen(false);
            setIsTransactionModalOpen(true);
          }}
          onDelete={async (txId) => {
            await deleteTransaction(txId);
            fetchCategory();
          }}
        />
      )}
    </article>
  );
};

export default CategoryDetailsPage;
