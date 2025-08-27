import React from "react";
import { ClipboardList, FileText, BarChart3, Timer } from "lucide-react";
import { cn } from "@/lib/utils";

const ExamGeneratorSection: React.FC = () => {
  const examFeatures = [
    {
      icon: FileText,
      title: "Question Banks",
      description:
        "Access thousands of questions across all subjects and difficulty levels.",
      benefits: ["Subject-specific", "Difficulty levels", "Regular updates"],
    },
    {
      icon: BarChart3,
      title: "Performance Analytics",
      description:
        "Track your progress with detailed performance reports and insights.",
      benefits: [
        "Strength analysis",
        "Weakness identification",
        "Progress trends",
      ],
    },
    {
      icon: Timer,
      title: "Time Management",
      description:
        "Practice under realistic exam conditions with built-in timers.",
      benefits: ["Simulated exams", "Time tracking", "Pacing guidance"],
    },
    {
      icon: ClipboardList,
      title: "Custom Exams",
      description:
        "Create personalized practice tests based on your specific needs.",
      benefits: [
        "Topic selection",
        "Difficulty customization",
        "Length options",
      ],
    },
  ];

  const questionTypes = [
    { type: "Multiple Choice", count: 1500, color: "bg-blue-500" },
    { type: "True/False", count: 800, color: "bg-green-500" },
    { type: "Short Answer", count: 600, color: "bg-purple-500" },
    { type: "Essay", count: 300, color: "bg-orange-500" },
  ];

  return (
    <section className="py-20 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-gray-700">
              <div className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    Practice Test
                  </h3>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Mathematics • 20 Questions
                  </div>
                </div>
                <div className="space-y-4">
                  {[
                    {
                      question: "What is the derivative of x²?",
                      options: ["2x", "x²", "2x²", "x/2"],
                    },
                    {
                      question: "Solve for x: 2x + 5 = 15",
                      options: ["x = 5", "x = 10", "x = 7.5", "x = 15"],
                    },
                    {
                      question: "What is the integral of 2x dx?",
                      options: ["x² + C", "2x² + C", "x + C", "2x + C"],
                    },
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-3"
                    >
                      <div className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                        {index + 1}. {item.question}
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {item.options.map((option, optionIndex) => (
                          <div
                            key={optionIndex}
                            className="text-xs p-2 rounded border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                          >
                            {option}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-orange-200 dark:border-orange-800 flex justify-between items-center">
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Question 3 of 20
                  </div>
                  <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                    Next Question
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-4">
                {questionTypes.map((item, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 flex items-center space-x-3"
                  >
                    <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                    <div>
                      <div className="text-xs font-medium text-gray-900 dark:text-white">
                        {item.type}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        {item.count} questions
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 text-sm font-medium mb-4">
              <ClipboardList className="h-4 w-4 mr-2" />
              Exam Generator
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Ace Your Exams with
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600">
                Smart Practice
              </span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
              Generate unlimited practice questions and mock exams tailored to
              your curriculum and learning needs.
            </p>

            <div className="space-y-6">
              {examFeatures.map((feature, index) => (
                <div
                  key={index}
                  className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex items-start space-x-3">
                    <div
                      className={cn(
                        "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0",
                        "bg-orange-100 dark:bg-orange-900/30"
                      )}
                    >
                      <feature.icon className="h-5 w-5 text-orange-600 dark:text-orange-400" />
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
        </div>
      </div>
    </section>
  );
};

export default ExamGeneratorSection;
