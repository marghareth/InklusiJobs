import Navbar from "@/components/landing/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import SkillsSection from "@/components/landing/SkillsSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import VerificationSection from "@/components/landing/VerificationSection";
import Footer from "@/components/landing/Footer";
import AccessibilityToolbar from "@/components/accessibility/AccessibilityToolbar";
import SkipLink from "@/components/accessibility/SkipLink";

export const metadata = {
  title: "InklusiJobs — Verified. Skilled. Employed.",
  description:
    "InklusiJobs helps Persons with Disabilities become verified, job-ready professionals through personalized learning paths, portfolio challenges, and AI-driven skill verification.",
};

export default function LandingPage() {
  return (
    <>
      {/* Skip to main content — first thing screen readers and keyboard users hit */}
      <SkipLink />

      {/* Floating navbar */}
      <Navbar />

      <main id="main-content">
        {/* Section 1: Hero with cloud background */}
        <HeroSection />

        {/* Section 2: Skills headline + profile card + trust bar */}
        <SkillsSection />

        {/* Section 3: How it works / Features */}
        <FeaturesSection />

        {/* Section 4: PWD Verification + CTA */}
        <VerificationSection />
      </main>

      <Footer />

      {/* Floating accessibility toolbar - PWD users can toggle font size, contrast, motion */}
      <AccessibilityToolbar />
    </>
  );
}