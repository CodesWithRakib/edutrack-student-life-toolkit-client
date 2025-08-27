import ExamGeneratorSection from "@/components/feature/ExamGenerator";
import FeatureComparison from "@/components/feature/FeatureComparison";
import FeaturesCTA from "@/components/feature/FeatureCTA";
import FeatureOverview from "@/components/feature/FeatureOverview";
import FeaturesHero from "@/components/feature/FeaturesHero";
import IntegrationSection from "@/components/feature/Integration";
import SmartSchedulingSection from "@/components/feature/SmartScheduling";
import StudyPlannerSection from "@/components/feature/StudyPlanner";
import FeaturesSection from "@/components/home/Features";

export default function Features() {
  return (
    <div>
      <FeaturesCTA />
      <FeaturesHero />
      <FeatureComparison />
      <FeatureOverview />
      <FeaturesSection />
      <IntegrationSection />
      <StudyPlannerSection />
      <SmartSchedulingSection />
      <ExamGeneratorSection />
    </div>
  );
}
