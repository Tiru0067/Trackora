import Modal from "./Modal";
import { AlertCircle, Check } from "lucide-react";
import { BsExclamation } from "react-icons/bs";

const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  isDestructive = false,
  isLoading = false,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} hideHeader={true}>
      <div className="flex flex-col text-left">
        {/* Icon Header */}
        <div className="mb-5 flex">
          {/* Outer Ring */}
          <div
            className={`flex items-center justify-center p-2 rounded-full border ${
              isDestructive
                ? "bg-red-500/10 border-red-500/5"
                : "bg-emerald-500/10 border-emerald-500/5"
            }`}
          >
            {/* Inner Ring */}
            <div
              className={`flex items-center justify-center p-2 rounded-full border ${
                isDestructive
                  ? "bg-red-500/10 border-red-500/5"
                  : "bg-emerald-500/10 border-emerald-500/5"
              }`}
            >
              {/* Solid Center */}
              <div
                className={`flex items-center justify-center w-6 h-6 rounded-full text-white ${
                  isDestructive ? "bg-red-500" : "bg-emerald-500"
                }`}
              >
                {isDestructive ? (
                  <BsExclamation size={18} />
                ) : (
                  <Check size={16} strokeWidth={3} />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <h3 className="text-lg font-bold text-(--ink) mb-2">{title}</h3>
        <p className="text-sm font-medium text-(--ink-soft) leading-relaxed">
          {message}
        </p>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 mt-6">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-semibold text-(--ink) bg-transparent border border-(--line) hover:bg-(--line-soft) rounded-lg transition-colors disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={`px-4 py-2 text-sm font-semibold text-white rounded-lg transition-colors disabled:opacity-50 ${
              isDestructive
                ? "bg-red-500 hover:bg-red-600"
                : "bg-orange-500 hover:bg-orange-600"
            }`}
          >
            {isLoading ? "Please wait..." : confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmModal;
