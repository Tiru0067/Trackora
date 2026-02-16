import { useState } from "react";
import { Outlet } from "react-router-dom";
import Overlay from "../components/layout/Overlay";
import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";

const MainLayout = () => {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="w-full min-w-[320px] min-h-dvh sm:max-h-dvh sm:overflow-hidden flex bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-200 relative">
      {showMenu && <Overlay />}
      <Sidebar showMenu={showMenu} setShowMenu={setShowMenu} />
      <main className="w-full flex flex-col">
        <Header showMenu={showMenu} setShowMenu={setShowMenu} />
        <div className="px-6 py-3 flex-1 min-h-0">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
