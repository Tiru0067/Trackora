import { ThemeProvider } from "@/context/ThemeContext";
import { AuthProvider } from "@/features/auth/context/AuthContext";
import { ToastProvider } from "./context/ToastContext";

const Providers = ({ children }) => {
  return (
    <ToastProvider>
      <AuthProvider>
        <ThemeProvider>{children}</ThemeProvider>
      </AuthProvider>
    </ToastProvider>
  );
};

export default Providers;
