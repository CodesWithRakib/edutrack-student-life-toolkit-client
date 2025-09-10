import React from "react";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Calendar,
  DollarSign,
  BookOpen,
  ClipboardList,
} from "lucide-react";
import { cn } from "@/lib/utils";

const HeroSection: React.FC = () => {
  return (
    <section className="relative bg-gradient-to-br from-amber-50 to-orange-50 dark:from-gray-900 dark:to-gray-800 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5 dark:opacity-10">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMwMDAiIGZpbGwtb3BhY2l0eT0iLjEiPjxwYXRoIGQ9Ik0zNiAzNGgtMnYtMmgydjJ6bTAgNGgtMnYtMmgydjJ6bTAtNGgtMnYtMmgydjJ6bTAtNGgtMnYtMmgydjJ6bTAtNGgtMnYtMmgydjJ6Ii8+PC9nPjwvZz48L3N2Zz4=')]"></div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-amber-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 dark:opacity-10 animate-blob"></div>
      <div className="absolute top-40 right-10 w-72 h-72 bg-orange-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 dark:opacity-10 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-amber-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 dark:opacity-10 animate-blob animation-delay-4000"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
        <div className="text-center">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 bg-white dark:bg-gray-800 rounded-full shadow-sm border border-amber-100 dark:border-amber-900/30 mb-8">
            <span className="text-sm font-medium text-amber-700 dark:text-amber-400">
              🎓 The Ultimate Student Management Platform
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight">
            Simplify Your
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-600 mt-2">
              Academic Journey
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto mb-12 leading-relaxed">
            All-in-one platform for students to manage schedules, track
            expenses, plan studies, and prepare for exams - all in one place.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              size="lg"
              asChild
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 rounded-full px-8"
            >
              <Link to="/register" className="flex items-center">
                Get Started Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              asChild
              className="border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-full px-8 transition-all duration-300"
            >
              <Link to="/features">View Features</Link>
            </Button>
          </div>

          {/* Feature Preview */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {[
              {
                icon: Calendar,
                title: "Schedule",
                color: "text-amber-600 dark:text-amber-400",
                bg: "bg-amber-50 dark:bg-amber-900/20",
              },
              {
                icon: DollarSign,
                title: "Budget",
                color: "text-amber-600 dark:text-amber-400",
                bg: "bg-amber-50 dark:bg-amber-900/20",
              },
              {
                icon: BookOpen,
                title: "Study",
                color: "text-amber-600 dark:text-amber-400",
                bg: "bg-amber-50 dark:bg-amber-900/20",
              },
              {
                icon: ClipboardList,
                title: "Exams",
                color: "text-amber-600 dark:text-amber-400",
                bg: "bg-amber-50 dark:bg-amber-900/20",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className={cn(
                  "bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm border border-amber-100 dark:border-amber-900/30 transition-all duration-300 hover:shadow-md hover:-translate-y-1 group",
                  feature.bg
                )}
              >
                <div className="flex justify-center mb-3">
                  <div className="p-3 rounded-full bg-white dark:bg-gray-700 shadow-sm group-hover:shadow-md transition-shadow">
                    <feature.icon className={cn("h-6 w-6", feature.color)} />
                  </div>
                </div>
                <p className="text-sm font-medium text-gray-900 dark:text-white text-center">
                  {feature.title}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Wave Separator */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          className="w-full h-20 fill-white dark:fill-gray-900"
          viewBox="0 0 1440 120"
          preserveAspectRatio="none"
        >
          <path d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,58.7C960,64,1056,64,1152,58.7C1248,53,1344,43,1392,37.3L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"></path>
        </svg>
      </div>

      {/* Custom animation styles */}
      <style>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </section>
  );
};

export default HeroSection;
