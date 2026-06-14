import { useState } from "react";
import { Outlet } from "react-router-dom";

import Sidebar from "@/layouts/components/Sidebar";
import Header from "@/layouts/components/Header";

const AppLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="w-full min-w-[320px] min-h-dvh bg-(--surface-0) sm:h-dvh sm:overflow-hidden flex relative">
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />
      <div className="w-full flex flex-col min-w-0">
        <Header
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />
        <main className="px-4 sm:px-6 py-3 flex-1 min-h-0 overflow-y-auto hide-scrollbar">
          <div className="max-w-screen-2xl mx-auto w-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
