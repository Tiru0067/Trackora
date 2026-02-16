import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import MainLayout from "./layouts/MainLayout";
import { ThemeProvider } from "./context/ThemeContext";
import Dashboard from "./pages/Dashboard";
import { WalletProvider } from "./context/WalletContext";
import { TransactionsProvider } from "./context/TransactionsContext";
import { CategoryProvider } from "./context/CategoryContext";
import { SettingsProvider } from "./context/SettingsContext";
import Wallets from "./pages/Wallets";
import Categories from "./pages/Categories";
import Settings from "./pages/Settings";

const App = () => {
  return (
    <WalletProvider>
      <TransactionsProvider>
        <CategoryProvider>
          <SettingsProvider>
            <ThemeProvider>
              <Routes>
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route element={<MainLayout />}>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/wallets" element={<Wallets />} />
                  <Route path="/categories" element={<Categories />} />
                  <Route path="/settings" element={<Settings />} />
                </Route>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
              </Routes>
            </ThemeProvider>
          </SettingsProvider>
        </CategoryProvider>
      </TransactionsProvider>
    </WalletProvider>
  );
};

export default App;
