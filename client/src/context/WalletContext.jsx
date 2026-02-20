import { createContext, useState } from "react";

const WalletContext = createContext();

const initalWallets = [
  {
    id: 1,
    name: "Personal",
    initialBalance: 12500,
    currency: "INR",
    primary: true,
    pinned: false,
  },
  {
    id: 2,
    name: "Savings",
    initialBalance: 85000,
    currency: "INR",
    primary: false,
    pinned: false,
  },
  {
    id: 3,
    name: "Freelance",
    initialBalance: 3200,
    currency: "USD",
    primary: false,
    pinned: false,
  },
  {
    id: 4,
    name: "Emergency Fund",
    initialBalance: 50000,
    currency: "INR",
    primary: false,
    pinned: true,
  },
  {
    id: 5,
    name: "Travel Fund",
    initialBalance: 1500,
    currency: "USD",
    primary: false,
    pinned: false,
  },
  {
    id: 6,
    name: "Business Account",
    initialBalance: 27000,
    currency: "PHP",
    primary: false,
    pinned: true,
  },
];

export const WalletProvider = ({ children }) => {
  const [wallets, setWallets] = useState(initalWallets);
  // const [loading, setLoading] = useState(false);
  // const [error, setError] = useState(null);
  const [selectedWalletId, setSelectedWalletId] = useState(null);

  // Add a new wallet
  const addWallet = (wallet) => {
    setWallets((prev) => [...prev, wallet]);
  };

  // Update a wallet by ID
  const updateWallet = (id, updatedWallet) => {
    setWallets((prev) =>
      prev.map((wallet) =>
        wallet.id === id ? { ...wallet, ...updatedWallet } : wallet,
      ),
    );
  };

  // Delete a wallet by ID
  const deleteWallet = (id) => {
    setWallets((prev) => prev.filter((wallet) => wallet.id !== id));
  };

  // Set a wallet as primary (only one can be primary at a time)
  const setPrimaryWallet = (id) => {
    setWallets((prev) =>
      prev.map((wallet) => ({
        ...wallet,
        primary: wallet.id === id,
      })),
    );
  };

  // Toggle pin/unpin wallet
  const togglePinWallet = (id) => {
    setWallets((prev) =>
      prev.map((wallet) =>
        wallet.id === id ? { ...wallet, pinned: !wallet.pinned } : wallet,
      ),
    );
  };

  // Ensure primary wallet is always first, then pinned wallets, then the rest
  const orderedWallets = [...wallets].sort((a, b) => {
    if (a.primary) return -1;
    if (b.primary) return 1;

    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;

    return 0;
  });

  return (
    <WalletContext.Provider
      value={{
        wallets: orderedWallets,
        selectedWalletId,
        setSelectedWalletId,
        addWallet,
        updateWallet,
        deleteWallet,
        setPrimaryWallet,
        togglePinWallet,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export default WalletContext;
