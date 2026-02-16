import { motion as Motion, useReducedMotion } from "motion/react";
import { NavLink } from "react-router-dom";
import useIsMobile from "../../hooks/useIsMobile";
import { useEffect, useRef } from "react";
import {
  Wallet,
  LayoutDashboard,
  Folder,
  Settings,
  PanelLeftClose,
  PiggyBank,
} from "lucide-react";

const Sidebar = ({ showMenu, setShowMenu }) => {
  const sidebarRef = useRef(null);
  const shouldReduceMotion = useReducedMotion();
  const transition = shouldReduceMotion ? { duration: 0 } : { duration: 0.25 };

  const isMobile = useIsMobile(1024);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setShowMenu]);

  const menuItems = [
    {
      name: "Dashboard",
      icon: <LayoutDashboard size={18} />,
    },
    {
      name: "Wallets",
      icon: <Wallet size={18} />,
    },
    {
      name: "Categories",
      icon: <Folder size={18} />,
    },
    {
      name: "Settings",
      icon: <Settings size={18} />,
    },
  ];

  return (
    <Motion.aside
      className="min-w-62 max-lg:z-100 max-lg:h-full bg-neutral-50 dark:bg-neutral-900 max-lg:absolute"
      ref={sidebarRef}
      initial={false}
      animate={
        isMobile
          ? showMenu
            ? { opacity: 1, x: 0 }
            : { opacity: 0, x: -250 }
          : { opacity: 1, x: 0 }
      }
      transition={transition}
    >
      {/* title */}
      <div className="w-full h-18 px-5 flex items-center">
        <div className="flex items-center">
          <div className="w-fit p-2">
            <PiggyBank size={32} className="text-emerald-800" />
          </div>
          <h1 className="text-xl font-bold bg-linear-to-r from-emerald-800 via-emerald-600 to-emerald-400 bg-clip-text text-transparent">
            Trackora
          </h1>
        </div>
        <button
          type="button"
          className="hidden max-lg:block ml-auto bg-neutral-200 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-400 p-3 rounded-full"
          onClick={() => setShowMenu(false)}
        >
          <PanelLeftClose size={18} />
        </button>
      </div>

      {/* menu */}
      <nav className="p-5">
        <ul className="flex flex-col gap-1 text-sm">
          {menuItems.map((item) => (
            <li key={item.name}>
              <NavLink
                to={`/${item.name.toLowerCase()}`}
                className={({
                  isActive,
                }) => `flex items-center gap-3 px-3 py-2 rounded-sm font-medium
                    ${isActive ? "bg-emerald-500/20 text-emerald-800 dark:text-emerald-500 dark:bg-emerald-500/20" : "hover:bg-emerald-500/10 text-neutral-500"}`}
                onClick={() => setShowMenu(false)}
              >
                {item.icon}
                {item.name}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </Motion.aside>
  );
};

export default Sidebar;
