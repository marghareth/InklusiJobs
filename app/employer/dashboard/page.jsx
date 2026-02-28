import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import AccessibilityPanel from "@/components/accessibility/AccessibilityPanel";
import SkipLink from "@/components/accessibility/SkipLink";
import EmployersClient from "@/components/landing/EmployersClient";

export const metadata = {
  title: "For Employers — InklusiJobs",
  description: "Hire verified PWD talent through skills-first matching. Browse AI-verified portfolios from inclusive job seekers across the Philippines.",
};

export default function EmployersPage() {
  return (
    <>
      <SkipLink />
      <Navbar />
      <main id="main-content" style={{ background: "#FAF8F5", minHeight: "100vh" }}>
        <EmployersClient />
      </main>
      <Footer />
      <AccessibilityPanel />
    </>
  );
}