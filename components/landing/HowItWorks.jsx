"use client";

import Image from "next/image";

const steps = [
  {
    title: "Build your profile and get your roadmap",
    description:
      "Tell us your skills, goals, and the kind of work you're looking for. Our AI creates a personalized learning roadmap designed around you — at your own pace, in a format that works for you.",
  },
  {
    title: "Complete Challenges & Build Your Portfolio",
    description:
      "Work through real, practical challenges that reflect actual job tasks. Every challenge you complete becomes verified proof of your skills — automatically added to your public portfolio.",
  },
  {
    title: "Get Matched & Get Hired",
    description:
      "Employers browse verified talent by skill, not credentials. When there's a match, they come to you. Apply in one click — your portfolio speaks for itself.",
  },
];

export default function HowItWorksSection() {
  return (
    <section
      className="bg-[#F9F8F6] py-16 px-6 md:px-8"
      aria-labelledby="how-it-works-heading"
    >
      <div className="max-w-360 mx-auto">

        {/* Header Badge */}
        <div className="mb-8">
          <div className="inline-block bg-[#1B3D3A] rounded-2xl px-6 py-4 mb-8">
            <span className="text-[#FAF9F8] text-4xl md:text-5xl font-normal font-['Lexend'] leading-tight">
              HOW IT WORKS
            </span>
          </div>

          <h2
            id="how-it-works-heading"
            className="text-black text-3xl md:text-4xl font-normal font-['Lexend'] leading-tight max-w-5xl"
          >
            Everything you need to know from skilled to employed.
          </h2>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-6 items-stretch">

          {/* Left: Steps + Verified card */}
          <div className="flex flex-col gap-4">

            {/* Step Cards */}
            {steps.map((step) => (
              <div
                key={step.title}
                className="border border-black rounded-[10px] px-4 py-5 bg-[#F9F8F6]"
              >
                <h3 className="text-black text-2xl font-normal font-['Lexend'] leading-10 mb-1">
                  {step.title}
                </h3>
                <p className="text-black text-sm font-normal font-['Lexend'] leading-5 m-0 max-w-2xl">
                  {step.description}
                </p>
              </div>
            ))}

            {/* Verified Card */}
            <div className="relative bg-[#0A1A2A] rounded-[10px] overflow-hidden min-h-50 flex items-end p-8 mt-1">
              <Image
                src="https://placehold.co/1000x500/0A1A2A/FFFFFF/png?text=+"
                alt=""
                fill
                className="object-cover opacity-30"
                aria-hidden="true"
              />
              <div className="relative z-10">
                <p className="text-white text-3xl md:text-4xl font-normal font-['Lexend'] leading-snug m-0">
                  Verified.<br />
                  Skilled.<br />
                  Employed.
                </p>
              </div>
            </div>
          </div>

          {/* Right: Tall Image */}
          <div className="relative w-full rounded-[10px] overflow-hidden min-h-125 lg:min-h-0 border border-black">
            <Image
              src="https://placehold.co/800x1200/E8EDF3/1E293B/png?text=Accessibility+Sign"
              alt="Accessibility sign indicating inclusive pathways"
              fill
              className="object-cover object-center"
            />
          </div>

        </div>
      </div>
    </section>
  );
}