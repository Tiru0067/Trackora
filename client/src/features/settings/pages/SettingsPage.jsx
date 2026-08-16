import { useState } from "react";
import { User, Shield, AlertTriangle, Monitor } from "lucide-react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useToast } from "@/hooks/useToast";
import FormField from "@/components/ui/FormField";
import ComboBox from "@/components/ui/ComboBox";
import ConfirmModal from "@/components/ui/ConfirmModal";
import { useCurrencies } from "@/features/currencies/hooks/useCurrencies";
import useTheme from "@/hooks/useTheme";

const SettingsPage = () => {
  const { user, updateProfile, changePassword, deleteAccount } = useAuth();
  const { currencies, isLoading: currenciesLoading } = useCurrencies();
  const { addToast } = useToast();
  const { theme, setTheme } = useTheme();

  // Modals
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // States
  const [name, setName] = useState(user?.name || "");
  const [baseCurrency, setBaseCurrency] = useState(user?.baseCurrency || "USD");

  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const currencyOptions = currencies
    ? currencies.map((c) => ({
        label: `${c.code} - ${c.name}`,
        value: c.code,
      }))
    : [];

  const themeOptions = [
    { label: "System Default", value: "system" },
    { label: "Light", value: "light" },
    { label: "Dark", value: "dark" },
  ];

  const handleProfileSave = async () => {
    if (!name.trim()) return addToast("Name cannot be empty", "error");
    
    try {
      await updateProfile({ name, baseCurrency });
      addToast("Preferences updated successfully", "success");
    } catch (error) {
      addToast(error.response?.data?.message || "Failed to update profile", "error");
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      return addToast("New passwords do not match", "error");
    }

    try {
      await changePassword({
        oldPassword: passwordForm.oldPassword,
        newPassword: passwordForm.newPassword,
      });
      addToast("Password changed successfully", "success");
      setPasswordForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error) {
      addToast(error.response?.data?.message || "Failed to change password", "error");
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await deleteAccount();
      // Auth context will handle wiping state, which triggers a redirect to login
    } catch (error) {
      addToast(error.response?.data?.message || "Failed to delete account", "error");
    }
  };

  return (
    <main className="mx-auto max-w-4xl w-full p-4 md:p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-(--ink)">
          Settings
        </h1>
        <p className="mt-2 text-(--ink-muted)">
          Manage your account settings and preferences.
        </p>
      </header>

      {/* Profile Section */}
      <section className="bg-(--bg-card) rounded-2xl border border-(--line) shadow-xs overflow-hidden">
        <div className="p-6 sm:p-8 border-b border-(--line-soft) flex items-center gap-4">
          <div className="p-3 bg-blue-500/10 rounded-xl text-blue-500">
            <User size={24} />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-(--ink)">
              Profile
            </h2>
            <p className="text-sm text-(--ink-muted)">
              Update your personal details.
            </p>
          </div>
        </div>
        <div className="p-6 sm:p-8 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <FormField label="Display Name" htmlFor="name">
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-transparent border border-(--line) rounded-lg px-3 h-10 outline-none focus:border-(--accent) focus:ring-1 focus:ring-(--accent) transition-all text-[14px] text-(--ink)"
              />
            </FormField>
            
            <FormField label="Email Address" htmlFor="email">
              <input
                id="email"
                type="email"
                value={user?.email || ""}
                disabled
                className="w-full bg-(--line-soft)/50 border border-(--line-soft) rounded-lg px-3 h-10 text-[14px] text-(--ink-muted) cursor-not-allowed outline-none"
              />
            </FormField>
          </div>
          <div className="flex justify-end pt-4">
            <button
              onClick={handleProfileSave}
              className="btn btn-primary"
            >
              Save Profile
            </button>
          </div>
        </div>
      </section>

      {/* Preferences Section */}
      <section className="bg-(--bg-card) rounded-2xl border border-(--line) shadow-xs overflow-hidden">
        <div className="p-6 sm:p-8 border-b border-(--line-soft) flex items-center gap-4">
          <div className="p-3 bg-purple-500/10 rounded-xl text-purple-500">
            <Monitor size={24} />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-(--ink)">
              Preferences
            </h2>
            <p className="text-sm text-(--ink-muted)">
              Customize how Trackora looks and feels.
            </p>
          </div>
        </div>
        <div className="p-6 sm:p-8 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="sm:max-w-xs">
              <h3 className="font-medium text-(--ink) mb-1">Theme</h3>
              <p className="text-sm text-(--ink-muted)">
                Switch between light and dark mode.
              </p>
            </div>
            <div className="w-full sm:w-64">
              <ComboBox
                value={theme}
                onChange={(val) => setTheme(val)}
                options={themeOptions}
                placeholder="Select theme"
              />
            </div>
          </div>

          <div className="h-px bg-(--line-soft)" />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="sm:max-w-xs">
              <h3 className="font-medium text-(--ink) mb-1">Base Currency</h3>
              <p className="text-sm text-(--ink-muted)">
                This is the currency used to calculate your total net worth on the dashboard.
              </p>
            </div>
            <div className="w-full sm:w-64">
              <ComboBox
                value={baseCurrency}
                onChange={(val) => setBaseCurrency(val)}
                options={currencyOptions}
                placeholder="Select currency"
                searchPlaceholder="Search currency..."
                isLoading={currenciesLoading}
              />
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-(--line-soft)">
            <button
              onClick={handleProfileSave}
              className="btn btn-primary"
            >
              Save Preferences
            </button>
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section className="bg-(--bg-card) rounded-2xl border border-(--line) shadow-xs overflow-hidden">
        <div className="p-6 sm:p-8 border-b border-(--line-soft) flex items-center gap-4">
          <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-500">
            <Shield size={24} />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-(--ink)">
              Security
            </h2>
            <p className="text-sm text-(--ink-muted)">
              Manage your password and security.
            </p>
          </div>
        </div>
        <form onSubmit={handlePasswordSubmit} className="p-6 sm:p-8 space-y-6">
          <div className="grid grid-cols-1 gap-6 max-w-md">
            <FormField label="Current Password" htmlFor="oldPassword">
              <input
                id="oldPassword"
                type="password"
                required
                value={passwordForm.oldPassword}
                onChange={(e) => setPasswordForm(prev => ({ ...prev, oldPassword: e.target.value }))}
                className="w-full bg-transparent border border-(--line) rounded-lg px-3 h-10 outline-none focus:border-(--accent) focus:ring-1 focus:ring-(--accent) transition-all text-[14px] text-(--ink)"
              />
            </FormField>
            
            <FormField label="New Password" htmlFor="newPassword">
              <input
                id="newPassword"
                type="password"
                required
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                className="w-full bg-transparent border border-(--line) rounded-lg px-3 h-10 outline-none focus:border-(--accent) focus:ring-1 focus:ring-(--accent) transition-all text-[14px] text-(--ink)"
              />
            </FormField>

            <FormField label="Confirm New Password" htmlFor="confirmPassword">
              <input
                id="confirmPassword"
                type="password"
                required
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                className="w-full bg-transparent border border-(--line) rounded-lg px-3 h-10 outline-none focus:border-(--accent) focus:ring-1 focus:ring-(--accent) transition-all text-[14px] text-(--ink)"
              />
            </FormField>
          </div>
          <div className="flex justify-end pt-4">
            <button
              type="submit"
              className="btn btn-primary"
            >
              Update Password
            </button>
          </div>
        </form>
      </section>

      {/* Danger Zone */}
      <section className="bg-red-500/5 rounded-2xl border border-red-500/20 overflow-hidden">
        <div className="p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-red-500/10 rounded-xl text-red-500 shrink-0">
              <AlertTriangle size={24} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-red-600 dark:text-red-400">
                Delete Account
              </h2>
              <p className="text-sm text-red-600/80 dark:text-red-400/80 mt-1 max-w-md">
                Permanently delete your account and all associated data. This action cannot be undone. All your wallets and transactions will be wiped out immediately.
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsDeleteModalOpen(true)}
            className="shrink-0 px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium shadow-sm transition-colors text-sm w-full sm:w-auto"
          >
            Delete Account
          </button>
        </div>
      </section>

      {/* Bottom Spacer */}
      <div className="h-12" />

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteAccount}
        title="Delete Account"
        message="Are you absolutely sure you want to delete your account? All of your wallets, categories, and transactions will be permanently deleted. This action cannot be undone."
        confirmText="Yes, Delete My Account"
        isDestructive={true}
      />
    </main>
  );
};

export default SettingsPage;
