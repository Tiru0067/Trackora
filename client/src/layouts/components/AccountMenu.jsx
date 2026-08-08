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
        !event.target.closest('#account-menu-toggle')
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
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
                className="w-full flex items-center justify-between px-2 py-1.5 text-sm text-(--ink) hover:bg-white/5 rounded-lg transition-colors text-left"
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
