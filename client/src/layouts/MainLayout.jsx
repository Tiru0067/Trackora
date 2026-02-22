import { useState } from "react";
import { Outlet } from "react-router-dom";
import Backdrop from "../components/common/Backdrop";
import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";

const MainLayout = () => {
  const [showMenu, setShowMenu] = useState(false);

  const isBackdropVisible = showMenu;
  const backdropClass = showMenu ? "lg:hidden" : "";

  return (
    <div className="w-full min-w-[320px] min-h-screen bg-white dark:bg-neutral-950 sm:max-h-dvh sm:overflow-hidden flex relative">
      {isBackdropVisible && <Backdrop className={backdropClass} />}
      <Sidebar showMenu={showMenu} setShowMenu={setShowMenu} />
      <main className="w-full flex flex-col">
        <Header showMenu={showMenu} setShowMenu={setShowMenu} />
        <div className="px-6 py-3 flex-1 min-h-0 overflow-y-auto hide-scrollbar">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
