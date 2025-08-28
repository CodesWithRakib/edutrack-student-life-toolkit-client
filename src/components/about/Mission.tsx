import React from "react";
import { BookOpen, Target, Users, Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";

const MissionSection: React.FC = () => {
  const values = [
    {
      icon: BookOpen,
      title: "Accessibility",
      description:
        "Making quality education tools accessible to every student, regardless of background or location.",
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-100 dark:bg-blue-900/30",
    },
    {
      icon: Target,
      title: "Excellence",
      description:
        "Committed to providing the highest quality tools that help students achieve their academic goals.",
      color: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-100 dark:bg-green-900/30",
    },
    {
      icon: Users,
      title: "Community",
      description:
        "Building a supportive community where students can learn, grow, and succeed together.",
      color: "text-purple-600 dark:text-purple-400",
      bgColor: "bg-purple-100 dark:bg-purple-900/30",
    },
    {
      icon: Lightbulb,
      title: "Innovation",
      description:
        "Continuously innovating to bring cutting-edge solutions to educational challenges.",
      color: "text-orange-600 dark:text-orange-400",
      bgColor: "bg-orange-100 dark:bg-orange-900/30",
    },
  ];

  return (
    <section className="py-20 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Our Mission and
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              Core Values
            </span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            We believe every student deserves the tools and support to reach
            their full potential.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((value, index) => (
            <div key={index} className="text-center group">
              <div
                className={cn(
                  "w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 transition-all duration-300 group-hover:scale-110",
                  value.bgColor
                )}
              >
                <value.icon className={cn("h-8 w-8", value.color)} />
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
