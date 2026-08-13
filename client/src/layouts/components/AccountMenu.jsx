import { useRef, useEffect } from "react";
import { LogOut, Check } from "lucide-react";
import { motion as Motion, AnimatePresence } from "motion/react";
import useTheme from "@/hooks/useTheme";
import { useAuth } from "@/features/auth/hooks/useAuth";

const AccountMenu = ({ isOpen, onClose }) => {
  const { theme, setTheme } = useTheme();
  const { logout } = useAuth();
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        !event.target.closest("#account-menu-toggle")
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  // Auto-focus first item
  useEffect(() => {
    if (!isOpen) return;
    
    const frameId = requestAnimationFrame(() => {
      const buttons = Array.from(menuRef.current?.querySelectorAll("button") || []);
      if (buttons.length > 0) {
        buttons[0].focus();
      }
    });
    
    return () => cancelAnimationFrame(frameId);
  }, [isOpen]);

  // Keyboard navigation & focus trapping
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        event.stopPropagation();
        onClose();
        // Restore focus to trigger
        document.getElementById("account-menu-toggle")?.focus();
        return;
      }

      const buttons = Array.from(menuRef.current?.querySelectorAll("button") || []);
      if (buttons.length === 0) return;

      const firstBtn = buttons[0];
      const lastBtn = buttons[buttons.length - 1];
      const currentIndex = buttons.indexOf(document.activeElement);

      if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        event.preventDefault();
        let nextIndex;
        if (currentIndex === -1) {
          nextIndex = event.key === "ArrowDown" ? 0 : buttons.length - 1;
        } else {
          if (event.key === "ArrowDown") {
            nextIndex = (currentIndex + 1) % buttons.length;
          } else {
            nextIndex = (currentIndex - 1 + buttons.length) % buttons.length;
          }
        }
        buttons[nextIndex]?.focus();
        return;
      }

      if (event.key === "Tab") {
        if (event.shiftKey && document.activeElement === firstBtn) {
          event.preventDefault();
          lastBtn.focus();
        } else if (!event.shiftKey && (document.activeElement === lastBtn || currentIndex === -1)) {
          event.preventDefault();
          firstBtn.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown, true);
    return () => document.removeEventListener("keydown", handleKeyDown, true);
  }, [isOpen, onClose]);

  const themes = [
    { label: "System", value: "system" },
    { label: "Light", value: "light" },
    { label: "Dark", value: "dark" },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <Motion.div
          ref={menuRef}
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.95 }}
          transition={{ duration: 0.15 }}
          className="absolute bottom-full left-0 right-0 mb-2 p-2 rounded-2xl bg-(--bg-card) border border-(--line) shadow-xl flex flex-col gap-1 z-50 origin-bottom"
        >
          {/* Theme Section */}
          <div className="px-2 pt-2 pb-1">
            <span className="text-[10px] font-semibold text-(--ink-muted) tracking-wider uppercase">
              Theme
            </span>
          </div>
          <div className="flex flex-col">
            {themes.map((t) => (
              <button
                key={t.value}
                type="button"
                className="w-full flex items-center justify-between px-2 py-1.5 text-sm text-(--ink) hover:bg-black/5 dark:hover:bg-white/5 rounded-lg transition-colors text-left"
                onClick={() => {
                  setTheme(t.value);
                  // Don't close on theme change to let them test
                }}
              >
                <span>{t.label}</span>
                {theme === t.value && (
                  <Check size={14} className="text-green-500" />
                )}
              </button>
            ))}
          </div>

          <div className="h-px bg-(--line-soft) my-1 mx-2" />

          {/* Logout Section */}
          <button
            type="button"
            className="w-full flex items-center gap-2.5 px-2 py-2 text-sm text-(--ink) hover:bg-red-500/10 hover:text-red-500 rounded-lg transition-colors text-left mt-1"
            onClick={() => {
              onClose();
              logout();
            }}
          >
            <LogOut size={15} />
            <span>Log out</span>
          </button>
        </Motion.div>
      )}
    </AnimatePresence>
  );
};

export default AccountMenu;
