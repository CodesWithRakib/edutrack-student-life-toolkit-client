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
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface DashboardSidebarProps {
  role?: string;
  isMobileOpen?: boolean;
  onMobileToggle?: () => void;
  handleLogout?: () => void;
}

const DashboardSidebar = ({
  role = "student",
  isMobileOpen = false,
  onMobileToggle,
  handleLogout,
}: DashboardSidebarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  const getLinksForRole = () => {
    switch (role) {
      case "student":
        return [
          {
            path: "/dashboard",
            name: "Dashboard",
            icon: LayoutDashboard,
            description: "Overview and analytics",
          },
          {
            path: "/dashboard/student/schedule",
            name: "Class Schedule",
            icon: Calendar,
            description: "View and manage your classes",
          },
          {
            path: "/dashboard/student/budget",
            name: "Budget Tracker",
            icon: DollarSign,
            description: "Track your expenses",
          },
          {
            path: "/dashboard/student/planner",
            name: "Study Planner",
            icon: BookOpen,
            description: "Plan your study sessions",
          },
          {
            path: "/dashboard/student/exam-generator",
            name: "AI Exam Generator",
            icon: BadgeQuestionMark,
            description: "Create practice exams",
          },
          {
            path: "/dashboard/student/qa",
            name: "Exam Q&A",
            icon: ClipboardList,
            description: "Practice questions",
          },
          {
            path: "/dashboard/student/performance",
            name: "Performance",
            icon: BarChart3,
            description: "Track your progress",
          },
        ];
      case "teacher":
        return [
          {
            path: "/dashboard",
            name: "Dashboard",
            icon: LayoutDashboard,
            description: "Overview and analytics",
          },
          {
            path: "/dashboard/teacher/qa-manage",
            name: "Q&A Management",
            icon: Edit,
            description: "Manage questions",
          },
          {
            path: "/dashboard/teacher/assignments",
            name: "Assignments",
            icon: BookOpenCheck,
            description: "Create and manage assignments",
          },
        ];
      case "admin":
        return [
          {
            path: "/dashboard",
            name: "Dashboard",
            icon: LayoutDashboard,
            description: "Overview and analytics",
          },
          {
            path: "/dashboard/admin/users",
            name: "Users",
            icon: Users,
            description: "Manage users",
          },
          {
            path: "/dashboard/admin/content",
            name: "Content",
            icon: FileCode,
            description: "Manage content",
          },
          {
            path: "/dashboard/admin/analytics",
            name: "Analytics",
            icon: BarChart3,
            description: "View analytics",
          },
          {
            path: "/dashboard/admin/settings",
            name: "Settings",
            icon: Settings,
            description: "System settings",
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

  const getRoleConfig = () => {
    switch (role) {
      case "student":
        return {
          color: "text-amber-600 dark:text-amber-400",
          bgColor: "bg-amber-50 dark:bg-amber-950/50",
          gradientFrom: "from-amber-600",
          gradientTo: "to-orange-500",
        };
      case "teacher":
        return {
          color: "text-amber-600 dark:text-amber-400",
          bgColor: "bg-amber-50 dark:bg-amber-950/50",
          gradientFrom: "from-amber-600",
          gradientTo: "to-orange-500",
        };
      case "admin":
        return {
          color: "text-amber-600 dark:text-amber-400",
          bgColor: "bg-amber-50 dark:bg-amber-950/50",
          gradientFrom: "from-amber-600",
          gradientTo: "to-orange-500",
        };
      default:
        return {
          color: "text-amber-600 dark:text-amber-400",
          bgColor: "bg-amber-50 dark:bg-amber-950/50",
          gradientFrom: "from-amber-600",
          gradientTo: "to-orange-500",
        };
    }
  };

  const roleConfig = getRoleConfig();

  return (
    <TooltipProvider>
      <>
        {/* Mobile overlay with improved blur effect */}
        {isMobileOpen && (
          <div
            className="fixed inset-0 bg-black/20 dark:bg-black/40 backdrop-blur-md z-40 lg:hidden transition-all duration-300"
            onClick={onMobileToggle}
          />
        )}
        <div
          className={cn(
            "fixed lg:relative h-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-r border-amber-200/60 dark:border-amber-800/60 transition-all duration-300 ease-in-out flex flex-col z-50",
            "shadow-xl lg:shadow-lg shadow-amber-200/50 dark:shadow-amber-900/50",
            isCollapsed ? "w-16" : "w-72",
            isMobileOpen
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0"
          )}
        >
          {/* Enhanced Toggle Button */}
          <Button
            variant="outline"
            size="icon"
            className={cn(
              "absolute -right-4 top-6 z-10 h-8 w-8 rounded-full bg-white dark:bg-slate-800",
              "border-amber-200 dark:border-amber-700 shadow-lg hover:shadow-xl transition-all duration-200",
              "hover:scale-105 hidden lg:flex hover:bg-amber-50 dark:hover:bg-amber-900/50"
            )}
            onClick={toggleSidebar}
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            ) : (
              <ChevronLeft className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            )}
          </Button>

          {/* Mobile close button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-3 top-3 z-10 h-8 w-8 rounded-full lg:hidden hover:bg-amber-50 dark:hover:bg-amber-900/50"
            onClick={onMobileToggle}
            aria-label="Close sidebar"
          >
            <X className="h-4 w-4 text-amber-600 dark:text-amber-400" />
          </Button>

          {/* Enhanced Logo Section */}
          <div className="p-6 pb-4">
            <NavLink
              to="/"
              className={cn(
                "flex items-center transition-all duration-200 hover:opacity-90 group",
                isCollapsed ? "justify-center" : "justify-start space-x-3"
              )}
              onClick={handleLinkClick}
              aria-label="EduTrack Home"
            >
              <div
                className={cn(
                  "p-2.5 rounded-2xl bg-gradient-to-r shadow-lg group-hover:shadow-xl transition-all duration-200",
                  `${roleConfig.gradientFrom} ${roleConfig.gradientTo}`
                )}
              >
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              {!isCollapsed && (
                <div className="flex flex-col">
                  <span className="text-xl font-bold text-slate-900 dark:text-white">
                    EduTrack
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    Learning Management
                  </span>
                </div>
              )}
            </NavLink>
          </div>

          {/* Content wrapper with better scrolling */}
          <div className="flex flex-col h-full px-4 pb-4 flex-1 overflow-hidden">
            {/* Enhanced User Role Section */}
            <div
              className={cn(
                "flex items-center mb-6 p-4 rounded-2xl transition-all duration-200",
                "bg-amber-50/50 dark:bg-amber-900/20 backdrop-blur-sm",
                "border border-amber-200/50 dark:border-amber-800/50",
                isCollapsed ? "justify-center" : "justify-between"
              )}
            >
              {!isCollapsed ? (
                <div className="flex items-center space-x-3">
                  <div className={cn("p-2.5 rounded-xl", roleConfig.bgColor)}>
                    <UserIcon className={cn("h-5 w-5", roleConfig.color)} />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                      Current Role
                    </p>
                    <p
                      className={cn(
                        "text-sm font-semibold capitalize",
                        roleConfig.color
                      )}
                    >
                      {role}
                    </p>
                  </div>
                </div>
              ) : (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className={cn("p-2.5 rounded-xl", roleConfig.bgColor)}>
                      <UserIcon className={cn("h-5 w-5", roleConfig.color)} />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent
                    side="right"
                    className="bg-slate-900 dark:bg-slate-100"
                  >
                    <p className="capitalize font-medium">{role} Role</p>
                  </TooltipContent>
                </Tooltip>
              )}
              {!isCollapsed && <ModeToggle />}
            </div>

            {/* Enhanced Navigation Links */}
            <nav className="flex-1 space-y-2 overflow-y-auto scrollbar-thin scrollbar-thumb-amber-300 dark:scrollbar-thumb-amber-600 scrollbar-track-transparent">
              {links.map((link) => {
                const isActive = location.pathname === link.path;
                const IconComponent = link.icon;
                const navLink = (
                  <NavLink
                    key={link.path}
                    to={link.path}
                    className={cn(
                      "flex items-center rounded-xl px-3 py-3 text-sm font-medium transition-all duration-200 group relative overflow-hidden",
                      isActive
                        ? "bg-white dark:bg-slate-800 shadow-lg shadow-amber-200/50 dark:shadow-amber-900/50 text-slate-900 dark:text-white border border-amber-200/60 dark:border-amber-800/60"
                        : "text-slate-600 dark:text-slate-300 hover:bg-amber-50 dark:hover:bg-amber-900/30 hover:text-slate-900 dark:hover:text-white",
                      isCollapsed ? "justify-center" : "justify-start"
                    )}
                    onClick={handleLinkClick}
                    aria-current={isActive ? "page" : undefined}
                  >
                    <div
                      className={cn(
                        "p-2 rounded-lg transition-all duration-200 flex-shrink-0",
                        isActive
                          ? "bg-amber-100 dark:bg-amber-900/30"
                          : "group-hover:bg-amber-100 dark:group-hover:bg-amber-900/30"
                      )}
                    >
                      <IconComponent
                        className={cn(
                          "h-5 w-5 transition-all duration-200",
                          isActive
                            ? "text-amber-600 dark:text-amber-400"
                            : "text-slate-600 dark:text-slate-300 group-hover:text-amber-600 dark:group-hover:text-amber-400"
                        )}
                      />
                    </div>
                    {!isCollapsed && (
                      <div className="ml-3 flex-1 min-w-0">
                        <span className="truncate block font-medium">
                          {link.name}
                        </span>
                        {!isActive && (
                          <span className="text-xs text-slate-500 dark:text-slate-400 truncate block">
                            {link.description}
                          </span>
                        )}
                      </div>
                    )}
                    {isActive && !isCollapsed && (
                      <div className="ml-auto w-2 h-2 rounded-full bg-gradient-to-r from-amber-500 to-orange-500" />
                    )}
                    {isActive && (
                      <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-amber-500 to-orange-500 rounded-r-full" />
                    )}
                  </NavLink>
                );
                return isCollapsed ? (
                  <Tooltip key={link.path}>
                    <TooltipTrigger asChild>{navLink}</TooltipTrigger>
                    <TooltipContent
                      side="right"
                      className="bg-slate-900 dark:bg-slate-100"
                    >
                      <div className="font-medium text-white dark:text-slate-900">
                        {link.name}
                      </div>
                      <div className="text-xs text-slate-300 dark:text-slate-600">
                        {link.description}
                      </div>
                    </TooltipContent>
                  </Tooltip>
                ) : (
                  navLink
                );
              })}
            </nav>

            {/* Enhanced Logout Button */}
            <div className="pt-6 mt-auto border-t border-amber-200/60 dark:border-amber-800/60">
              {isCollapsed ? (
                <div className="space-y-3">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        className="w-full h-10 rounded-xl border-amber-200 dark:border-amber-700 hover:bg-amber-50 dark:hover:bg-amber-900/50"
                      >
                        <ModeToggle />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      <p>Toggle theme</p>
                    </TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        className="w-full h-10 rounded-xl text-red-600 dark:text-red-400 border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-950/50"
                        onClick={handleLogout}
                      >
                        <LogOut className="h-5 w-5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      <p>Logout</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              ) : (
                <Button
                  variant="outline"
                  className={cn(
                    "w-full flex items-center rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200",
                    "text-red-600 dark:text-red-400 border-red-200 dark:border-red-800",
                    "hover:bg-red-50 dark:hover:bg-red-950/50 hover:border-red-300 dark:hover:border-red-700"
                  )}
                  onClick={handleLogout}
                >
                  <div className="p-2 rounded-lg bg-red-50 dark:bg-red-950/50 mr-3">
                    <LogOut className="h-4 w-4 text-red-600 dark:text-red-400" />
                  </div>
                  <span>Sign Out</span>
                </Button>
              )}
            </div>

            {/* Enhanced Footer */}
            <div className="pt-4">
              {!isCollapsed && (
                <div className="text-center">
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    EduTrack • Version 2.0
                  </p>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                    © 2024 All rights reserved
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </>
    </TooltipProvider>
  );
};

export default DashboardSidebar;
