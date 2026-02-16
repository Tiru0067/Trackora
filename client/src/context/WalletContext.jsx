import { createContext, useState } from "react";

const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
  const [wallets, setWallets] = useState([
    { id: 1, name: "Personal", balance: 12500, currency: "INR" },
    { id: 2, name: "Savings", balance: 85000, currency: "INR" },
    { id: 3, name: "Freelance", balance: 3200, currency: "USD" },
    { id: 4, name: "Emergency Fund", balance: 50000, currency: "INR" },
    { id: 5, name: "Travel Fund", balance: 1500, currency: "USD" },
    { id: 6, name: "Business Account", balance: 27000, currency: "PHP" },
  ]);

  const addWallet = (wallet) => {
    setWallets((prev) => [...prev, wallet]);
  };

  const updateWallet = (id, updatedWallet) => {
    setWallets((prev) =>
      prev.map((wallet) =>
        wallet.id === id ? { ...wallet, ...updatedWallet } : wallet,
      ),
    );
  };

  const deleteWallet = (id) => {
    setWallets((prev) => prev.filter((wallet) => wallet.id !== id));
  };

  return (
    <WalletContext.Provider
      value={{ wallets, addWallet, updateWallet, deleteWallet }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export default WalletContext;
