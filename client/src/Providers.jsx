import { ThemeProvider } from "@/context/ThemeContext";
import { AuthProvider } from "@/features/auth/context/AuthContext";
import { ToastProvider } from "./context/ToastContext";
import { WalletProvider } from "@/features/wallets/context/WalletContext";
import { CategoryProvider } from "@/features/categories/context/CategoryContext";

const Providers = ({ children }) => {
  return (
    <ToastProvider>
      <AuthProvider>
        <WalletProvider>
          <CategoryProvider>
            <ThemeProvider>{children}</ThemeProvider>
          </CategoryProvider>
        </WalletProvider>
      </AuthProvider>
    </ToastProvider>
  );
};

export default Providers;
