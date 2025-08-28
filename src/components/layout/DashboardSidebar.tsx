import { useState } from "react";
import { NavLink, useLocation } from "react-router";
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  DollarSign,
  BookOpen,
  ClipboardList,
  FileText,
  Edit,
  Users,
  FileCode,
  Settings,
  LayoutDashboard,
  User,
  GraduationCap,
  BookOpenCheck,
  BarChart3,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ModeToggle } from "@/components/mode-toggle"; // Assuming you have this component

const DashboardSidebar = ({ role = "student" }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  // Define links based on role
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
            path: "/dashboard/teacher/resources",
            name: "Notes/Resources",
            icon: FileText,
          },
          {
            path: "/dashboard/teacher/qa-manage",
            name: "Manage Q&A",
            icon: Edit,
          },
          {
            path: "/dashboard/teacher/students",
            name: "Student Management",
            icon: GraduationCap,
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
          { path: "/dashboard/admin/users", name: "Manage Users", icon: Users },
          {
            path: "/dashboard/admin/content",
            name: "Manage Content",
            icon: FileCode,
          },
          {
            path: "/dashboard/admin/analytics",
            name: "Analytics",
            icon: BarChart3,
          },
          {
            path: "/dashboard/admin/settings",
            name: "System Settings",
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

  return (
    <div
      className={cn(
        "relative h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-all duration-300 ease-in-out",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      {/* Toggle Button */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute -right-3 top-6 z-10 h-6 w-6 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-md"
        onClick={toggleSidebar}
      >
        {isCollapsed ? (
          <ChevronRight className="h-3 w-3" />
        ) : (
          <ChevronLeft className="h-3 w-3" />
        )}
      </Button>
      {/* Sidebar Content */}
      <div className="flex flex-col h-full p-4">
        {/* User Role Badge with Theme Toggle */}
        <div
          className={cn(
            "flex items-center justify-between mb-6 p-2 rounded-lg bg-gray-100 dark:bg-gray-800 transition-all",
            isCollapsed ? "justify-center" : "justify-between"
          )}
        >
          <div className="flex items-center">
            <div className="p-1.5 rounded-md bg-amber-100 dark:bg-amber-900/30">
              <User className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            </div>
            {!isCollapsed && (
              <div className="ml-2">
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                  Role
                </p>
                <p className="text-sm font-semibold capitalize text-amber-600 dark:text-amber-400">
                  {role}
                </p>
              </div>
            )}
          </div>
          {!isCollapsed && <ModeToggle />}
        </div>
        <Separator className="my-2" />
        {/* Navigation Links */}
        <nav className="flex-1 space-y-1">
          {links.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <NavLink
                key={link.path}
                to={link.path}
                className={cn(
                  "flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400"
                    : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800",
                  isCollapsed ? "justify-center" : "justify-start"
                )}
                title={isCollapsed ? link.name : undefined}
              >
                <link.icon className={cn("h-5 w-5", !isCollapsed && "mr-3")} />
                {!isCollapsed && link.name}
              </NavLink>
            );
          })}
        </nav>
        {/* Footer/Collapsed Info */}
        {isCollapsed && (
          <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-800">
            <div className="flex justify-center">
              <div className="p-1.5 rounded-md bg-amber-100 dark:bg-amber-900/30">
                <User className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              </div>
            </div>
          </div>
        )}
        {!isCollapsed && (
          <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-800">
            <p className="text-xs text-center text-gray-500 dark:text-gray-400">
              EduTrack v1.0
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardSidebar;
