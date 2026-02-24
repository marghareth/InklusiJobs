"use client";

import Link from "next/link";

const steps = [
  {
    num: 1,
    title: "Multi-Document Submission",
    desc: "PWD ID + supporting document (medical cert, barangay cert, or PhilHealth records)",
  },
  {
    num: 2,
    title: "AI Document Analysis",
    desc: "Gemini Vision API validates fields, checks LGU templates, flags inconsistencies",
  },
  {
    num: 3,
    title: "Liveness Check",
    desc: "Real-time selfie with PWD ID via browser camera — no special hardware needed",
  },
  {
    num: 4,
    title: "Human Review & Badge",
    desc: "Admin reviews flagged cases — approved accounts receive the PWD Verified badge",
  },
];

const vaasPartners = [
  { icon: "🏥", label: "Hospitals" },
  { icon: "🛒", label: "Retailers" },
  { icon: "✈️", label: "Airlines" },
  { icon: "💊", label: "Pharmacies" },
  { icon: "🏛️", label: "Government" },
  { icon: "🍔", label: "Food Chains" },
];

export default function VerificationSection() {
  return (
    <>
      {/* ── VERIFICATION SECTION ── */}
      <section
        className="bg-[#1E293B] py-24 px-6 md:px-16 lg:px-24"
        aria-labelledby="verification-heading"
      >
        <div style={{ maxWidth: 1400, margin: "0 auto" }}>

          {/* Label */}
          <p style={{
            fontFamily: "Lexend, sans-serif",
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "#60A5FA",
            marginBottom: 14,
          }}>
            PWD Verification System
          </p>

          {/* Heading */}
          <h2
            id="verification-heading"
            style={{
              fontFamily: "Lexend, sans-serif",
              fontWeight: 300,
              fontSize: "clamp(2rem, 3.5vw, 2.8rem)",
              color: "#F8FAFC",
              lineHeight: 1.2,
              marginBottom: 48,
              maxWidth: 480,
            }}
          >
            The trust layer the Philippines has been missing
          </h2>

          <div style={{ display: "flex", flexDirection: "row", gap: 32, alignItems: "flex-start" }}
            className="flex-col lg:flex-row"
          >
            {/* Steps */}
            <div style={{ flex: "0 0 52%", display: "flex", flexDirection: "column", gap: 12 }}
              role="list" aria-label="Verification steps"
            >
              {steps.map((step) => (
                <div
                  key={step.num}
                  role="listitem"
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 16,
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: 14,
                    padding: "18px 20px",
                  }}
                >
                  <div style={{
                    width: 30, height: 30, borderRadius: "50%",
                    background: "#1E40AF",
                    color: "#fff",
                    fontSize: 13, fontWeight: 700,
                    fontFamily: "Lexend, sans-serif",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0, marginTop: 1,
                  }} aria-hidden="true">
                    {step.num}
                  </div>
                  <div>
                    <h3 style={{ fontFamily: "Lexend, sans-serif", fontWeight: 600, fontSize: 14, color: "#F1F5F9", marginBottom: 4 }}>
                      {step.title}
                    </h3>
                    <p style={{ fontFamily: "Lexend, sans-serif", fontSize: 13, color: "rgba(255,255,255,0.5)", lineHeight: 1.6 }}>
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* VaaS Card */}
            <div style={{
              flex: 1,
              background: "rgba(255,255,255,0.07)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 20,
              padding: "32px 28px",
            }}>
              <h3 style={{ fontFamily: "Lexend, sans-serif", fontWeight: 600, fontSize: 20, color: "#F8FAFC", marginBottom: 12 }}>
                Verification-as-a-Service
              </h3>
              <p style={{ fontFamily: "Lexend, sans-serif", fontSize: 14, color: "rgba(255,255,255,0.6)", lineHeight: 1.7, marginBottom: 24 }}>
                {`InklusiJobs' verification infrastructure is licensable to any business that offers PWD discounts or must comply with RA 7277 — hospitals, retailers, airlines, and more.`}
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }} role="list" aria-label="Partner industries">
                {vaasPartners.map((p) => (
                  <span
                    key={p.label}
                    role="listitem"
                    style={{
                      fontFamily: "Lexend, sans-serif",
                      fontSize: 12, fontWeight: 500,
                      display: "flex", alignItems: "center", gap: 6,
                      background: "rgba(255,255,255,0.08)",
                      border: "1px solid rgba(255,255,255,0.12)",
                      borderRadius: 999,
                      padding: "6px 14px",
                      color: "rgba(255,255,255,0.75)",
                    }}
                  >
                    <span aria-hidden="true">{p.icon}</span> {p.label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA SECTION ── */}
      <section
        className="py-20 px-6 md:px-16 lg:px-24"
        style={{ background: "#F7F6F4" }}
        aria-labelledby="cta-heading"
      >
        <div
          style={{
            maxWidth: 1400,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 20,
          }}
          className="grid-cols-1 md:grid-cols-2"
        >

          {/* ── Job Seeker CTA — Navy blue card ── */}
          <div
            style={{
              background: "linear-gradient(135deg, #1E40AF 0%, #1E3A8A 100%)",
              borderRadius: 20,
              padding: "44px 40px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              minHeight: 280,
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Subtle decorative circle */}
            <div style={{
              position: "absolute", top: -40, right: -40,
              width: 200, height: 200, borderRadius: "50%",
              background: "rgba(255,255,255,0.05)",
              pointerEvents: "none",
            }} aria-hidden="true" />

            <div>
              <h2
                id="cta-heading"
                style={{
                  fontFamily: "Lexend, sans-serif",
                  fontWeight: 700,
                  fontSize: "clamp(1.4rem, 2.5vw, 1.9rem)",
                  color: "#fff",
                  lineHeight: 1.25,
                  marginBottom: 14,
                }}
              >
                Ready to prove your skills?
              </h2>
              <p style={{
                fontFamily: "Lexend, sans-serif",
                fontSize: 14,
                color: "rgba(255,255,255,0.75)",
                lineHeight: 1.7,
                maxWidth: 360,
                marginBottom: 32,
              }}>
                Create your free profile, complete your first challenge, and get your PWD Verified badge — all in one platform.
              </p>
            </div>

            <Link
              href="/signup"
              style={{
                fontFamily: "Lexend, sans-serif",
                fontWeight: 600,
                fontSize: 13,
                color: "#1E40AF",
                background: "#fff",
                borderRadius: 10,
                padding: "12px 24px",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                alignSelf: "flex-start",
                boxShadow: "0 2px 12px rgba(0,0,0,0.12)",
                transition: "background 0.2s",
              }}
              className="hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2"
            >
              Start Your Journey →
            </Link>
          </div>

          {/* ── Employer CTA — White card ── */}
          <div
            style={{
              background: "#fff",
              border: "1.5px solid #E2E8F0",
              borderRadius: 20,
              padding: "44px 40px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              minHeight: 280,
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Subtle decorative circle */}
            <div style={{
              position: "absolute", bottom: -50, right: -50,
              width: 200, height: 200, borderRadius: "50%",
              background: "rgba(30,64,175,0.04)",
              pointerEvents: "none",
            }} aria-hidden="true" />

            <div>
              <h2 style={{
                fontFamily: "Lexend, sans-serif",
                fontWeight: 700,
                fontSize: "clamp(1.4rem, 2.5vw, 1.9rem)",
                color: "#1E293B",
                lineHeight: 1.25,
                marginBottom: 14,
              }}>
                Hiring verified PWD talent?
              </h2>
              <p style={{
                fontFamily: "Lexend, sans-serif",
                fontSize: 14,
                color: "#64748B",
                lineHeight: 1.7,
                maxWidth: 360,
                marginBottom: 32,
              }}>
                Browse skill-verified candidates, post jobs for free, and earn your Inclusive Employer badge — while maximizing your RA 7277 tax benefits.
              </p>
            </div>

            <Link
              href="/signup?role=employer"
              style={{
                fontFamily: "Lexend, sans-serif",
                fontWeight: 600,
                fontSize: 13,
                color: "#fff",
                background: "#1E293B",
                borderRadius: 10,
                padding: "12px 24px",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                alignSelf: "flex-start",
                transition: "background 0.2s",
              }}
              className="hover:bg-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-700 focus-visible:ring-offset-2"
            >
              Post a Job →
            </Link>
          </div>

        </div>
      </section>
    </>
  );
}