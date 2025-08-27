import React from "react";
import { Link, useLocation } from "react-router";
import {
  Calendar,
  DollarSign,
  BookOpen,
  ClipboardList,
  Home,
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
    <div className="w-64 bg-white shadow-md">
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-center h-16 shadow-sm">
          <h1 className="text-lg font-semibold">Navigation</h1>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-1">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors",
                  isActive
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                )}
              >
                <item.icon className="w-5 h-5 mr-3" />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
