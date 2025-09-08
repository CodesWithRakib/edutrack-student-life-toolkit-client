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
            name: "Exam Generator",
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

  return (
    <TooltipProvider>
      <>
        {/* Mobile overlay with blur effect */}
        {isMobileOpen && (
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
            onClick={onMobileToggle}
          />
        )}

        <div
          className={cn(
            "fixed lg:relative h-full bg-gradient-to-b from-background to-muted/30 border-r border-border/50 transition-all duration-300 ease-in-out flex flex-col z-50 shadow-lg",
            isCollapsed ? "w-16" : "min-w-[240px] max-w-[280px]",
            isMobileOpen
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0"
          )}
          style={{ width: isCollapsed ? "4rem" : "75vw", maxWidth: "280px" }}
        >
          {/* Toggle Button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute -right-3 top-6 z-10 h-8 w-8 rounded-full bg-background border border-border shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105 hidden lg:flex"
            onClick={toggleSidebar}
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
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
            aria-label="Close sidebar"
          >
            <X className="h-4 w-4" />
          </Button>

          {/* Logo Section */}
          <div className="p-4">
            <NavLink
              to="/"
              className={cn(
                "flex items-center transition-all duration-200 hover:opacity-90",
                isCollapsed ? "justify-center" : "justify-start space-x-2"
              )}
              onClick={handleLinkClick}
              aria-label="EduTrack Home"
            >
              <div className="p-1.5 rounded-xl bg-gradient-to-r from-primary to-primary/70 flex-shrink-0 shadow-sm">
                <GraduationCap className="h-6 w-6 text-primary-foreground" />
              </div>
              {!isCollapsed && (
                <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
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
                "flex items-center mb-6 p-3 rounded-xl bg-muted/50 backdrop-blur-sm transition-all duration-200 border border-border/50",
                isCollapsed ? "justify-center" : "justify-between"
              )}
            >
              {!isCollapsed ? (
                <div className="flex items-center">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <UserIcon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="ml-3">
                    <p className="text-xs font-medium text-muted-foreground">
                      Role
                    </p>
                    <p className="text-sm font-semibold text-primary capitalize">
                      {role}
                    </p>
                  </div>
                </div>
              ) : (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="p-2 rounded-lg bg-primary/10">
                      <UserIcon className="h-5 w-5 text-primary" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p className="capitalize">{role} role</p>
                  </TooltipContent>
                </Tooltip>
              )}
              {!isCollapsed && <ModeToggle />}
            </div>

            <Separator className="mb-4" />

            {/* Navigation Links */}
            <nav className="flex-1 space-y-1.5 overflow-y-auto scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
              {links.map((link) => {
                const isActive = location.pathname === link.path;
                const IconComponent = link.icon;

                const navLink = (
                  <NavLink
                    key={link.path}
                    to={link.path}
                    className={cn(
                      "flex items-center rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 group relative",
                      isActive
                        ? "bg-primary/10 text-primary shadow-sm"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                      isCollapsed ? "justify-center" : "justify-start"
                    )}
                    onClick={handleLinkClick}
                    aria-current={isActive ? "page" : undefined}
                  >
                    <IconComponent
                      className={cn(
                        "h-5 w-5 flex-shrink-0 transition-all duration-200",
                        !isCollapsed && "mr-3",
                        isActive
                          ? "text-primary"
                          : "text-muted-foreground group-hover:text-foreground"
                      )}
                    />
                    {!isCollapsed && (
                      <span
                        className={cn(
                          "truncate",
                          isActive
                            ? "text-primary font-medium"
                            : "text-muted-foreground group-hover:text-foreground"
                        )}
                      >
                        {link.name}
                      </span>
                    )}
                    {isActive && !isCollapsed && (
                      <div className="ml-auto w-2 h-2 rounded-full bg-primary" />
                    )}
                  </NavLink>
                );

                return isCollapsed ? (
                  <Tooltip key={link.path}>
                    <TooltipTrigger asChild>{navLink}</TooltipTrigger>
                    <TooltipContent side="right">
                      <div className="font-medium">{link.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {link.description}
                      </div>
                    </TooltipContent>
                  </Tooltip>
                ) : (
                  navLink
                );
              })}
            </nav>

            {/* Footer Info */}
            <div className="pt-4 border-t border-border/50">
              {isCollapsed ? (
                <div className="flex justify-center">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="p-2 rounded-lg bg-muted/50">
                        <ModeToggle />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      <p>Toggle theme</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <p className="text-xs text-center text-muted-foreground">
                    EduTrack • Version 1.0
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
