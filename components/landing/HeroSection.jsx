"use client";

import Image from "next/image";
import Link from "next/link";

// Profile card shown on the right side of hero
function ProfileCard() {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <div className="w-12 h-12 rounded-full bg-[#01322C] flex items-center justify-center text-white font-bold text-lg font-['Lexend'] shrink-0">
          M
        </div>
        <div className="flex-1">
          <p className="font-semibold text-[#1E293B] font-['Lexend'] text-base">Maria Santos</p>
          <p className="text-sm text-slate-500 font-['Lexend']">UI/UX Designer · Quezon City</p>
        </div>
        <span className="text-xs font-semibold text-green-700 bg-green-100 border border-green-300 rounded-lg px-3 py-1.5">
          ✓ Verified
        </span>
      </div>

      {/* Skills */}
      <div className="space-y-3 mb-5">
        {[
          { label: "Figma & Prototyping", pct: 90, color: "from-[#0023FF] to-green-400" },
          { label: "Accessibility Design", pct: 75, color: "from-[#0023FF] to-green-300" },
          { label: "User Research", pct: 60, color: "from-[#0023FF] to-green-200" },
        ].map((skill) => (
          <div key={skill.label}>
            <p className="text-sm font-medium text-[#1E293B] font-['Lexend'] mb-1">{skill.label}</p>
            <div
              className="h-2 bg-slate-200 rounded-full overflow-hidden"
              role="progressbar"
              aria-valuenow={skill.pct}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`${skill.label}: ${skill.pct}%`}
            >
              <div
                className={`h-full rounded-full bg-linear-to-r ${skill.color}`}
                style={{ width: `${skill.pct}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Divider */}
      <div className="border-t border-slate-100 my-4" />

      {/* Activity */}
      <div className="space-y-2 mb-5" role="log" aria-label="Recent activity">
        <div className="flex items-start gap-2 text-sm text-slate-600 font-['Lexend']">
          <span className="w-2.5 h-2.5 rounded-full bg-green-500 shrink-0 mt-1.5" aria-hidden="true" />
          {`Completed: "Design an Accessible Dashboard" challenge`}
        </div>
        <div className="flex items-start gap-2 text-sm text-slate-600 font-['Lexend']">
          <span className="w-2.5 h-2.5 rounded-full bg-orange-400 shrink-0 mt-1.5" aria-hidden="true" />
          Milestone: Intermediate UI/UX unlocked 🎉
        </div>
      </div>

      {/* Badges */}
      <div className="flex gap-2 flex-wrap" role="list" aria-label="Earned badges">
        <span className="text-xs font-semibold bg-green-100 text-green-700 rounded-lg px-3 py-1.5" role="listitem">✓ Portfolio Live</span>
        <span className="text-xs font-semibold bg-blue-100 text-blue-700 rounded-lg px-3 py-1.5" role="listitem">⚡ 3 Challenges Done</span>
        <span className="text-xs font-semibold bg-orange-100 text-orange-700 rounded-lg px-3 py-1.5" role="listitem">🏅 Rising Talent</span>
      </div>
    </div>
  );
}

export default function HeroSection() {
  return (
    <section
      className="relative min-h-screen w-full overflow-hidden"
      aria-labelledby="hero-heading"
    >
      {/* Background image with dark overlay for WCAG contrast */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero-bg.jpg"
          alt=""
          fill
          className="object-cover object-center"
          priority
          aria-hidden="true"
        />
        {/* Dark overlay — ensures text contrast passes WCAG AA */}
        <div className="absolute inset-0 bg-black/55" aria-hidden="true" />
        {/* Bottom fade to next section */}
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-linear-to-r from-transparent to-[#F7F6F4]" aria-hidden="true" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-end min-h-screen pb-24 px-6 md:px-20 max-w-360 mx-auto">
        {/* Large tagline — bottom left */}
        <div className="max-w-2xl">
          <h1
            id="hero-heading"
            className="text-white font-['Lexend'] font-normal leading-[1.05] text-6xl md:text-8xl"
          >
            Verified.<br />
            Skilled.<br />
            Employed.
          </h1>
        </div>
      </div>
    </section>
  );
}