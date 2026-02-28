import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import AccessibilityPanel from "@/components/accessibility/AccessibilityPanel";
import SkipLink from "@/components/accessibility/SkipLink";
import FindWorkClient from "@/components/landing/FindWorkClient";

export const metadata = {
  title: "Find Work — InklusiJobs",
  description: "Browse verified, inclusive job opportunities for Persons with Disabilities across the Philippines.",
};

export default function FindWorkPage() {
  return (
    <>
      <SkipLink />
      <Navbar />
      <main id="main-content" style={{ background: "#FAF8F5", minHeight: "100vh" }}>
        <FindWorkClient />
      </main>
      <Footer />
      <AccessibilityPanel />
    </>
  );
}