import React from "react";
import {
  Calendar,
  DollarSign,
  BookOpen,
  ClipboardList,
  CheckCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

const FeatureOverview: React.FC = () => {
  const features = [
    {
      icon: Calendar,
      title: "Smart Scheduling",
      description:
        "Organize your classes with color-coded schedules and never miss an important event.",
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-100 dark:bg-blue-900/30",
      features: [
        "Class timetables",
        "Assignment deadlines",
        "Exam reminders",
        "Color coding",
      ],
    },
    {
      icon: DollarSign,
      title: "Budget Tracker",
      description:
        "Manage your finances with intuitive expense tracking and visual budget reports.",
      color: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-100 dark:bg-green-900/30",
      features: [
        "Expense categorization",
        "Budget limits",
        "Spending trends",
        "Financial goals",
      ],
    },
    {
      icon: BookOpen,
      title: "Study Planner",
      description:
        "Create personalized study plans with smart recommendations based on your goals.",
      color: "text-purple-600 dark:text-purple-400",
      bgColor: "bg-purple-100 dark:bg-purple-900/30",
      features: [
        "AI recommendations",
        "Study sessions",
        "Progress tracking",
        "Resource library",
      ],
    },
    {
      icon: ClipboardList,
      title: "Exam Generator",
      description:
        "Generate practice questions and mock exams to test your knowledge effectively.",
      color: "text-orange-600 dark:text-orange-400",
      bgColor: "bg-orange-100 dark:bg-orange-900/30",
      features: [
        "Question banks",
        "Custom difficulty",
        "Performance analysis",
        "Time tracking",
      ],
    },
  ];

  return (
    <section className="py-20 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Everything You Need in
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-600">
              One Platform
            </span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            EduTrack combines all the essential tools students need to succeed
            academically.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="group">
              <div
                className={cn(
                  "w-14 h-14 rounded-xl flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-110",
                  feature.bgColor
                )}
              >
                <feature.icon className={cn("h-7 w-7", feature.color)} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {feature.description}
              </p>
              <ul className="space-y-2">
                {feature.features.map((item, itemIndex) => (
                  <li
                    key={itemIndex}
                    className="flex items-center text-sm text-gray-600 dark:text-gray-400"
                  >
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureOverview;
