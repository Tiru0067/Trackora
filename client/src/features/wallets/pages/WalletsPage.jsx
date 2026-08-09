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

  if (isLoading) {
    return <div className="p-4 text-(--ink-soft)">Loading wallets...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

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
        {wallets.length > 0 && (
          <button
            type="button"
            onClick={handleCreate}
            className="inline-flex items-center gap-1.5 bg-(--ink)/90 text-(--bg) px-3.5 py-2.5 rounded-xl text-sm font-medium hover:bg-(--ink)/80 transition-all shadow-sm"
          >
            <Plus size={16} />
            <span>New Wallet</span>
          </button>
        )}
      </header>

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

      <WalletFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        wallet={selectedWallet}
      />
    </div>
  );
};

export default WalletsPage;
