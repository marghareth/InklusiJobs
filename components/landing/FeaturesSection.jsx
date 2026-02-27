"use client";

const features = [
  {
    title: "AI-Powered Learning Roadmap",
    description:
      "Tell us your goals, and our AI will create a step-by-step learning plan that fits your current skills and your schedule.",
    bg: "#0F5C6E",
    color: "#FFFFFF",
  },
  {
    title: "Portfolio-Based Skill Verification",
    description:
      "Show employers what you can do. Complete real-world challenges to build a verified portfolio that proves your skills.",
    bg: "#1A8FA5",
    color: "#FFFFFF",
  },
  {
    title: "Inclusive Job Matching",
    description:
      "Find jobs that match your verified skills. See how well you fit each role and apply easily with your portfolio.",
    bg: "#2AABB8",
    color: "#FFFFFF",
  },
  {
    title: "Adaptive Accessibility Interface",
    description:
      "Choose the display that works best for you. We offer high contrast, dyslexia-friendly fonts, and distraction-free layouts.",
    bg: "#F0EDE8",
    color: "#1A1A2E",
    border: "1.5px solid #C8D8E0",
  },
  {
    title: "Badges & Milestones",
    description:
      "Earn badges as you learn and finish challenges. Your collection clearly shows employers your progress and dedication.",
    bg: "#FAF8F5",
    color: "#1A1A2E",
    border: "1.5px solid #C8D8E0",
  },
  {
    title: "Dual Dashboards",
    description:
      "Track your learning, challenges, and portfolio in one simple workspace. Employers use a separate dashboard to hire verified talent.",
    bg: "#1A3A5C",
    color: "#FFFFFF",
  },
];

export default function FeaturesSection() {
  return (
    <section
      className="py-16 px-6 md:px-8"
      style={{ background: "#FAF8F5" }}
      aria-labelledby="features-heading"
    >
      <div className="max-w-360 mx-auto">

        <h2
          id="features-heading"
          className="font-normal font-['Lexend'] mb-2"
          style={{ fontSize: 48, lineHeight: "80px", color: "#1A1A2E" }}
        >
          Everything you need to go from skilled to employed.
        </h2>

        <div className="w-full h-px mb-10" style={{ background: "#C8D8E0" }} />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="flex flex-col gap-3 p-6"
              style={{
                background: feature.bg,
                borderRadius: 25,
                border: feature.border || "none",
                minHeight: 315,
              }}
            >
              <h3
                className="font-normal font-['Lexend'] m-0"
                style={{ fontSize: 32, lineHeight: "40px", color: feature.color }}
              >
                {feature.title}
              </h3>
              <p
                className="font-normal font-['Lexend'] m-0"
                style={{ fontSize: 18, lineHeight: "32px", color: feature.color, opacity: 0.85 }}
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