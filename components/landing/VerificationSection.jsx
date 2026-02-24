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
        className="bg-[#1E293B] py-24 px-6 md:px-20"
        aria-labelledby="verification-heading"
      >
        <div className="max-w-340 mx-auto">

          {/* Label */}
          <p className="text-blue-300 text-sm font-semibold font-['Roboto'] uppercase tracking-widest mb-4">
            PWD Verification System
          </p>

          {/* Heading */}
          <h2
            id="verification-heading"
            className="text-white text-4xl md:text-5xl font-normal font-['Lexend'] leading-tight mb-12 max-w-xl"
          >
            The trust layer the Philippines has been missing
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

            {/* Steps */}
            <div className="space-y-4" role="list" aria-label="Verification steps">
              {steps.map((step) => (
                <div
                  key={step.num}
                  className="flex items-start gap-4 bg-white/10 border border-white/10 rounded-xl p-5"
                  role="listitem"
                >
                  <div
                    className="w-8 h-8 rounded-full bg-[#0023FF] text-white text-sm font-bold flex items-center justify-center shrink-0 mt-0.5"
                    aria-hidden="true"
                  >
                    {step.num}
                  </div>
                  <div>
                    <h3 className="text-white font-semibold font-['Lexend'] text-base mb-1">
                      {step.title}
                    </h3>
                    <p className="text-white/60 text-sm font-['Lexend'] leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* VaaS Card */}
            <div className="bg-white/10 border border-white/15 rounded-2xl p-8">
              <h3 className="text-white text-2xl font-semibold font-['Lexend'] mb-4">
                Verification-as-a-Service
              </h3>
              <p className="text-white/70 text-base font-['Lexend'] leading-relaxed mb-6">
                {`InklusiJobs' verification infrastructure is licensable to any business that offers PWD discounts or must comply with RA 7277 — hospitals, retailers, airlines, and more.`}
              </p>
              <div className="flex flex-wrap gap-2" role="list" aria-label="Partner industries">
                {vaasPartners.map((p) => (
                  <span
                    key={p.label}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 border border-white/20 rounded-full text-sm text-white/80 font-['Lexend']"
                    role="listitem"
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
        className="bg-[#F7F6F4] py-24 px-6 md:px-20"
        aria-labelledby="cta-heading"
      >
        <div className="max-w-340 mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Job Seeker CTA */}
          <div className="bg-[#0023FF] rounded-2xl p-10 flex flex-col justify-between min-h-340">
            <div>
              <h2
                id="cta-heading"
                className="text-white text-3xl font-semibold font-['Lexend'] leading-tight mb-4"
              >
                Ready to prove your skills?
              </h2>
              <p className="text-white/80 text-base font-['Lexend'] leading-relaxed mb-8">
                Create your free profile, complete your first challenge, and get your PWD Verified badge — all in one platform.
              </p>
            </div>
            <Link
              href="/signup"
              className="inline-flex items-center justify-center px-6 py-3 bg-white text-[#0023FF] text-sm font-semibold font-['Roboto'] uppercase tracking-tight rounded-xl hover:bg-blue-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0023FF] self-start min-h-11"
            >
              Start Your Journey →
            </Link>
          </div>

          {/* Employer CTA */}
          <div className="bg-white border border-slate-200 rounded-2xl p-10 flex flex-col justify-between min-h-70">
            <div>
              <h2 className="text-[#1E293B] text-3xl font-semibold font-['Lexend'] leading-tight mb-4">
                Hiring verified PWD talent?
              </h2>
              <p className="text-slate-600 text-base font-['Lexend'] leading-relaxed mb-8">
                Browse skill-verified candidates, post jobs for free, and earn your Inclusive Employer badge — while maximizing your RA 7277 tax benefits.
              </p>
            </div>
            <Link
              href="/signup?role=employer"
              className="inline-flex items-center justify-center px-6 py-3 bg-[#1E293B] text-white text-sm font-semibold font-['Roboto'] uppercase tracking-tight rounded-xl hover:bg-slate-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E293B] focus-visible:ring-offset-2 self-start min-h-11"
            >
              Post a Job →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}