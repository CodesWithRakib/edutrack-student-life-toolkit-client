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
  Users,
  FileText,
  FolderOpen,
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
  const { user, logOut } = useAuth();
  const navigate = useNavigate();
  const isAuthenticated = !!user;

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
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
    { name: "Features", path: "/features", icon: null },
    { name: "About", path: "/about", icon: null },
    { name: "Contact", path: "/contact", icon: null },
  ];

  const privateLinks = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    //student
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
    // teacher
    {
      name: "Resources",
      path: "/dashboard/teacher/resources",
      icon: FolderOpen,
      roles: ["teacher", "admin"],
    },
    {
      name: "Manage Q&A",
      path: "/dashboard/teacher/qa-manage",
      icon: ClipboardList,
      roles: ["teacher", "admin"],
    },
    {
      name: "Students",
      path: "/dashboard/teacher/students",
      icon: Users,
      roles: ["teacher", "admin"],
    },
    {
      name: "Assignments",
      path: "/dashboard/teacher/assignments",
      icon: FileText,
      roles: ["teacher", "admin"],
    },
    //admin
    {
      name: "User Management",
      path: "/dashboard/admin/users",
      icon: Users,
      roles: ["admin"],
    },
    {
      name: "Content Management",
      path: "/dashboard/admin/content",
      icon: FolderOpen,
      roles: ["admin"],
    },
    {
      name: "Analytics",
      path: "/dashboard/admin/analytics",
      icon: BarChart3,
      roles: ["admin"],
    },
    {
      name: "System Settings",
      path: "/dashboard/admin/settings",
      icon: Settings,
      roles: ["admin"],
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
        "sticky top-0 z-50 w-full transition-all duration-300",
        isScrolled
          ? "bg-white/95 backdrop-blur-md border-b border-gray-200/50 shadow-sm dark:bg-gray-900/95 dark:border-b dark:border-gray-800/50"
          : "bg-white dark:bg-gray-900"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center space-x-2 transition-transform hover:scale-105"
            onClick={() => setIsOpen(false)}
          >
            <div className="p-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
              EduTrack
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex gap-6 items-center">
            {publicLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  cn(
                    "text-sm font-medium transition-all duration-300 relative px-1 py-2",
                    isActive
                      ? "text-amber-600 dark:text-amber-400 font-semibold"
                      : "text-gray-700 hover:text-amber-600 dark:text-gray-300 dark:hover:text-amber-400"
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    {link.name}
                    <span
                      className={cn(
                        "absolute bottom-0 left-0 h-0.5 bg-amber-600 dark:bg-amber-400 transition-all duration-300",
                        isActive ? "w-full" : "w-0"
                      )}
                    />
                  </>
                )}
              </NavLink>
            ))}

            {isAuthenticated && (
              <div className="relative group">
                <button className="flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-amber-600 dark:text-gray-300 dark:hover:text-amber-400 transition-colors">
                  Dashboard
                  <ChevronDown className="h-4 w-4" />
                </button>
                <div className="absolute left-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top-right border border-gray-200 dark:border-gray-700">
                  {privateLinks.map((link) => (
                    <NavLink
                      key={link.path}
                      to={link.path}
                      className={({ isActive }) =>
                        cn(
                          "flex items-center gap-2 px-4 py-2 text-sm transition-colors",
                          isActive
                            ? "bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400"
                            : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                        )
                      }
                    >
                      {link.icon && <link.icon className="h-4 w-4" />}
                      {link.name}
                    </NavLink>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center gap-3">
              <ModeToggle />

              {!isAuthenticated ? (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    asChild
                    className="dark:border-gray-700"
                  >
                    <Link to="/login">Login</Link>
                  </Button>
                  <Button
                    asChild
                    className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-md hover:shadow-lg transition-all"
                  >
                    <Link to="/register">Register</Link>
                  </Button>
                </div>
              ) : (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="relative h-8 w-8 rounded-full"
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={user.photoURL || ""}
                          alt={user.displayName || "User"}
                        />
                        <AvatarFallback className="bg-amber-500 text-white">
                          {getUserInitials()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {user.displayName || "User"}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/dashboard/profile" className="cursor-pointer">
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/dashboard/settings" className="cursor-pointer">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Settings</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="cursor-pointer"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <ModeToggle />
            {isAuthenticated && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={user.photoURL || ""}
                        alt={user.displayName || "User"}
                      />
                      <AvatarFallback className="bg-amber-500 text-white">
                        {getUserInitials()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {user.displayName || "User"}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="cursor-pointer"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            <button
              className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 animate-fadeIn">
          <div className="p-4 flex flex-col gap-3">
            {publicLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    isActive
                      ? "bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400"
                      : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                  )
                }
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </NavLink>
            ))}

            {isAuthenticated && (
              <>
                <div className="pt-2 mt-2 border-t border-gray-200 dark:border-gray-700">
                  <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider dark:text-gray-400">
                    Dashboard
                  </p>
                </div>
                {privateLinks.map((link) => (
                  <NavLink
                    key={link.path}
                    to={link.path}
                    className={({ isActive }) =>
                      cn(
                        "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                        isActive
                          ? "bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400"
                          : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                      )
                    }
                    onClick={() => setIsOpen(false)}
                  >
                    {link.icon && <link.icon className="h-4 w-4" />}
                    {link.name}
                  </NavLink>
                ))}
              </>
            )}

            <div className="pt-4 mt-2 border-t border-gray-200 dark:border-gray-700 flex flex-col gap-2">
              {!isAuthenticated ? (
                <>
                  <Button
                    variant="outline"
                    asChild
                    className="dark:border-gray-700"
                    onClick={() => setIsOpen(false)}
                  >
                    <Link to="/login">Login</Link>
                  </Button>
                  <Button
                    asChild
                    className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
                    onClick={() => setIsOpen(false)}
                  >
                    <Link to="/register">Register</Link>
                  </Button>
                </>
              ) : (
                <Button
                  variant="outline"
                  className="dark:border-gray-700"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
