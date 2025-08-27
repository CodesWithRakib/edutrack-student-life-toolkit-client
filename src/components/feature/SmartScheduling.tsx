import React from "react";
import { Calendar, Clock, Bell, Tag, Users, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const SmartSchedulingSection: React.FC = () => {
  const scheduleFeatures = [
    {
      icon: Calendar,
      title: "Class Timetables",
      description:
        "Create and manage your weekly class schedule with an intuitive calendar interface.",
      benefits: [
        "Drag & drop interface",
        "Weekly and monthly views",
        "Conflict detection",
      ],
    },
    {
      icon: Clock,
      title: "Assignment Tracking",
      description:
        "Never miss a deadline with our comprehensive assignment management system.",
      benefits: ["Priority levels", "Progress tracking", "Time estimates"],
    },
    {
      icon: Bell,
      title: "Smart Reminders",
      description:
        "Get notified about upcoming classes, assignments, and exams at the right time.",
      benefits: [
        "Custom notifications",
        "Multiple reminder types",
        "Snooze options",
      ],
    },
    {
      icon: Tag,
      title: "Color Coding",
      description:
        "Organize your schedule with custom colors for different subjects and activities.",
      benefits: [
        "Subject-based colors",
        "Activity types",
        "Personal preferences",
      ],
    },
  ];

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm font-medium mb-4">
              <Calendar className="h-4 w-4 mr-2" />
              Smart Scheduling
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Never Miss a
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                Class Again
              </span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
              Our intelligent scheduling system helps you organize your academic
              life efficiently, ensuring you're always on top of your
              commitments.
            </p>

            <div className="space-y-6">
              {scheduleFeatures.map((feature, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex items-start space-x-3">
                    <div
                      className={cn(
                        "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0",
                        "bg-blue-100 dark:bg-blue-900/30"
                      )}
                    >
                      <feature.icon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {feature.description}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {feature.benefits.map((benefit, benefitIndex) => (
                          <span
                            key={benefitIndex}
                            className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded"
                          >
                            {benefit}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-gray-700">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    Weekly Schedule
                  </h3>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Oct 23-29, 2023
                  </div>
                </div>
                <div className="space-y-2">
                  {[
                    {
                      time: "9:00 AM",
                      subject: "Computer Science",
                      color: "bg-blue-500",
                    },
                    {
                      time: "11:00 AM",
                      subject: "Mathematics",
                      color: "bg-green-500",
                    },
                    {
                      time: "2:00 PM",
                      subject: "Physics Lab",
                      color: "bg-purple-500",
                    },
                    {
                      time: "4:00 PM",
                      subject: "Study Group",
                      color: "bg-orange-500",
                    },
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-3 p-2 rounded hover:bg-white/50 dark:hover:bg-gray-800/50 transition-colors"
                    >
                      <div className="w-2 h-12 rounded-full bg-gray-300 dark:bg-gray-600"></div>
                      <div className="flex-1">
                        <div className="text-xs text-gray-600 dark:text-gray-400">
                          {item.time}
                        </div>
                        <div className="flex items-center space-x-2">
                          <div
                            className={`w-3 h-3 rounded-full ${item.color}`}
                          ></div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {item.subject}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <CheckCircle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                    <span className="font-medium text-gray-900 dark:text-white">
                      Upcoming
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Math Assignment due in 2 days
                  </div>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Users className="h-5 w-5 text-green-600 dark:text-green-400" />
                    <span className="font-medium text-gray-900 dark:text-white">
                      Study Group
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Physics review tomorrow
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SmartSchedulingSection;
