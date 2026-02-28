"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useAuthModalContext } from "@/components/landing/AuthModalContext";

export default function HeroSection() {
  const { openRoleSelector } = useAuthModalContext();
  const bgRef = useRef(null);
  const [arrowPos, setArrowPos] = useState(0);
  const [eyeScale, setEyeScale] = useState(1);

  useEffect(() => {
    const handleScroll = () => {
      if (bgRef.current) {
        bgRef.current.style.transform = `translateY(${window.scrollY * 0.4}px)`;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    let frame;
    let start;
    const animate = (ts) => {
      if (!start) start = ts;
      const t = (ts - start) / 1000;
      setArrowPos(Math.sin(t * Math.PI * 2 / 1.1) * 5 + 5);
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    let frame;
    let start;
    const animate = (ts) => {
      if (!start) start = ts;
      const t = (ts - start) / 1000;
      setEyeScale(1 + Math.sin(t * Math.PI * 2 / 1.6) * 0.20);
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <section
      className="relative min-h-screen w-full overflow-hidden"
      aria-labelledby="hero-heading"
    >
      {/* Parallax background */}
      <div
        ref={bgRef}
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          top: "-12%",
          bottom: "-12%",
          backgroundImage: "url('/images/hero-bg.png')",
          backgroundSize: "cover",
          backgroundPosition: "center center",
          backgroundRepeat: "no-repeat",
          willChange: "transform",
          zIndex: 0,
        }}
      />

      {/* Dark overlay */}
      <div
        className="absolute inset-0 z-0"
        style={{ background: "rgba(0,0,0,0.50)" }}
        aria-hidden="true"
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen text-center px-6 md:px-20 pt-32">

        {/* Heading — bigger */}
        <h1
          id="hero-heading"
          className="font-light leading-[1.1] text-5xl md:text-6xl lg:text-7xl mb-8 max-w-4xl"
          style={{ color: "#F0FDFD", fontFamily: "Arial, Helvetica, sans-serif" }}
        >
          Equal Opportunity<br />
          Starts with<br />
          <span style={{ fontWeight: 700, color: "#7DDCE8" }}>Equal Access</span>
        </h1>

        <p
          className="text-xl md:text-2xl leading-relaxed mb-12 max-w-xl"
          style={{ color: "rgba(240,253,253,0.80)", fontFamily: "Arial, Helvetica, sans-serif" }}
        >
          InklusiJobs connects persons with disabilities to verified, inclusive employers — with the tools and support to grow your career.
        </p>

        {/* Buttons */}
        <div className="flex flex-wrap gap-4 justify-center">

          {/* See How It Works */}
          <a
            href="#how-it-works"
            style={{
              display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 10,
              fontFamily: "Arial, Helvetica, sans-serif", fontWeight: 600, fontSize: 20,
              padding: "18px 40px", borderRadius: 12,
              background: "rgba(255,255,255,0.12)",
              border: "1.5px solid rgba(255,255,255,0.35)",
              color: "#F0FDFD",
              backdropFilter: "blur(8px)",
              textDecoration: "none",
              cursor: "pointer", transition: "background 0.2s",
            }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.22)"}
            onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.12)"}
          >
            See How It Works
            <span
              aria-hidden="true"
              style={{
                display: "inline-block",
                fontSize: 24,
                lineHeight: 1,
                transform: `translateX(${arrowPos}px)`,
              }}
            >
              →
            </span>
          </a>

          {/* View Success Stories */}
          <Link
            href="/success-stories"
            style={{
              display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 10,
              fontFamily: "Arial, Helvetica, sans-serif", fontWeight: 600, fontSize: 20,
              padding: "18px 40px", borderRadius: 12,
              background: "rgba(52,211,153,0.15)",
              border: "1.5px solid rgba(52,211,153,0.45)",
              color: "#A7F3D0",
              backdropFilter: "blur(8px)",
              textDecoration: "none",
              cursor: "pointer", transition: "background 0.2s",
            }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(52,211,153,0.28)"}
            onMouseLeave={e => e.currentTarget.style.background = "rgba(52,211,153,0.15)"}
          >
            <span
              aria-hidden="true"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: 30,
                height: 30,
                borderRadius: "50%",
                background: "#34D399",
                flexShrink: 0,
                transform: `scale(${eyeScale})`,
              }}
            >
              <svg width="12" height="12" viewBox="0 0 10 10" fill="none" aria-hidden="true">
                <polygon points="2,1 9,5 2,9" fill="#0A3D2E" />
              </svg>
            </span>
            View Success Stories
          </Link>

        </div>

        {/* Scroll indicator line */}
        <div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center"
          aria-hidden="true"
        >
          <div style={{ width: 1, height: 44, background: "linear-gradient(to bottom, rgba(255,255,255,0.35), transparent)", animation: "scroll-fade 2s ease-in-out infinite" }} />
        </div>

      </div>

      <style>{`
        @keyframes scroll-fade {
          0%, 100% { opacity: 0.4; transform: scaleY(0.8) translateY(0); }
          50% { opacity: 1; transform: scaleY(1) translateY(4px); }
        }
      `}</style>
    </section>
  );
}