"use client";

import Link from "next/link";
import { useState } from "react";

const steps = [
  {
    num: 1,
    emoji: "📄",
    title: "Multi-Document Submission",
    desc: "PWD ID + supporting document (medical cert, barangay cert, or PhilHealth records)",
    color: "#FFE4B5",
    accent: "#F59E0B",
  },
  {
    num: 2,
    emoji: "🤖",
    title: "AI Document Analysis",
    desc: "Gemini Vision API validates fields, checks LGU templates, flags inconsistencies",
    color: "#BFDBFE",
    accent: "#3B82F6",
  },
  {
    num: 3,
    emoji: "📸",
    title: "Liveness Check",
    desc: "Real-time selfie with PWD ID via browser camera — no special hardware needed",
    color: "#BBF7D0",
    accent: "#10B981",
  },
  {
    num: 4,
    emoji: "🏅",
    title: "Human Review & Badge",
    desc: "Admin reviews flagged cases — approved accounts receive the PWD Verified badge",
    color: "#E9D5FF",
    accent: "#8B5CF6",
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
  const [hovered, setHovered] = useState(null);

  return (
    <>
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        @keyframes pulse-ring {
          0% { transform: scale(1); opacity: 0.4; }
          100% { transform: scale(1.5); opacity: 0; }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .step-card {
          transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.25s ease;
          cursor: default;
        }
        .step-card:hover {
          transform: translateY(-6px) rotate(-0.5deg);
        }
        .partner-chip {
          transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
          cursor: default;
        }
        .partner-chip:hover {
          transform: scale(1.1) translateY(-2px);
        }
        .cta-card {
          transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s ease;
        }
        .cta-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 32px 64px rgba(0,0,0,0.15);
        }
        .shimmer-text {
          background: linear-gradient(90deg, #7DDCE8, #fff, #7DDCE8);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 3s linear infinite;
        }
      `}</style>

      {/* ── VERIFICATION SECTION ── */}
      <section
        style={{
          background: "linear-gradient(160deg, #0A2A35 0%, #0F3D4A 40%, #0A2E3A 100%)",
          padding: "96px 24px",
          position: "relative",
          overflow: "hidden",
        }}
        aria-labelledby="verification-heading"
      >
        {/* Decorative blobs */}
        <div style={{
          position: "absolute", top: -80, right: -80,
          width: 400, height: 400, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(125,220,232,0.12) 0%, transparent 70%)",
          pointerEvents: "none",
        }} aria-hidden="true" />
        <div style={{
          position: "absolute", bottom: -100, left: -60,
          width: 300, height: 300, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 70%)",
          pointerEvents: "none",
        }} aria-hidden="true" />

        <div style={{ maxWidth: 1200, margin: "0 auto" }}>

          {/* Header */}
          <div style={{ marginBottom: 64, textAlign: "center" }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "rgba(125,220,232,0.12)",
              border: "1px solid rgba(125,220,232,0.25)",
              borderRadius: 999, padding: "6px 18px", marginBottom: 20,
            }}>
              <span style={{ fontSize: 14 }}>🔐</span>
              <span style={{
                fontFamily: "Lexend, sans-serif", fontSize: 11, fontWeight: 700,
                letterSpacing: "0.16em", textTransform: "uppercase", color: "#7DDCE8",
              }}>PWD Verification System</span>
            </div>

            <h2
              id="verification-heading"
              className="shimmer-text"
              style={{
                fontFamily: "Lexend, sans-serif", fontWeight: 300,
                fontSize: "clamp(2rem, 4vw, 3.2rem)",
                lineHeight: 1.15, marginBottom: 16,
              }}
            >
              The trust layer the Philippines<br />has been missing
            </h2>
            <p style={{
              fontFamily: "Lexend, sans-serif", fontSize: 15,
              color: "rgba(224,248,250,0.55)", maxWidth: 480, margin: "0 auto",
              lineHeight: 1.7,
            }}>
              Four steps. One badge. A lifetime of opportunity.
            </p>
          </div>

          {/* Step Cards Grid */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: 16, marginBottom: 48,
          }} role="list" aria-label="Verification steps">
            {steps.map((step, i) => (
              <div
                key={step.num}
                role="listitem"
                className="step-card"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: `1.5px solid ${hovered === i ? step.accent + "60" : "rgba(255,255,255,0.08)"}`,
                  borderRadius: 20,
                  padding: "28px 24px",
                  position: "relative",
                  overflow: "hidden",
                  animationDelay: `${i * 0.15}s`,
                }}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
              >
                {/* Glow on hover */}
                {hovered === i && (
                  <div style={{
                    position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
                    background: `radial-gradient(circle at 30% 30%, ${step.accent}15, transparent 60%)`,
                    pointerEvents: "none", borderRadius: 20,
                  }} />
                )}

                {/* Step number badge */}
                <div style={{
                  position: "absolute", top: 16, right: 16,
                  width: 24, height: 24, borderRadius: "50%",
                  background: "rgba(255,255,255,0.08)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: "Lexend, sans-serif", fontSize: 11, fontWeight: 700,
                  color: "rgba(255,255,255,0.3)",
                }} aria-hidden="true">{step.num}</div>

                {/* Emoji icon */}
                <div style={{
                  width: 52, height: 52, borderRadius: 16,
                  background: step.color + "22",
                  border: `1.5px solid ${step.color}44`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 24, marginBottom: 16,
                  animation: hovered === i ? "float 2s ease-in-out infinite" : "none",
                }} aria-hidden="true">{step.emoji}</div>

                <h3 style={{
                  fontFamily: "Lexend, sans-serif", fontWeight: 600, fontSize: 14,
                  color: "#E0F8FA", marginBottom: 8, lineHeight: 1.4,
                }}>{step.title}</h3>
                <p style={{
                  fontFamily: "Lexend, sans-serif", fontSize: 12.5,
                  color: "rgba(224,248,250,0.5)", lineHeight: 1.65, margin: 0,
                }}>{step.desc}</p>

                {/* Bottom accent line */}
                <div style={{
                  position: "absolute", bottom: 0, left: 0, right: 0, height: 2,
                  background: hovered === i ? `linear-gradient(90deg, transparent, ${step.accent}, transparent)` : "transparent",
                  borderRadius: "0 0 20px 20px",
                  transition: "all 0.3s ease",
                }} />
              </div>
            ))}
          </div>

          {/* VaaS Card */}
          <div style={{
            background: "rgba(255,255,255,0.04)",
            border: "1.5px solid rgba(125,220,232,0.15)",
            borderRadius: 24, padding: "36px 40px",
            display: "flex", flexWrap: "wrap",
            gap: 32, alignItems: "center",
            justifyContent: "space-between",
          }}>
            <div style={{ flex: "1 1 320px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                <span style={{ fontSize: 22 }}>⚡</span>
                <h3 style={{
                  fontFamily: "Lexend, sans-serif", fontWeight: 700, fontSize: 18,
                  color: "#F0FDFD", margin: 0,
                }}>Verification-as-a-Service</h3>
              </div>
              <p style={{
                fontFamily: "Lexend, sans-serif", fontSize: 13.5,
                color: "rgba(224,248,250,0.6)", lineHeight: 1.75, margin: 0,
              }}>
                {`InklusiJobs' verification infrastructure is licensable to any business that offers PWD discounts or must comply with RA 7277 — hospitals, retailers, airlines, and more.`}
              </p>
            </div>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, flex: "1 1 260px" }}
              role="list" aria-label="Partner industries">
              {vaasPartners.map((p) => (
                <span
                  key={p.label}
                  role="listitem"
                  className="partner-chip"
                  style={{
                    fontFamily: "Lexend, sans-serif", fontSize: 12.5, fontWeight: 500,
                    display: "inline-flex", alignItems: "center", gap: 6,
                    background: "rgba(125,220,232,0.08)",
                    border: "1px solid rgba(125,220,232,0.18)",
                    borderRadius: 999, padding: "8px 16px",
                    color: "rgba(224,248,250,0.8)",
                  }}
                >
                  <span aria-hidden="true">{p.icon}</span> {p.label}
                </span>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* ── CTA SECTION ── */}
      <section
        style={{ background: "#F7F6F4", padding: "80px 24px" }}
        aria-labelledby="cta-heading"
      >
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>

          {/* Section label */}
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <p style={{
              fontFamily: "Lexend, sans-serif", fontSize: 11, fontWeight: 700,
              letterSpacing: "0.16em", textTransform: "uppercase",
              color: "#0F5C6E", marginBottom: 10,
            }}>Ready to get started?</p>
            <h2
              id="cta-heading"
              style={{
                fontFamily: "Lexend, sans-serif", fontWeight: 700,
                fontSize: "clamp(1.8rem, 3vw, 2.4rem)",
                color: "#0A2A35", margin: 0,
              }}
            >
              Which one are you? 👇
            </h2>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: 20,
          }}>

            {/* Job Seeker CTA */}
            <div
              className="cta-card"
              style={{
                background: "linear-gradient(145deg, #0F5C6E 0%, #0A3040 100%)",
                borderRadius: 24, padding: "48px 40px",
                display: "flex", flexDirection: "column",
                justifyContent: "space-between", minHeight: 300,
                position: "relative", overflow: "hidden",
                boxShadow: "0 8px 32px rgba(15,92,110,0.2)",
              }}
            >
              {/* Decorative circles */}
              <div style={{
                position: "absolute", top: -60, right: -60,
                width: 200, height: 200, borderRadius: "50%",
                background: "rgba(125,220,232,0.1)", pointerEvents: "none",
              }} aria-hidden="true" />
              <div style={{
                position: "absolute", bottom: -30, left: -30,
                width: 120, height: 120, borderRadius: "50%",
                background: "rgba(125,220,232,0.06)", pointerEvents: "none",
              }} aria-hidden="true" />

              <div style={{ position: "relative" }}>
                <div style={{ fontSize: 36, marginBottom: 16 }}>🚀</div>
                <h3 style={{
                  fontFamily: "Lexend, sans-serif", fontWeight: 700,
                  fontSize: "clamp(1.4rem, 2.5vw, 1.75rem)",
                  color: "#fff", lineHeight: 1.25, marginBottom: 12,
                }}>
                  Ready to prove<br />your skills?
                </h3>
                <p style={{
                  fontFamily: "Lexend, sans-serif", fontSize: 13.5,
                  color: "rgba(224,248,250,0.7)", lineHeight: 1.7,
                  marginBottom: 32, maxWidth: 320,
                }}>
                  Create your free profile, complete your first challenge, and get your PWD Verified badge — all in one platform.
                </p>
              </div>

              <Link
                href="/signup"
                style={{
                  fontFamily: "Lexend, sans-serif", fontWeight: 700, fontSize: 13,
                  color: "#0F5C6E", background: "#fff", borderRadius: 12,
                  padding: "14px 28px", textDecoration: "none",
                  display: "inline-flex", alignItems: "center", gap: 8,
                  alignSelf: "flex-start",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
                  transition: "transform 0.2s, box-shadow 0.2s",
                  position: "relative",
                }}
                className="hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                Start Your Journey ✨
              </Link>
            </div>

            {/* Employer CTA */}
            <div
              className="cta-card"
              style={{
                background: "#fff",
                border: "2px solid #E8F0F2",
                borderRadius: 24, padding: "48px 40px",
                display: "flex", flexDirection: "column",
                justifyContent: "space-between", minHeight: 300,
                position: "relative", overflow: "hidden",
                boxShadow: "0 8px 32px rgba(0,0,0,0.06)",
              }}
            >
              <div style={{
                position: "absolute", bottom: -60, right: -60,
                width: 200, height: 200, borderRadius: "50%",
                background: "rgba(15,92,110,0.05)", pointerEvents: "none",
              }} aria-hidden="true" />

              <div style={{ position: "relative" }}>
                <div style={{ fontSize: 36, marginBottom: 16 }}>🏢</div>
                <h3 style={{
                  fontFamily: "Lexend, sans-serif", fontWeight: 700,
                  fontSize: "clamp(1.4rem, 2.5vw, 1.75rem)",
                  color: "#0A2A35", lineHeight: 1.25, marginBottom: 12,
                }}>
                  Hiring verified<br />PWD talent?
                </h3>
                <p style={{
                  fontFamily: "Lexend, sans-serif", fontSize: 13.5,
                  color: "#4A6070", lineHeight: 1.7,
                  marginBottom: 32, maxWidth: 320,
                }}>
                  Browse skill-verified candidates, post jobs for free, and earn your Inclusive Employer badge — while maximizing your RA 7277 tax benefits.
                </p>
              </div>

              <Link
                href="/signup?role=employer"
                style={{
                  fontFamily: "Lexend, sans-serif", fontWeight: 700, fontSize: 13,
                  color: "#fff", background: "linear-gradient(135deg, #0F5C6E, #0A3040)",
                  borderRadius: 12, padding: "14px 28px",
                  textDecoration: "none", display: "inline-flex",
                  alignItems: "center", gap: 8, alignSelf: "flex-start",
                  boxShadow: "0 4px 16px rgba(15,92,110,0.25)",
                  transition: "transform 0.2s, box-shadow 0.2s",
                }}
                className="hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F5C6E]"
              >
                Post a Job 🎯
              </Link>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}