import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import AccessibilityPanel from "@/components/accessibility/AccessibilityPanel";
import SkipLink from "@/components/accessibility/SkipLink";

export const metadata = {
  title: "Find Work — InklusiJobs",
  description: "Browse verified, inclusive job opportunities for Persons with Disabilities across the Philippines.",
};

const steps = [
  { num: "01", title: "Sign Up & Assess", desc: "Create your account via email or Google. Complete an interactive skill assessment covering your technical abilities, soft skills, career goals, and time availability. Disability disclosure is fully optional and confidential." },
  { num: "02", title: "Get Your AI Roadmap", desc: "Gemini AI generates your personalized visual roadmap — Beginner to Advanced — with specific skills, free resources, and realistic timeframes built around you." },
  { num: "03", title: "Complete Portfolio Challenges", desc: "Unlock real-world tasks like 'Design an accessible dashboard' or 'Debug this code'. AI evaluates your work against strict rubrics and gives you detailed feedback." },
  { num: "04", title: "Get Matched & Hired", desc: "Employers browse your verified portfolio by skill. See your match percentage for each role and apply in one click — no traditional resume needed." },
];

const categories = [
  { icon: "🎨", label: "UI/UX Design" },
  { icon: "💻", label: "Web Development" },
  { icon: "📊", label: "Data Entry & Admin" },
  { icon: "✍️", label: "Content Writing" },
  { icon: "📣", label: "Digital Marketing" },
  { icon: "🎧", label: "Customer Support" },
  { icon: "📈", label: "Data Analysis" },
  { icon: "🎬", label: "Video Editing" },
];

const painPoints = [
  { icon: "🔄", title: "Breaking the Cycle", desc: "Can't get hired without experience. Can't get experience without being hired. We break that cycle with verified proof of skill — no work history required." },
  { icon: "🔒", title: "Your Privacy, Protected", desc: "Disability disclosure is completely optional. We keep your identity confidential and focus on what you can actually do." },
  { icon: "🤖", title: "AI That Works for You", desc: "Our AI doesn't just match keywords — it verifies your practical skills through real challenges and surfaces you to employers who need exactly what you can do." },
];

const stats = [
  { value: "500+", label: "PWD job seekers" },
  { value: "120+", label: "Inclusive employers" },
  { value: "WCAG 2.1 AA", label: "Accessibility standard" },
  { value: "RA 7277", label: "Legally aligned" },
];

export default function FindWorkPage() {
  return (
    <>
      <SkipLink />
      <Navbar />
      <main id="main-content" style={{ background: "#FAF8F5", minHeight: "100vh" }}>

        {/* Hero Banner */}
        <div style={{ background: "linear-gradient(135deg, #0F5C6E 0%, #0A3D4A 100%)", paddingTop: 140, paddingBottom: 80, paddingLeft: 32, paddingRight: 32 }}>
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            <span style={{ fontFamily: "Arial, sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: "#7DDCE8", display: "block", marginBottom: 16 }}>Job Board</span>
            <h1 style={{ fontFamily: "Arial, sans-serif", fontSize: "clamp(2.2rem, 5vw, 3.5rem)", fontWeight: 800, color: "#fff", lineHeight: 1.15, marginBottom: 20, maxWidth: 680 }}>
              Find Work That Works <span style={{ color: "#7DDCE8" }}>For You</span>
            </h1>
            <p style={{ fontFamily: "Arial, sans-serif", fontSize: 17, color: "rgba(224,248,250,0.82)", lineHeight: 1.8, maxWidth: 560, marginBottom: 48 }}>
              Skills-first. Verified. Inclusive. Browse opportunities from employers committed to hiring Persons with Disabilities — matched to what you can actually do, not just what&apos;s on paper.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 40 }}>
              {stats.map(s => (
                <div key={s.label}>
                  <div style={{ fontFamily: "Arial, sans-serif", fontWeight: 800, fontSize: 24, color: "#7DDCE8" }}>{s.value}</div>
                  <div style={{ fontFamily: "Arial, sans-serif", fontSize: 12, color: "rgba(224,248,250,0.60)", marginTop: 3 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "72px 32px" }}>

          {/* Why it's different */}
          <div style={{ marginBottom: 72 }}>
            <h2 style={{ fontFamily: "Arial, sans-serif", fontWeight: 800, fontSize: 28, color: "#1A1A2E", marginBottom: 8 }}>Why InklusiJobs is different</h2>
            <p style={{ fontFamily: "Arial, sans-serif", fontSize: 15, color: "#4A6070", marginBottom: 36, lineHeight: 1.7, maxWidth: 600 }}>
              Unlike LinkedIn, Jobstreet, or OnlineJobsPh — we don&apos;t rely on credentials or work history. We verify what you can actually do.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
              {painPoints.map(p => (
                <div key={p.title} style={{ background: "#0F5C6E", borderRadius: 16, padding: "28px 24px" }}>
                  <div style={{ fontSize: 32, marginBottom: 14 }}>{p.icon}</div>
                  <h3 style={{ fontFamily: "Arial, sans-serif", fontWeight: 700, fontSize: 16, color: "#fff", marginBottom: 8 }}>{p.title}</h3>
                  <p style={{ fontFamily: "Arial, sans-serif", fontSize: 13, color: "rgba(224,248,250,0.80)", lineHeight: 1.75 }}>{p.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* How It Works */}
          <div style={{ marginBottom: 72 }}>
            <h2 style={{ fontFamily: "Arial, sans-serif", fontWeight: 800, fontSize: 28, color: "#1A1A2E", marginBottom: 8 }}>How it works</h2>
            <p style={{ fontFamily: "Arial, sans-serif", fontSize: 15, color: "#4A6070", marginBottom: 36, lineHeight: 1.7 }}>
              Four steps from sign-up to employment — no traditional resume needed.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 20 }}>
              {steps.map(step => (
                <div key={step.num} style={{ background: "#fff", border: "1.5px solid #DDE8EC", borderRadius: 16, padding: "28px 24px", boxShadow: "0 2px 16px rgba(15,92,110,0.06)" }}>
                  <div style={{ fontFamily: "Arial, sans-serif", fontWeight: 800, fontSize: 40, color: "#EFF9FB", lineHeight: 1, marginBottom: 14 }}>{step.num}</div>
                  <h3 style={{ fontFamily: "Arial, sans-serif", fontWeight: 700, fontSize: 15, color: "#1A1A2E", marginBottom: 8 }}>{step.title}</h3>
                  <p style={{ fontFamily: "Arial, sans-serif", fontSize: 13, color: "#4A6070", lineHeight: 1.75 }}>{step.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Job Categories */}
          <div style={{ marginBottom: 72 }}>
            <h2 style={{ fontFamily: "Arial, sans-serif", fontWeight: 800, fontSize: 28, color: "#1A1A2E", marginBottom: 8 }}>Job categories</h2>
            <p style={{ fontFamily: "Arial, sans-serif", fontSize: 15, color: "#4A6070", marginBottom: 36 }}>Remote-friendly, skills-based opportunities across fields where PWDs excel.</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(195px, 1fr))", gap: 14 }}>
              {categories.map(cat => (
                <div key={cat.label} style={{ background: "#fff", border: "1.5px solid #DDE8EC", borderRadius: 14, padding: "18px 20px", display: "flex", alignItems: "center", gap: 14, boxShadow: "0 2px 12px rgba(15,92,110,0.05)" }}>
                  <span style={{ fontSize: 26 }}>{cat.icon}</span>
                  <span style={{ fontFamily: "Arial, sans-serif", fontWeight: 700, fontSize: 14, color: "#1A3A5C" }}>{cat.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div style={{ background: "#F0EDE8", border: "1.5px solid #C8D8E0", borderRadius: 20, padding: "56px 40px", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
            <div style={{ fontSize: 52, marginBottom: 20 }}>🚀</div>
            <h2 style={{ fontFamily: "Arial, sans-serif", fontWeight: 800, fontSize: 26, color: "#1A1A2E", marginBottom: 12 }}>Live job listings coming soon</h2>
            <p style={{ fontFamily: "Arial, sans-serif", fontSize: 15, color: "#4A6070", maxWidth: 500, lineHeight: 1.8, marginBottom: 36 }}>
              We&apos;re onboarding inclusive employers right now. Sign up to be first in line when jobs go live — and start building your verified portfolio today so you&apos;re ready.
            </p>
            <a href="/" style={{ fontFamily: "Arial, sans-serif", fontWeight: 700, fontSize: 14, background: "#0F5C6E", color: "#fff", padding: "14px 36px", borderRadius: 12, textDecoration: "none" }}>
              Start Building Your Portfolio →
            </a>
          </div>
        </div>
      </main>
      <Footer />
      <AccessibilityPanel />
    </>
  );
}