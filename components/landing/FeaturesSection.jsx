"use client";

import { useRef } from "react";

const features = [
  {
    number: "01",
    title: "AI-Powered Learning Roadmap",
    description: "Tell us your goals, and our AI will create a step-by-step learning plan that fits your current skills and your schedule.",
    image: "/images/features/ai-roadmap.jpg",
    bg: "linear-gradient(135deg, #0F5C6E 0%, #0A3D4A 100%)",
    accent: "#34D399",
    light: false,
  },
  {
    number: "02",
    title: "Portfolio-Based Skill Verification",
    description: "Show employers what you can do. Complete real-world challenges to build a verified portfolio that proves your skills.",
    image: "/images/features/portfolio.jpg",
    bg: "linear-gradient(135deg, #1A8FA5 0%, #0F5C6E 100%)",
    accent: "#7DDCE8",
    light: false,
  },
  {
    number: "03",
    title: "Inclusive Job Matching",
    description: "Find jobs that match your verified skills. See how well you fit each role and apply easily with your portfolio.",
    image: "/images/features/job-matching.jpg",
    bg: "linear-gradient(135deg, #FAF8F5 0%, #EAF4F7 100%)",
    accent: "#0F5C6E",
    light: true,
  },
  {
    number: "04",
    title: "Adaptive Accessibility Interface",
    description: "High contrast, dyslexia-friendly fonts, distraction-free layouts — built for the way you work best.",
    image: "/images/features/Accessibillity.jpg",
    bg: "linear-gradient(135deg, #1A3A5C 0%, #0F2540 100%)",
    accent: "#34D399",
    light: false,
  },
  {
    number: "05",
    title: "Badges & Milestones",
    description: "Earn badges as you learn and finish challenges. Your collection clearly shows employers your progress and dedication.",
    image: "/images/features/badges.png",
    bg: "linear-gradient(135deg, #2AABB8 0%, #1A8FA5 100%)",
    accent: "#FFFFFF",
    light: false,
  },
  {
    number: "06",
    title: "Dual Dashboards",
    description: "Track your learning, challenges, and portfolio in one workspace. Employers get a separate dashboard to hire verified talent.",
    image: "/images/features/dashboards.png",
    bg: "linear-gradient(135deg, #FAF8F5 0%, #DDE8EC 100%)",
    accent: "#0F5C6E",
    light: true,
  },
];

export default function FeaturesSection() {
  const scrollRef = useRef(null);

  const scroll = (dir) => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir * 380, behavior: "smooth" });
  };

  return (
    <section
      style={{ background: "#FAF8F5", padding: "40px 0 80px" }}
      aria-labelledby="features-heading"
    >
      {/* Header row */}
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 60px", marginBottom: 48, display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 24 }}>
        <div>
          <p style={{ fontFamily: "Arial, Helvetica, sans-serif", fontSize: 13, fontWeight: 700, letterSpacing: "2.5px", textTransform: "uppercase", color: "#0F5C6E", margin: "0 0 16px" }}>
            Platform Features
          </p>
          <h2
            id="features-heading"
            style={{ fontFamily: "Arial, Helvetica, sans-serif", fontSize: "clamp(36px, 5vw, 64px)", fontWeight: 300, color: "#1A1A2E", margin: 0, lineHeight: 1.1, maxWidth: 680 }}
          >
            Everything you need to go from{" "}
            <span style={{ fontWeight: 900, color: "#0F5C6E" }}>skilled to employed.</span>
          </h2>
        </div>

        {/* Arrow buttons */}
        <div style={{ display: "flex", gap: 10, flexShrink: 0 }}>
          <button
            onClick={() => scroll(-1)}
            aria-label="Scroll left"
            style={{ width: 44, height: 44, borderRadius: "50%", border: "1.5px solid #C8D8E0", background: "#fff", color: "#0F5C6E", fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s", fontFamily: "system-ui" }}
            onMouseEnter={e => { e.currentTarget.style.background = "#0F5C6E"; e.currentTarget.style.color = "#fff"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.color = "#0F5C6E"; }}
          >
            ←
          </button>
          <button
            onClick={() => scroll(1)}
            aria-label="Scroll right"
            style={{ width: 44, height: 44, borderRadius: "50%", border: "1.5px solid #C8D8E0", background: "#0F5C6E", color: "#fff", fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s", fontFamily: "system-ui" }}
            onMouseEnter={e => { e.currentTarget.style.background = "#0A3D4A"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "#0F5C6E"; }}
          >
            →
          </button>
        </div>
      </div>

      {/* Scrollable track */}
      <div
        ref={scrollRef}
        role="list"
        aria-label="Platform features"
        style={{
          display: "flex",
          gap: 20,
          overflowX: "auto",
          scrollbarWidth: "none",
          WebkitOverflowScrolling: "touch",
          paddingLeft: 60,
          paddingRight: 60,
          paddingBottom: 16,
          cursor: "grab",
        }}
        onMouseDown={(e) => {
          const el = scrollRef.current;
          if (!el) return;
          let startX = e.pageX - el.offsetLeft;
          let scrollLeft = el.scrollLeft;
          el.style.cursor = "grabbing";
          const onMove = (e) => { el.scrollLeft = scrollLeft - (e.pageX - el.offsetLeft - startX); };
          const onUp = () => { el.style.cursor = "grab"; window.removeEventListener("mousemove", onMove); window.removeEventListener("mouseup", onUp); };
          window.addEventListener("mousemove", onMove);
          window.addEventListener("mouseup", onUp);
        }}
      >
        {features.map((f) => (
          <div
            key={f.title}
            role="listitem"
            style={{
              flex: "0 0 320px",
              minHeight: 380,
              borderRadius: 24,
              overflow: "hidden",
              position: "relative",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              transition: "transform 0.25s, box-shadow 0.25s",
              boxShadow: "0 4px 20px rgba(15,92,110,0.10)",
              userSelect: "none",
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-6px)"; e.currentTarget.style.boxShadow = "0 16px 40px rgba(15,92,110,0.20)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 20px rgba(15,92,110,0.10)"; }}
          >
            {/* Background image */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                backgroundImage: `url(${f.image})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                zIndex: 0,
              }}
              aria-hidden="true"
            />

            {/* Gradient overlay so text stays readable */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: f.light
                  ? "linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.72) 55%)"
                  : "linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.72) 55%)",
                zIndex: 1,
              }}
              aria-hidden="true"
            />

            {/* Card content */}
            <div style={{ position: "relative", zIndex: 2, padding: "32px 28px", display: "flex", flexDirection: "column", justifyContent: "space-between", height: "100%" }}>
              {/* Top: number */}
              <span style={{ fontFamily: "Arial, Helvetica, sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "2px", color: f.light ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.7)" }}>
                {f.number}
              </span>

              {/* Bottom: title + desc + accent line */}
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div style={{ height: 2, width: 36, background: f.accent, borderRadius: 99 }} aria-hidden="true" />
                <h3 style={{ fontFamily: "Arial, Helvetica, sans-serif", fontSize: 20, fontWeight: 700, color: f.light ? "#FFFFFF" : "#FFFFFF", margin: 0, lineHeight: 1.3 }}>
                  {f.title}
                </h3>
                <p style={{ fontFamily: "Arial, Helvetica, sans-serif", fontSize: 14, lineHeight: 1.7, color: f.light ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.85)", margin: 0 }}>
                  {f.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Scroll indicator dots */}
      <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 28 }} aria-hidden="true">
        {features.map((_, i) => (
          <div key={i} style={{ width: i === 0 ? 20 : 6, height: 6, borderRadius: 99, background: i === 0 ? "#0F5C6E" : "#C8D8E0", transition: "width 0.3s" }} />
        ))}
      </div>
    </section>
  );
}