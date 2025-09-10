import React from "react";
import { BookOpen, Target, Users, Lightbulb } from "lucide-react";

const MissionSection: React.FC = () => {
  const values = [
    {
      icon: BookOpen,
      title: "Accessibility",
      description:
        "Making quality education tools accessible to every student, regardless of background or location.",
    },
    {
      icon: Target,
      title: "Excellence",
      description:
        "Committed to providing the highest quality tools that help students achieve their academic goals.",
    },
    {
      icon: Users,
      title: "Community",
      description:
        "Building a supportive community where students can learn, grow, and succeed together.",
    },
    {
      icon: Lightbulb,
      title: "Innovation",
      description:
        "Continuously innovating to bring cutting-edge solutions to educational challenges.",
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Our Mission and
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-600">
              Core Values
            </span>
          </h2>
          <p className="text-lg text-gray-700 dark:text-gray-300">
            We believe every student deserves the tools and support to reach
            their full potential.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {values.map((value, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 text-center border border-amber-100 dark:border-amber-900/30 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1"
            >
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/20 dark:to-orange-900/20 transition-all duration-300 group-hover:scale-110">
                <value.icon className="h-8 w-8 text-amber-600 dark:text-amber-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                {value.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MissionSection;
