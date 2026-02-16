import { Menu, User2 } from "lucide-react";
import { useLocation } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";

const Header = ({ showMenu, setShowMenu }) => {
  const location = useLocation();
  const currentPath = location.pathname.split("/")[1]; // Get the first segment of the path

  const buttonStyle =
    "p-3 rounded-full cursor-pointer bg-neutral-100 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-800";

  return (
    <header className="w-full shrink-0 h-18 px-7 max-lg:px-6 flex items-center justify-between">
      <h1 className="text-xl font-semibold text-emerald-700">
        {currentPath.charAt(0).toUpperCase() + currentPath.slice(1)}
      </h1>

      {/* Right side */}
      <div className="flex items-center gap-3 lg:gap-6 ml-auto">
        <ThemeToggle buttonStyle={buttonStyle} />

        <div className={`${buttonStyle}`}>
          <span className="text-xs font-bold">
            <User2 size={18} />
          </span>
        </div>

        {/* Menu toggle button for mobile */}
        <button
          type="button"
          className={`${buttonStyle} max-lg:block lg:hidden`}
          onClick={() => setShowMenu(!showMenu)}
        >
          <Menu size={18} />
        </button>
      </div>
    </header>
  );
};

export default Header;
