import { ThemeProvider } from "@/context/ThemeContext";
import { AuthProvider } from "@/features/auth/context/AuthContext";
import { ToastProvider } from "./context/ToastContext";
import { WalletProvider } from "@/features/wallets/context/WalletContext";

const Providers = ({ children }) => {
  return (
    <ToastProvider>
      <AuthProvider>
        <WalletProvider>
          <ThemeProvider>{children}</ThemeProvider>
        </WalletProvider>
      </AuthProvider>
    </ToastProvider>
  );
};

export default Providers;
