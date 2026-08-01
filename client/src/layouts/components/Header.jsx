import { Menu, User2 } from "lucide-react";
import { useLocation } from "react-router-dom";
import ThemeToggle from "@/layouts/components/ThemeToggle";
import { cn } from "@/utils/cn";

const Header = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const location = useLocation();
  const currentPath = location.pathname.split("/")[1]; // Get the first segment of the path

  const buttonStyle =
    "p-3 rounded-full cursor-pointer btn-secondary text-(--text-3)";

  return (
    <header className="w-full shrink-0 h-18 px-7 max-lg:px-6 flex items-center justify-between gap-3">
      <h1 className="text-xl font-semibold text-(--accent-6) truncate">
        {currentPath.charAt(0).toUpperCase() + currentPath.slice(1)}
      </h1>

      {/* Right side */}
      <div className="flex items-center gap-3 lg:gap-6 ml-auto">
        <ThemeToggle buttonStyle={buttonStyle} />

        <div className={buttonStyle}>
          <span className="text-xs font-semibold">
            <User2 size={18} />
          </span>
        </div>

        {/* Menu toggle button for mobile */}
        <button
          type="button"
          className={cn(buttonStyle, "max-lg:block lg:hidden")}
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          <Menu size={18} />
        </button>
      </div>
    </header>
  );
};

export default Header;
