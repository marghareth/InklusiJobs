// lib/jobs.js
// Hardcoded PWD-friendly job listings for InklusiJobs
// Tracks: Customer Service / VA, Social Media Marketing, Content Writing
// Job requirements aligned with TESDA PTQF competency standards

export const CAREER_TRACKS = [
  {
    id: "customer_service",
    label: "Customer Service & VA",
    emoji: "🎧",
    description: "Remote support, virtual assistance, and data entry roles",
    color: "#479880",
    gradient: "linear-gradient(135deg, #e8f6f2, #e4f2f5)",
    accentGradient: "linear-gradient(135deg, #479880, #4B959E)",
  },
  {
    id: "social_media",
    label: "Social Media Marketing",
    emoji: "📱",
    description: "Content creation, community management, and brand growth",
    color: "#648FBF",
    gradient: "linear-gradient(135deg, #e8f0f8, #edf4fb)",
    accentGradient: "linear-gradient(135deg, #648FBF, #8891C9)",
  },
  {
    id: "content_writing",
    label: "Content Writing",
    emoji: "✍️",
    description: "Copywriting, blogging, SEO writing, and email marketing",
    color: "#8891C9",
    gradient: "linear-gradient(135deg, #eeeef8, #f0edf8)",
    accentGradient: "linear-gradient(135deg, #8891C9, #9A89C6)",
  },
];

export const JOBS = {
  customer_service: [
    {
      id: "va_general",
      title: "Virtual Assistant (General)",
      company: "Remote-First PH",
      type: "Full-time / Part-time",
      setup: "100% Remote",
      description: "Provide administrative support, manage schedules, handle emails, and assist with day-to-day business tasks for clients.",
      requiredSkills: [
        { skill: "Written Communication", weight: 2, tesda: "Business Communication NC II" },
        { skill: "Computer & Digital Tools", weight: 2, tesda: "Computer Systems Servicing NC II" },
        { skill: "Organisation & Time Management", weight: 2, tesda: "Records Management NC II" },
        { skill: "Email & Calendar Management", weight: 1, tesda: "Business Communication NC II" },
        { skill: "Attention to Detail", weight: 1, tesda: "Records Management NC II" },
      ],
      pwdAccommodations: ["Flexible hours", "Fully remote", "Async communication"],
      salaryRange: "₱15,000 – ₱30,000/month",
    },
    {
      id: "customer_support",
      title: "Customer Support Representative",
      company: "InklusiHire Partners",
      type: "Full-time",
      setup: "100% Remote",
      description: "Handle customer inquiries via chat and email, resolve issues, and maintain customer satisfaction for a growing e-commerce brand.",
      requiredSkills: [
        { skill: "Written Communication", weight: 2, tesda: "Business Communication NC II" },
        { skill: "Problem Solving", weight: 2, tesda: "Contact Center Services NC II" },
        { skill: "Empathy & Active Listening", weight: 2, tesda: "Contact Center Services NC II" },
        { skill: "Computer & Digital Tools", weight: 1, tesda: "Computer Systems Servicing NC II" },
        { skill: "Patience & Stress Management", weight: 1, tesda: "Contact Center Services NC II" },
      ],
      pwdAccommodations: ["Chat-based (no voice required)", "Flexible schedule", "Screen reader compatible tools"],
      salaryRange: "₱18,000 – ₱25,000/month",
    },
    {
      id: "data_entry",
      title: "Data Entry Specialist",
      company: "DataBridge Solutions",
      type: "Part-time / Project-based",
      setup: "100% Remote",
      description: "Encode, verify, and organise data across spreadsheets and databases. Ensure accuracy and maintain proper records.",
      requiredSkills: [
        { skill: "Accuracy & Attention to Detail", weight: 2, tesda: "Records Management NC II" },
        { skill: "Spreadsheet Skills", weight: 2, tesda: "Computer Systems Servicing NC II" },
        { skill: "Computer & Digital Tools", weight: 2, tesda: "Computer Systems Servicing NC II" },
        { skill: "Organisation", weight: 1, tesda: "Records Management NC II" },
        { skill: "Speed & Consistency", weight: 1, tesda: "Records Management NC II" },
      ],
      pwdAccommodations: ["Own pace work", "No meetings required", "Fully async"],
      salaryRange: "₱8,000 – ₱18,000/month",
    },
  ],

  social_media: [
    {
      id: "smm_manager",
      title: "Social Media Manager",
      company: "BrandPulse Digital",
      type: "Full-time",
      setup: "100% Remote",
      description: "Plan and execute social media strategies across Facebook, Instagram, and TikTok. Create content calendars, write captions, and track performance.",
      requiredSkills: [
        { skill: "Content Strategy & Planning", weight: 2, tesda: "Digital Marketing NC III" },
        { skill: "Copywriting & Caption Writing", weight: 2, tesda: "Digital Marketing NC III" },
        { skill: "Social Media Platform Knowledge", weight: 2, tesda: "Digital Marketing NC III" },
        { skill: "Basic Design (Canva/similar)", weight: 1, tesda: "Graphic Technology NC II" },
        { skill: "Analytics & Reporting", weight: 1, tesda: "Digital Marketing NC III" },
      ],
      pwdAccommodations: ["Fully remote", "Flexible content schedule", "Async team communication"],
      salaryRange: "₱20,000 – ₱40,000/month",
    },
    {
      id: "content_creator",
      title: "Content Creator (Short-form)",
      company: "CreatorHub PH",
      type: "Freelance / Project-based",
      setup: "100% Remote",
      description: "Create engaging short-form content for Reels, TikTok, and YouTube Shorts. Script, produce, and edit videos for brand clients.",
      requiredSkills: [
        { skill: "Video Scripting & Storytelling", weight: 2, tesda: "Broadcast Technology NC II" },
        { skill: "Short-form Video Editing", weight: 2, tesda: "Broadcast Technology NC II" },
        { skill: "Trend Awareness", weight: 2, tesda: "Digital Marketing NC III" },
        { skill: "Creativity & Originality", weight: 1, tesda: "Broadcast Technology NC II" },
        { skill: "Caption & Hashtag Writing", weight: 1, tesda: "Digital Marketing NC III" },
      ],
      pwdAccommodations: ["Work at own pace", "No live streaming required", "Remote collaboration"],
      salaryRange: "₱15,000 – ₱35,000/month",
    },
    {
      id: "community_manager",
      title: "Community Manager",
      company: "EngageNow",
      type: "Part-time",
      setup: "100% Remote",
      description: "Moderate and grow online communities on Facebook Groups and Discord. Respond to comments, run engagement campaigns, and build brand loyalty.",
      requiredSkills: [
        { skill: "Written Communication", weight: 2, tesda: "Business Communication NC II" },
        { skill: "Community Engagement & Moderation", weight: 2, tesda: "Digital Marketing NC III" },
        { skill: "Empathy & Conflict Resolution", weight: 2, tesda: "Contact Center Services NC II" },
        { skill: "Social Media Platform Knowledge", weight: 1, tesda: "Digital Marketing NC III" },
        { skill: "Consistency & Reliability", weight: 1, tesda: "Business Communication NC II" },
      ],
      pwdAccommodations: ["Flexible hours", "Text-based only", "No video calls required"],
      salaryRange: "₱10,000 – ₱22,000/month",
    },
  ],

  content_writing: [
    {
      id: "copywriter",
      title: "Copywriter",
      company: "WordFlow Agency",
      type: "Full-time / Freelance",
      setup: "100% Remote",
      description: "Write persuasive copy for ads, landing pages, product descriptions, and marketing materials for local and international clients.",
      requiredSkills: [
        { skill: "Persuasive Writing", weight: 2, tesda: "Business Communication NC II" },
        { skill: "Research & Fact-checking", weight: 2, tesda: "Business Communication NC II" },
        { skill: "Brand Voice Adaptation", weight: 2, tesda: "Digital Marketing NC III" },
        { skill: "Grammar & Language Precision", weight: 1, tesda: "Business Communication NC II" },
        { skill: "Deadline Management", weight: 1, tesda: "Records Management NC II" },
      ],
      pwdAccommodations: ["Fully remote", "Flexible deadlines", "Async feedback"],
      salaryRange: "₱18,000 – ₱45,000/month",
    },
    {
      id: "seo_writer",
      title: "Blog Writer / SEO Writer",
      company: "RankUp Content",
      type: "Freelance / Part-time",
      setup: "100% Remote",
      description: "Research and write long-form SEO blog articles for websites in health, tech, finance, and lifestyle niches.",
      requiredSkills: [
        { skill: "Long-form Writing", weight: 2, tesda: "Business Communication NC II" },
        { skill: "SEO Fundamentals", weight: 2, tesda: "Digital Marketing NC III" },
        { skill: "Research Skills", weight: 2, tesda: "Business Communication NC II" },
        { skill: "Grammar & Clarity", weight: 1, tesda: "Business Communication NC II" },
        { skill: "Content Structure & Formatting", weight: 1, tesda: "Digital Marketing NC III" },
      ],
      pwdAccommodations: ["Work at own pace", "No voice or video required", "Fully async"],
      salaryRange: "₱12,000 – ₱30,000/month",
    },
    {
      id: "email_writer",
      title: "Email Marketing Writer",
      company: "ConvertFlow PH",
      type: "Part-time / Freelance",
      setup: "100% Remote",
      description: "Write email sequences, newsletters, and campaign copy for e-commerce and SaaS businesses. Focus on open rates, click-through, and conversions.",
      requiredSkills: [
        { skill: "Email Copywriting", weight: 2, tesda: "Business Communication NC II" },
        { skill: "Audience Empathy & Tone", weight: 2, tesda: "Contact Center Services NC II" },
        { skill: "CTA Writing", weight: 2, tesda: "Digital Marketing NC III" },
        { skill: "Grammar & Language Precision", weight: 1, tesda: "Business Communication NC II" },
        { skill: "Basic Marketing Knowledge", weight: 1, tesda: "Digital Marketing NC III" },
      ],
      pwdAccommodations: ["Flexible output schedule", "Remote-only", "No client calls required"],
      salaryRange: "₱15,000 – ₱35,000/month",
    },
  ],
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
export function getTrack(trackId) {
  return CAREER_TRACKS.find((t) => t.id === trackId);
}

export function getJobsByTrack(trackId) {
  return JOBS[trackId] || [];
}

export function getJob(trackId, jobId) {
  return JOBS[trackId]?.find((j) => j.id === jobId);
}