import React from "react";
import { Link, useLocation } from "react-router";
import {
  Calendar,
  DollarSign,
  BookOpen,
  ClipboardList,
  Home,
  GraduationCap,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Schedule", href: "/dashboard/schedule", icon: Calendar },
  { name: "Budget", href: "/dashboard/budget", icon: DollarSign },
  { name: "Study Planner", href: "/dashboard/planner", icon: BookOpen },
  { name: "Exam Generator", href: "/dashboard/exam", icon: ClipboardList },
];

const Sidebar: React.FC = () => {
  const location = useLocation();

  return (
    <div className="w-64 bg-white dark:bg-gray-800 shadow-md dark:shadow-lg border-r border-gray-200 dark:border-gray-700 h-full flex flex-col">
      {/* Logo/Branding Section */}
      <div className="flex items-center justify-center h-16 px-4 border-b border-gray-200 dark:border-gray-700">
        <Link to="/dashboard" className="flex items-center space-x-2">
          <div className="p-1.5 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600">
            <GraduationCap className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-indigo-400">
            EduTrack
          </span>
        </Link>
      </div>

      {/* Navigation Section */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "group flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200",
                isActive
                  ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 shadow-sm"
                  : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-gray-100"
              )}
            >
              <item.icon
                className={cn(
                  "w-5 h-5 mr-3 transition-colors duration-200",
                  isActive
                    ? "text-blue-600 dark:text-blue-400"
                    : "text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300"
                )}
              />
              <span className="truncate">{item.name}</span>

              {/* Active indicator */}
              {isActive && (
                <div className="ml-auto w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400"></div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer Section */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
          © 2023 EduTrack. All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
