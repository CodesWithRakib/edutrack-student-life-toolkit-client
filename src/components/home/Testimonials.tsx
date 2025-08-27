import React from "react";
import { Star, Quote } from "lucide-react";
import { cn } from "@/lib/utils";

const TestimonialsSection: React.FC = () => {
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Computer Science Student",
      university: "Stanford University",
      content:
        "EduTrack has completely transformed how I manage my academic life. The AI study planner helped me improve my GPA from 3.2 to 3.8 in just one semester!",
      rating: 5,
    },
    {
      name: "Michael Chen",
      role: "Business Administration",
      university: "Harvard Business School",
      content:
        "The budget tracker feature is a game-changer. I've saved over $2,000 this semester by tracking my expenses and finding better deals on textbooks.",
      rating: 5,
    },
    {
      name: "Emily Rodriguez",
      role: "Pre-Med Student",
      university: "Johns Hopkins University",
      content:
        "As a pre-med student with a heavy course load, EduTrack keeps me organized and stress-free. The exam generator is perfect for preparing for tough exams.",
      rating: 5,
    },
  ];

  const stats = [
    { value: "50K+", label: "Active Students" },
    { value: "98%", label: "Satisfaction Rate" },
    { value: "4.8/5", label: "Average Rating" },
    { value: "200+", label: "Universities" },
  ];

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={cn(
          "h-4 w-4",
          i < rating
            ? "text-amber-400 fill-current"
            : "text-gray-300 dark:text-gray-600"
        )}
      />
    ));
  };

  return (
    <section className="py-20 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            What Our
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-600">
              Students Say
            </span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Join thousands of students who have transformed their academic
            journey with EduTrack.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-600 mb-2">
                {stat.value}
              </div>
              <div className="text-gray-600 dark:text-gray-400">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Testimonials */}
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center mb-4">
                <div className="flex">{renderStars(testimonial.rating)}</div>
                <Quote className="h-5 w-5 text-gray-400 ml-2" />
              </div>
              <p className="text-gray-700 dark:text-gray-300 mb-6 italic">
                "{testimonial.content}"
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-amber-400 to-orange-400 flex items-center justify-center text-white font-bold text-lg mr-4">
                  {testimonial.name.charAt(0)}
                </div>
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {testimonial.role}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-500">
                    {testimonial.university}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Ready to join thousands of successful students?
          </p>
          <button className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-medium py-3 px-8 rounded-lg shadow-lg hover:shadow-xl transition-all">
            Get Started for Free
          </button>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
