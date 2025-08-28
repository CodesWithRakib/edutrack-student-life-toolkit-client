import AboutCTA from "@/components/about/AboutCTA";
import AboutHero from "@/components/about/AboutHero";
import CultureSection from "@/components/about/Culture";
import ImpactSection from "@/components/about/Impact";
import MissionSection from "@/components/about/Mission";
import StorySection from "@/components/about/Story";
import TeamSection from "@/components/about/Team";

function About() {
  return (
    <div>
      <AboutHero />
      <StorySection />
      <TeamSection />
      <CultureSection />
      <MissionSection />
      <CultureSection />
      <ImpactSection />
      <AboutCTA />
    </div>
  );
}

export default About;
