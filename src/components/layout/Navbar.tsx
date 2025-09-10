import { Link, NavLink, useNavigate } from "react-router";
import { useState, useEffect } from "react";
import {
  Menu,
  X,
  GraduationCap,
  LayoutDashboard,
  Calendar,
  DollarSign,
  BookOpen,
  ClipboardList,
  User,
  LogOut,
  Settings,
  ChevronDown,
  BarChart3,
  Bell,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ModeToggle } from "../mode-toggle";
import { useAuth } from "@/hooks/useAuth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [dashboardOpen, setDashboardOpen] = useState(false);
  const { user, logOut } = useAuth();
  const navigate = useNavigate();
  const isAuthenticated = !!user;

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
    setDashboardOpen(false);
  }, []);

  const handleLogout = async () => {
    try {
      await logOut();
      toast.success("Logged out successfully");
      navigate("/");
      setIsOpen(false);
    } catch (error) {
      toast.error("Failed to log out");
      console.error("Logout error:", error);
    }
  };

  const publicLinks = [
    { name: "Home", path: "/", icon: null },
    { name: "About", path: "/about", icon: null },
    { name: "Contact", path: "/contact", icon: null },
  ];

  const privateLinks = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    {
      name: "Class Schedule",
      path: "/dashboard/student/schedule",
      icon: Calendar,
      roles: ["student"],
    },
    {
      name: "Budget Tracker",
      path: "/dashboard/student/budget",
      icon: DollarSign,
      roles: ["student"],
    },
    {
      name: "Study Planner",
      path: "/dashboard/student/planner",
      icon: BookOpen,
      roles: ["student"],
    },
    {
      name: "Exam Q&A",
      path: "/dashboard/student/qa",
      icon: ClipboardList,
      roles: ["student"],
    },
    {
      name: "Performance",
      path: "/dashboard/student/performance",
      icon: BarChart3,
      roles: ["student"],
    },
  ];

  // Get user initials for avatar fallback
  const getUserInitials = () => {
    if (!user?.displayName) return user?.email?.charAt(0).toUpperCase() || "U";

    return user.displayName
      .split(" ")
      .map((name) => name[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 w-full transition-all duration-500 ease-in-out",
        isScrolled
          ? "bg-white/80 backdrop-blur-xl border-b border-gray-200/60 shadow-lg dark:bg-gray-950/90 dark:border-gray-800/60"
          : "bg-white dark:bg-gray-950 border-b border-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center space-x-3 transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:ring-offset-2 rounded-lg p-1"
            onClick={() => setIsOpen(false)}
          >
            <div className="relative p-2 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 shadow-lg">
              <GraduationCap className="h-6 w-6 text-white drop-shadow-sm" />
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-amber-400 via-orange-400 to-red-400 opacity-0 hover:opacity-100 transition-opacity duration-300" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 bg-clip-text text-transparent dark:from-amber-400 dark:via-orange-400 dark:to-red-400">
                EduTrack
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400 font-medium hidden sm:block">
                Student Portal
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {/* Public Links */}
            <div className="flex items-center space-x-6">
              {publicLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={({ isActive }) =>
                    cn(
                      "relative text-sm font-medium transition-all duration-300 px-3 py-2 rounded-lg group",
                      isActive
                        ? "text-amber-600 dark:text-amber-400"
                        : "text-gray-700 hover:text-amber-600 dark:text-gray-300 dark:hover:text-amber-400"
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      <span className="relative z-10">{link.name}</span>
                      <div
                        className={cn(
                          "absolute inset-0 rounded-lg transition-all duration-300 -z-0",
                          isActive
                            ? "bg-amber-50 dark:bg-amber-950/30 scale-100"
                            : "bg-gray-100 dark:bg-gray-800 scale-0 group-hover:scale-100"
                        )}
                      />
                    </>
                  )}
                </NavLink>
              ))}
            </div>

            {/* Dashboard Dropdown for Desktop */}
            {isAuthenticated && (
              <div className="relative">
                <DropdownMenu
                  open={dashboardOpen}
                  onOpenChange={setDashboardOpen}
                >
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="h-auto p-3 font-medium text-gray-700 hover:text-amber-600 dark:text-gray-300 dark:hover:text-amber-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all duration-300"
                    >
                      <LayoutDashboard className="h-4 w-4 mr-2" />
                      Dashboard
                      <ChevronDown className="h-4 w-4 ml-1 transition-transform duration-200" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className="w-64 mt-2 bg-white/95 backdrop-blur-xl dark:bg-gray-950/95 border border-gray-200/60 dark:border-gray-800/60 shadow-xl rounded-xl p-2"
                    align="start"
                    sideOffset={8}
                  >
                    <div className="px-2 py-2">
                      <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                        Student Tools
                      </p>
                    </div>
                    {privateLinks.map((link) => (
                      <DropdownMenuItem key={link.path} asChild>
                        <NavLink
                          to={link.path}
                          className={({ isActive }) =>
                            cn(
                              "flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg transition-all duration-200 cursor-pointer w-full",
                              isActive
                                ? "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 font-medium"
                                : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800/60"
                            )
                          }
                          onClick={() => setDashboardOpen(false)}
                        >
                          {link.icon && (
                            <link.icon className="h-4 w-4 flex-shrink-0" />
                          )}
                          <span className="flex-1">{link.name}</span>
                        </NavLink>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-3">
            {/* Theme Toggle */}
            <div className="hidden sm:block">
              <ModeToggle />
            </div>

            {/* Notifications (for authenticated users) */}
            {isAuthenticated && (
              <Button
                variant="ghost"
                size="icon"
                className="relative h-9 w-9 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200 hidden sm:inline-flex"
              >
                <Bell className="h-4 w-4" />
                <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full animate-pulse" />
              </Button>
            )}

            {/* Auth Buttons / User Menu */}
            {!isAuthenticated ? (
              <div className="hidden sm:flex items-center space-x-2">
                <Button
                  variant="outline"
                  asChild
                  className="h-9 px-4 border-gray-300 hover:border-amber-300 hover:bg-amber-50 dark:border-gray-700 dark:hover:border-amber-700 dark:hover:bg-amber-950/20 transition-all duration-200"
                >
                  <Link to="/login">Sign In</Link>
                </Button>
                <Button
                  asChild
                  className="h-9 px-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
                >
                  <Link to="/register">Get Started</Link>
                </Button>
              </div>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-9 w-9 rounded-full p-0 hover:ring-2 hover:ring-amber-500/20 hover:ring-offset-2 transition-all duration-200"
                  >
                    <Avatar className="h-9 w-9 ring-2 ring-transparent hover:ring-amber-500/30 transition-all duration-200">
                      <AvatarImage
                        src={user.photoURL || ""}
                        alt={user.displayName || "User"}
                        className="object-cover"
                      />
                      <AvatarFallback className="bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold text-sm">
                        {getUserInitials()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-950" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-64 mt-2 bg-white/95 backdrop-blur-xl dark:bg-gray-950/95 border border-gray-200/60 dark:border-gray-800/60 shadow-xl rounded-xl p-2"
                  align="end"
                  sideOffset={8}
                >
                  <DropdownMenuLabel className="font-normal p-3">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage
                          src={user.photoURL || ""}
                          alt={user.displayName || "User"}
                        />
                        <AvatarFallback className="bg-gradient-to-r from-amber-500 to-orange-500 text-white">
                          {getUserInitials()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                          {user.displayName || "User"}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="my-2" />
                  <DropdownMenuItem asChild>
                    <Link
                      to="/dashboard/profile"
                      className="flex items-center gap-3 px-3 py-2 text-sm rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800/60 transition-colors duration-200"
                    >
                      <User className="h-4 w-4" />
                      <span>Profile Settings</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      to="/dashboard/settings"
                      className="flex items-center gap-3 px-3 py-2 text-sm rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800/60 transition-colors duration-200"
                    >
                      <Settings className="h-4 w-4" />
                      <span>App Settings</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="my-2" />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-3 py-2 text-sm rounded-lg cursor-pointer text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-950/20 transition-colors duration-200"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Sign Out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* Mobile Menu Button */}
            <div className="lg:hidden flex items-center space-x-2">
              <div className="sm:hidden">
                <ModeToggle />
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
                onClick={() => setIsOpen(!isOpen)}
              >
                {isOpen ? (
                  <X className="h-5 w-5 transition-transform duration-200 rotate-0" />
                ) : (
                  <Menu className="h-5 w-5 transition-transform duration-200" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-xl dark:bg-gray-950/95 border-t border-gray-200/60 dark:border-gray-800/60 shadow-xl">
          <div className="max-w-7xl mx-auto px-4 py-6">
            {/* Public Links */}
            <div className="space-y-2 mb-6">
              {publicLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center px-4 py-3 text-base font-medium rounded-xl transition-all duration-200",
                      isActive
                        ? "bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-300"
                        : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800/60"
                    )
                  }
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </NavLink>
              ))}
            </div>

            {/* Dashboard Links for Mobile */}
            {isAuthenticated && (
              <div className="border-t border-gray-200 dark:border-gray-800 pt-6 mb-6">
                <p className="px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
                  Dashboard
                </p>
                <div className="space-y-2">
                  {privateLinks.map((link) => (
                    <NavLink
                      key={link.path}
                      to={link.path}
                      className={({ isActive }) =>
                        cn(
                          "flex items-center gap-3 px-4 py-3 text-base rounded-xl transition-all duration-200",
                          isActive
                            ? "bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-300 font-medium"
                            : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800/60"
                        )
                      }
                      onClick={() => setIsOpen(false)}
                    >
                      {link.icon && <link.icon className="h-5 w-5" />}
                      {link.name}
                    </NavLink>
                  ))}
                </div>
              </div>
            )}

            {/* Auth Actions */}
            <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
              {!isAuthenticated ? (
                <div className="space-y-3">
                  <Button
                    variant="outline"
                    asChild
                    className="w-full h-12 text-base border-gray-300 hover:border-amber-300 hover:bg-amber-50 dark:border-gray-700 dark:hover:border-amber-700 dark:hover:bg-amber-950/20"
                    onClick={() => setIsOpen(false)}
                  >
                    <Link to="/login">Sign In</Link>
                  </Button>
                  <Button
                    asChild
                    className="w-full h-12 text-base bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-lg"
                    onClick={() => setIsOpen(false)}
                  >
                    <Link to="/register">Get Started</Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Button
                    variant="ghost"
                    asChild
                    className="w-full justify-start h-12 text-base hover:bg-gray-100 dark:hover:bg-gray-800/60"
                    onClick={() => setIsOpen(false)}
                  >
                    <Link to="/dashboard/profile">
                      <User className="h-5 w-5 mr-3" />
                      Profile Settings
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start h-12 text-base text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-950/20"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-5 w-5 mr-3" />
                    Sign Out
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
