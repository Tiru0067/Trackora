import { useState, useEffect, useMemo } from "react";
import Modal from "@/components/ui/Modal";
import FormField from "@/components/ui/FormField";
import ComboBox from "@/components/ui/ComboBox";
import { useWallets } from "../../wallets/hooks/useWallets";
import { useCategories } from "../../categories/hooks/useCategories";
import { cn } from "@/utils/cn";
import { motion as Motion } from "motion/react";
import { getCurrencySymbol } from "@/utils/currency";

const TransactionFormModal = ({
  isOpen,
  onClose,
  initialWalletId = null,
  transactionToEdit = null,
  onSuccess,
}) => {
  const { wallets } = useWallets();
  const { categories } = useCategories();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [type, setType] = useState("EXPENSE");
  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    date: new Date().toISOString().split("T")[0],
    note: "",
    walletId: "",
    fromWalletId: "",
    toWalletId: "",
    categoryId: "",
  });

  // Options for ComboBox components
  const walletOptions = useMemo(() => {
    return wallets.map((w) => ({
      label: w.name,
      value: w.id,
    }));
  }, [wallets]);

  const categoryOptions = useMemo(() => {
    return categories.map((c) => ({
      label: c.name,
      value: c.id,
    }));
  }, [categories]);

  useEffect(() => {
    if (isOpen) {
      // eslint-disable-next-line
      setError("");
      
      if (transactionToEdit) {
        setType(transactionToEdit.type);
        
        let initialFormData = {
          title: transactionToEdit.title,
          date: new Date(transactionToEdit.date).toISOString().split("T")[0],
          note: transactionToEdit.note || "",
          walletId: transactionToEdit.wallet?.id || "",
          categoryId: transactionToEdit.category?.id || "",
          amount: transactionToEdit.amount,
          fromWalletId: "",
          toWalletId: "",
          destinationAmount: "",
        };

        if (transactionToEdit.type === "TRANSFER") {
          const isTransferIn = transactionToEdit.transferDirection === "IN";
          
          const fromWallet = isTransferIn
            ? (transactionToEdit.linkedTransfer?.wallet || transactionToEdit.transferLeg?.wallet)
            : transactionToEdit.wallet;
            
          const toWallet = isTransferIn
            ? transactionToEdit.wallet
            : (transactionToEdit.linkedTransfer?.wallet || transactionToEdit.transferLeg?.wallet);

          const outAmount = isTransferIn
            ? (transactionToEdit.linkedTransfer?.amount || transactionToEdit.transferLeg?.amount || transactionToEdit.amount)
            : transactionToEdit.amount;

          const inAmount = isTransferIn
            ? transactionToEdit.amount
            : (transactionToEdit.linkedTransfer?.amount || transactionToEdit.transferLeg?.amount || transactionToEdit.amount);

          initialFormData.fromWalletId = fromWallet?.id || "";
          initialFormData.toWalletId = toWallet?.id || "";
          initialFormData.amount = outAmount;
          initialFormData.destinationAmount = (fromWallet?.currency !== toWallet?.currency) ? inAmount : "";
          initialFormData.walletId = "";
        }
        
        setFormData(initialFormData);
      } else {
        setFormData({
          title: "",
          amount: "",
          destinationAmount: "",
          date: new Date().toISOString().split("T")[0],
          note: "",
          walletId: initialWalletId || (wallets.length > 0 ? wallets[0].id : ""),
          fromWalletId:
            initialWalletId || (wallets.length > 0 ? wallets[0].id : ""),
          toWalletId: "",
          categoryId: "",
        });
        setType("EXPENSE");
      }
    }
  }, [isOpen, initialWalletId, wallets, transactionToEdit]);

  const fromWallet = useMemo(
    () =>
      wallets.find(
        (w) =>
          w.id ===
          (type === "TRANSFER" ? formData.fromWalletId : formData.walletId),
      ),
    [wallets, formData.fromWalletId, formData.walletId, type],
  );

  const toWallet = useMemo(
    () => wallets.find((w) => w.id === formData.toWalletId),
    [wallets, formData.toWalletId],
  );

  const isCrossCurrency =
    fromWallet && toWallet && fromWallet.currency !== toWallet.currency;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTypeChange = (newType) => {
    setType(newType);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      // get current time and add it to the date object so transactions sort properly
      const dateObj = new Date(formData.date);
      const now = new Date();
      dateObj.setHours(now.getHours(), now.getMinutes(), now.getSeconds());

      const payload = {
        type,
        amount: Number(formData.amount),
        date: dateObj.toISOString(),
        title: formData.title,
        note: formData.note || null,
      };

      if (type === "TRANSFER") {
        payload.fromWalletId = formData.fromWalletId;
        payload.toWalletId = formData.toWalletId;
        if (formData.destinationAmount) {
          payload.destinationAmount = Number(formData.destinationAmount);
        }
      } else {
        payload.walletId = formData.walletId;
        payload.categoryId = formData.categoryId || null;
      }

      // import api directly here because useTransactions hook doesn't have a create function
      const { transactionsApi } = await import("../api/transactions");
      
      if (transactionToEdit) {
        await transactionsApi.update(transactionToEdit.id, payload);
      } else {
        await transactionsApi.create(payload);
      }

      onClose();

      if (onSuccess) onSuccess();
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "An error occurred",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={transactionToEdit ? "Edit Transaction" : "New Transaction"}>
      <Motion.form
        layout
        onSubmit={handleSubmit}
        className="flex flex-col gap-5"
      >
        {error && (
          <div className="p-3 text-sm text-red-500 bg-red-500/10 rounded-lg">
            {error}
          </div>
        )}

        {/* Type Selector */}
        <Motion.fieldset
          layout
          className="relative flex p-1 bg-(--line-soft) rounded-lg gap-1 border-0 m-0"
          role="radiogroup"
          aria-labelledby="transaction-type-label"
        >
          <legend id="transaction-type-label" className="sr-only">
            Transaction Type
          </legend>
          {["EXPENSE", "INCOME", "TRANSFER"].map((t) => (
            <button
              key={t}
              type="button"
              role="radio"
              aria-checked={type === t}
              onClick={() => handleTypeChange(t)}
              className={cn(
                "relative flex-1 py-1.5 text-[13px] font-medium rounded-md transition-colors z-10",
                type === t
                  ? "text-(--ink)"
                  : "text-(--ink-muted) hover:text-(--ink-soft)",
              )}
            >
              {type === t && (
                <Motion.div
                  layoutId="activeTabIndicator"
                  className="absolute inset-0 bg-(--bg-card) rounded-md shadow-xs -z-10"
                  transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
                />
              )}
              <span className="relative z-10">
                {t.charAt(0) + t.slice(1).toLowerCase()}
              </span>
            </button>
          ))}
        </Motion.fieldset>

        {/* Dynamic Selectors */}
        <Motion.div layout className="grid grid-cols-2 gap-3">
          {type === "TRANSFER" ? (
            <>
              <FormField label="From Wallet" id="fromWalletId">
                <ComboBox
                  options={walletOptions}
                  id="fromWalletId"
                  name="fromWalletId"
                  className={cn(
                    "w-full",
                    initialWalletId &&
                      "pointer-events-none opacity-60 bg-black/5",
                  )}
                  value={formData.fromWalletId}
                  onChange={(val) =>
                    setFormData((prev) => ({ ...prev, fromWalletId: val }))
                  }
                />
              </FormField>
              <FormField label="To Wallet" id="toWalletId">
                <ComboBox
                  options={walletOptions}
                  id="toWalletId"
                  name="toWalletId"
                  className="w-full"
                  value={formData.toWalletId}
                  onChange={(val) =>
                    setFormData((prev) => ({ ...prev, toWalletId: val }))
                  }
                />
              </FormField>
            </>
          ) : (
            <>
              <FormField label="Wallet" id="walletId">
                <ComboBox
                  options={walletOptions}
                  id="walletId"
                  name="walletId"
                  className={cn(
                    "w-full",
                    initialWalletId &&
                      "pointer-events-none opacity-60 bg-black/5",
                  )}
                  value={formData.walletId}
                  onChange={(val) =>
                    setFormData((prev) => ({ ...prev, walletId: val }))
                  }
                />
              </FormField>
              <FormField label="Category" id="categoryId">
                <ComboBox
                  searchable
                  options={categoryOptions}
                  id="categoryId"
                  name="categoryId"
                  className="w-full"
                  searchPlaceholder="Optional"
                  value={formData.categoryId}
                  onChange={(val) =>
                    setFormData((prev) => ({ ...prev, categoryId: val }))
                  }
                />
              </FormField>
            </>
          )}
        </Motion.div>

        {/* Amount(s) */}
        <Motion.div layout>
          {type === "TRANSFER" ? (
            <div className="grid grid-cols-2 gap-3">
              <FormField label="Amount" id="txAmount">
                <div
                  className={cn(
                    "flex items-center form-input focus-within:ring-1 focus-within:ring-(--accent) bg-transparent border border-(--line) rounded-lg px-3 overflow-hidden",
                    formData.amount === ""
                      ? "text-(--ink-muted)/75 focus-within:text-(--ink)"
                      : "text-(--ink)",
                  )}
                >
                  <span className="font-medium whitespace-nowrap h-10 flex items-center mt-0.5">
                    {getCurrencySymbol(fromWallet?.currency)}
                  </span>
                  <input
                    type="text"
                    inputMode="decimal"
                    id="txAmount"
                    name="amount"
                    placeholder="0.00"
                    className="outline-none flex-1 bg-transparent h-10 text-(--ink) placeholder-(--ink-muted)/75"
                    value={formData.amount}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === "" || /^\d*\.?\d*$/.test(value)) {
                        handleChange(e);
                      }
                    }}
                    required
                  />
                </div>
              </FormField>
              <FormField label="Amount" id="txDestinationAmount">
                <div
                  className={cn(
                    "flex items-center form-input focus-within:ring-1 focus-within:ring-(--accent) bg-transparent border border-(--line) rounded-lg px-3 overflow-hidden",
                    formData.destinationAmount === ""
                      ? "text-(--ink-muted)/75 focus-within:text-(--ink)"
                      : "text-(--ink)",
                  )}
                >
                  <span className="font-medium whitespace-nowrap h-10 flex items-center mt-0.5">
                    {getCurrencySymbol(toWallet?.currency)}
                  </span>
                  <input
                    type="text"
                    inputMode="decimal"
                    id="txDestinationAmount"
                    name="destinationAmount"
                    placeholder="0.00"
                    className="outline-none flex-1 bg-transparent h-10 text-(--ink)"
                    value={formData.destinationAmount || ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === "" || /^\d*\.?\d*$/.test(value)) {
                        handleChange(e);
                      }
                    }}
                    required={isCrossCurrency}
                  />
                </div>
              </FormField>
            </div>
          ) : (
            <FormField label="Amount" id="txAmount">
              <div
                className={cn(
                  "flex items-center form-input focus-within:ring-1 focus-within:ring-(--accent) bg-transparent border border-(--line) rounded-lg px-3 overflow-hidden",
                  formData.amount === ""
                    ? "text-(--ink-muted)/75 focus-within:text-(--ink)"
                    : "text-(--ink)",
                )}
              >
                <span className="font-medium whitespace-nowrap h-10 flex items-center mt-0.5">
                  {getCurrencySymbol(fromWallet?.currency)}
                </span>

                <input
                  type="text"
                  inputMode="decimal"
                  id="txAmount"
                  name="amount"
                  placeholder="0.00"
                  className="outline-none flex-1 bg-transparent h-10 text-(--ink)"
                  value={formData.amount}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === "" || /^\d*\.?\d*$/.test(value)) {
                      handleChange(e);
                    }
                  }}
                  required
                />
              </div>
            </FormField>
          )}
        </Motion.div>

        {/* Date & Title */}
        <Motion.div layout className="grid grid-cols-[1fr_2fr] gap-3">
          <FormField label="Date" id="txDate">
            <input
              type="date"
              id="txDate"
              name="date"
              className="w-full bg-transparent border border-(--line) rounded-lg px-3 h-10 outline-none focus:border-(--accent) focus:ring-1 focus:ring-(--accent) transition-all text-[13.5px] text-(--ink)"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </FormField>
          <FormField label="Title" id="txTitle">
            <input
              type="text"
              id="txTitle"
              name="title"
              placeholder="e.g. Groceries"
              className="w-full bg-transparent border border-(--line) rounded-lg px-3 h-10 outline-none focus:border-(--accent) focus:ring-1 focus:ring-(--accent) transition-all text-[13.5px] text-(--ink)"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </FormField>
        </Motion.div>

        {/* Note */}
        <Motion.div layout>
          <FormField label="Note (Optional)" id="txNote">
            <textarea
              id="txNote"
              name="note"
              rows={2}
              placeholder="Any extra details..."
              className="w-full bg-transparent border border-(--line) rounded-lg px-3 py-2 outline-none focus:border-(--accent) focus:ring-1 focus:ring-(--accent) transition-all resize-none text-[13.5px] text-(--ink)"
              value={formData.note}
              onChange={handleChange}
            />
          </FormField>
        </Motion.div>

        {/* Actions */}
        <Motion.div
          layout
          className="flex justify-end gap-2 mt-4 border-t border-(--line-soft) pt-4"
        >
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
            {isSubmitting ? "Saving..." : (transactionToEdit ? "Save Changes" : "Add Transaction")}
          </button>
        </Motion.div>
      </Motion.form>
    </Modal>
  );
};

export default TransactionFormModal;
