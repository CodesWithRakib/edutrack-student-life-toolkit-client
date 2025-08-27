import React from "react";
import { DollarSign, TrendingUp, PiggyBank, CreditCard } from "lucide-react";
import { cn } from "@/lib/utils";

const BudgetTrackerSection: React.FC = () => {
  const budgetFeatures = [
    {
      icon: DollarSign,
      title: "Expense Tracking",
      description:
        "Track every expense with categories and tags for better financial management.",
      benefits: [
        "Manual & auto imports",
        "Receipt scanning",
        "Custom categories",
      ],
    },
    {
      icon: TrendingUp,
      title: "Spending Analytics",
      description:
        "Visualize your spending patterns with detailed charts and insights.",
      benefits: ["Monthly reports", "Category breakdowns", "Trend analysis"],
    },
    {
      icon: PiggyBank,
      title: "Budget Planning",
      description:
        "Set budgets for different categories and monitor your spending in real-time.",
      benefits: ["Budget limits", "Alerts & warnings", "Savings goals"],
    },
    {
      icon: CreditCard,
      title: "Financial Goals",
      description:
        "Set and track financial goals to build better money habits.",
      benefits: [
        "Goal tracking",
        "Progress visualization",
        "Achievement rewards",
      ],
    },
  ];

  return (
    <section className="py-20 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-gray-700">
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    Monthly Budget
                  </h3>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    October 2023
                  </div>
                </div>
                <div className="space-y-4">
                  {[
                    {
                      category: "Food",
                      spent: 320,
                      budget: 400,
                      color: "bg-green-500",
                    },
                    {
                      category: "Transport",
                      spent: 150,
                      budget: 200,
                      color: "bg-blue-500",
                    },
                    {
                      category: "Books",
                      spent: 80,
                      budget: 100,
                      color: "bg-purple-500",
                    },
                    {
                      category: "Entertainment",
                      spent: 60,
                      budget: 150,
                      color: "bg-orange-500",
                    },
                  ].map((item, index) => (
                    <div key={index}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-700 dark:text-gray-300">
                          {item.category}
                        </span>
                        <span className="text-gray-600 dark:text-gray-400">
                          ${item.spent} / ${item.budget}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${item.color}`}
                          style={{
                            width: `${(item.spent / item.budget) * 100}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-green-200 dark:border-green-800">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Total Spent
                    </span>
                    <span className="text-lg font-bold text-green-600 dark:text-green-400">
                      $610 / $850
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 mt-4">
                {[
                  { label: "This Month", value: "$610", change: "-12%" },
                  { label: "Savings", value: "$240", change: "+8%" },
                  { label: "Avg/Day", value: "$20.33", change: "-5%" },
                ].map((stat, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 text-center"
                  >
                    <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                      {stat.label}
                    </div>
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {stat.value}
                    </div>
                    <div
                      className={`text-xs ${
                        stat.change.startsWith("+")
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {stat.change}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-sm font-medium mb-4">
              <DollarSign className="h-4 w-4 mr-2" />
              Budget Tracker
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Take Control of Your
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">
                Student Finances
              </span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
              Manage your money like a pro with our comprehensive budget
              tracking system designed specifically for students.
            </p>

            <div className="space-y-6">
              {budgetFeatures.map((feature, index) => (
                <div
                  key={index}
                  className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex items-start space-x-3">
                    <div
                      className={cn(
                        "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0",
                        "bg-green-100 dark:bg-green-900/30"
                      )}
                    >
                      <feature.icon className="h-5 w-5 text-green-600 dark:text-green-400" />
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

export default BudgetTrackerSection;
