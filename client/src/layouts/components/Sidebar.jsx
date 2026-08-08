import { NavLink } from "react-router-dom";
import {
  motion as Motion,
  AnimatePresence,
  useReducedMotion,
} from "motion/react";

import {
  Wallet,
  LayoutDashboard,
  Folder,
  Settings,
  Menu,
  ChevronsUpDown,
  ArrowLeftRight,
} from "lucide-react";

import { cn } from "@/utils/cn";
import useWindowSize from "@/hooks/useWindowSize";
import Logo from "../../assets/trend-up.svg?react";
import { useAuth } from "@/features/auth/hooks/useAuth";

const navGroups = [
  {
    label: "Workspace",
    items: [
      { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
      { name: "Wallets", path: "/wallets", icon: Wallet },
      { name: "Transactions", path: "/transactions", icon: ArrowLeftRight },
      { name: "Categories", path: "/categories", icon: Folder },
    ],
  },
  {
    label: "Account",
    items: [{ name: "Settings", path: "/settings", icon: Settings }],
  },
];

const BrandMark = () => (
  <NavLink to="/dashboard" className="flex items-center gap-2.5">
    <span className="bg-(--accent) w-6 h-6 flex-center rounded-md">
      <Logo className="size-3.5 text-(--bg-warm)" />
    </span>
    <span className="text-[17px] font-semibold bg-(--accent-ink) bg-clip-text text-transparent">
      Trackora
    </span>
  </NavLink>
);

const NavSections = ({ onNavigate }) => (
  <div className="flex flex-col gap-2">
    {navGroups.map((group) => (
      <div key={group.label}>
        <p className="px-2.5 pt-3.5 pb-1.5 mb-2 text-[10px] font-medium tracking-wide uppercase text-(--ink-muted)">
          {group.label}
        </p>
        <nav aria-label={group.label}>
          <ul className="flex flex-col gap-px text-sm">
            {group.items.map((item) => {
              const Icon = item.icon;

              return (
                <li key={item.name}>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      cn(
                        "flex items-center gap-2.5 px-2.5 py-2.25 rounded-lg text-(--ink-soft) text-sm transition-colors",
                        isActive
                          ? "dark:bg-white/3 bg-white shadow-xs font-medium text-(--ink)"
                          : "hover:bg-white dark:hover:bg-white/3 hover:text-(--ink)",
                      )
                    }
                    onClick={onNavigate}
                  >
                    <Icon size={15} aria-hidden="true" />
                    <span className="text-[13.5px]">{item.name}</span>
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    ))}
  </div>
);

const ProfileRow = ({ user }) => (
  <div className="mt-auto pt-4 relative">
    <div className="w-full h-px bg-(--line-soft) mb-2"></div>
    <button
      type="button"
      className="w-full p-2 rounded-lg flex items-center gap-2 hover:bg-white/4 transition-colors text-left"
    >
      <div className="w-8 h-8 shrink-0 bg-(--accent) text-white rounded-full flex-center font-medium">
        {user.name.charAt(0).toUpperCase()}
      </div>
      <div className="min-w-0 flex-1">
        <span className="text-sm text-(--ink) font-medium truncate capitalize block">
          {user.name}
        </span>
        <span className="text-xs text-(--ink-muted) truncate block">
          {user.email}
        </span>
      </div>
      <ChevronsUpDown
        size={15}
        className="shrink-0 text-(--ink-muted)"
        aria-hidden="true"
      />
    </button>
  </div>
);

const Sidebar = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const shouldReduceMotion = useReducedMotion();
  const transition = shouldReduceMotion
    ? { duration: 0 }
    : { duration: 0.25, ease: "easeInOut" };

  const { user } = useAuth();
  const { width } = useWindowSize();
  const isCompact = width < 1024;

  const onClose = () => setIsSidebarOpen(false);
  const onToggle = () => setIsSidebarOpen((prev) => !prev);

  // Desktop: static full sidebar, always visible
  if (!isCompact) {
    return (
      <aside className="w-64 h-full flex flex-col bg-(--bg-warm) border-r border-(--line-soft) shrink-0">
        <div className="flex flex-col h-full px-4 py-5.5">
          <div className="w-full px-2.5 pt-1.5 pb-5 flex items-center border-b border-(--line-soft) mb-2">
            <BrandMark />
          </div>
          <NavSections />
          <ProfileRow user={user} />
        </div>
      </aside>
    );
  }

  /*
  Compact: The header is part of the normal page flow.
  Expanding the nav panel increases the header's height, 
  pushing the content below it down.
  */
  return (
    <header className="w-full shrink-0 py-4 bg-(--bg-warm) border-b border-(--line-soft)/75">
      <div className="w-full px-6.5 py-1.75 flex items-center justify-between">
        <BrandMark />
        <button
          type="button"
          aria-label={isSidebarOpen ? "Close menu" : "Open menu"}
          aria-expanded={isSidebarOpen}
          aria-controls="mobile-menu"
          onClick={onToggle}
          className="p-2 -mr-2 text-(--ink-soft) hover:bg-(--line-soft) rounded-lg transition-colors"
        >
          <Menu size={20} aria-hidden="true" />
        </button>
      </div>

      <AnimatePresence>
        {isSidebarOpen && (
          <Motion.div
            id="mobile-menu"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={transition}
            className="w-full overflow-hidden bg-(--bg-warm)"
          >
            <div className="h-4 mx-4 border-b border-(--line-soft)" />
            <div className="flex flex-col px-4 pt-4">
              <NavSections onNavigate={onClose} />
              <ProfileRow user={user} />
            </div>
          </Motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Sidebar;
