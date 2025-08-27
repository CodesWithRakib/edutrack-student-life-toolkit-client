import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, Star, Users } from "lucide-react";

const CTASection: React.FC = () => {
  return (
    <section className="relative py-20 bg-gradient-to-br from-amber-500 to-orange-600 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iLjIiPjxwYXRoIGQ9Ik0zNiAzNGgtMnYtMmgydjJ6bTAgNGgtMnYtMmgydjJ6bTAtNGgtMnYtMmgydjJ6bTAtNGgtMnYtMmgydjJ6bTAtNGgtMnYtMmgydjJ6Ii8+PC9nPjwvZz48L3N2Zz4=')]"></div>
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 md:p-12 border border-white/20">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 bg-white/20 rounded-full mb-6">
            <Star className="h-4 w-4 text-white mr-2" />
            <span className="text-sm font-medium text-white">
              Join 50,000+ Happy Students
            </span>
          </div>

          {/* Main Heading */}
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Transform Your
            <span className="block">Academic Journey?</span>
          </h2>

          {/* Subheading */}
          <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
            Start your free 14-day trial today. No credit card required. Cancel
            anytime.
          </p>

          {/* Benefits */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10 max-w-2xl mx-auto">
            {[
              { icon: CheckCircle, text: "14-day free trial" },
              { icon: Users, text: "No credit card required" },
              { icon: Star, text: "Cancel anytime" },
            ].map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-center space-x-2"
              >
                <item.icon className="h-5 w-5 text-white" />
                <span className="text-white font-medium">{item.text}</span>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              size="lg"
              className="bg-white text-amber-600 hover:bg-gray-100 shadow-lg hover:shadow-xl transition-all"
            >
              Start Free Trial
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-white text-white hover:bg-white/10"
            >
              Schedule a Demo
            </Button>
          </div>

          {/* Testimonial */}
          <div className="mt-12 pt-8 border-t border-white/20">
            <div className="flex items-center justify-center space-x-2 text-white/80">
              <span className="text-sm">
                "EduTrack helped me improve my GPA by 0.8 points in just one
                semester!"
              </span>
              <span className="text-sm font-medium">
                — Sarah J., Stanford University
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
