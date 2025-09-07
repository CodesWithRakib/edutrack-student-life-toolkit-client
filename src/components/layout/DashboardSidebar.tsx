import { useState } from "react";
import { NavLink, useLocation } from "react-router";
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  DollarSign,
  BookOpen,
  ClipboardList,
  BarChart3,
  Edit,
  Users,
  FileCode,
  Settings,
  LayoutDashboard,
  User as UserIcon,
  GraduationCap,
  BookOpenCheck,
  X,
  BadgeQuestionMark,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ModeToggle } from "@/components/mode-toggle";

interface DashboardSidebarProps {
  role?: string;
  isMobileOpen?: boolean;
  onMobileToggle?: () => void;
}

const DashboardSidebar = ({
  role = "student",
  isMobileOpen = false,
  onMobileToggle,
}: DashboardSidebarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  const getLinksForRole = () => {
    switch (role) {
      case "student":
        return [
          { path: "/dashboard", name: "Dashboard", icon: LayoutDashboard },
          {
            path: "/dashboard/student/schedule",
            name: "Class Schedule",
            icon: Calendar,
          },
          {
            path: "/dashboard/student/budget",
            name: "Budget Tracker",
            icon: DollarSign,
          },
          {
            path: "/dashboard/student/planner",
            name: "Study Planner",
            icon: BookOpen,
          },
          {
            path: "/dashboard/student/exam-generator",
            name: "Exam Generator",
            icon: BadgeQuestionMark,
          },
          {
            path: "/dashboard/student/qa",
            name: "Exam Q&A",
            icon: ClipboardList,
          },
          {
            path: "/dashboard/student/performance",
            name: "Performance",
            icon: BarChart3,
          },
        ];
      case "teacher":
        return [
          { path: "/dashboard", name: "Dashboard", icon: LayoutDashboard },
          {
            path: "/dashboard/teacher/qa-manage",
            name: "Q&A Management",
            icon: Edit,
          },
          {
            path: "/dashboard/teacher/assignments",
            name: "Assignments",
            icon: BookOpenCheck,
          },
        ];
      case "admin":
        return [
          { path: "/dashboard", name: "Dashboard", icon: LayoutDashboard },
          {
            path: "/dashboard/admin/users",
            name: "Users",
            icon: Users,
          },
          {
            path: "/dashboard/admin/content",
            name: "Content",
            icon: FileCode,
          },
          {
            path: "/dashboard/admin/analytics",
            name: "Analytics",
            icon: BarChart3,
          },
          {
            path: "/dashboard/admin/settings",
            name: "Settings",
            icon: Settings,
          },
        ];
      default:
        return [];
    }
  };

  const links = getLinksForRole();

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleLinkClick = () => {
    if (onMobileToggle && window.innerWidth < 1024) {
      onMobileToggle();
    }
  };

  return (
    <>
      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onMobileToggle}
        />
      )}

      <div
        className={cn(
          "fixed lg:relative h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-all duration-300 ease-in-out flex flex-col z-50",
          isCollapsed ? "w-16" : "min-w-[200px] max-w-[280px]",
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
        style={{ width: isCollapsed ? "4rem" : "75vw", maxWidth: "280px" }}
      >
        {/* Toggle Button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute -right-3 top-6 z-10 h-8 w-8 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-md hover:shadow-lg transition-transform hover:scale-105 hidden lg:flex"
          onClick={toggleSidebar}
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>

        {/* Close button for mobile */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-2 z-10 h-8 w-8 rounded-full lg:hidden"
          onClick={onMobileToggle}
        >
          <X className="h-4 w-4" />
        </Button>

        {/* Logo Section */}
        <div className="p-4">
          <NavLink
            to="/"
            className={cn(
              "flex items-center transition-transform hover:scale-105",
              isCollapsed ? "justify-center" : "justify-start space-x-2"
            )}
            onClick={handleLinkClick}
          >
            <div className="p-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 flex-shrink-0">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            {!isCollapsed && (
              <span className="text-xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                EduTrack
              </span>
            )}
          </NavLink>
        </div>

        <Separator className="mb-4" />

        {/* Sidebar Content */}
        <div className="flex flex-col h-full px-4 pb-4 flex-1 overflow-hidden">
          {/* User Role & Theme Toggle */}
          <div
            className={cn(
              "flex items-center mb-6 p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 transition-all",
              isCollapsed ? "justify-center" : "justify-between"
            )}
          >
            {!isCollapsed ? (
              <div className="flex items-center">
                <div className="p-2 rounded-md bg-amber-100 dark:bg-amber-900/30">
                  <UserIcon className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div className="ml-3">
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                    Role
                  </p>
                  <p className="text-sm font-semibold text-amber-600 dark:text-amber-400 capitalize">
                    {role}
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-2 rounded-md bg-amber-100 dark:bg-amber-900/30">
                <UserIcon className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
            )}
            {!isCollapsed && <ModeToggle />}
          </div>

          <Separator className="mb-4" />

          {/* Navigation Links */}
          <nav className="flex-1 space-y-1 overflow-y-auto">
            {links.map((link) => {
              const isActive = location.pathname === link.path;
              const IconComponent = link.icon;

              return (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={cn(
                    "flex items-center rounded-lg px-3 py-3 text-sm font-medium transition-all duration-200 group",
                    isActive
                      ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                      : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800",
                    isCollapsed ? "justify-center" : "justify-start"
                  )}
                  title={isCollapsed ? link.name : undefined}
                  onClick={handleLinkClick}
                >
                  <IconComponent
                    className={cn(
                      "h-5 w-5 flex-shrink-0",
                      !isCollapsed && "mr-3",
                      isActive
                        ? "text-amber-700 dark:text-amber-400"
                        : "text-gray-600 dark:text-gray-400 group-hover:text-amber-600 dark:group-hover:text-amber-400"
                    )}
                  />
                  {!isCollapsed && (
                    <span
                      className={cn(
                        isActive
                          ? "text-amber-700 dark:text-amber-400"
                          : "text-gray-600 dark:text-gray-400"
                      )}
                    >
                      {link.name}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>

          {/* Footer Info */}
          <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
            {isCollapsed ? (
              <div className="flex justify-center">
                <div className="p-2 rounded-md bg-amber-100 dark:bg-amber-900/30">
                  <ModeToggle />
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <p className="text-xs text-center text-gray-500 dark:text-gray-400">
                  EduTrack • Version 1.0
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardSidebar;
