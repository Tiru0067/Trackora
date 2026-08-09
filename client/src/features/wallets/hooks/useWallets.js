import { use } from "react";
import WalletContext from "../context/WalletContext";

export const useWallets = () => {
  const context = use(WalletContext);
  if (!context) {
    throw new Error("useWallets must be used within a WalletProvider");
  }
  return context;
};
