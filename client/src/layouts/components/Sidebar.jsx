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
import { useAuth } from "@/features/auth/hooks/useAuth";

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

  const { user } = useAuth();

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
            className="hidden max-lg:block ml-auto btn-secondary text-(--ink-soft) p-3 rounded-full"
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
                          ? "dark:bg-white/3 bg-white shadow-xs font-medium text-(--ink)"
                          : "hover:bg-white dark:hover:bg-white/3 hover:text-(--ink)",
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

        <div className="mt-auto">
          <div className="w-full h-px bg-(--line-soft) mb-2"></div>
          <button
            // aria-haspopup="true"
            // aria-expanded="false"
            className="w-full p-2 rounded-lg flex items-center gap-2 hover:bg-white/4 truncate"
          >
            <div className="w-8 h-8 shrink-0 bg-(--accent) rounded-full flex-center">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="">
              <div className="flex items-center gap-1">
                <span className="text-sm text-(--ink) capitalize">
                  {user.name}
                </span>
                <span title="Verified account" aria-label="Verified account">
                  <svg
                    viewBox="0 0 22 22"
                    width="14"
                    height="14"
                    aria-hidden="true"
                  >
                    <path
                      d="M20.396 11c-.018-.646-.215-1.275-.57-1.816-.354-.54-.852-.972-1.438-1.246.223-.607.27-1.264.14-1.897-.131-.634-.437-1.218-.882-1.687-.47-.445-1.053-.75-1.687-.882-.633-.13-1.29-.083-1.897.14-.273-.587-.704-1.086-1.245-1.44S11.647 1.62 11 1.604c-.646.017-1.273.213-1.813.568s-.969.854-1.24 1.44c-.608-.223-1.267-.272-1.902-.14-.635.13-1.22.436-1.69.882-.445.47-.749 1.055-.878 1.688-.13.633-.08 1.29.144 1.896-.587.274-1.087.705-1.443 1.245-.356.54-.555 1.17-.574 1.817.02.647.218 1.276.574 1.817.356.54.856.972 1.443 1.245-.224.606-.274 1.263-.144 1.896.13.634.433 1.218.877 1.688.47.443 1.054.747 1.687.878.633.132 1.29.084 1.897-.136.274.586.705 1.084 1.246 1.439.54.354 1.17.551 1.816.569.647-.016 1.276-.213 1.817-.567s.972-.854 1.245-1.44c.604.239 1.266.296 1.903.164.636-.132 1.22-.447 1.68-.907.46-.46.776-1.044.908-1.681s.075-1.299-.165-1.903c.586-.274 1.084-.705 1.439-1.246.354-.54.551-1.17.569-1.816zM9.662 14.85l-3.429-3.428 1.293-1.302 2.072 2.072 4.4-4.794 1.347 1.246z"
                      fill="#1d9bf0"
                    ></path>
                  </svg>
                </span>
              </div>
              <div className="text-xs text-(--ink-muted) max-w-38 truncate">
                {user.email}
              </div>
            </div>
          </button>
        </div>
      </Motion.aside>
    </div>
  );
};

export default Sidebar;
