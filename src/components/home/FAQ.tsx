import React, { useState } from "react";
import { Plus, Minus } from "lucide-react";

const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "Is EduTrack really free to use?",
      answer:
        "Yes! We offer a generous free plan that includes all core features like schedule management, expense tracking, and basic study planning. Premium features are available in our Pro plan for $9.99/month.",
    },
    {
      question: "Can I cancel my subscription anytime?",
      answer:
        "Absolutely! You can cancel your subscription at any time with no cancellation fees. You'll continue to have access to premium features until the end of your billing period.",
    },
    {
      question: "How does the AI study planner work?",
      answer:
        "Our AI study planner analyzes your course schedule, learning preferences, and academic goals to create personalized study plans. It adapts based on your progress and suggests optimal study times and methods.",
    },
    {
      question: "Is my data secure with EduTrack?",
      answer:
        "Yes, we take data security very seriously. All your data is encrypted in transit and at rest. We comply with GDPR and other privacy regulations, and we never sell your data to third parties.",
    },
    {
      question: "Can I use EduTrack on multiple devices?",
      answer:
        "Yes! EduTrack works seamlessly across all your devices - desktop, tablet, and mobile. Your data syncs automatically so you can access it anywhere, anytime.",
    },
    {
      question: "Do you offer discounts for students?",
      answer:
        "We believe in making education accessible. That's why we offer a 50% discount for students with valid .edu email addresses. Contact our support team to claim your discount.",
    },
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Frequently Asked
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-600">
              Questions
            </span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Everything you need to know about EduTrack. Can't find the answer
            you're looking for? Please chat to our friendly team.
          </p>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-xl border border-amber-100 dark:border-amber-900/30 overflow-hidden transition-all duration-300 hover:shadow-md"
            >
              <button
                className="w-full flex items-center justify-between p-5 md:p-6 text-left"
                onClick={() => toggleFAQ(index)}
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white pr-4">
                  {faq.question}
                </h3>
                <div className="flex-shrink-0 ml-4">
                  {openIndex === index ? (
                    <Minus className="h-5 w-5 text-amber-500" />
                  ) : (
                    <Plus className="h-5 w-5 text-amber-500" />
                  )}
                </div>
              </button>
              {openIndex === index && (
                <div className="px-5 md:px-6 pb-5 md:pb-6">
                  <div className="pt-4 border-t border-amber-100 dark:border-amber-900/30">
                    <p className="text-gray-600 dark:text-gray-400">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 md:mt-20 text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Still have questions?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-medium py-3 px-8 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              Contact Support
            </button>
            <button className="border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300 font-medium py-3 px-8 rounded-full hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-all duration-300">
              View Documentation
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
