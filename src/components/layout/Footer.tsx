import React from "react";
import { Link } from "react-router";
import {
  GraduationCap,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Github,
  ArrowUp,
  Send,
  Heart,
  Shield,
  Award,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const footerLinks = [
    {
      title: "Product",
      links: [
        { name: "Features", href: "/features" },
        { name: "Pricing", href: "/pricing" },
        { name: "Testimonials", href: "/testimonials" },
        { name: "FAQ", href: "/faq" },
      ],
    },
    {
      title: "Company",
      links: [
        { name: "About Us", href: "/about" },
        { name: "Careers", href: "/careers" },
        { name: "Blog", href: "/blog" },
        { name: "Press", href: "/press" },
      ],
    },
    {
      title: "Resources",
      links: [
        { name: "Documentation", href: "/docs" },
        { name: "Support", href: "/support" },
        { name: "Community", href: "/community" },
        { name: "Help Center", href: "/help" },
      ],
    },
    {
      title: "Legal",
      links: [
        { name: "Privacy Policy", href: "/privacy" },
        { name: "Terms of Service", href: "/terms" },
        { name: "Cookie Policy", href: "/cookies" },
        { name: "GDPR Compliance", href: "/gdpr" },
      ],
    },
  ];

  const socialLinks = [
    {
      name: "Facebook",
      icon: Facebook,
      href: "https://facebook.com/edutrack",
      color:
        "hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-950/20 dark:hover:text-blue-400",
    },
    {
      name: "Twitter",
      icon: Twitter,
      href: "https://twitter.com/edutrack",
      color:
        "hover:bg-sky-50 hover:text-sky-600 dark:hover:bg-sky-950/20 dark:hover:text-sky-400",
    },
    {
      name: "Instagram",
      icon: Instagram,
      href: "https://instagram.com/edutrack",
      color:
        "hover:bg-pink-50 hover:text-pink-600 dark:hover:bg-pink-950/20 dark:hover:text-pink-400",
    },
    {
      name: "LinkedIn",
      icon: Linkedin,
      href: "https://linkedin.com/company/edutrack",
      color:
        "hover:bg-blue-50 hover:text-blue-700 dark:hover:bg-blue-950/20 dark:hover:text-blue-400",
    },
    {
      name: "GitHub",
      icon: Github,
      href: "https://github.com/edutrack",
      color:
        "hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-gray-100",
    },
  ];

  const stats = [
    { icon: Users, label: "Active Users", value: "50K+" },
    { icon: Award, label: "Success Rate", value: "98%" },
    { icon: Shield, label: "Data Security", value: "100%" },
  ];

  return (
    <footer className="relative bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 border-t border-gray-200/60 dark:border-gray-800/60">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5 dark:opacity-10" />

      {/* Back to Top Button */}
      <button
        onClick={scrollToTop}
        className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-white dark:bg-gray-800 rounded-full shadow-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-400 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
        aria-label="Back to top"
      >
        <ArrowUp className="h-5 w-5" />
      </button>

      {/* Stats Section */}
      <div className="relative border-b border-gray-200/60 dark:border-gray-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-3 gap-8 text-center">
            {stats.map((stat) => (
              <div key={stat.label} className="group">
                <div className="flex flex-col items-center space-y-2">
                  <div className="p-3 rounded-xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 group-hover:from-amber-500/20 group-hover:to-orange-500/20 transition-all duration-300">
                    <stat.icon className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {stat.value}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {stat.label}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-5">
            <div className="flex items-center space-x-3 mb-6">
              <div className="relative p-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 shadow-lg">
                <GraduationCap className="h-7 w-7 text-white drop-shadow-sm" />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-amber-400 via-orange-400 to-red-400 opacity-0 hover:opacity-100 transition-opacity duration-300" />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 bg-clip-text text-transparent dark:from-amber-400 dark:via-orange-400 dark:to-red-400">
                  EduTrack
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                  Student Success Platform
                </span>
              </div>
            </div>

            <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed text-lg">
              Empowering the next generation of learners with innovative tools
              for academic success, personal growth, and seamless educational
              management.
            </p>

            {/* Contact Info */}
            <div className="space-y-4">
              <a
                href="mailto:support@edutrack.com"
                className="flex items-center space-x-3 text-gray-600 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors duration-200 group"
              >
                <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 group-hover:bg-amber-50 dark:group-hover:bg-amber-950/20 transition-colors duration-200">
                  <Mail className="h-4 w-4" />
                </div>
                <span className="font-medium">support@edutrack.com</span>
              </a>
              <a
                href="tel:+15551234567"
                className="flex items-center space-x-3 text-gray-600 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors duration-200 group"
              >
                <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 group-hover:bg-amber-50 dark:group-hover:bg-amber-950/20 transition-colors duration-200">
                  <Phone className="h-4 w-4" />
                </div>
                <span className="font-medium">+1 (555) 123-4567</span>
              </a>
              <div className="flex items-start space-x-3 text-gray-600 dark:text-gray-400">
                <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 mt-0.5">
                  <MapPin className="h-4 w-4" />
                </div>
                <span className="font-medium leading-relaxed">
                  123 Education Street
                  <br />
                  Learning City, LC 12345
                  <br />
                  United States
                </span>
              </div>
            </div>
          </div>

          {/* Footer Links */}
          <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-4 gap-8">
            {footerLinks.map((section) => (
              <div key={section.title} className="space-y-4">
                <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider relative">
                  {section.title}
                  <div className="absolute -bottom-1 left-0 w-8 h-0.5 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full" />
                </h3>
                <ul className="space-y-3">
                  {section.links.map((link) => (
                    <li key={link.name}>
                      <Link
                        to={link.href}
                        className="text-sm text-gray-600 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-400 transition-all duration-200 hover:translate-x-1 inline-block relative group"
                      >
                        {link.name}
                        <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-amber-500 transition-all duration-300 group-hover:w-full" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="mt-16 p-8 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 rounded-2xl border border-amber-200/50 dark:border-amber-800/30">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Stay in the Loop
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Get the latest updates, study tips, and educational insights
                delivered to your inbox.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                asChild
                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
              >
                <Link to="/newsletter" className="flex items-center gap-2">
                  <Send className="h-4 w-4" />
                  Subscribe Now
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="mt-12 pt-8 border-t border-gray-200/60 dark:border-gray-800/60">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-4">
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Connect with us:
              </span>
              <div className="flex items-center gap-2">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-11 h-11 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-400 transition-all duration-300 transform hover:scale-110 hover:shadow-lg ${social.color}`}
                    aria-label={`Follow us on ${social.name}`}
                  >
                    <social.icon className="h-5 w-5" />
                  </a>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <span>Made with</span>
              <Heart className="h-4 w-4 text-red-500 animate-pulse" />
              <span>for students worldwide</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="relative bg-white/80 dark:bg-gray-950/80 backdrop-blur-sm border-t border-gray-200/60 dark:border-gray-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-6">
              <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                © {currentYear} EduTrack. All rights reserved.
              </p>
              <div className="hidden sm:flex items-center gap-1 text-xs text-gray-500 dark:text-gray-500">
                <Shield className="h-3 w-3" />
                <span>SOC 2 Compliant</span>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <Link
                to="/privacy"
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors duration-200 font-medium"
              >
                Privacy
              </Link>
              <Link
                to="/terms"
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors duration-200 font-medium"
              >
                Terms
              </Link>
              <Link
                to="/cookies"
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors duration-200 font-medium"
              >
                Cookies
              </Link>
              <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-500">
                <span>Version 2.1.0</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .bg-grid-pattern {
          background-image: radial-gradient(
            circle,
            #d1d5db 1px,
            transparent 1px
          );
          background-size: 20px 20px;
        }
      `}</style>
    </footer>
  );
};

export default Footer;
