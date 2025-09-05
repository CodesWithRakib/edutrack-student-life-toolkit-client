import { useState } from "react";
import { Outlet } from "react-router";
import DashboardSidebar from "@/components/layout/DashboardSidebar";
import DashboardHeader from "@/components/layout/DashboardHeader";

import { useAuth } from "@/hooks/useAuth";
import { useMyProfile } from "@/hooks/useUsers";

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { loading: authLoading } = useAuth();
  const { data: me, isLoading: roleIsLoading } = useMyProfile();

  console.log(me);
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Show loading state if either auth or role is still loading
  if (authLoading || roleIsLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
      {/* Pass actual user role instead of hardcoded value */}
      <DashboardSidebar
        role={me?.role}
        isMobileOpen={sidebarOpen}
        onMobileToggle={toggleSidebar}
      />
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <DashboardHeader onMenuToggle={toggleSidebar} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-6">
          <div className="max-w-7xl mx-auto w-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
