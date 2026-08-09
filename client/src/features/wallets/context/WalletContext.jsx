import { createContext, useState, useEffect, useCallback } from "react";
import { walletsApi } from "../api/wallets";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useToast } from "@/hooks/useToast";

const WalletContext = createContext(null);

export const WalletProvider = ({ children }) => {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [wallets, setWallets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchWallets = useCallback(async () => {
    if (!user) return;
    try {
      setIsLoading(true);
      setError(null);
      const data = await walletsApi.getAll();
      setWallets(data);
    } catch (err) {
      console.error("Failed to fetch wallets:", err);
      addToast("Failed to load wallets", "error");
      setError("Failed to load wallets");
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchWallets();
  }, [fetchWallets]);

  const createWallet = async (data) => {
    try {
      const newWallet = await walletsApi.create(data);
      setWallets((prev) => [...prev, newWallet]);
      addToast("Wallet created successfully");
      return newWallet;
    } catch (err) {
      console.error("Failed to create wallet:", err);
      addToast("Failed to create wallet", "error");
      throw err;
    }
  };

  const updateWallet = async (id, data) => {
    try {
      const updatedWallet = await walletsApi.update(id, data);
      setWallets((prev) => prev.map((w) => (w.id === id ? updatedWallet : w)));
      addToast("Wallet updated successfully");
      return updatedWallet;
    } catch (err) {
      console.error("Failed to update wallet:", err);
      addToast("Failed to update wallet", "error");
      throw err;
    }
  };

  const deleteWallet = async (id) => {
    try {
      await walletsApi.delete(id);
      setWallets((prev) => prev.filter((w) => w.id !== id));
    } catch (err) {
      console.error("Failed to delete wallet:", err);
      throw err;
    }
  };

  const togglePinWallet = async (id) => {
    const wallet = wallets.find((w) => w.id === id);
    if (!wallet) return;
    const newPinnedAt = wallet.pinnedAt ? null : new Date().toISOString();
    
    const previousWallets = [...wallets];
    setWallets((prev) =>
      prev.map((w) => (w.id === id ? { ...w, pinnedAt: newPinnedAt } : w)),
    );
    
    try {
      await walletsApi.update(id, { pinnedAt: newPinnedAt });
      addToast(newPinnedAt ? "Wallet pinned" : "Wallet unpinned");
    } catch (err) {
      console.error("Failed to pin wallet:", err);
      addToast("Failed to update pin status", "error");
      setWallets(previousWallets);
      throw err;
    }
  };

  const orderedWallets = [...wallets].sort((a, b) => {
    if (a.pinnedAt && !b.pinnedAt) return -1;
    if (!a.pinnedAt && b.pinnedAt) return 1;
    if (a.pinnedAt && b.pinnedAt)
      return new Date(a.pinnedAt) - new Date(b.pinnedAt);
    return 0;
  });

  return (
    <WalletContext.Provider
      value={{
        wallets: orderedWallets,
        isLoading,
        error,
        fetchWallets,
        createWallet,
        updateWallet,
        deleteWallet,
        togglePinWallet,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export default WalletContext;
