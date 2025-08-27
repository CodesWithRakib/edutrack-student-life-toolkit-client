import React from "react";
import {
  ArrowRight,
  CheckCircle,
  UserCheck,
  BookOpen,
  Target,
  BarChart3,
} from "lucide-react";
import { cn } from "@/lib/utils";

const HowItWorksSection: React.FC = () => {
  const steps = [
    {
      icon: UserCheck,
      title: "Create Your Account",
      description: "Sign up in seconds and set up your academic profile.",
      color: "text-blue-600 dark:text-blue-400",
    },
    {
      icon: BookOpen,
      title: "Add Your Courses",
      description: "Import your schedule and subjects with just a few clicks.",
      color: "text-green-600 dark:text-green-400",
    },
    {
      icon: Target,
      title: "Set Your Goals",
      description: "Define your academic objectives and study preferences.",
      color: "text-purple-600 dark:text-purple-400",
    },
    {
      icon: BarChart3,
      title: "Track Progress",
      description: "Monitor your performance and get AI-powered insights.",
      color: "text-orange-600 dark:text-orange-400",
    },
  ];

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            How EduTrack
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-600">
              Works For You
            </span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Get started in minutes and transform your academic experience with
            our simple 4-step process.
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              {/* Step Number */}
              <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center text-white font-bold text-sm shadow-lg">
                {index + 1}
              </div>

              {/* Step Content */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 h-full border border-gray-200 dark:border-gray-700 shadow-sm">
                <div
                  className={cn(
                    "w-12 h-12 rounded-lg flex items-center justify-center mb-4",
                    "bg-gray-100 dark:bg-gray-700"
                  )}
                >
                  <step.icon className={cn("h-6 w-6", step.color)} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {step.description}
                </p>
              </div>

              {/* Arrow Connector */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                  <ArrowRight className="h-8 w-8 text-gray-400" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Benefits */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 md:p-12 border border-gray-200 dark:border-gray-700">
          <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Why Students Love EduTrack
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: "Save 5+ Hours Weekly",
                description:
                  "Automate routine tasks and focus on what matters most.",
              },
              {
                title: "Improve Grades by 20%",
                description:
                  "Our study methods are proven to boost academic performance.",
              },
              {
                title: "Reduce Stress Levels",
                description:
                  "Stay organized and in control of your academic life.",
              },
            ].map((benefit, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-amber-600 dark:text-amber-400" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {benefit.title}
                </h4>
                <p className="text-gray-600 dark:text-gray-400">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
