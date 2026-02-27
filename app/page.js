import Navbar from "@/components/landing/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import SkillsSection from "@/components/landing/SkillsSection";
import HowItWorksSection from "@/components/landing/HowItWorks";
import FeaturesSection from "@/components/landing/FeaturesSection";
import VerificationSection from "@/components/landing/VerificationSection";
import Footer from "@/components/landing/Footer";
import AccessibilityPanel from "@/components/accessibility/AccessibilityPanel";
import SkipLink from "@/components/accessibility/SkipLink";

export const metadata = {
  title: "InklusiJobs — Verified. Skilled. Employed.",
  description:
    "InklusiJobs helps Persons with Disabilities become verified, job-ready professionals through personalized learning paths, portfolio challenges, and AI-driven skill verification.",
};

export default function LandingPage() {
  return (
    <>
      <SkipLink />
      <Navbar />

      <main id="main-content">
        <HeroSection />
        <SkillsSection />
        <HowItWorksSection />
        <FeaturesSection />
        <VerificationSection />
      </main>

      <Footer />
      <AccessibilityPanel />
    </>
  );
}