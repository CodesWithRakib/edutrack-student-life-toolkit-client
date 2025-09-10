import CTASection from "@/components/home/CTA";
import FAQSection from "@/components/home/FAQ";
import FeaturesSection from "@/components/home/Features";
import HeroSection from "@/components/home/Hero";
import HowItWorksSection from "@/components/home/HowItWorks";
import PricingSection from "@/components/home/Pricing";
import TestimonialsSection from "@/components/home/Testimonials";
import { useAuth } from "@/hooks/useAuth";
import apiClient from "@/lib/apiClient";
import { useEffect } from "react";

export default function Home() {
  const { loading } = useAuth();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data: dbUser } = await apiClient.get("/users/me");
        console.log(dbUser);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUser();
  }, []);
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
