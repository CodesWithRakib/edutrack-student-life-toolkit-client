import React from "react";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

const FeatureComparison: React.FC = () => {
  const features = [
    { name: "Smart Scheduling", description: "Organize classes and deadlines" },
    { name: "Budget Tracking", description: "Manage expenses and finances" },
    { name: "AI Study Planner", description: "Personalized study plans" },
    { name: "Exam Generator", description: "Create practice tests" },
    { name: "Progress Analytics", description: "Track academic performance" },
    { name: "Collaboration Tools", description: "Study groups and sharing" },
    { name: "Mobile App", description: "Access on all devices" },
    { name: "Cloud Sync", description: "Automatic data backup" },
    { name: "Priority Support", description: "24/7 customer service" },
  ];

  const plans = [
    { name: "Free Plan", price: "$0", popular: false },
    { name: "Pro Plan", price: "$9.99/mo", popular: true },
    { name: "Team Plan", price: "$19.99/mo", popular: false },
  ];

  const planFeatures = {
    free: [true, true, false, false, true, false, true, true, false],
    pro: [true, true, true, true, true, true, true, true, true],
    team: [true, true, true, true, true, true, true, true, true],
  };

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Compare Our
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-600">
              Feature Plans
            </span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Choose the plan that best fits your needs. All plans include core
            features with premium options for power users.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
          {/* Plan Headers */}
          <div className="grid grid-cols-4 gap-px bg-gray-200 dark:bg-gray-700">
            <div className="bg-white dark:bg-gray-800 p-6">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Features
              </h3>
            </div>
            {plans.map((plan, index) => (
              <div
                key={index}
                className={cn(
                  "bg-white dark:bg-gray-800 p-6 text-center",
                  plan.popular && "relative"
                )}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                      MOST POPULAR
                    </div>
                  </div>
                )}
                <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-1">
                  {plan.name}
                </h3>
                <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-600">
                  {plan.price}
                </div>
              </div>
            ))}
          </div>

          {/* Feature Rows */}
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {features.map((feature, index) => (
              <div
                key={index}
                className="grid grid-cols-4 gap-px bg-gray-200 dark:bg-gray-700"
              >
                <div className="bg-white dark:bg-gray-800 p-6">
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    {feature.name}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {feature.description}
                  </p>
                </div>
                {plans.map((_, planIndex) => (
                  <div
                    key={planIndex}
                    className="bg-white dark:bg-gray-800 p-6 flex items-center justify-center"
                  >
                    {planFeatures[
                      planIndex === 0
                        ? "free"
                        : planIndex === 1
                        ? "pro"
                        : "team"
                    ][index] ? (
                      <Check className="h-6 w-6 text-green-500" />
                    ) : (
                      <X className="h-6 w-6 text-gray-400" />
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* CTA Row */}
          <div className="grid grid-cols-4 gap-px bg-gray-200 dark:bg-gray-700">
            <div className="bg-white dark:bg-gray-800 p-6"></div>
            {plans.map((plan, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 p-6 text-center"
              >
                <button
                  className={cn(
                    "w-full py-2 px-4 rounded-lg font-medium transition-all",
                    plan.popular
                      ? "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg"
                      : "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white"
                  )}
                >
                  Get Started
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeatureComparison;
