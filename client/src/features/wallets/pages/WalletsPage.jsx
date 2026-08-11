import { useState, useMemo } from "react";
import { Plus } from "lucide-react";
import { motion as Motion, AnimatePresence, LayoutGroup } from "motion/react";
import { Wallet, SearchX } from "lucide-react";
import { useWallets } from "../hooks/useWallets";
import WalletFormModal from "../components/WalletFormModal";
import WalletStats from "../components/WalletStats";
import WalletToolbar from "../components/WalletToolbar";
import WalletCard from "../components/WalletCard";
import EmptyState from "@/components/ui/EmptyState";
import Skeleton from "@/components/ui/Skeleton";
import { getWalletSummary } from "../utils/walletCalculation";

const WalletsPage = () => {
  const { wallets, togglePinWallet, isLoading, error } = useWallets();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("default");
  const [filterCurrency, setFilterCurrency] = useState("All");

  const [isSortMenuOpen, setIsSortMenuOpen] = useState(false);
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);

  const totalWalletsCount = wallets.length;

  const balancesByCurrency = useMemo(() => {
    const totals = {};
    wallets.forEach((w) => {
      const { totalBalance } = getWalletSummary(w, []);
      totals[w.currency] = (totals[w.currency] || 0) + totalBalance;
    });
    return totals;
  }, [wallets]);

  const uniqueCurrenciesCount = Object.keys(balancesByCurrency).length;

  const filteredAndSortedWallets = useMemo(() => {
    let result = [...wallets];

    if (searchQuery) {
      result = result.filter((w) =>
        w.name.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    if (filterCurrency !== "All") {
      result = result.filter((w) => w.currency === filterCurrency);
    }

    if (sortBy !== "default") {
      result.sort((a, b) => {
        // Keep pinned above unpinned
        if (a.pinnedAt && !b.pinnedAt) return -1;
        if (!a.pinnedAt && b.pinnedAt) return 1;

        // Sort within the same group
        if (sortBy === "highToLow") {
          return (
            getWalletSummary(b, []).totalBalance -
            getWalletSummary(a, []).totalBalance
          );
        } else if (sortBy === "lowToHigh") {
          return (
            getWalletSummary(a, []).totalBalance -
            getWalletSummary(b, []).totalBalance
          );
        } else if (sortBy === "aToZ") {
          return a.name.localeCompare(b.name);
        } else if (sortBy === "zToA") {
          return b.name.localeCompare(a.name);
        }
        return 0;
      });
    }

    return result;
  }, [wallets, searchQuery, filterCurrency, sortBy]);

  const handleCreate = () => {
    setSelectedWallet(null);
    setIsModalOpen(true);
  };

  const handleEdit = (wallet) => {
    setSelectedWallet(wallet);
    setIsModalOpen(true);
  };

  return (
    <div>
      <header className="page-header lg:flex-row lg:justify-between gap-3 lg:items-end items-start">
        <div>
          <span className="page-section">Wallets</span>
          <h1 className="page-title">Manage Wallets</h1>
          <p className="page-subtitle">
            View and manage your different accounts and cash reserves
          </p>
        </div>
        {!isLoading && wallets.length > 0 && (
          <button
            type="button"
            onClick={handleCreate}
            className="inline-flex items-center gap-1.5 h-9 bg-(--ink) text-(--bg) px-3.5 rounded-[9px] text-[13px] font-medium hover:bg-(--ink)/80 transition-all shadow-sm"
          >
            <Plus size={16} />
            <span>New Wallet</span>
          </button>
        )}
      </header>

      {isLoading ? (
        <div className="w-full">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <Skeleton className="h-22.5 flex-1" />
            <Skeleton className="h-22.5 flex-1" />
            <Skeleton className="h-22.5 flex-1 hidden sm:block" />
          </div>
          <div className="flex justify-between mb-4">
            <Skeleton className="h-9 w-64" />
            <Skeleton className="h-9 w-24" />
          </div>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] lg:grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-3 pt-4">
            <Skeleton className="h-35 w-full" />
            <Skeleton className="h-35 w-full" />
            <Skeleton className="h-35 w-full" />
            <Skeleton className="h-35 w-full hidden sm:block" />
            <Skeleton className="h-35 w-full hidden lg:block" />
            <Skeleton className="h-35 w-full hidden lg:block" />
          </div>
        </div>
      ) : error ? (
        <div className="p-4 text-red-500">{error}</div>
      ) : (
        <>
          {wallets.length > 0 && (
            <>
              <WalletStats
                totalWalletsCount={totalWalletsCount}
                balancesByCurrency={balancesByCurrency}
                uniqueCurrenciesCount={uniqueCurrenciesCount}
              />

              <WalletToolbar
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                sortBy={sortBy}
                setSortBy={setSortBy}
                filterCurrency={filterCurrency}
                setFilterCurrency={setFilterCurrency}
                balancesByCurrency={balancesByCurrency}
                isSortMenuOpen={isSortMenuOpen}
                setIsSortMenuOpen={setIsSortMenuOpen}
                isFilterMenuOpen={isFilterMenuOpen}
                setIsFilterMenuOpen={setIsFilterMenuOpen}
              />
            </>
          )}

          <LayoutGroup>
            <Motion.ul
              role="list"
              layout
              className="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] lg:grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-3 pt-4"
            >
              <AnimatePresence mode="popLayout">
                {wallets.length === 0 ? (
                  <EmptyState
                    key="empty-wallets"
                    icon={Wallet}
                    title="No wallets yet"
                    description="Create your first wallet to start tracking your balances and transactions."
                    actionLabel="Create Wallet"
                    onAction={handleCreate}
                  />
                ) : filteredAndSortedWallets.length === 0 ? (
                  <EmptyState
                    key="empty-search"
                    icon={SearchX}
                    title="No wallets found"
                    description="We couldn't find any wallets matching your search or filter criteria."
                  />
                ) : (
                  filteredAndSortedWallets.map((wallet) => (
                    <WalletCard
                      key={wallet.id}
                      wallet={wallet}
                      togglePinWallet={togglePinWallet}
                      handleEdit={handleEdit}
                    />
                  ))
                )}
              </AnimatePresence>
            </Motion.ul>
          </LayoutGroup>
        </>
      )}

      <WalletFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        wallet={selectedWallet}
      />
    </div>
  );
};

export default WalletsPage;
