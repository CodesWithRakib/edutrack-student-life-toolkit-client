import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Mail, Phone, MapPin } from "lucide-react";

const AboutCTA: React.FC = () => {
  return (
    <section className="relative py-20 bg-gradient-to-br from-blue-600 to-indigo-700 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iLjIiPjxwYXRoIGQ9Ik0zNiAzNGgtMnYtMmgydjJ6bTAgNGgtMnYtMmgydjJ6bTAtNGgtMnYtMmgydjJ6bTAtNGgtMnYtMmgydjJ6bTAtNGgtMnYtMmgydjJ6Ii8+PC9nPjwvZz48L3N2Zz4=')]"></div>
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 md:p-12 border border-white/20">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 bg-white/20 rounded-full mb-6">
            <Mail className="h-4 w-4 text-white mr-2" />
            <span className="text-sm font-medium text-white">Get in Touch</span>
          </div>

          {/* Main Heading */}
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Transform Your
            <span className="block">Educational Journey?</span>
          </h2>

          {/* Subheading */}
          <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
            Whether you're a student, educator, or institution, we'd love to
            hear from you and explore how we can work together.
          </p>

          {/* Contact Info */}
          <div className="grid md:grid-cols-3 gap-6 mb-10 max-w-2xl mx-auto">
            {[
              { icon: Mail, text: "hello@edutrack.com", label: "Email Us" },
              { icon: Phone, text: "+1 (555) 123-4567", label: "Call Us" },
              { icon: MapPin, text: "San Francisco, CA", label: "Visit Us" },
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-2">
                  <item.icon className="h-6 w-6 text-white" />
                </div>
                <div className="text-white font-medium mb-1">{item.text}</div>
                <div className="text-white/70 text-sm">{item.label}</div>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              size="lg"
              className="bg-white text-blue-600 hover:bg-gray-100 shadow-lg hover:shadow-xl transition-all"
            >
              Start Free Trial
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-white text-white hover:bg-white/10"
            >
              Contact Sales
            </Button>
          </div>

          {/* Additional Info */}
          <div className="mt-8 pt-8 border-t border-white/20">
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 text-white/80 text-sm">
              <span>Available 24/7 for support</span>
              <span>•</span>
              <span>Free demo for institutions</span>
              <span>•</span>
              <span>No credit card required</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutCTA;
