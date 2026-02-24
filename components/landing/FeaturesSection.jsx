"use client";

const features = [
  {
    title: "AI-Powered Learning Roadmap",
    description:
      "Tell us your goals, and our AI will create a step-by-step learning plan that fits your current skills and your schedule.",
    bg: "#479880",
  },
  {
    title: "Portfolio-Based Skill Verification",
    description:
      "Show employers what you can do. Complete real-world challenges to build a verified portfolio that proves your skills.",
    bg: "#4B959E",
  },
  {
    title: "Inclusive Job Matching",
    description:
      "Find jobs that match your verified skills. See how well you fit each role and apply easily with your portfolio.",
    bg: "#648FBF",
  },
  {
    title: "Adaptive Accessibility Interface",
    description:
      "Choose the display that works best for you. We offer high contrast, dyslexia-friendly fonts, and distraction-free layouts to make browsing comfortable.",
    bg: "#8891C9",
  },
  {
    title: "Badges & Milestones",
    description:
      "Earn badges as you learn and finish challenges. Your collection clearly shows employers your progress and dedication.",
    bg: "#9A89C6",
  },
  {
    title: "Dual Dashboards",
    description:
      "Track your learning, challenges, and portfolio in one simple workspace. Meanwhile, employers use a separate dashboard to easily find and hire verified talent based on skills.",
    bg: "#94A3B8",
  },
];

export default function FeaturesSection() {
  return (
    <section
      className="bg-white py-16 px-6 md:px-8"
      aria-labelledby="features-heading"
    >
      <div className="max-w-360 mx-auto">

        {/* Heading */}
        <h2
          id="features-heading"
          className="text-black font-normal font-['Lexend'] mb-2"
          style={{ fontSize: 48, lineHeight: "80px" }}
        >
          Everything you need to know from skilled to employed.
        </h2>

        {/* Divider */}
        <div className="w-full h-px bg-black mb-10" />

        {/* 3×2 Feature Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="flex flex-col gap-3 p-6"
              style={{
                background: feature.bg,
                borderRadius: 25,
                border: "2px solid black",
                minHeight: 315,
              }}
            >
              <h3
                className="text-black font-normal font-['Lexend'] m-0"
                style={{ fontSize: 32, lineHeight: "40px" }}
              >
                {feature.title}
              </h3>
              <p
                className="text-black font-normal font-['Lexend'] m-0"
                style={{ fontSize: 20, lineHeight: "40px" }}
              >
                {feature.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}