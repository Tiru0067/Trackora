import { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";

import Sidebar from "@/layouts/components/Sidebar";
import useWindowSize from "@/hooks/useWindowSize";

const AppLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const { width } = useWindowSize();
  const isCompact = width < 1024;

  // Auto-close sidebar on navigation
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional reset on route change
    setIsSidebarOpen(false);
  }, [location.pathname]);

  // Auto-close sidebar when switching to compact mode
  useEffect(() => {
    if (isCompact) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional reset on route change
      setIsSidebarOpen(false);
    }
  }, [isCompact]);

  return (
    <div className="w-full min-w-[320px] min-h-dvh bg-(--bg) flex flex-col lg:flex-row lg:h-dvh lg:overflow-hidden relative">
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />

      <div className="w-full flex flex-col min-w-0 flex-1 lg:h-full">
        <main className="px-4 sm:px-6 py-6 flex-1 lg:min-h-0 lg:overflow-y-auto hide-scrollbar">
          <div className="max-w-7xl mx-auto w-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
