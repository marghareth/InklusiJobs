"use client";

import Link from "next/link";

function ProfileCard() {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 w-full">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <div className="w-12 h-12 rounded-full bg-[#01322C] flex items-center justify-center text-white font-bold text-lg font-['Lexend'] shrink-0" aria-hidden="true">
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
              <div className={`h-full rounded-full bg-linear-to-r ${skill.color}`} style={{ width: `${skill.pct}%` }} />
            </div>
          </div>
        ))}
      </div>

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

export default function SkillsSection() {
  return (
    <section className="bg-[#F7F6F4] py-24 px-6 md:px-20" aria-labelledby="skills-heading">
      <div className="max-w-340 mx-auto">

        {/* Accessibility badge */}
        <div className="inline-flex items-center gap-2 bg-[#02322D] text-white text-sm font-medium font-['Roboto'] uppercase tracking-wide rounded-full px-4 py-2 mb-10">
          <span aria-hidden="true">♿</span>
          Accessibility First Platform
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

          {/* Left: headline + description + buttons */}
          <div>
            <h2
              id="skills-heading"
              className="font-['Lexend'] font-normal text-black leading-[1.05] text-6xl md:text-7xl lg:text-8xl mb-8"
            >
              Skills that<br />
              speaks<br />
              <span className="font-medium">louder</span> than<br />
              credentials
            </h2>

            <p className="text-black text-xl md:text-2xl font-normal font-['Lexend'] leading-relaxed mb-10 max-w-xl">
              InklusiJobs helps Persons with Disabilities become verified, job-ready professionals — through personalized learning paths, portfolio challenges, and AI-driven skill verification.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4">
              <Link
                href="/signup"
                className="px-6 py-3.5 bg-[#0023FF] text-white text-sm font-medium font-['Roboto'] uppercase tracking-tight rounded-xl shadow-md hover:bg-blue-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0023FF] focus-visible:ring-offset-2"
              >
                Start Your Journey
              </Link>
              <Link
                href="/signup?role=employer"
                className="px-6 py-3.5 bg-white text-[#232F74] text-sm font-medium font-['Roboto'] uppercase tracking-tight rounded-xl outline-1 outline-[#232F74] hover:bg-slate-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#232F74] focus-visible:ring-offset-2"
              >
                {`I'm an Employer`}
              </Link>
            </div>
          </div>

          {/* Right: profile card */}
          <div className="flex justify-center lg:justify-end">
            <div className="w-full max-w-md">
              <ProfileCard />
            </div>
          </div>
        </div>

        {/* Trust bar */}
        <div className="mt-16 pt-10 border-t border-slate-200">
          <ul className="flex flex-wrap gap-x-8 gap-y-3 items-center" role="list" aria-label="Platform trust indicators">
            {[
              { icon: "✅", label: "WCAG 2.1 AA Compliant" },
              { icon: "🇵🇭", label: "RA 7277 Aligned" },
              { icon: "🤖", label: "AI-Powered Verification" },
              { icon: "🔒", label: "PWD Identity Protected" },
              { icon: "📋", label: "NCDA Partnership Roadmap" },
            ].map((item) => (
              <li key={item.label} className="flex items-center gap-2 text-sm font-medium text-slate-600 font-['Lexend']" role="listitem">
                <span aria-hidden="true">{item.icon}</span>
                {item.label}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}