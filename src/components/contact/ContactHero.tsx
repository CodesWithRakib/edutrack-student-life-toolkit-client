import React from "react";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Mail, Phone, MapPin } from "lucide-react";

const ContactHero: React.FC = () => {
  return (
    <section className="relative bg-gradient-to-br from-green-50 to-teal-50 dark:from-gray-900 dark:to-gray-800 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5 dark:opacity-10">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMwMDAiIGZpbGwtb3BhY2l0eT0iLjEiPjxwYXRoIGQ9Ik0zNiAzNGgtMnYtMmgydjJ6bTAgNGgtMnYtMmgydjJ6bTAtNGgtMnYtMmgydjJ6bTAtNGgtMnYtMmgydjJ6bTAtNGgtMnYtMmgydjJ6Ii8+PC9nPjwvZz48L3N2Zz4=')]"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
        <div className="text-center">
          {/* Breadcrumb */}
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-600 dark:text-gray-400 mb-6">
            <Link
              to="/"
              className="hover:text-green-600 dark:hover:text-green-400"
            >
              Home
            </Link>
            <span>/</span>
            <span className="text-green-600 dark:text-green-400">Contact</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Get in
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-teal-600">
              Touch With Us
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-10">
            Have questions or feedback? We'd love to hear from you. Our team is
            here to help and ready to assist you.
          </p>

          {/* Quick Contact Options */}
          <div className="grid md:grid-cols-3 gap-6 max-w-2xl mx-auto mb-10">
            {[
              { icon: Mail, text: "hello@edutrack.com", label: "Email Us" },
              { icon: Phone, text: "+1 (555) 123-4567", label: "Call Us" },
              { icon: MapPin, text: "San Francisco, CA", label: "Visit Us" },
            ].map((item, index) => (
              <div
                key={index}
                className="flex flex-col items-center p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow"
              >
                <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-2">
                  <item.icon className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div className="font-medium text-gray-900 dark:text-white mb-1">
                  {item.text}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {item.label}
                </div>
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <Button
            size="lg"
            asChild
            className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 shadow-lg hover:shadow-xl transition-all"
          >
            <Link to="#contact-form" className="flex items-center">
              Send us a Message
              <ArrowLeft className="ml-2 h-4 w-4 rotate-180" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ContactHero;
