import React from "react";
import {
  ArrowRight,
  CheckCircle,
  UserCheck,
  BookOpen,
  Target,
  BarChart3,
} from "lucide-react";

const HowItWorksSection: React.FC = () => {
  const steps = [
    {
      icon: UserCheck,
      title: "Create Your Account",
      description: "Sign up in seconds and set up your academic profile.",
    },
    {
      icon: BookOpen,
      title: "Add Your Courses",
      description: "Import your schedule and subjects with just a few clicks.",
    },
    {
      icon: Target,
      title: "Set Your Goals",
      description: "Define your academic objectives and study preferences.",
    },
    {
      icon: BarChart3,
      title: "Track Progress",
      description: "Monitor your performance and get AI-powered insights.",
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-gray-900 dark:to-gray-800">
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-16 md:mb-24">
          {steps.map((step, index) => (
            <div key={index} className="relative group">
              {/* Step Number */}
              <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center text-white font-bold text-sm shadow-lg z-10">
                {index + 1}
              </div>

              {/* Step Content */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 h-full border border-amber-100 dark:border-amber-900/30 shadow-sm transition-all duration-300 group-hover:shadow-md group-hover:-translate-y-1">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4 bg-amber-100 dark:bg-amber-900/30">
                  <step.icon className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {step.description}
                </p>
              </div>

              {/* Arrow Connector - Desktop Only */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/30">
                    <ArrowRight className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Benefits */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 md:p-8 lg:p-12 border border-amber-100 dark:border-amber-900/30 shadow-sm">
          <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Why Students Love EduTrack
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
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
              <div
                key={index}
                className="text-center p-4 rounded-xl transition-all duration-300 hover:bg-amber-50 dark:hover:bg-amber-900/10"
              >
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 flex items-center justify-center mx-auto mb-4">
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
