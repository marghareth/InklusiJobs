"use client";

import Link from "next/link";

// 1. Extracted Data (From Main Repo)
const skills = [
  { label: "Figma & Prototyping", pct: 90, color: "from-blue-800 to-emerald-400" },
  { label: "Accessibility Design", pct: 75, color: "from-blue-800 to-emerald-300" },
  { label: "User Research", pct: 60, color: "from-blue-800 to-emerald-200" },
];

const milestones = [
  { dot: "bg-emerald-500", text: `Completed: "Design an Accessible Dashboard" challenge` },
  { dot: "bg-amber-500", text: "Milestone: Intermediate UI/UX unlocked 🎉" },
];

const badges = [
  { label: "✓ Portfolio Live", style: "bg-green-50 text-green-700 border-green-200" },
  { label: "⚡ 3 Challenges Done", style: "bg-blue-50 text-blue-700 border-blue-200" },
  { label: "🏅 Rising Talent", style: "bg-orange-50 text-orange-700 border-orange-200" },
];

const trustItems = [
  "WCAG 2.1 AA Compliant",
  "RA 7277 Aligned",
  "AI-Powered Verification",
  "PWD Identity Protected",
  "NCDA Partnership Roadmap",
];

// 2. Profile Card Component
function ProfileCard() {
  return (
    <div 
      className="bg-white rounded-[20px] shadow-[0_2px_24px_rgba(30,41,59,0.10)] border border-slate-100 p-7 w-full max-w-150 flex flex-col gap-5"
      style={{ animation: 'skills-float 4s ease-in-out infinite' }}
    >
      {/* Header */}
      <div className="flex items-center gap-3.5">
        <div className="w-11 h-11 rounded-full bg-slate-800 flex items-center justify-center text-white font-bold text-base font-['Lexend'] shrink-0" aria-hidden="true">
          M
        </div>
        <div className="flex-1">
          <p className="font-semibold text-slate-800 font-['Lexend'] text-sm m-0">Maria Santos</p>
          <p className="text-xs text-slate-400 font-['Lexend'] mt-0.5 m-0">UI/UX Designer · Quezon City</p>
        </div>
        <span className="text-[11px] font-bold text-green-700 bg-green-50 border border-green-200 rounded-full px-3 py-1.5 whitespace-nowrap">
          ✓ Verified
        </span>
      </div>

      {/* Skills */}
      <div className="flex flex-col gap-3.5">
        {skills.map((skill) => (
          <div key={skill.label} className="flex flex-col gap-1.5">
            <div className="flex justify-between text-[13px] font-semibold text-slate-800 font-['Lexend']">
              <span>{skill.label}</span>
              <span className="font-normal text-slate-400">{skill.pct}%</span>
            </div>
            <div
              className="h-2 bg-slate-100 rounded-full overflow-hidden"
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

      <hr className="border-t border-slate-100 m-0" />

      {/* Activity Milestones */}
      <div className="flex flex-col gap-2.5" role="log" aria-label="Recent activity">
        {milestones.map((item, i) => (
          <div key={i} className="flex items-start gap-2.5">
            <span className={`w-2 h-2 rounded-full shrink-0 mt-1 ${item.dot}`} aria-hidden="true" />
            <span className="text-xs text-slate-500 font-['Lexend'] leading-relaxed">
              {item.text}
            </span>
          </div>
        ))}
      </div>

      {/* Badges */}
      <div className="flex gap-2 flex-wrap" role="list" aria-label="Earned badges">
        {badges.map((b) => (
          <span 
            key={b.label}
            className={`text-[11px] font-bold border rounded-full px-3 py-1.5 ${b.style}`} 
            role="listitem"
          >
            {b.label}
          </span>
        ))}
      </div>
    </div>
  );
}

// 3. Main Section Component
export default function SkillsSection() {
  return (
    <>
      <style>{`
        @keyframes skills-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        .text-gradient {
          background: linear-gradient(100deg, #1E40AF 0%, #2563EB 35%, #0EA5E9 70%, #01322C 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
      `}</style>

      <section className="bg-[#F7F6F4]" aria-labelledby="skills-heading">
        <div className="pt-24 px-6 md:px-20">
          <div className="max-w-7xl mx-auto">
            
            {/* Accessibility badge */}
            <div className="inline-flex items-center gap-2 bg-slate-800 text-white text-[11px] font-bold font-['Lexend'] uppercase tracking-[1.5px] rounded-full px-4 py-2 mb-9 w-fit">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" aria-hidden="true"></span>
              ♿ Accessibility First Platform
            </div>

            {/* Two-column layout */}
            <div className="grid grid-cols-1 lg:grid-cols-[55%_45%] gap-12 items-center mb-16">
              
              {/* Left: Headline + Description + Buttons */}
              <div className="flex flex-col gap-7">
                <p className="font-['Lexend'] text-[11px] font-bold tracking-[2.5px] uppercase text-blue-600 m-0">
                  Built for PWDs. Powered by AI.
                </p>

                <h2 
                  id="skills-heading" 
                  className="font-['Lexend'] text-[#0F1C1B] leading-[1.05] tracking-tight text-5xl md:text-6xl lg:text-[80px] m-0"
                >
                  <span className="block font-light">Skills that</span>
                  <span className="block font-normal underline decoration-blue-600 decoration-3 underline-offset-[7px]">speaks</span>
                  <span className="block font-extrabold text-[clamp(58px,7vw,90px)] text-gradient">louder</span>
                  <span className="block font-light">than</span>
                  <span className="block italic font-normal text-slate-800">credentials</span>
                </h2>

                <p className="text-slate-500 text-base font-normal font-['Lexend'] leading-relaxed m-0 max-w-120">
                  InklusiJobs helps Persons with Disabilities become verified, job-ready professionals — through personalized learning paths, portfolio challenges, and AI-driven skill verification.
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-wrap gap-3 items-center mt-2">
                  <Link
                    href="/signup"
                    className="px-7 py-3.5 bg-blue-800 text-white text-xs font-bold font-['Lexend'] uppercase tracking-[1.5px] rounded-xl shadow-[0_4px_14px_rgba(30,64,175,0.28)] hover:bg-blue-900 hover:-translate-y-px transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-800 focus-visible:ring-offset-2"
                  >
                    Start Your Journey
                  </Link>
                  <Link
                    href="/signup?role=employer"
                    className="px-7 py-3.5 bg-white text-slate-800 text-xs font-bold font-['Lexend'] uppercase tracking-[1.5px] rounded-xl border-2 border-slate-300 hover:bg-slate-50 hover:-translate-y-px transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-800 focus-visible:ring-offset-2"
                  >
                    I&apos;m an Employer
                  </Link>
                </div>
              </div>

              {/* Right: Profile card */}
              <div className="flex justify-center">
                <ProfileCard />
              </div>
            </div>

          </div>
        </div>

        {/* Trust bar — full width, edge to edge */}
        <div className="bg-slate-800 px-6 md:px-20 py-8 mt-12">
          <ul className="flex flex-wrap justify-between items-center gap-4 max-w-7xl mx-auto m-0 p-0 list-none" role="list" aria-label="Platform trust indicators">
            {trustItems.map((label) => (
              <li key={label} className="flex-1 flex justify-center min-w-37.5
              ">
                <span className="inline-flex items-center justify-center border border-slate-600 text-slate-300 text-xs font-semibold font-['Lexend'] rounded-lg px-4 py-2 whitespace-nowrap">
                  {label}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}