import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import AccessibilityPanel from "@/components/accessibility/AccessibilityPanel";
import SkipLink from "@/components/accessibility/SkipLink";

export const metadata = {
  title: "How to Use InklusiJobs",
  description: "A complete guide to using InklusiJobs — from signing up to getting hired or finding verified PWD talent.",
};

const seekerSteps = [
  { icon: "📝", step: "Step 1", title: "Sign Up & Set Your Profile", desc: "Create your account via email or Google OAuth. Complete a guided multi-step skill assessment covering your technical abilities, soft skills, career goals, and time availability. Setting a disability profile is optional and confidential — it just helps us adapt the UI to work better for you." },
  { icon: "🗺️", step: "Step 2", title: "Receive Your AI Roadmap", desc: "Based on your assessment, Gemini AI generates your personalized visual roadmap displayed as an interactive timeline — Beginner to Advanced. Each phase lists specific skills, free or affordable resources, and realistic estimated timeframes." },
  { icon: "📚", step: "Step 3", title: "Learn at Your Own Pace", desc: "Follow your roadmap using curated resources. Your dashboard tracks completed modules, upcoming milestones, and progress. If you struggle with a topic, the AI adapts and gives you alternative recommendations." },
  { icon: "🏆", step: "Step 4", title: "Unlock & Complete Challenges", desc: "Completing roadmap sections unlocks real portfolio challenges — like 'Create a social media plan', 'Debug this code', or 'Design an accessible website'. Submit via file upload or project link. AI evaluates against rubrics and gives pass/fail with detailed constructive feedback." },
  { icon: "🌐", step: "Step 5", title: "Build Your Public Portfolio", desc: "Every passed challenge is automatically added to your public portfolio page with the task description, your submission, AI verification score, and skills demonstrated. Share it via a custom URL — employers can view it anytime." },
  { icon: "💼", step: "Step 6", title: "Browse Jobs & Apply", desc: "Browse job listings filtered by your verified skills. See your match percentage for each role. Apply in one click — your portfolio is automatically shared with the employer. No traditional resume needed." },
];

const employerSteps = [
  { icon: "🏢", step: "Step 1", title: "Register Your Company", desc: "Create an employer account and enter company details. Optionally declare your commitment to inclusive hiring to start earning your Inclusive Employer badge, displayed on your profile and all job listings." },
  { icon: "📋", step: "Step 2", title: "Post a Job Listing", desc: "Specify required skills, work arrangement, compensation, and whether accommodations are available. The AI automatically suggests which portfolio challenges best signal readiness for your role." },
  { icon: "🔍", step: "Step 3", title: "Browse Verified Candidates", desc: "The platform surfaces candidates whose verified challenge scores match your job requirements, ranked by AI score and portfolio quality. Filter by skills, availability, and preferences." },
  { icon: "📊", step: "Step 4", title: "Review & Compare", desc: "View AI verification scores and portfolio project work. Compare multiple candidates side-by-side in one view. Contact shortlisted candidates through the platform's messaging system." },
  { icon: "✅", step: "Step 5", title: "Hire & Give Feedback", desc: "Conduct interviews and mark the position as filled once hired. Rate the hire quality after onboarding — your feedback improves future matching and becomes social proof on the worker's profile." },
];

const platformFeatures = [
  { icon: "♿", title: "Adaptive Accessibility UI", desc: "The platform dynamically adjusts based on your disability profile — high contrast and screen-reader optimized for visual impairments; specialized typography and distraction-free layouts for dyslexia and ADHD. Fully WCAG 2.1 AA compliant." },
  { icon: "🤖", title: "AI Skill Gap Analysis", desc: "Before your roadmap is generated, the AI identifies your specific skill gaps with encouraging, actionable insights — so you know exactly where to focus energy and what to learn next." },
  { icon: "🏅", title: "Badge & Milestone System", desc: "Earn visual badges as you hit milestones. Each badge is permanently displayed on your portfolio and signals verified competency to employers — a living record of your growth." },
  { icon: "🔔", title: "Work Request Notifications", desc: "Employers can send direct work requests to candidates through in-platform notifications — keeping communication streamlined and your personal contact details private." },
  { icon: "📂", title: "Dual Dashboards", desc: "Job seekers get a progress-tracking dashboard — roadmap, challenges, portfolio, and applications in one place. Employers get a candidate management dashboard — job listings, applicant review, and hiring pipeline." },
  { icon: "🔐", title: "Confidential Disability Profile", desc: "Your disability information is never shared with employers unless you choose to disclose it. The platform focuses entirely on verified skills and portfolio quality — not labels." },
];

export default function LearnPage() {
  return (
    <>
      <SkipLink />
      <Navbar />
      <main id="main-content" style={{ background: "#FAF8F5", minHeight: "100vh" }}>

        {/* Hero */}
        <div style={{ background: "linear-gradient(135deg, #0A3D4A 0%, #1A3A5C 100%)", paddingTop: 140, paddingBottom: 80, paddingLeft: 32, paddingRight: 32 }}>
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            <span style={{ fontFamily: "Arial, sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: "#7DDCE8", display: "block", marginBottom: 16 }}>Platform Guide</span>
            <h1 style={{ fontFamily: "Arial, sans-serif", fontSize: "clamp(2.2rem, 5vw, 3.5rem)", fontWeight: 800, color: "#fff", lineHeight: 1.15, marginBottom: 20, maxWidth: 700 }}>
              How to Use <span style={{ color: "#7DDCE8" }}>InklusiJobs</span>
            </h1>
            <p style={{ fontFamily: "Arial, sans-serif", fontSize: 17, color: "rgba(224,248,250,0.82)", lineHeight: 1.8, maxWidth: 580 }}>
              A complete walkthrough — whether you&apos;re a PWD job seeker building your verified portfolio, or an employer looking for skilled inclusive talent.
            </p>
          </div>
        </div>

        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "72px 32px" }}>

          {/* Jump Links */}
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 64 }}>
            {["For Job Seekers", "For Employers", "Platform Features"].map(label => (
              <a key={label} href={`#${label.toLowerCase().replace(/ /g, "-")}`} style={{ fontFamily: "Arial, sans-serif", fontWeight: 700, fontSize: 13, color: "#0F5C6E", background: "#EFF9FB", border: "1.5px solid #B8E4ED", padding: "8px 18px", borderRadius: 99, textDecoration: "none" }}>
                {label}
              </a>
            ))}
          </div>

          {/* Job Seeker Steps */}
          <div id="for-job-seekers" style={{ marginBottom: 72 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#0F5C6E", borderRadius: 99, padding: "6px 16px", marginBottom: 16 }}>
              <span style={{ fontFamily: "Arial, sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: "#fff" }}>👤 For Job Seekers</span>
            </div>
            <h2 style={{ fontFamily: "Arial, sans-serif", fontWeight: 800, fontSize: 28, color: "#1A1A2E", marginBottom: 8 }}>Your journey from skilled to employed</h2>
            <p style={{ fontFamily: "Arial, sans-serif", fontSize: 15, color: "#4A6070", marginBottom: 40, lineHeight: 1.7, maxWidth: 620 }}>
              Six steps to build a verified portfolio and land an inclusive job — no work history required.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {seekerSteps.map(s => (
                <div key={s.title} style={{ background: "#fff", border: "1.5px solid #DDE8EC", borderRadius: 16, padding: "28px 28px", display: "flex", gap: 22, alignItems: "flex-start", boxShadow: "0 2px 12px rgba(15,92,110,0.05)" }}>
                  <div style={{ flexShrink: 0, width: 50, height: 50, borderRadius: 12, background: "#EFF9FB", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>{s.icon}</div>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                      <span style={{ fontFamily: "Arial, sans-serif", fontSize: 11, fontWeight: 700, color: "#0F5C6E", background: "#EFF9FB", border: "1px solid #B8E4ED", borderRadius: 99, padding: "2px 10px" }}>{s.step}</span>
                      <h3 style={{ fontFamily: "Arial, sans-serif", fontWeight: 700, fontSize: 15, color: "#1A1A2E", margin: 0 }}>{s.title}</h3>
                    </div>
                    <p style={{ fontFamily: "Arial, sans-serif", fontSize: 14, color: "#4A6070", lineHeight: 1.8, margin: 0 }}>{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Employer Steps */}
          <div id="for-employers" style={{ marginBottom: 72 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#1A3A5C", borderRadius: 99, padding: "6px 16px", marginBottom: 16 }}>
              <span style={{ fontFamily: "Arial, sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: "#fff" }}>🏢 For Employers</span>
            </div>
            <h2 style={{ fontFamily: "Arial, sans-serif", fontWeight: 800, fontSize: 28, color: "#1A1A2E", marginBottom: 8 }}>Your hiring journey</h2>
            <p style={{ fontFamily: "Arial, sans-serif", fontSize: 15, color: "#4A6070", marginBottom: 40, lineHeight: 1.7, maxWidth: 620 }}>
              From account setup to your first inclusive hire — five simple steps.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 18 }}>
              {employerSteps.map(s => (
                <div key={s.title} style={{ background: "#1A3A5C", borderRadius: 16, padding: "28px 24px" }}>
                  <div style={{ fontSize: 28, marginBottom: 10 }}>{s.icon}</div>
                  <div style={{ fontFamily: "Arial, sans-serif", fontSize: 11, fontWeight: 700, color: "rgba(125,220,232,0.7)", marginBottom: 6, letterSpacing: "1px", textTransform: "uppercase" }}>{s.step}</div>
                  <h3 style={{ fontFamily: "Arial, sans-serif", fontWeight: 700, fontSize: 15, color: "#fff", marginBottom: 8 }}>{s.title}</h3>
                  <p style={{ fontFamily: "Arial, sans-serif", fontSize: 13, color: "rgba(224,248,250,0.75)", lineHeight: 1.75, margin: 0 }}>{s.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Platform Features */}
          <div id="platform-features" style={{ marginBottom: 64 }}>
            <h2 style={{ fontFamily: "Arial, sans-serif", fontWeight: 800, fontSize: 28, color: "#1A1A2E", marginBottom: 8 }}>Platform features</h2>
            <p style={{ fontFamily: "Arial, sans-serif", fontSize: 15, color: "#4A6070", marginBottom: 40 }}>Built with accessibility and inclusion at every layer.</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 18 }}>
              {platformFeatures.map(f => (
                <div key={f.title} style={{ background: "#fff", border: "1.5px solid #DDE8EC", borderRadius: 16, padding: "28px 24px", boxShadow: "0 2px 12px rgba(15,92,110,0.05)" }}>
                  <div style={{ fontSize: 30, marginBottom: 12 }}>{f.icon}</div>
                  <h3 style={{ fontFamily: "Arial, sans-serif", fontWeight: 700, fontSize: 15, color: "#1A1A2E", marginBottom: 8 }}>{f.title}</h3>
                  <p style={{ fontFamily: "Arial, sans-serif", fontSize: 13, color: "#4A6070", lineHeight: 1.75, margin: 0 }}>{f.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div style={{ background: "linear-gradient(135deg, #0F5C6E, #0A3D4A)", borderRadius: 20, padding: "56px 40px", textAlign: "center" }}>
            <h2 style={{ fontFamily: "Arial, sans-serif", fontWeight: 800, fontSize: 26, color: "#fff", marginBottom: 12 }}>Ready to get started?</h2>
            <p style={{ fontFamily: "Arial, sans-serif", fontSize: 15, color: "rgba(224,248,250,0.78)", maxWidth: 440, margin: "0 auto 32px", lineHeight: 1.75 }}>
              Join hundreds of PWDs and inclusive employers already using InklusiJobs.
            </p>
            <a href="/" style={{ fontFamily: "Arial, sans-serif", fontWeight: 700, fontSize: 14, background: "#fff", color: "#0F5C6E", padding: "14px 36px", borderRadius: 12, textDecoration: "none", display: "inline-block" }}>
              Create Your Free Account →
            </a>
          </div>
        </div>
      </main>
      <Footer />
      <AccessibilityPanel />
    </>
  );
}