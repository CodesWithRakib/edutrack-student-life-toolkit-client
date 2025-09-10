import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, Star, Users } from "lucide-react";

const CTASection: React.FC = () => {
  return (
    <section className="relative py-16 md:py-24 bg-gradient-to-br from-amber-500 to-orange-600 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iLjIiPjxwYXRoIGQ9Ik0zNiAzNGgtMnYtMmgydjJ6bTAgNGgtMnYtMmgydjJ6bTAtNGgtMnYtMmgydjJ6bTAtNGgtMnYtMmgydjJ6bTAtNGgtMnYtMmgydjJ6Ii8+PC9nPjwvZz48L3N2Zz4=')]"></div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full mix-blend-lighten filter blur-3xl opacity-10 animate-blob"></div>
      <div className="absolute bottom-20 right-10 w-72 h-72 bg-white rounded-full mix-blend-lighten filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="bg-white/15 backdrop-blur-md rounded-3xl p-8 md:p-12 border border-white/20 shadow-2xl">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 bg-white/20 rounded-full mb-8 backdrop-blur-sm">
            <Star className="h-4 w-4 text-white mr-2" />
            <span className="text-sm font-medium text-white">
              Join 50,000+ Happy Students
            </span>
          </div>

          {/* Main Heading */}
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
            Ready to Transform Your
            <span className="block">Academic Journey?</span>
          </h2>

          {/* Subheading */}
          <p className="text-lg md:text-xl text-white/90 mb-10 max-w-2xl mx-auto leading-relaxed">
            Start your free 14-day trial today. No credit card required. Cancel
            anytime.
          </p>

          {/* Benefits */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-2xl mx-auto">
            {[
              { icon: CheckCircle, text: "14-day free trial" },
              { icon: Users, text: "No credit card required" },
              { icon: Star, text: "Cancel anytime" },
            ].map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-center space-x-3 bg-white/10 backdrop-blur-sm rounded-xl p-4 transition-all duration-300 hover:bg-white/20"
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
              className="bg-white text-amber-600 hover:bg-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 rounded-full px-8 py-4 font-semibold"
            >
              Start Free Trial
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-white text-white hover:bg-white/10 rounded-full px-8 py-4 font-semibold transition-all duration-300"
            >
              Schedule a Demo
            </Button>
          </div>

          {/* Testimonial */}
          <div className="mt-12 pt-8 border-t border-white/20">
            <div className="flex flex-col items-center justify-center space-y-2 text-white/80">
              <div className="flex items-center space-x-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 fill-current text-amber-300"
                  />
                ))}
              </div>
              <p className="text-base italic max-w-md mx-auto">
                "EduTrack helped me improve my GPA by 0.8 points in just one
                semester!"
              </p>
              <p className="text-sm font-medium mt-1">
                — Sarah J., Stanford University
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Custom animation styles */}
      <style>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </section>
  );
};

export default CTASection;
