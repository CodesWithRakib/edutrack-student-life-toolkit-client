import React from "react";
import { TrendingUp, Heart, Clock, Users } from "lucide-react";

const ImpactSection: React.FC = () => {
  const impactStats = [
    {
      value: "50K+",
      label: "Students Helped",
      description: "Across 50+ countries worldwide",
      icon: Users,
    },
    {
      value: "85%",
      label: "Grade Improvement",
      description: "Average increase in student performance",
      icon: TrendingUp,
    },
    {
      value: "40%",
      label: "Time Saved",
      description: "Average reduction in study organization time",
      icon: Clock,
    },
    {
      value: "98%",
      label: "Satisfaction",
      description: "Student satisfaction rate",
      icon: Heart,
    },
  ];

  const testimonials = [
    {
      quote:
        "EduTrack transformed how I manage my academic life. I went from struggling to keep up to being on top of everything!",
      author: "Emma Thompson",
      role: "Computer Science Student",
      university: "Stanford University",
      improvement: "GPA increased by 0.8",
    },
    {
      quote:
        "The budget tracker feature helped me save $2000 last semester while still enjoying college life.",
      author: "James Rodriguez",
      role: "Business Administration",
      university: "University of Michigan",
      improvement: "Saved $2000",
    },
    {
      quote:
        "As a working student, EduTrack's scheduling feature is a lifesaver. I can balance work and studies perfectly.",
      author: "Lisa Chen",
      role: "Nursing Student",
      university: "Johns Hopkins University",
      improvement: "Better work-life balance",
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Making a Real
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-600">
              Impact in Education
            </span>
          </h2>
          <p className="text-lg text-gray-700 dark:text-gray-300">
            We measure our success by the academic achievements and personal
            growth of our students.
          </p>
        </div>

        {/* Impact Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-16 md:mb-20">
          {impactStats.map((stat, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 text-center border border-amber-100 dark:border-amber-900/30 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1"
            >
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/20 dark:to-orange-900/20 flex items-center justify-center mx-auto mb-4">
                <stat.icon className="h-8 w-8 text-amber-600 dark:text-amber-400" />
              </div>
              <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-600 mb-2">
                {stat.value}
              </div>
              <div className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                {stat.label}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {stat.description}
              </div>
            </div>
          ))}
        </div>

        {/* Testimonials */}
        <div className="mb-16 md:mb-20">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Student Success Stories
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-amber-100 dark:border-amber-900/30 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
              >
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center text-white font-bold shadow-md">
                    {testimonial.author
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      {testimonial.author}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {testimonial.role}
                    </p>
                    <p className="text-xs text-amber-600 dark:text-amber-400 font-medium">
                      {testimonial.university}
                    </p>
                  </div>
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-4 italic">
                  "{testimonial.quote}"
                </p>
                <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-3 text-center border border-amber-100 dark:border-amber-900/30">
                  <div className="text-sm font-medium text-amber-700 dark:text-amber-400">
                    {testimonial.improvement}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Case Study */}
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-2xl p-6 md:p-8 lg:p-12 border border-amber-100 dark:border-amber-900/30">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Case Study: University Partnership
              </h3>
              <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                Our partnership with State University resulted in a 35%
                improvement in student retention rates and a 28% increase in
                overall GPA among participating students.
              </p>
              <div className="space-y-4 mb-6">
                {[
                  { label: "Partnership Duration", value: "2 Years" },
                  { label: "Students Enrolled", value: "5,000+" },
                  { label: "Retention Improvement", value: "+35%" },
                  { label: "GPA Increase", value: "+0.7 Average" },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center bg-white dark:bg-gray-800 rounded-lg p-3 border border-amber-100 dark:border-amber-900/20"
                  >
                    <span className="text-gray-700 dark:text-gray-300">
                      {item.label}
                    </span>
                    <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-600">
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
              <button className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-medium py-3 px-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                Download Full Case Study
              </button>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-amber-100 dark:border-amber-900/30">
              <div className="text-center mb-6">
                <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-600 mb-2">
                  35%
                </div>
                <div className="text-gray-600 dark:text-gray-400">
                  Retention Rate Improvement
                </div>
              </div>
              <div className="space-y-3">
                {[
                  {
                    label: "Before EduTrack",
                    value: 65,
                    color: "bg-gray-300 dark:bg-gray-600",
                  },
                  {
                    label: "After EduTrack",
                    value: 88,
                    color: "bg-gradient-to-r from-amber-500 to-orange-500",
                  },
                ].map((item, index) => (
                  <div key={index}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-700 dark:text-gray-300">
                        {item.label}
                      </span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {item.value}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full ${item.color}`}
                        style={{ width: `${item.value}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ImpactSection;
