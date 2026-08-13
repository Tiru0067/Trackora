import { useState, useEffect, useMemo } from "react";
import Modal from "@/components/ui/Modal";
import FormField from "@/components/ui/FormField";
import ComboBox from "@/components/ui/ComboBox";
import SymbolPicker from "@/components/ui/SymbolPicker";
import ColorPicker from "@/components/ui/ColorPicker";
import { useWallets } from "../hooks/useWallets";
import { useCurrencies } from "@/features/currencies/hooks/useCurrencies";
import { cn } from "@/utils/cn";

const WalletFormModal = ({ isOpen, onClose, wallet = null }) => {
  const { createWallet, updateWallet } = useWallets();
  const { currencies } = useCurrencies();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    currency: "INR",
    initialBalance: "",
    color: "#3B82F6",
    icon: { set: "phosphor", name: "Wallet" },
  });

  const currencyList = useMemo(() => {
    return currencies.map((currency) => ({
      label: currency.code,
      value: currency.code,
      name: currency.name,
    }));
  }, [currencies]);

  useEffect(() => {
    if (isOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setError("");
    }

    if (wallet && isOpen) {
      setFormData({
        name: wallet.name,
        currency: wallet.currency,
        initialBalance: String(wallet.initialBalance),
        color: wallet.color,
        icon:
          wallet.icon.type === "icon"
            ? { set: wallet.icon.pack, name: wallet.icon.value }
            : { set: "emojis", name: wallet.icon.value },
      });
    } else if (isOpen) {
      setFormData({
        name: "",
        currency: "INR",
        initialBalance: "",
        color: "#3B82F6",
        icon: { set: "phosphor", name: "Wallet" },
      });
    }
  }, [wallet, isOpen, currencyList]);

  const handleChange = (event) => {
    const { name, type, value, checked } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const payload = {
        name: formData.name,
        initialBalance: Number(formData.initialBalance) || 0,
        color: formData.color,
        icon:
          formData.icon.set === "phosphor"
            ? { type: "icon", value: formData.icon.name, pack: "phosphor" }
            : { type: "emoji", value: formData.icon.name },
      };

      if (wallet) {
        await updateWallet(wallet.id, payload);
      } else {
        payload.currency = formData.currency;
        await createWallet(payload);
      }
      onClose();
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "An error occurred",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={wallet ? "Edit Wallet" : "Create New Wallet"}
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {error && (
          <div className="p-3 text-sm text-red-500 bg-red-500/10 rounded-lg">
            {error}
          </div>
        )}

        {/* Wallet Name & Pickers */}
        <FormField label="Name" id="walletName">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex form-input focus-within:ring-1 focus-within:ring-(--accent) p-0 bg-transparent border border-(--line) rounded-lg flex-1 overflow-hidden">
                <SymbolPicker
                  value={formData.icon}
                  onChange={(icon) =>
                    setFormData((prev) => ({ ...prev, icon }))
                  }
                  color={formData.color}
                  showLabel={false}
                  className="w-10 h-10 shrink-0 p-0 flex items-center justify-center rounded-none border-r border-(--line-soft)"
                />
                <input
                  type="text"
                  id="walletName"
                  name="name"
                  placeholder="Wallet name"
                  className="outline-none flex-1 bg-transparent px-3 text-(--ink)"
                  maxLength={32}
                  autoComplete="off"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <ColorPicker
                value={formData.color}
                onChange={(color) =>
                  setFormData((prev) => ({ ...prev, color }))
                }
                className="shrink-0 w-10 h-10 p-0 flex items-center justify-center border border-(--line) rounded-lg"
                placement="bottom-end"
              />
            </div>
            <p className="text-xs text-(--ink-muted) mt-1">
              Set a name, icon, and accent color for your wallet
            </p>
          </div>
        </FormField>

        {/* Currency & Balance */}
        <FormField label="Initial Balance" id="walletBalance">
          <div className="grid grid-cols-3 focus-within:ring-1 focus-within:ring-(--accent) border border-(--line) rounded-lg overflow-hidden bg-transparent">
            <ComboBox
              searchable
              options={currencyList}
              id="walletCurrency"
              name="currency"
              className={cn(
                "focus:ring-0 border-0 bg-black/5 dark:bg-white/5 rounded-none h-10 border-r border-(--line)",
                wallet && "pointer-events-none opacity-60",
              )}
              value={formData.currency}
              onChange={(optionValue) =>
                setFormData((prev) => ({ ...prev, currency: optionValue }))
              }
            />

            <input
              type="text"
              inputMode="decimal"
              id="walletBalance"
              name="initialBalance"
              placeholder="0"
              className="focus:ring-0 border-0 col-span-2 px-3 h-10 bg-transparent text-(--ink) outline-none"
              value={formData.initialBalance}
              onChange={(event) => {
                const value = event.target.value;
                if (value === "" || /^-?\d*\.?\d*$/.test(value)) {
                  handleChange(event);
                }
              }}
            />
          </div>
          <p className="text-xs text-(--ink-muted) mt-1">
            Choose your currency and set the opening balance
          </p>
        </FormField>

        {/* Actions */}
        <div className="flex justify-end gap-2 mt-4 border-t border-(--line-soft) pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-(--ink-soft) hover:text-(--ink) transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 text-sm font-medium text-white bg-(--accent) rounded-full hover:bg-(--accent)/90 transition-colors disabled:opacity-50"
          >
            {isSubmitting
              ? "Saving..."
              : wallet
                ? "Update Wallet"
                : "Add wallet"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default WalletFormModal;
