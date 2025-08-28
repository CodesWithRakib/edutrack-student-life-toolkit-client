import ContactCTA from "@/components/contact/ContactCTA";
import ContactFormSection from "@/components/contact/ContactForm";
import ContactHero from "@/components/contact/ContactHero";
import OfficeLocationsSection from "@/components/contact/OfficeLocation";

const Contact = () => {
  return (
    <div>
      <ContactHero />
      <ContactFormSection />
      <OfficeLocationsSection />
      <ContactCTA />
    </div>
  );
};

export default Contact;
