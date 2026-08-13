import { motion as Motion, AnimatePresence } from "motion/react";
import Backdrop from "./Backdrop";
import { X } from "lucide-react";
import { useEffect, useRef } from "react";

const getFocusableElements = (element) => {
  if (!element) return [];
  return Array.from(
    element.querySelectorAll(
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )
  ).filter(
    (el) =>
      !el.hasAttribute("hidden") &&
      el.getAttribute("aria-hidden") !== "true" &&
      el.offsetParent !== null
  );
};

const Modal = ({ isOpen, onClose, title, children, hideHeader = false }) => {
  const modalRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      
      // Auto focus first element
      const frameId = requestAnimationFrame(() => {
        const focusableElements = getFocusableElements(modalRef.current);
        if (focusableElements.length > 0) {
          focusableElements[0].focus();
        } else {
          modalRef.current?.focus();
        }
      });
      return () => cancelAnimationFrame(frameId);
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isOpen]);

  // Keyboard Navigation (Escape & Tab trapping)
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        event.stopPropagation();
        onClose();
        return;
      }

      if (event.key !== "Tab") return;

      const focusableElements = getFocusableElements(modalRef.current);
      if (focusableElements.length === 0) {
        event.preventDefault();
        modalRef.current?.focus();
        return;
      }

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      const currentIndex = focusableElements.indexOf(document.activeElement);

      if (event.shiftKey && (document.activeElement === firstElement || currentIndex === -1)) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && (document.activeElement === lastElement || currentIndex === -1)) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown, true);
    return () => document.removeEventListener("keydown", handleKeyDown, true);
  }, [isOpen, onClose]);

  // Cleanup overflow on unmount
  useEffect(() => {
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <Backdrop onClose={onClose} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <Motion.div
              ref={modalRef}
              tabIndex={-1}
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-md bg-(--bg-card) border border-(--line-soft) rounded-2xl shadow-xl pointer-events-auto flex flex-col max-h-[90dvh] focus:outline-none"
              role="dialog"
              aria-modal="true"
              aria-labelledby={title ? "modal-title" : undefined}
            >
              {!hideHeader && (
                <div className="flex items-center justify-between px-5 py-4 border-b border-(--line-soft)">
                  <h2 id="modal-title" className="text-lg font-semibold text-(--ink)">{title}</h2>
                  <button
                    type="button"
                    onClick={onClose}
                    className="p-1.5 text-(--ink-soft) hover:text-(--ink) hover:bg-(--line-soft) rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black dark:focus-visible:ring-white"
                    aria-label="Close modal"
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
