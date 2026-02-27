import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import AccessibilityPanel from "@/components/accessibility/AccessibilityPanel";
import SkipLink from "@/components/accessibility/SkipLink";

export const metadata = {
  title: "About InklusiJobs — Our Philosophy & Mission",
  description: "Why InklusiJobs exists, what we stand for, and why inclusive employment matters for the Philippines.",
};

const painPoints = [
  { icon: "🔄", title: "The Experience Trap", desc: "Employers require prior experience for entry-level roles. PWDs can't get experience because they aren't hired. They aren't hired because they lack experience. It's a cycle that traps capable people — and we're breaking it." },
  { icon: "📄", title: "Certificates ≠ Competence", desc: "Online courses and certifications are widely available — but a certificate doesn't prove someone can actually do the job. Without real work history or a credible portfolio, PWDs have no way to show what they're truly capable of." },
  { icon: "🧩", title: "Platforms Built for the Majority", desc: "Job platforms like LinkedIn, Jobstreet, and OnlineJobsPh weren't designed with PWDs in mind. They rely on traditional credentials, offer no accessibility adaptations, and leave an entire community of skilled workers invisible." },
  { icon: "🏢", title: "Employers Without Tools", desc: "Even employers who want to hire inclusively struggle — there's no reliable way to verify if a PWD applicant can actually perform the role. Good intentions don't overcome the trust gap without evidence." },
];

const pillars = [
  { icon: "🎯", title: "Skills Over Credentials", desc: "We believe your ability to do the job matters infinitely more than where you went to school or who you worked for. Our platform verifies what you can actually do — through real challenges, evaluated by AI." },
  { icon: "♿", title: "Accessibility by Design", desc: "Accessibility isn't a feature we added later — it's built into the foundation. WCAG 2.1 AA compliance, adaptive interfaces for visual, cognitive, and motor disabilities, and full confidentiality are non-negotiable defaults." },
  { icon: "🔒", title: "Dignity in Every Interaction", desc: "Your disability is never your defining trait on this platform. We keep your disability profile private from employers unless you choose to share it. You are a skilled professional first." },
  { icon: "🤝", title: "Trust Through Verification", desc: "The trust gap between PWDs and employers is real. We close it with evidence — AI-verified portfolio challenges, detailed rubric scores, and public portfolios that let your work do the talking." },
  { icon: "🌏", title: "Systemic, Not Sympathy-Based", desc: "We're not a charity. We're building infrastructure — a skills verification layer that creates genuine economic value for both workers and employers. Inclusion that makes business sense is inclusion that lasts." },
  { icon: "📈", title: "Economic Participation", desc: "Every PWD who enters the workforce unlocks economic potential — for themselves, their families, and the Philippine economy. Inclusive employment isn't a social nicety; it's an economic imperative." },
];

const sdgCards = [
  { tag: "SDG 8", title: "Decent Work & Economic Growth", desc: "InklusiJobs directly targets SDG 8 by reducing unemployment among PWDs — a chronically underrepresented segment of the Philippine labor force — through verified skills and inclusive hiring infrastructure.", color: "#0F5C6E" },
  { tag: "SDG 10", title: "Reduced Inequalities", desc: "By removing credential-based barriers and providing accessible tools, we level the playing field for Persons with Disabilities in a job market that has historically excluded them.", color: "#1A3A5C" },
  { tag: "RA 7277", title: "Magna Carta for Persons with Disabilities", desc: "Every feature is built in alignment with the Magna Carta for PWDs — from confidential disability profiles to employer tax benefit documentation and verification infrastructure.", color: "#1A8FA5" },
];

const differentiators = [
  { title: "End-to-End Solution", desc: "AI roadmap generation → skill building → portfolio challenges → verification → job matching → hiring. No other platform in the Philippines connects all of these into one inclusive ecosystem." },
  { title: "Evidence-Based Portfolios", desc: "Challenge-based verification creates real, demonstrable proof of skill. Users without work history can prove capability through completed projects — building employer confidence from the ground up." },
  { title: "AI That Adapts to You", desc: "Our Gemini-powered roadmaps adapt to your current skill level, time availability, disability accommodations, and career goals. Personalization that reflects reality — not a generic course list." },
  { title: "Confidentiality at the Core", desc: "Unlike most platforms, disability status is never visible to employers unless you disclose it. The focus is entirely on verified skills and portfolio quality." },
];

export default function AboutPage() {
  return (
    <>
      <SkipLink />
      <Navbar />
      <main id="main-content" style={{ background: "#FAF8F5", minHeight: "100vh" }}>

        {/* Hero */}
        <div style={{ background: "linear-gradient(135deg, #0A3D4A 0%, #0F5C6E 100%)", paddingTop: 140, paddingBottom: 80, paddingLeft: 32, paddingRight: 32 }}>
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            <span style={{ fontFamily: "Arial, sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: "#7DDCE8", display: "block", marginBottom: 16 }}>Our Philosophy</span>
            <h1 style={{ fontFamily: "Arial, sans-serif", fontSize: "clamp(2.2rem, 5vw, 3.5rem)", fontWeight: 800, color: "#fff", lineHeight: 1.15, marginBottom: 20, maxWidth: 760 }}>
              Why InklusiJobs Exists — and Why It <span style={{ color: "#7DDCE8" }}>Matters</span>
            </h1>
            <p style={{ fontFamily: "Arial, sans-serif", fontSize: 17, color: "rgba(224,248,250,0.82)", lineHeight: 1.85, maxWidth: 640 }}>
              Despite RA 7277, hundreds of thousands of Persons with Disabilities in the Philippines remain unemployed — not because they lack ability, but because the systems around them were never built to see it. We&apos;re changing that.
            </p>
          </div>
        </div>

        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "72px 32px" }}>

          {/* The Problem */}
          <div style={{ marginBottom: 72 }}>
            <h2 style={{ fontFamily: "Arial, sans-serif", fontWeight: 800, fontSize: 28, color: "#1A1A2E", marginBottom: 8 }}>The problem we&apos;re solving</h2>
            <p style={{ fontFamily: "Arial, sans-serif", fontSize: 15, color: "#4A6070", marginBottom: 40, lineHeight: 1.75, maxWidth: 680 }}>
              The unemployment of PWDs in the Philippines isn&apos;t a capability problem. It&apos;s a systems problem — and it shows up in four interconnected ways.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 20 }}>
              {painPoints.map(p => (
                <div key={p.title} style={{ background: "#fff", border: "1.5px solid #DDE8EC", borderRadius: 16, padding: "28px 24px", boxShadow: "0 2px 12px rgba(15,92,110,0.05)" }}>
                  <div style={{ fontSize: 30, marginBottom: 14 }}>{p.icon}</div>
                  <h3 style={{ fontFamily: "Arial, sans-serif", fontWeight: 700, fontSize: 15, color: "#1A1A2E", marginBottom: 8 }}>{p.title}</h3>
                  <p style={{ fontFamily: "Arial, sans-serif", fontSize: 13, color: "#4A6070", lineHeight: 1.75 }}>{p.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Mission Statement */}
          <div style={{ background: "#0F5C6E", borderRadius: 20, padding: "48px 44px", marginBottom: 72 }}>
            <span style={{ fontFamily: "Arial, sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: "#7DDCE8", display: "block", marginBottom: 16 }}>Our Mission</span>
            <p style={{ fontFamily: "Arial, sans-serif", fontWeight: 700, fontSize: "clamp(1.3rem, 2.5vw, 1.75rem)", color: "#fff", lineHeight: 1.55, maxWidth: 760, margin: 0 }}>
              &ldquo;To empower Persons with Disabilities by providing a verified, accessible, and skills-first pathway to meaningful employment — so that capability, not circumstance, determines opportunity.&rdquo;
            </p>
          </div>

          {/* Our Pillars */}
          <div style={{ marginBottom: 72 }}>
            <h2 style={{ fontFamily: "Arial, sans-serif", fontWeight: 800, fontSize: 28, color: "#1A1A2E", marginBottom: 8 }}>What we stand for</h2>
            <p style={{ fontFamily: "Arial, sans-serif", fontSize: 15, color: "#4A6070", marginBottom: 40, lineHeight: 1.75 }}>Six principles that guide every decision we make.</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
              {pillars.map((p, i) => (
                <div key={p.title} style={{ background: i % 3 === 0 ? "#F0EDE8" : i % 3 === 1 ? "#0F5C6E" : "#1A3A5C", border: i % 3 === 0 ? "1.5px solid #C8D8E0" : "none", borderRadius: 16, padding: "28px 24px" }}>
                  <div style={{ fontSize: 30, marginBottom: 12 }}>{p.icon}</div>
                  <h3 style={{ fontFamily: "Arial, sans-serif", fontWeight: 700, fontSize: 15, color: i % 3 === 0 ? "#1A1A2E" : "#fff", marginBottom: 8 }}>{p.title}</h3>
                  <p style={{ fontFamily: "Arial, sans-serif", fontSize: 13, color: i % 3 === 0 ? "#4A6070" : "rgba(224,248,250,0.78)", lineHeight: 1.75, margin: 0 }}>{p.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* SDG Alignment */}
          <div style={{ marginBottom: 72 }}>
            <h2 style={{ fontFamily: "Arial, sans-serif", fontWeight: 800, fontSize: 28, color: "#1A1A2E", marginBottom: 8 }}>Aligned with global & local standards</h2>
            <p style={{ fontFamily: "Arial, sans-serif", fontSize: 15, color: "#4A6070", marginBottom: 40, lineHeight: 1.75 }}>InklusiJobs is built in alignment with Philippine law and UN Sustainable Development Goals.</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
              {sdgCards.map(s => (
                <div key={s.tag} style={{ background: s.color, borderRadius: 16, padding: "28px 24px" }}>
                  <span style={{ fontFamily: "Arial, sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: "rgba(224,248,250,0.65)", display: "block", marginBottom: 8 }}>{s.tag}</span>
                  <h3 style={{ fontFamily: "Arial, sans-serif", fontWeight: 700, fontSize: 16, color: "#fff", marginBottom: 10 }}>{s.title}</h3>
                  <p style={{ fontFamily: "Arial, sans-serif", fontSize: 13, color: "rgba(224,248,250,0.78)", lineHeight: 1.75, margin: 0 }}>{s.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* What Makes Us Different */}
          <div style={{ marginBottom: 72 }}>
            <h2 style={{ fontFamily: "Arial, sans-serif", fontWeight: 800, fontSize: 28, color: "#1A1A2E", marginBottom: 8 }}>What makes InklusiJobs different</h2>
            <p style={{ fontFamily: "Arial, sans-serif", fontSize: 15, color: "#4A6070", marginBottom: 40, lineHeight: 1.75, maxWidth: 640 }}>
              Platforms like LinkedIn, Jobstreet, and OnlineJobsPh weren&apos;t built for this. Here&apos;s what sets us apart.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {differentiators.map((d, i) => (
                <div key={d.title} style={{ background: "#fff", border: "1.5px solid #DDE8EC", borderRadius: 16, padding: "24px 28px", display: "flex", gap: 20, alignItems: "flex-start", boxShadow: "0 2px 12px rgba(15,92,110,0.05)" }}>
                  <div style={{ flexShrink: 0, width: 36, height: 36, borderRadius: "50%", background: "#0F5C6E", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Arial, sans-serif", fontWeight: 800, fontSize: 14, color: "#fff" }}>{i + 1}</div>
                  <div>
                    <h3 style={{ fontFamily: "Arial, sans-serif", fontWeight: 700, fontSize: 15, color: "#1A1A2E", marginBottom: 6 }}>{d.title}</h3>
                    <p style={{ fontFamily: "Arial, sans-serif", fontSize: 13, color: "#4A6070", lineHeight: 1.75, margin: 0 }}>{d.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Vision */}
          <div style={{ background: "#F0EDE8", border: "1.5px solid #C8D8E0", borderRadius: 20, padding: "56px 44px", textAlign: "center" }}>
            <div style={{ fontSize: 48, marginBottom: 20 }}>🌏</div>
            <h2 style={{ fontFamily: "Arial, sans-serif", fontWeight: 800, fontSize: 26, color: "#1A1A2E", marginBottom: 16 }}>Our Vision</h2>
            <p style={{ fontFamily: "Arial, sans-serif", fontSize: 16, color: "#4A6070", maxWidth: 620, margin: "0 auto 36px", lineHeight: 1.85 }}>
              A Philippines where disability is never a barrier to economic participation — where every Person with a Disability has access to the tools, verification, and opportunities they deserve to build a career that reflects their true capability.
            </p>
            <a href="/" style={{ fontFamily: "Arial, sans-serif", fontWeight: 700, fontSize: 14, background: "#0F5C6E", color: "#fff", padding: "14px 36px", borderRadius: 12, textDecoration: "none", display: "inline-block" }}>
              Join InklusiJobs →
            </a>
          </div>
        </div>
      </main>
      <Footer />
      <AccessibilityPanel />
    </>
  );
}