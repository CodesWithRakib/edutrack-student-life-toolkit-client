import React from "react";
import { Calendar, TrendingUp, Award, Globe } from "lucide-react";

const StorySection: React.FC = () => {
  const timeline = [
    {
      year: "2019",
      title: "The Beginning",
      description:
        "EduTrack was founded by a group of students who struggled with managing their academic lives.",
      icon: Calendar,
    },
    {
      year: "2020",
      title: "First Launch",
      description:
        "Launched our MVP with basic scheduling and budget tracking features for 100 beta users.",
      icon: TrendingUp,
    },
    {
      year: "2021",
      title: "Growth & Recognition",
      description:
        "Reached 10,000 active users and received the EdTech Innovation Award.",
      icon: Award,
    },
    {
      year: "2023",
      title: "Global Expansion",
      description:
        "Now serving students in 50+ countries with a comprehensive suite of academic tools.",
      icon: Globe,
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 text-sm font-medium mb-4">
              Our Story
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
              From a Student Idea to
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-600">
                Global Impact
              </span>
            </h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-8 leading-relaxed">
              What started as a simple solution to manage class schedules has
              evolved into a comprehensive platform helping thousands of
              students worldwide achieve academic success.
            </p>
            <div className="space-y-6">
              {timeline.map((item, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-4 p-3 rounded-xl transition-all duration-300 hover:bg-amber-50 dark:hover:bg-amber-900/10"
                >
                  <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 bg-white dark:bg-gray-800 border-2 border-amber-500 shadow-sm">
                    <item.icon className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-1">
                      <span className="text-lg font-bold text-gray-900 dark:text-white">
                        {item.year}
                      </span>
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        {item.title}
                      </span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 md:p-8 border border-amber-100 dark:border-amber-900/30 transition-all duration-300 hover:shadow-2xl">
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl p-6 border border-amber-100 dark:border-amber-900/20">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  Why We Started
                </h3>
                <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                  "As students ourselves, we knew the challenges of juggling
                  classes, assignments, exams, and finances. We needed a single
                  platform to manage everything - and EduTrack was born."
                </p>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center shadow-md">
                    <span className="text-white font-bold">JT</span>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      John Thompson
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      CEO & Co-founder
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-6 grid grid-cols-2 gap-4">
                {[
                  { label: "Founded", value: "2019" },
                  { label: "Team Size", value: "25+" },
                  { label: "Countries", value: "50+" },
                  { label: "Investment", value: "$5M+" },
                ].map((stat, index) => (
                  <div
                    key={index}
                    className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-3 text-center border border-amber-100 dark:border-amber-900/20 transition-all duration-300 hover:shadow-sm"
                  >
                    <div className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-600">
                      {stat.value}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StorySection;
