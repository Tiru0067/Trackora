import Modal from "@/components/ui/Modal";
import { formatCurrency } from "@/utils/currency";
import { format } from "date-fns";
import {
  Trash2,
  Edit2,
  X,
  ArrowRightLeft,
  ArrowDownLeft,
  ArrowUpRight,
  ArrowRight,
} from "lucide-react";
import * as PhosphorIcons from "@phosphor-icons/react";
import { useState, useEffect } from "react";
import ConfirmModal from "@/components/ui/ConfirmModal";
import { cn } from "@/utils/cn";

const TransactionDetailsModal = ({
  isOpen,
  onClose,
  transaction,
  onDelete,
  onEdit,
}) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Reset internal state if the modal is fully closed by the parent
  useEffect(() => {
    if (!isOpen) {
      //eslint-disable-next-line
      setIsDeleteModalOpen(false);
      setIsDeleting(false);
    }
  }, [isOpen]);

  if (!transaction) return null;

  const isIncome =
    transaction.type === "INCOME" ||
    (transaction.type === "TRANSFER" && transaction.transferDirection === "IN");
  const isExpense =
    transaction.type === "EXPENSE" ||
    (transaction.type === "TRANSFER" &&
      transaction.transferDirection === "OUT");

  const amountColor = isIncome
    ? "text-emerald-500"
    : isExpense
      ? "text-red-500"
      : "text-(--ink)";
  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      if (onDelete) await onDelete(transaction.id);
      setIsDeleteModalOpen(false);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsDeleting(false);
    }
  };

  // Resolve Icon
  let IconElement = null;
  if (transaction.type === "TRANSFER") {
    IconElement = (
      <ArrowRightLeft
        size={24}
        strokeWidth={1.5}
        className="text-(--ink-soft)"
      />
    );
  } else if (transaction.category?.icon) {
    const iconObj = transaction.category.icon;
    if (iconObj.set === "emojis") {
      IconElement = (
        <span className="text-2xl leading-none">{iconObj.name}</span>
      );
    } else if (iconObj.set === "phosphor" && PhosphorIcons[iconObj.name]) {
      const PhosphorIcon = PhosphorIcons[iconObj.name];
      IconElement = (
        <PhosphorIcon
          size={24}
          weight="regular"
          className="text-(--ink-soft)"
          style={
            transaction.category.color
              ? { color: transaction.category.color }
              : {}
          }
        />
      );
    }
  }

  if (!IconElement) {
    IconElement = isIncome ? (
      <ArrowDownLeft size={24} strokeWidth={1.5} className="text-emerald-500" />
    ) : (
      <ArrowUpRight size={24} strokeWidth={1.5} className="text-red-500" />
    );
  }

  // Handle Transfer details correctly based on direction
  const isTransferIn = transaction.type === "TRANSFER" && transaction.transferDirection === "IN";
  
  const fromWallet = isTransferIn
    ? (transaction.linkedTransfer?.wallet || transaction.transferLeg?.wallet)
    : transaction.wallet;
    
  const toWallet = isTransferIn
    ? transaction.wallet
    : (transaction.linkedTransfer?.wallet || transaction.transferLeg?.wallet);

  const outAmount = isTransferIn
    ? (transaction.linkedTransfer?.amount || transaction.transferLeg?.amount || transaction.amount)
    : transaction.amount;

  const inAmount = isTransferIn
    ? transaction.amount
    : (transaction.linkedTransfer?.amount || transaction.transferLeg?.amount || transaction.amount);

  return (
    <>
      <Modal
        isOpen={isOpen && !isDeleteModalOpen}
        onClose={onClose}
        hideHeader={true}
      >
        <div className="relative p-2 flex flex-col">
          {/* Custom Close Button */}
          <button
            onClick={onClose}
            className="absolute top-2 right-2 p-1.5 text-(--ink-muted) hover:text-(--ink) hover:bg-(--line-soft) rounded-lg transition-colors"
            aria-label="Close"
          >
            <X size={18} />
          </button>

          {/* Top Left Floating Icon */}
          <div
            className={cn(
              "w-12 h-12 rounded-full flex items-center justify-center mb-5",
              !transaction.category?.color &&
                (isIncome
                  ? "bg-emerald-500/10"
                  : isExpense
                    ? "bg-red-500/10"
                    : "bg-(--line-soft)"),
            )}
            style={
              transaction.category?.color
                ? { backgroundColor: `${transaction.category.color}15` }
                : {}
            }
          >
            {IconElement}
          </div>

          {/* Title & Date Subtitle */}
          <div className="mb-6 text-left">
            <h3 className="text-[22px] font-bold text-(--ink) mb-1 tracking-tight leading-tight">
              {transaction.title}
            </h3>
            <p className="text-[14px] text-(--ink-muted) font-medium flex items-center gap-1.5">
              <span>
                {transaction.type === "TRANSFER"
                  ? "Transfer"
                  : transaction.category?.name || "Uncategorized"}
              </span>
              <span>•</span>
              <span>{format(new Date(transaction.date), "MMM d")}</span>
            </p>
          </div>

          {/* Large Amount Display */}
          <div className="mb-6 w-full text-left">
            {transaction.type === "TRANSFER" ? (
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center text-[12px] text-(--ink-muted) font-medium">
                  <span className="w-24 truncate">
                    {fromWallet?.name}
                  </span>
                  <span className="w-6 shrink-0"></span>
                  <span className="truncate">
                    {toWallet?.name}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[26px] font-bold tracking-tight text-(--ink)">
                    {formatCurrency(outAmount, fromWallet?.currency)}
                  </span>
                  <ArrowRight
                    size={18}
                    className="text-(--ink-muted) shrink-0"
                  />
                  <span className="text-[26px] font-bold tracking-tight text-(--ink)">
                    {formatCurrency(
                      inAmount,
                      toWallet?.currency,
                    )}
                  </span>
                </div>
              </div>
            ) : (
              <span
                className={cn(
                  "text-[32px] font-bold tracking-tight",
                  amountColor,
                )}
              >
                {isIncome ? "+" : isExpense ? "-" : ""}
                {formatCurrency(
                  transaction.amount,
                  transaction.wallet?.currency,
                )}
              </span>
            )}
          </div>

          {/* Divider */}
          <hr className="border-t border-(--line) mb-6" />

          {/* Details List */}
          <div className="w-full flex flex-col gap-4 mb-6">
            <div className="flex justify-between items-center text-[14px]">
              <span className="text-(--ink-muted)">Type</span>
              <span className="font-medium text-(--ink) capitalize">
                {transaction.type.toLowerCase()}
              </span>
            </div>

            {transaction.type === "TRANSFER" ? (
              <>
                <div className="flex justify-between items-center text-[14px]">
                  <span className="text-(--ink-muted)">From wallet</span>
                  <span className="font-medium text-(--ink) flex items-center gap-1.5">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: fromWallet?.color }}
                    />
                    {fromWallet?.name}
                  </span>
                </div>
                <div className="flex justify-between items-center text-[14px]">
                  <span className="text-(--ink-muted)">To wallet</span>
                  <span className="font-medium text-(--ink) flex items-center gap-1.5">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{
                        backgroundColor: toWallet?.color,
                      }}
                    />
                    {toWallet?.name}
                  </span>
                </div>
              </>
            ) : (
              <>
                <div className="flex justify-between items-center text-[14px]">
                  <span className="text-(--ink-muted)">Wallet</span>
                  <span className="font-medium text-(--ink) flex items-center gap-1.5">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: transaction.wallet?.color }}
                    />
                    {transaction.wallet?.name}
                  </span>
                </div>
                <div className="flex justify-between items-center text-[14px]">
                  <span className="text-(--ink-muted)">Category</span>
                  <span className="font-medium text-(--ink) flex items-center gap-1.5">
                    {transaction.category?.color && (
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: transaction.category.color }}
                      />
                    )}
                    {transaction.category?.name || "Uncategorized"}
                  </span>
                </div>
              </>
            )}

            <div className="flex justify-between items-center text-[14px]">
              <span className="text-(--ink-muted)">Date</span>
              <span className="font-medium text-(--ink)">
                {format(new Date(transaction.date), "MMM d, yyyy 'at' h:mm a")}
              </span>
            </div>
          </div>

          {/* Note Box */}
          {transaction.note && (
            <div className="w-full mb-6">
              <p className="text-[13px] font-medium text-(--ink-muted) mb-2">
                Note
              </p>
              <div className="w-full bg-(--line-soft)/40 rounded-xl p-4 text-[13.5px] text-(--ink) leading-relaxed">
                {transaction.note}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="w-full grid grid-cols-2 gap-3 mt-2">
            <button
              onClick={() => onEdit?.(transaction)}
              className="py-2.5 rounded-xl flex items-center justify-center gap-2 text-[14px] font-semibold text-(--ink) border border-(--line) hover:bg-(--line-soft) transition-colors"
            >
              <Edit2 size={16} /> Edit
            </button>
            <button
              onClick={() => setIsDeleteModalOpen(true)}
              className="py-2.5 rounded-xl flex items-center justify-center gap-2 text-[14px] font-semibold text-red-500 bg-red-500/10 hover:bg-red-500/15 border border-transparent shadow-sm transition-all"
            >
              <Trash2 size={16} /> Delete
            </button>
          </div>
        </div>
      </Modal>

      <ConfirmModal
        isOpen={isOpen && isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Delete Transaction"
        message={`Are you sure you want to delete this transaction? This action cannot be undone.`}
        confirmText="Delete Transaction"
        isDestructive={true}
        isLoading={isDeleting}
      />
    </>
  );
};

export default TransactionDetailsModal;
