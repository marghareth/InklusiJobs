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
      className="py-16 px-6 md:px-8"
      style={{ background: "#F0EDE8" }}
      aria-labelledby="how-it-works-heading"
    >
      <div className="max-w-360 mx-auto">

        {/* Header Badge */}
        <div className="mb-8">
          <div
            className="inline-block rounded-2xl px-6 py-4 mb-8"
            style={{ background: "#0F5C6E" }}
          >
            <span className="text-white text-4xl md:text-5xl font-normal font-['Lexend'] leading-tight">
              HOW IT WORKS
            </span>
          </div>

          <h2
            id="how-it-works-heading"
            className="text-3xl md:text-4xl font-normal font-['Lexend'] leading-tight max-w-5xl"
            style={{ color: "#1A1A2E" }}
          >
            Everything you need to know from skilled to employed.
          </h2>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-6 items-stretch">

          {/* Left: Steps + Verified card */}
          <div className="flex flex-col gap-4">
            {steps.map((step) => (
              <div
                key={step.title}
                className="rounded-[10px] px-4 py-5"
                style={{
                  border: "1.5px solid #C8D8E0",
                  background: "#FDFCFA",
                }}
              >
                <h3
                  className="text-2xl font-normal font-['Lexend'] leading-10 mb-1"
                  style={{ color: "#1A1A2E" }}
                >
                  {step.title}
                </h3>
                <p
                  className="text-sm font-normal font-['Lexend'] leading-5 m-0 max-w-2xl"
                  style={{ color: "#4A6070" }}
                >
                  {step.description}
                </p>
              </div>
            ))}

            {/* Verified Card */}
            <div
              className="relative rounded-[10px] overflow-hidden min-h-50 flex items-end p-8 mt-1"
              style={{ background: "#0F5C6E" }}
            >
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
          <div
            className="relative w-full rounded-[10px] overflow-hidden min-h-125 lg:min-h-0"
            style={{ border: "1.5px solid #C8D8E0" }}
          >
            <Image
              src="https://placehold.co/800x1200/DDE8EC/0F5C6E/png?text=Accessibility+Sign"
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