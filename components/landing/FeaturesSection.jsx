"use client";

import Image from "next/image";

const features = [
  {
    title: "AI-Generated Roadmap",
    description:
      "Gemini AI builds a personalized learning path based on your current skills, goals, and pace — from Beginner to Job-Ready.",
    image: "https://placehold.co/506x284",
    imageAlt: "AI roadmap visualization",
  },
  {
    title: "Portfolio Challenges",
    description:
      "Complete real-world tasks evaluated by AI against strict rubrics. Build a verifiable portfolio even without prior work history.",
    image: "https://placehold.co/506x284",
    imageAlt: "Portfolio challenge example",
  },
  {
    title: "Skill-First Job Matching",
    description:
      "Employers see your verified skill scores first — disability context is secondary. Your ability leads every conversation.",
    image: "https://placehold.co/506x284",
    imageAlt: "Job matching interface",
  },
];

export default function FeaturesSection() {
  return (
    <section className="bg-[#F9F8F6] py-24 px-6 md:px-20" aria-labelledby="features-heading">
      <div className="max-w-340 mx-auto">

        {/* HOW IT WORKS label */}
        <div className="inline-block bg-[#1B3E3A] rounded-[15px] px-6 py-4 mb-8">
          <span className="text-stone-50 text-5xl font-normal font-['Lexend'] leading-20">
            HOW IT WORKS
          </span>
        </div>

        {/* Subheading */}
        <h2
          id="features-heading"
          className="text-black text-5xl md:text-6xl font-normal font-['Lexend'] leading-20 mb-16 max-w-4xl"
        >
          Everything you need to know from skilled to employed.
        </h2>

        {/* Feature cards */}
        <div className="space-y-12">
          {features.map((feature, i) => (
            <div
              key={feature.title}
              className={`flex flex-col ${
                i % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
              } gap-10 items-center`}
            >
              {/* Text side */}
              <div className="flex-1">
                <h3 className="text-black text-3xl font-medium font-['Lexend'] leading-25">
                  {feature.title}
                </h3>
                <p className="text-black text-xl font-normal font-['Lexend'] leading-25 max-w-lg">
                  {feature.description}
                </p>
              </div>

              {/* Card side */}
              <div className="flex-1 flex justify-center">
                <div className="bg-white rounded-[50px] shadow-md overflow-hidden w-full max-w-lg">
                  <div className="relative w-full h-64">
                    <Image
                      src={feature.image}
                      alt={feature.imageAlt}
                      fill
                      className="object-cover rounded-t-[50px]"
                    />
                  </div>
                  <div className="p-8">
                    <h3 className="text-black text-3xl font-medium font-['Lexend'] leading-tight mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-black text-xl font-normal font-['Lexend'] leading-12.5">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}