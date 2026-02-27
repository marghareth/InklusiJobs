"use client";

import Link from "next/link";
import { useAuthModalContext } from "@/components/landing/AuthModalContext";

export default function HeroSection() {
  const { openRoleSelector } = useAuthModalContext();

  return (
    <section
      className="relative min-h-screen w-full overflow-hidden"
      aria-labelledby="hero-heading"
      style={{
        backgroundImage: "url('/images/hero-bg.png')",
        backgroundSize: "cover",
        backgroundPosition: "center center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Dark overlay so text stays readable */}
      <div
        className="absolute inset-0 z-0"
        style={{ background: "rgba(0, 0, 0, 0.50)" }}
        aria-hidden="true"
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen text-center px-6 md:px-20 pt-32">
        {/* Pill badge */}
        <div
          className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-widest"
          style={{
            background: "rgba(255,255,255,0.15)",
            color: "#E0F4F7",
            border: "1px solid rgba(255,255,255,0.25)",
            fontFamily: "Arial, Helvetica, sans-serif",
          }}
        >
          <span
            style={{ width: 7, height: 7, borderRadius: "50%", background: "#34D399", display: "inline-block" }}
            aria-hidden="true"
          />
          Equal Opportunity Platform
        </div>

        <h1
          id="hero-heading"
          className="font-light leading-[1.1] text-4xl md:text-5xl lg:text-6xl mb-6 max-w-3xl"
          style={{ color: "#F0FDFD", fontFamily: "Arial, Helvetica, sans-serif" }}
        >
          Equal Opportunity<br />
          Starts with<br />
          <span style={{ fontWeight: 700, color: "#7DDCE8" }}>Equal Access</span>
        </h1>

        <p
          className="text-lg md:text-xl leading-relaxed mb-10 max-w-xl"
          style={{ color: "rgba(240,253,253,0.80)", fontFamily: "Arial, Helvetica, sans-serif" }}
        >
          InklusiJobs connects persons with disabilities to verified, inclusive employers — with the tools and support to grow your career.
        </p>

        <div className="flex flex-wrap gap-4 justify-center">
          <button
            onClick={openRoleSelector}
            className="inline-flex items-center justify-center font-semibold text-base px-8 py-3.5 rounded-xl transition-all hover:opacity-90"
            style={{
              background: "#0F5C6E",
              color: "#FFFFFF",
              boxShadow: "0 4px 20px rgba(15,92,110,0.4)",
              fontFamily: "Arial, Helvetica, sans-serif",
            }}
          >
            Get Started Free
          </button>
          <Link
            href="/find-work"
            className="inline-flex items-center justify-center font-semibold text-base px-8 py-3.5 rounded-xl transition-all hover:bg-white/20"
            style={{
              background: "rgba(255,255,255,0.12)",
              border: "1.5px solid rgba(255,255,255,0.35)",
              color: "#F0FDFD",
              backdropFilter: "blur(8px)",
              fontFamily: "Arial, Helvetica, sans-serif",
            }}
          >
            Browse Jobs →
          </Link>
        </div>

        <p
          className="text-sm mt-8"
          style={{ color: "rgba(240,253,253,0.50)", fontFamily: "Arial, Helvetica, sans-serif" }}
        >
          Trusted by 500+ PWD job seekers and 120+ inclusive employers across the Philippines.
        </p>
      </div>
    </section>
  );
}