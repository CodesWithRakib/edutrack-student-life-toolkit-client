import CTASection from "@/components/home/CTA";
import FAQSection from "@/components/home/FAQ";
import FeaturesSection from "@/components/home/Features";
import HeroSection from "@/components/home/Hero";
import HowItWorksSection from "@/components/home/HowItWorks";
import PricingSection from "@/components/home/Pricing";
import TestimonialsSection from "@/components/home/Testimonials";

export default function Home() {
  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <PricingSection />
      <FAQSection />
      <CTASection />
    </>
  );
}
