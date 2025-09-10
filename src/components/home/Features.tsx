import React from "react";
import {
  Calendar,
  DollarSign,
  BookOpen,
  ClipboardList,
  Target,
  BarChart3,
  Users,
  CheckCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

const FeaturesSection: React.FC = () => {
  const features = [
    {
      icon: Calendar,
      title: "Smart Scheduling",
      description:
        "Organize your classes with color-coded schedules and never miss an important event.",
      color: "text-amber-600 dark:text-amber-400",
      bgColor: "bg-amber-100 dark:bg-amber-900/30",
    },
    {
      icon: DollarSign,
      title: "Budget Tracker",
      description:
        "Manage your finances with intuitive expense tracking and visual budget reports.",
      color: "text-amber-600 dark:text-amber-400",
      bgColor: "bg-amber-100 dark:bg-amber-900/30",
    },
    {
      icon: BookOpen,
      title: "Study Planner",
      description:
        "Create personalized study plans with smart recommendations based on your goals.",
      color: "text-amber-600 dark:text-amber-400",
      bgColor: "bg-amber-100 dark:bg-amber-900/30",
    },
    {
      icon: ClipboardList,
      title: "Exam Generator",
      description:
        "Generate practice questions and mock exams to test your knowledge effectively.",
      color: "text-amber-600 dark:text-amber-400",
      bgColor: "bg-amber-100 dark:bg-amber-900/30",
    },
  ];

  const uniqueFeatures = [
    { icon: Target, text: "AI-powered study recommendations" },
    { icon: BarChart3, text: "Progress tracking with analytics" },
    { icon: Users, text: "Collaborative study groups" },
    { icon: CheckCircle, text: "Smart reminders and notifications" },
  ];

  return (
    <section className="py-16 md:py-24 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Everything You Need to
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-600">
              Succeed Academically
            </span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Powerful features designed to help students stay organized, focused,
            and on top of their academic journey.
          </p>
        </div>

        {/* Main Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-16 md:mb-24">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border border-gray-100 dark:border-gray-700"
            >
              <div
                className={cn(
                  "w-14 h-14 rounded-xl flex items-center justify-center mb-4 transition-all duration-300",
                  feature.bgColor
                )}
              >
                <feature.icon className={cn("h-7 w-7", feature.color)} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Unique Features Section */}
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-6 md:p-8 lg:p-12 border border-amber-100 dark:border-amber-900/30">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
            <div>
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6">
                What Makes EduTrack
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-600">
                  Truly Unique
                </span>
              </h3>
              <div className="space-y-4">
                {uniqueFeatures.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-start space-x-4 p-3 rounded-lg hover:bg-white/50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <div
                      className={cn(
                        "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0",
                        "bg-amber-100 dark:bg-amber-900/30"
                      )}
                    >
                      <item.icon className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 font-medium">
                      {item.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
              <div className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg p-6 text-white">
                <h4 className="text-lg font-semibold mb-4">
                  Sample Study Plan
                </h4>
                <div className="space-y-3">
                  {[
                    "Monday: Math (2 hours)",
                    "Tuesday: History (1.5 hours)",
                    "Wednesday: Science (2 hours)",
                    "Thursday: Language (1 hour)",
                    "Friday: Review & Practice (2 hours)",
                  ].map((item, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-300" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-6 pt-4 border-t border-amber-400/30">
                  <button className="w-full py-3 bg-white/20 hover:bg-white/30 rounded-lg font-medium transition-colors duration-300">
                    Generate Your Plan
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
