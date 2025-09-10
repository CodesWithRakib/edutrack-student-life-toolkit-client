import React from "react";
import { Heart, Brain, Zap, Users } from "lucide-react";

const CultureSection: React.FC = () => {
  const cultureValues = [
    {
      icon: Heart,
      title: "Student-First",
      description:
        "Every decision we make starts with what's best for our students.",
    },
    {
      icon: Brain,
      title: "Continuous Learning",
      description:
        "We're always learning, growing, and improving our skills and knowledge.",
    },
    {
      icon: Zap,
      title: "Innovation",
      description:
        "We embrace new ideas and approaches to solve educational challenges.",
    },
    {
      icon: Users,
      title: "Collaboration",
      description: "We believe the best solutions come from working together.",
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
    <section className="py-16 md:py-24 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 text-sm font-medium mb-4">
              Our Culture
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Where Passion Meets
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-600">
                Purpose
              </span>
            </h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-8 leading-relaxed">
              At EduTrack, we've built a culture where innovation thrives,
              collaboration is encouraged, and every team member has the
              opportunity to make a real impact on education.
            </p>
            <div className="space-y-6 mb-8">
              {cultureValues.map((value, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-4 p-3 rounded-xl transition-all duration-300 hover:bg-amber-50 dark:hover:bg-amber-900/10"
                >
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 bg-amber-100 dark:bg-amber-900/30">
                    <value.icon className="h-6 w-6 text-amber-600 dark:text-amber-400" />
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
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 md:p-8 border border-amber-100 dark:border-amber-900/30 transition-all duration-300 hover:shadow-2xl">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
              Why Join EduTrack?
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              {benefits.slice(0, 6).map((benefit, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-3 p-2 rounded-lg hover:bg-amber-50 dark:hover:bg-amber-900/10 transition-colors"
                >
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500"></div>
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {benefit}
                  </span>
                </div>
              ))}
            </div>
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl p-6 mb-6 border border-amber-100 dark:border-amber-900/30">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                <Heart className="h-5 w-5 text-amber-500 mr-2" />
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
                    className="bg-white dark:bg-gray-800/50 rounded-lg p-4 border border-amber-100 dark:border-amber-900/20 transition-all duration-300 hover:shadow-sm"
                  >
                    <p className="text-sm text-gray-700 dark:text-gray-300 italic mb-2">
                      "{item.quote}"
                    </p>
                    <p className="text-xs text-amber-600 dark:text-amber-400 font-medium">
                      — {item.author}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            <div className="text-center">
              <button className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-medium py-3 px-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 w-full">
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
