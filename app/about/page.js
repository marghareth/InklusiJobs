import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import AccessibilityPanel from "@/components/accessibility/AccessibilityPanel";
import SkipLink from "@/components/accessibility/SkipLink";
import AboutClient from "@/components/landing/AboutClient";

export const metadata = {
  title: "Our Mission — InklusiJobs",
  description: "Why InklusiJobs exists — building a skills-first, accessible path to employment for Persons with Disabilities in the Philippines.",
};

export default function AboutPage() {
  return (
    <>
      <SkipLink />
      <Navbar />
      <main id="main-content" style={{ background: "#FAF8F5", minHeight: "100vh" }}>
        <AboutClient />
      </main>
      <Footer />
      <AccessibilityPanel />
    </>
  );
}