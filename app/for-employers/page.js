import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import AccessibilityPanel from "@/components/accessibility/AccessibilityPanel";
import SkipLink from "@/components/accessibility/SkipLink";

export const metadata = {
  title: "For Employers — InklusiJobs",
  description: "Hire verified PWD talent, earn your Inclusive Employer badge, and maximize your RA 7277 tax benefits.",
};

const steps = [
  { num: "01", title: "Register Your Company", desc: "Create your employer account, enter company details, and optionally declare your commitment to inclusive hiring to start earning your Inclusive Employer badge." },
  { num: "02", title: "Post a Job", desc: "List required skills, work arrangement, compensation, and whether accommodations are available. AI automatically suggests which portfolio challenges align with your role." },
  { num: "03", title: "Browse Verified Talent", desc: "Platform surfaces candidates whose verified challenge scores match your job requirements — ranked by AI verification score and portfolio quality." },
  { num: "04", title: "Review, Compare & Hire", desc: "View AI verification scores and portfolio work side-by-side. Contact candidates through the platform, conduct interviews, and mark positions as filled." },
  { num: "05", title: "Post-Hire Feedback", desc: "Rate the hire quality after onboarding. Your feedback refines future matches and provides social proof on your hired worker's public profile." },
];

const benefits = [
  { icon: "✅", title: "Skills-Verified Candidates", desc: "Every candidate has completed practical challenges evaluated by AI against strict rubrics. You get evidence-based proof of ability — not just a list of certifications.", bg: "#0F5C6E", color: "#fff" },
  { icon: "💰", title: "RA 7277 Tax Benefits", desc: "Hiring PWD employees qualifies your business for tax deductions under the Magna Carta for Persons with Disabilities. We help you document and maximize your benefits.", bg: "#1A3A5C", color: "#fff" },
  { icon: "🏅", title: "Inclusive Employer Badge", desc: "Earn a public badge displayed on your company profile and all job listings — a powerful signal of your commitment to inclusion and a boost to your employer brand.", bg: "#FAF8F5", color: "#1A1A2E", border: "1.5px solid #DDE8EC" },
  { icon: "🎯", title: "AI-Powered Matching", desc: "Our AI surfaces candidates whose verified portfolio scores directly align with your job requirements. Less guesswork, faster hiring, better fit.", bg: "#FAF8F5", color: "#1A1A2E", border: "1.5px solid #DDE8EC" },
  { icon: "📊", title: "Side-by-Side Comparison", desc: "Compare multiple candidates simultaneously — portfolio work, AI scores, skill levels, and availability — all in a single employer dashboard view.", bg: "#1A8FA5", color: "#fff" },
  { icon: "🌐", title: "Verification-as-a-Service", desc: "Our PWD verification infrastructure is also licensable to hospitals, retailers, airlines, and any business that offers PWD discounts or must comply with RA 7277.", bg: "#0A3D4A", color: "#fff" },
];

const comparisonRows = [
  { feature: "Skill Verification", inklusi: "✅ AI-verified challenges", others: "❌ Self-reported only" },
  { feature: "PWD-Specific Support", inklusi: "✅ Built-in, WCAG 2.1 AA", others: "❌ Generic platform" },
  { feature: "Portfolio Evidence", inklusi: "✅ Real project submissions", others: "❌ Resume / credentials" },
  { feature: "RA 7277 Guidance", inklusi: "✅ Integrated", others: "❌ Not available" },
  { feature: "Inclusive Employer Badge", inklusi: "✅ Earned through platform", others: "❌ Not applicable" },
];

export default function ForEmployersPage() {
  return (
    <>
      <SkipLink />
      <Navbar />
      <main id="main-content" style={{ background: "#FAF8F5", minHeight: "100vh" }}>

        {/* Hero */}
        <div style={{ background: "linear-gradient(135deg, #1A3A5C 0%, #0F5C6E 100%)", paddingTop: 140, paddingBottom: 80, paddingLeft: 32, paddingRight: 32 }}>
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            <span style={{ fontFamily: "Arial, sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: "#7DDCE8", display: "block", marginBottom: 16 }}>For Employers</span>
            <h1 style={{ fontFamily: "Arial, sans-serif", fontSize: "clamp(2.2rem, 5vw, 3.5rem)", fontWeight: 800, color: "#fff", lineHeight: 1.15, marginBottom: 20, maxWidth: 720 }}>
              Hire Verified PWD Talent. <span style={{ color: "#7DDCE8" }}>Build a Truly Inclusive Workforce.</span>
            </h1>
            <p style={{ fontFamily: "Arial, sans-serif", fontSize: 17, color: "rgba(224,248,250,0.82)", lineHeight: 1.8, maxWidth: 600, marginBottom: 40 }}>
              InklusiJobs gives you access to a verified pool of skilled PWD candidates that traditional platforms miss entirely — while helping you meet RA 7277 compliance and earn your Inclusive Employer badge.
            </p>
            <a href="/employer" style={{ fontFamily: "Arial, sans-serif", fontWeight: 700, fontSize: 14, background: "#fff", color: "#0F5C6E", padding: "14px 36px", borderRadius: 12, textDecoration: "none", display: "inline-block" }}>
              Create Employer Account →
            </a>
          </div>
        </div>

        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "72px 32px" }}>

          {/* Why Hire Here */}
          <div style={{ background: "#fff", border: "1.5px solid #DDE8EC", borderRadius: 20, padding: "40px 36px", marginBottom: 64, boxShadow: "0 2px 16px rgba(15,92,110,0.06)" }}>
            <h2 style={{ fontFamily: "Arial, sans-serif", fontWeight: 800, fontSize: 22, color: "#1A1A2E", marginBottom: 16 }}>Why hire through InklusiJobs?</h2>
            <p style={{ fontFamily: "Arial, sans-serif", fontSize: 15, color: "#4A6070", lineHeight: 1.85, maxWidth: 760 }}>
              Despite RA 7277, many capable PWDs remain unemployed — not because they lack skill, but because traditional hiring relies on credentials and work history they haven&apos;t had the chance to build yet. InklusiJobs solves this by giving employers <strong style={{ color: "#0F5C6E" }}>evidence-based portfolios</strong>, <strong style={{ color: "#0F5C6E" }}>AI challenge verification scores</strong>, and <strong style={{ color: "#0F5C6E" }}>practical project submissions</strong> — so you can hire with full confidence.
            </p>
          </div>

          {/* Benefits Grid */}
          <div style={{ marginBottom: 64 }}>
            <h2 style={{ fontFamily: "Arial, sans-serif", fontWeight: 800, fontSize: 28, color: "#1A1A2E", marginBottom: 36 }}>What you get</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
              {benefits.map(b => (
                <div key={b.title} style={{ background: b.bg, border: b.border || "none", borderRadius: 16, padding: "28px 24px", boxShadow: "0 2px 16px rgba(15,92,110,0.05)" }}>
                  <div style={{ fontSize: 32, marginBottom: 14 }}>{b.icon}</div>
                  <h3 style={{ fontFamily: "Arial, sans-serif", fontWeight: 700, fontSize: 15, color: b.color, marginBottom: 8 }}>{b.title}</h3>
                  <p style={{ fontFamily: "Arial, sans-serif", fontSize: 13, color: b.color, opacity: 0.82, lineHeight: 1.75 }}>{b.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Hiring Journey */}
          <div style={{ marginBottom: 64 }}>
            <h2 style={{ fontFamily: "Arial, sans-serif", fontWeight: 800, fontSize: 28, color: "#1A1A2E", marginBottom: 8 }}>Your hiring journey</h2>
            <p style={{ fontFamily: "Arial, sans-serif", fontSize: 15, color: "#4A6070", marginBottom: 40, lineHeight: 1.7 }}>From account setup to your first inclusive hire — simple and transparent.</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {steps.map((step, i) => (
                <div key={step.num} style={{ background: "#fff", border: "1.5px solid #DDE8EC", borderRadius: 16, padding: "24px 28px", display: "flex", gap: 24, alignItems: "flex-start", boxShadow: "0 2px 12px rgba(15,92,110,0.05)" }}>
                  <div style={{ flexShrink: 0, width: 44, height: 44, borderRadius: "50%", background: "#0F5C6E", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Arial, sans-serif", fontWeight: 800, fontSize: 15, color: "#fff" }}>{i + 1}</div>
                  <div>
                    <h3 style={{ fontFamily: "Arial, sans-serif", fontWeight: 700, fontSize: 15, color: "#1A1A2E", marginBottom: 6 }}>{step.title}</h3>
                    <p style={{ fontFamily: "Arial, sans-serif", fontSize: 13, color: "#4A6070", lineHeight: 1.75, margin: 0 }}>{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Comparison Table */}
          <div style={{ marginBottom: 64 }}>
            <h2 style={{ fontFamily: "Arial, sans-serif", fontWeight: 800, fontSize: 28, color: "#1A1A2E", marginBottom: 36 }}>InklusiJobs vs. other platforms</h2>
            <div style={{ background: "#fff", border: "1.5px solid #DDE8EC", borderRadius: 20, overflow: "hidden", boxShadow: "0 2px 16px rgba(15,92,110,0.06)" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", background: "#0F5C6E", padding: "16px 24px" }}>
                <span style={{ fontFamily: "Arial, sans-serif", fontWeight: 700, fontSize: 13, color: "#fff" }}>Feature</span>
                <span style={{ fontFamily: "Arial, sans-serif", fontWeight: 700, fontSize: 13, color: "#7DDCE8" }}>InklusiJobs</span>
                <span style={{ fontFamily: "Arial, sans-serif", fontWeight: 700, fontSize: 13, color: "rgba(224,248,250,0.6)" }}>Other Platforms</span>
              </div>
              {comparisonRows.map((row, i) => (
                <div key={row.feature} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", padding: "14px 24px", borderTop: "1px solid #EEF4F6", background: i % 2 === 0 ? "#FDFCFA" : "#fff" }}>
                  <span style={{ fontFamily: "Arial, sans-serif", fontWeight: 600, fontSize: 13, color: "#1A1A2E" }}>{row.feature}</span>
                  <span style={{ fontFamily: "Arial, sans-serif", fontSize: 13, color: "#0F5C6E" }}>{row.inklusi}</span>
                  <span style={{ fontFamily: "Arial, sans-serif", fontSize: 13, color: "#94A3B8" }}>{row.others}</span>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div style={{ background: "linear-gradient(135deg, #0F5C6E, #0A3D4A)", borderRadius: 20, padding: "56px 40px", textAlign: "center" }}>
            <h2 style={{ fontFamily: "Arial, sans-serif", fontWeight: 800, fontSize: 26, color: "#fff", marginBottom: 12 }}>Ready to post your first job?</h2>
            <p style={{ fontFamily: "Arial, sans-serif", fontSize: 15, color: "rgba(224,248,250,0.78)", marginBottom: 32, maxWidth: 460, margin: "0 auto 32px" }}>
              Join 120+ inclusive employers already using InklusiJobs to find verified PWD talent — free to get started.
            </p>
            <a href="/employer" style={{ fontFamily: "Arial, sans-serif", fontWeight: 700, fontSize: 14, background: "#fff", color: "#0F5C6E", padding: "14px 36px", borderRadius: 12, textDecoration: "none", display: "inline-block" }}>
              Get Started as Employer →
            </a>
          </div>
        </div>
      </main>
      <Footer />
      <AccessibilityPanel />
    </>
  );
}