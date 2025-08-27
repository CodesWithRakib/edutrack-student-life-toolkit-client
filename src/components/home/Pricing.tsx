import React from "react";
import { Check, Star, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

const PricingSection: React.FC = () => {
  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      description: "Perfect for students just getting started",
      features: [
        "Basic schedule management",
        "Simple expense tracking",
        "Study plan templates",
        "Limited exam questions",
        "Email support",
      ],
      cta: "Get Started",
      popular: false,
    },
    {
      name: "Pro",
      price: "$9.99",
      period: "per month",
      description: "For serious students who want to excel",
      features: [
        "Everything in Free",
        "Advanced scheduling",
        "Detailed budget analytics",
        "AI-powered study planner",
        "Unlimited exam questions",
        "Progress tracking",
        "Priority support",
      ],
      cta: "Start Free Trial",
      popular: true,
    },
    {
      name: "Team",
      price: "$19.99",
      period: "per month",
      description: "For study groups and classrooms",
      features: [
        "Everything in Pro",
        "Collaborative study spaces",
        "Group scheduling",
        "Team analytics",
        "Admin dashboard",
        "API access",
        "Dedicated support",
      ],
      cta: "Contact Sales",
      popular: false,
    },
  ];

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Simple, Transparent
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-600">
              Pricing
            </span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Choose the plan that works best for you. All plans include a 14-day
            free trial.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={cn(
                "bg-white dark:bg-gray-800 rounded-2xl border-2 overflow-hidden transition-all duration-300 hover:shadow-xl",
                plan.popular
                  ? "border-amber-500 dark:border-amber-400 relative transform scale-105 shadow-lg"
                  : "border-gray-200 dark:border-gray-700"
              )}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold px-4 py-1 rounded-full flex items-center">
                    <Star className="h-3 w-3 mr-1" />
                    MOST POPULAR
                  </div>
                </div>
              )}

              <div className="p-8">
                {/* Plan Name */}
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {plan.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  {plan.description}
                </p>

                {/* Price */}
                <div className="mb-6">
                  <div className="flex items-baseline">
                    <span className="text-4xl font-bold text-gray-900 dark:text-white">
                      {plan.price}
                    </span>
                    <span className="text-gray-600 dark:text-gray-400 ml-2">
                      /{plan.period}
                    </span>
                  </div>
                </div>

                {/* CTA Button */}
                <button
                  className={cn(
                    "w-full py-3 rounded-lg font-medium mb-8 transition-all",
                    plan.popular
                      ? "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg hover:shadow-xl"
                      : "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white"
                  )}
                >
                  {plan.cta}
                </button>

                {/* Features */}
                <ul className="space-y-4">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* FAQ Note */}
        <div className="mt-16 text-center max-w-2xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-center mb-4">
              <Zap className="h-6 w-6 text-amber-500 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Need something custom?
              </h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              We offer custom plans for universities and educational
              institutions. Get in touch with our sales team to discuss your
              requirements.
            </p>
            <button className="text-amber-600 dark:text-amber-400 font-medium hover:underline">
              Contact Sales Team →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
