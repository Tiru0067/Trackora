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
  PiggyBank,
  ArrowLeftRight,
} from "lucide-react";

import { cn } from "@/utils/cn";
import useWindowSize from "@/hooks/useWindowSize";
import Backdrop from "@/components/ui/Backdrop";

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
        className="h-full w-65 max-lg:z-100 max-lg:h-full bg-(--surface-1) max-lg:absolute border-r border-(--border-1) dark:border-(--border-0)"
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
        <div className="w-full h-18 px-5 flex items-center">
          <NavLink to="/dashboard" className="flex items-center">
            <PiggyBank
              size={32}
              className="text-(--accent-6)"
              aria-hidden="true"
            />
            <span className="text-xl font-bold bg-linear-to-r from-(--accent-6) via-(--accent-5) to-(--accent-4) bg-clip-text text-transparent">
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
        <nav aria-label="Primary navigation" className="px-6 py-2.5">
          <ul className="flex flex-col gap-1 text-sm">
            {navItems.map((item) => {
              const Icon = item.icon;

              return (
                <li key={item.name}>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      cn(
                        "flex items-center gap-3 px-4 py-2.5 rounded-lg font-medium text-(--text-2)",
                        isActive
                          ? "bg-(--accent-6) text-white"
                          : "hover:bg-(--accent-2) hover:text-(--text-3)/85",
                      )
                    }
                    onClick={() => setIsSidebarOpen(false)}
                  >
                    <Icon size={18} aria-hidden="true" />
                    <span>{item.name}</span>
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
