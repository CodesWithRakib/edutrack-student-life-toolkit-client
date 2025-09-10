import React from "react";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { ArrowLeft, GraduationCap, Users, Target } from "lucide-react";

const AboutHero: React.FC = () => {
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
          {/* Breadcrumb */}
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-600 dark:text-gray-400 mb-8">
            <Link
              to="/"
              className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
            >
              Home
            </Link>
            <span>/</span>
            <span className="text-amber-600 dark:text-amber-400 font-medium">
              About
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight">
            Empowering Students to
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-600 mt-2">
              Achieve Academic Excellence
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto mb-12 leading-relaxed">
            We're on a mission to transform education through technology, making
            learning more accessible, organized, and effective for students
            worldwide.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-2xl mx-auto mb-12">
            {[
              { value: "50K+", label: "Active Students", icon: Users },
              { value: "100+", label: "Institutions", icon: GraduationCap },
              { value: "98%", label: "Success Rate", icon: Target },
            ].map((stat, index) => (
              <div
                key={index}
                className="flex flex-col items-center p-4 rounded-xl bg-white dark:bg-gray-800/50 backdrop-blur-sm border border-amber-100 dark:border-amber-900/30 transition-all duration-300 hover:shadow-md"
              >
                <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-600 mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600 dark:text-gray-400 flex items-center font-medium">
                  <stat.icon className="h-4 w-4 mr-1 text-amber-500" />
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <Button
            size="lg"
            asChild
            className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 rounded-full px-8"
          >
            <Link to="/register" className="flex items-center">
              Join Our Community
              <ArrowLeft className="ml-2 h-4 w-4 rotate-180" />
            </Link>
          </Button>
        </div>
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

export default AboutHero;
