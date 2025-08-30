import CTASection from "@/components/home/CTA";
import FAQSection from "@/components/home/FAQ";
import FeaturesSection from "@/components/home/Features";
import HeroSection from "@/components/home/Hero";
import HowItWorksSection from "@/components/home/HowItWorks";
import PricingSection from "@/components/home/Pricing";
import TestimonialsSection from "@/components/home/Testimonials";
import { useAuth } from "@/hooks/useAuth";

export default function Home() {
  const { user, loading } = useAuth();
  console.log(user?.getIdToken(true));
  if (loading) return <div>loading....</div>;
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
