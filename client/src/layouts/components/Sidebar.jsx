import { useRef } from "react";
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
  PanelLeftClose,
  ArrowLeftRight,
} from "lucide-react";

import { cn } from "@/utils/cn";
import useWindowSize from "@/hooks/useWindowSize";
import Backdrop from "@/components/ui/Backdrop";
import Logo from "../../assets/trend-up.svg?react";

const navItems = [
  {
    name: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Wallets",
    path: "/wallets",
    icon: Wallet,
  },
  {
    name: "Transactions",
    path: "/transactions",
    icon: ArrowLeftRight,
  },
  {
    name: "Categories",
    path: "/categories",
    icon: Folder,
  },
  {
    name: "Settings",
    path: "/settings",
    icon: Settings,
  },
];

const Sidebar = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const sidebarRef = useRef(null);
  const shouldReduceMotion = useReducedMotion();
  const transition = shouldReduceMotion ? { duration: 0 } : { duration: 0.25 };

  const { width } = useWindowSize();
  const isCompact = width < 1024;

  const onClose = () => {
    if (isCompact) {
      setIsSidebarOpen(false);
    }
  };

  return (
    <div>
      <AnimatePresence>
        {isCompact && isSidebarOpen && <Backdrop onClose={onClose} />}
      </AnimatePresence>
      <Motion.aside
        className="h-full w-60 px-4 py-5.5 flex flex-col gap-2 max-lg:z-100 max-lg:h-full bg-(--bg-warm) max-lg:absolute border-r border-black/2 dark:border-white/5"
        ref={sidebarRef}
        initial={false}
        animate={
          isCompact
            ? isSidebarOpen
              ? { opacity: 1, x: 0 }
              : { opacity: 0, x: -300 }
            : { opacity: 1, x: 0 }
        }
        transition={transition}
      >
        {/* title */}
        <div className="w-full px-2.5 pt-1.5 pb-5 flex items-center border-b border-(--line-soft)">
          <NavLink to="/dashboard" className="flex items-center gap-2.5">
            <span className="bg-(--accent) w-6 h-6 flex-center rounded-md">
              <Logo className="size-3.5 text-(--bg-warm)" />
            </span>
            <span className="text-[17px] font-semibold bg-(--accent-ink) bg-clip-text text-transparent">
              Trackora
            </span>
          </NavLink>
          <button
            type="button"
            aria-label="Close sidebar"
            className="hidden max-lg:block ml-auto btn-secondary text-(--text-3) p-3 rounded-full"
            onClick={onClose}
          >
            <PanelLeftClose size={18} aria-hidden="true" />
          </button>
        </div>

        {/* menu */}
        <nav aria-label="Primary navigation" className="mt-3">
          <ul className="flex flex-col gap-px text-sm">
            {navItems.map((item) => {
              const Icon = item.icon;

              return (
                <li key={item.name}>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      cn(
                        "flex items-center gap-2.5 px-2.5 py-2.25 rounded-lg text-(--ink-soft) text-sm",
                        isActive
                          ? "dark:bg-white/2 bg-white shadow-xs font-medium text-(--ink)"
                          : "hover:bg-white dark:hover:bg-white/2 hover:text-(--ink)",
                      )
                    }
                    onClick={() => setIsSidebarOpen(false)}
                  >
                    <Icon size={15} aria-hidden="true" />
                    <span className="text-[13.5px]">{item.name}</span>
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>
      </Motion.aside>
    </div>
  );
};

export default Sidebar;
