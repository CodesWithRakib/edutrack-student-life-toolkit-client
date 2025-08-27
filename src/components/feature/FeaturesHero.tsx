import React from "react";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  BookOpen,
  Calendar,
  DollarSign,
  ClipboardList,
} from "lucide-react";
import { cn } from "@/lib/utils";

const FeaturesHero: React.FC = () => {
  const features = [
    {
      icon: Calendar,
      title: "Smart Scheduling",
      color: "text-blue-600 dark:text-blue-400",
    },
    {
      icon: DollarSign,
      title: "Budget Tracker",
      color: "text-green-600 dark:text-green-400",
    },
    {
      icon: BookOpen,
      title: "Study Planner",
      color: "text-purple-600 dark:text-purple-400",
    },
    {
      icon: ClipboardList,
      title: "Exam Generator",
      color: "text-orange-600 dark:text-orange-400",
    },
  ];

  return (
    <section className="relative bg-gradient-to-br from-amber-50 to-orange-50 dark:from-gray-900 dark:to-gray-800 overflow-hidden">
      <div className="absolute inset-0 opacity-5 dark:opacity-10">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMwMDAiIGZpbGwtb3BhY2l0eT0iLjEiPjxwYXRoIGQ9Ik0zNiAzNGgtMnYtMmgydjJ6bTAgNGgtMnYtMmgydjJ6bTAtNGgtMnYtMmgydjJ6bTAtNGgtMnYtMmgydjJ6bTAtNGgtMnYtMmgydjJ6Ii8+PC9nPjwvZz48L3N2Zz4=')]"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
        <div className="text-center">
          {/* Breadcrumb */}
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-600 dark:text-gray-400 mb-6">
            <Link
              to="/"
              className="hover:text-amber-600 dark:hover:text-amber-400"
            >
              Home
            </Link>
            <span>/</span>
            <span className="text-amber-600 dark:text-amber-400">Features</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Powerful Features for
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-600">
              Academic Success
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-10">
            Discover how EduTrack's comprehensive suite of tools can transform
            your educational experience and help you achieve your academic
            goals.
          </p>

          {/* Feature Icons */}
          <div className="flex flex-wrap justify-center gap-6 mb-10">
            {features.map((feature, index) => (
              <div key={index} className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-white dark:bg-gray-800 shadow-md flex items-center justify-center mb-2">
                  <feature.icon className={cn("h-8 w-8", feature.color)} />
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {feature.title}
                </span>
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <Button
            size="lg"
            asChild
            className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-lg hover:shadow-xl transition-all"
          >
            <Link to="/register" className="flex items-center">
              Start Free Trial
              <ArrowLeft className="ml-2 h-4 w-4 rotate-180" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturesHero;
