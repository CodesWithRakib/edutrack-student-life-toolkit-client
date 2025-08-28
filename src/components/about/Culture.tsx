import React from "react";
import { Heart, Brain, Zap, Users } from "lucide-react";
import { cn } from "@/lib/utils";

const CultureSection: React.FC = () => {
  const cultureValues = [
    {
      icon: Heart,
      title: "Student-First",
      description:
        "Every decision we make starts with what's best for our students.",
      color: "text-red-500 dark:text-red-400",
      bgColor: "bg-red-100 dark:bg-red-900/30",
    },
    {
      icon: Brain,
      title: "Continuous Learning",
      description:
        "We're always learning, growing, and improving our skills and knowledge.",
      color: "text-purple-500 dark:text-purple-400",
      bgColor: "bg-purple-100 dark:bg-purple-900/30",
    },
    {
      icon: Zap,
      title: "Innovation",
      description:
        "We embrace new ideas and approaches to solve educational challenges.",
      color: "text-yellow-500 dark:text-yellow-400",
      bgColor: "bg-yellow-100 dark:bg-yellow-900/30",
    },
    {
      icon: Users,
      title: "Collaboration",
      description: "We believe the best solutions come from working together.",
      color: "text-green-500 dark:text-green-400",
      bgColor: "bg-green-100 dark:bg-green-900/30",
    },
  ];

  const benefits = [
    "Flexible work arrangements",
    "Professional development budget",
    "Health, dental, and vision insurance",
    "Unlimited PTO policy",
    "Equity options for all employees",
    "Learning and growth opportunities",
    "Modern office with free meals",
    "Wellness programs and gym access",
  ];

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-sm font-medium mb-4">
              Our Culture
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Where Passion Meets
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                Purpose
              </span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
              At EduTrack, we've built a culture where innovation thrives,
              collaboration is encouraged, and every team member has the
              opportunity to make a real impact on education.
            </p>

            <div className="space-y-6 mb-8">
              {cultureValues.map((value, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div
                    className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0",
                      value.bgColor
                    )}
                  >
                    <value.icon className={cn("h-6 w-6", value.color)} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                      {value.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {value.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
              Why Join EduTrack?
            </h3>

            <div className="grid grid-cols-2 gap-4 mb-6">
              {benefits.slice(0, 6).map((benefit, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {benefit}
                  </span>
                </div>
              ))}
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-6 mb-6">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                Our Team Says
              </h4>
              <div className="space-y-4">
                {[
                  {
                    quote:
                      "Working at EduTrack feels like being part of a mission, not just a company.",
                    author: "Sarah, Product Designer",
                  },
                  {
                    quote:
                      "I love that I can directly see how my work helps students succeed.",
                    author: "Michael, Software Engineer",
                  },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-3"
                  >
                    <p className="text-sm text-gray-700 dark:text-gray-300 italic mb-1">
                      "{item.quote}"
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      — {item.author}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-center">
              <button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all w-full">
                Explore Career Opportunities
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CultureSection;
