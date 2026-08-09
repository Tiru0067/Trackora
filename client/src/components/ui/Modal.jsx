import { motion as Motion, AnimatePresence } from "motion/react";
import Backdrop from "./Backdrop";
import { X } from "lucide-react";
import { useEffect } from "react";

const Modal = ({ isOpen, onClose, title, children, hideHeader = false }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <Backdrop onClose={onClose} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <Motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-md bg-(--bg-card) border border-(--line-soft) rounded-2xl shadow-xl pointer-events-auto flex flex-col max-h-[90dvh]"
            >
              {!hideHeader && (
                <div className="flex items-center justify-between px-5 py-4 border-b border-(--line-soft)">
                  <h2 className="text-lg font-semibold text-(--ink)">{title}</h2>
                  <button
                    type="button"
                    onClick={onClose}
                    className="p-1.5 text-(--ink-soft) hover:text-(--ink) hover:bg-(--line-soft) rounded-lg transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>
              )}
              <div className="p-5 overflow-y-auto">
                {children}
              </div>
            </Motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Modal;
