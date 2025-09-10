import { useState } from "react";
import { Outlet, useNavigate } from "react-router";
import DashboardSidebar from "@/components/layout/DashboardSidebar";
import DashboardHeader from "@/components/layout/DashboardHeader";
import { useAuth } from "@/hooks/useAuth";
import { useMyProfile } from "@/hooks/useUsers";
import { FullPageLoader } from "@/components/ui/loading-states";
import { toast } from "sonner";

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { loading: authLoading, logOut } = useAuth();
  const { data: me, isLoading: roleIsLoading } = useMyProfile();
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Create a logout handler to pass to the sidebar
  const handleLogout = async () => {
    try {
      await logOut();
      toast.success("Logged out successfully");
      navigate("/");
    } catch (error) {
      toast.error("Failed to log out");
      console.error("Logout error:", error);
    }
  };

  // Show loading state if either auth or role is still loading
  if (authLoading || roleIsLoading) {
    return <FullPageLoader />;
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Pass actual user role and logout handler to sidebar */}
      <DashboardSidebar
        role={me?.role}
        isMobileOpen={sidebarOpen}
        onMobileToggle={toggleSidebar}
        handleLogout={handleLogout}
      />

      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <DashboardHeader onMenuToggle={toggleSidebar} />

        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-6 bg-gradient-to-br from-background to-muted/20">
          <div className="max-w-7xl mx-auto w-full animate-fade-in">
            <Outlet />
          </div>
        </main>

        {/* Footer */}
        <footer className="py-3 px-6 border-t border-border/50 bg-background/80 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center text-xs text-muted-foreground">
            <div className="mb-2 sm:mb-0">
              © {new Date().getFullYear()} EduTrack. All rights reserved.
            </div>
            <div className="flex items-center space-x-4">
              <span>Version 1.0.0</span>
              <span>•</span>
              <span>Secure Connection</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default DashboardLayout;
