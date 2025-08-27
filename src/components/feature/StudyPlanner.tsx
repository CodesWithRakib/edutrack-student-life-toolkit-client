import React from "react";
import { BookOpen, Brain, Target, Clock, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const StudyPlannerSection: React.FC = () => {
  const plannerFeatures = [
    {
      icon: Brain,
      title: "AI Recommendations",
      description:
        "Get personalized study suggestions based on your learning patterns and goals.",
      benefits: [
        "Learning style analysis",
        "Optimal study times",
        "Content prioritization",
      ],
    },
    {
      icon: Target,
      title: "Goal Setting",
      description:
        "Set academic goals and break them down into manageable study sessions.",
      benefits: ["SMART goals", "Milestone tracking", "Progress visualization"],
    },
    {
      icon: Clock,
      title: "Time Management",
      description:
        "Optimize your study schedule with intelligent time blocking techniques.",
      benefits: ["Pomodoro integration", "Focus sessions", "Break scheduling"],
    },
    {
      icon: BookOpen,
      title: "Resource Library",
      description: "Access and organize all your study materials in one place.",
      benefits: ["Document storage", "Link organization", "Note integration"],
    },
  ];

  const studyPlan = [
    {
      day: "Monday",
      subject: "Mathematics",
      time: "2 hours",
      topic: "Calculus Chapter 3",
    },
    {
      day: "Tuesday",
      subject: "Physics",
      time: "1.5 hours",
      topic: "Thermodynamics",
    },
    {
      day: "Wednesday",
      subject: "Computer Science",
      time: "2 hours",
      topic: "Data Structures",
    },
    {
      day: "Thursday",
      subject: "Chemistry",
      time: "1 hour",
      topic: "Organic Chemistry",
    },
    {
      day: "Friday",
      subject: "Review",
      time: "2 hours",
      topic: "Weekly recap",
    },
  ];

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-sm font-medium mb-4">
              <BookOpen className="h-4 w-4 mr-2" />
              Study Planner
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Study Smarter, Not
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                Harder
              </span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
              Our AI-powered study planner helps you create personalized study
              schedules that adapt to your learning style and academic goals.
            </p>

            <div className="space-y-6">
              {plannerFeatures.map((feature, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex items-start space-x-3">
                    <div
                      className={cn(
                        "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0",
                        "bg-purple-100 dark:bg-purple-900/30"
                      )}
                    >
                      <feature.icon className="h-5 w-5 text-purple-600 dark:text-purple-400" />
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
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    Your Study Plan
                  </h3>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    This Week
                  </div>
                </div>
                <div className="space-y-3">
                  {studyPlan.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                          <span className="text-sm font-medium text-purple-600 dark:text-purple-400">
                            {item.day.substring(0, 3)}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">
                            {item.subject}
                          </div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">
                            {item.topic}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {item.time}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">
                          planned
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Target className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    <span className="font-medium text-gray-900 dark:text-white">
                      Weekly Goal
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    8.5 hours of focused study
                  </div>
                </div>
                <div className="bg-pink-50 dark:bg-pink-900/20 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <CheckCircle className="h-5 w-5 text-pink-600 dark:text-pink-400" />
                    <span className="font-medium text-gray-900 dark:text-white">
                      Progress
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    65% completed this week
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

export default StudyPlannerSection;
