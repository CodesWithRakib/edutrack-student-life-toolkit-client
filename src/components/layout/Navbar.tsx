// src/components/shared/Navbar.tsx
import { Link, NavLink } from "react-router";
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
  Sparkles,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ModeToggle } from "../mode-toggle";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const isAuthenticated = false; // Replace with auth state

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const publicLinks = [
    { name: "Home", path: "/", icon: null },
    { name: "Features", path: "/features", icon: null },
    { name: "About", path: "/about", icon: null },
    { name: "Contact", path: "/contact", icon: null },
  ];

  const privateLinks = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Class Schedule", path: "/dashboard/schedule", icon: Calendar },
    { name: "Budget Tracker", path: "/dashboard/budget", icon: DollarSign },
    { name: "Study Planner", path: "/dashboard/planner", icon: BookOpen },
    { name: "Exam Q&A", path: "/dashboard/exam", icon: ClipboardList },
    { name: "Unique Tool", path: "/dashboard/unique", icon: Sparkles },
    { name: "Profile", path: "/dashboard/profile", icon: User },
  ];

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
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
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
                <Button variant="outline" className="dark:border-gray-700">
                  Logout
                </Button>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <ModeToggle />
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
                  >
                    <Link to="/login" onClick={() => setIsOpen(false)}>
                      Login
                    </Link>
                  </Button>
                  <Button
                    asChild
                    className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
                  >
                    <Link to="/register" onClick={() => setIsOpen(false)}>
                      Register
                    </Link>
                  </Button>
                </>
              ) : (
                <Button variant="outline" className="dark:border-gray-700">
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
