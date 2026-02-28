import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import AccessibilityPanel from "@/components/accessibility/AccessibilityPanel";
import SkipLink from "@/components/accessibility/SkipLink";
import LearnClient from "@/components/landing/LearnClient";

export const metadata = {
  title: "How to Use InklusiJobs",
  description: "A complete guide to using InklusiJobs — from signing up to getting hired or finding verified PWD talent.",
};

export default function LearnPage() {
  return (
    <>
      <SkipLink />
      <Navbar />
      <main id="main-content" style={{ background: "#FAF8F5", minHeight: "100vh" }}>
        <LearnClient />
      </main>
      <Footer />
      <AccessibilityPanel />
    </>
  );
}