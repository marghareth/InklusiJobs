// lib/mockData.js
// InklusiJobs — Complete Mock Data for Demo
// Used with Firebase Auth + localStorage setup
// DO NOT use in production — demo purposes only

// ─────────────────────────────────────────────────────────────────────────────
// MOCK JOB SEEKER PROFILES (PWDs)
// Disability types: Visual Impairment, Hearing Impairment, Learning Disability
// Skill tracks: customer_service, social_media, content_writing
// ─────────────────────────────────────────────────────────────────────────────

export const MOCK_WORKERS = [
  {
    id: "worker_001",
    name: "Maria Santos",
    email: "maria.santos@gmail.com",
    avatar: "MS",
    avatarColor: "#479880",
    location: "Quezon City, Metro Manila",
    disability: "visual",
    disabilityLabel: "Visual Impairment",
    accessibilityNeeds: ["Screen reader compatible", "High contrast mode", "Large text"],
    jobTrack: "content_writing",
    jobId: "copywriter",
    jobTitle: "Copywriter",
    phase: 3,
    bio: "Former school paper editor turned freelance copywriter. I write with clarity and purpose — every word earns its place. I use NVDA screen reader and work best with clean, distraction-free interfaces.",
    skills: [
      { name: "Persuasive Writing", verified: true, score: 91, badge: "gold" },
      { name: "Brand Voice Adaptation", verified: true, score: 85, badge: "silver" },
      { name: "Research & Fact-checking", verified: true, score: 88, badge: "gold" },
      { name: "Grammar & Language Precision", verified: false, score: null, badge: null },
      { name: "Deadline Management", verified: false, score: null, badge: null },
    ],
    completedChallenges: ["cw_challenge_1"],
    badges: [
      { id: "badge_cw_1", label: "Campaign Writer", icon: "✍️", earnedAt: "2025-01-15", challengeId: "cw_challenge_1" },
      { id: "badge_verified", label: "Verified PWD Professional", icon: "✅", earnedAt: "2025-01-10" },
    ],
    portfolioItems: [
      {
        id: "port_001",
        challengeId: "cw_challenge_1",
        title: "Ganda Mo Skincare — Full Ad Campaign",
        description: "Wrote 3 ad variations for a Filipina-owned skincare brand celebrating all Filipino skin tones.",
        skills: ["Persuasive Writing", "Brand Voice Adaptation"],
        aiScore: 91,
        aiVerified: true,
        submittedAt: "2025-01-15",
        excerpt: "Facebook Ad: 'Your skin tells your story — and it's beautiful exactly as it is. Ganda Mo Papaya Kojic Soap, made for Filipina skin, only ₱149. Shop now and feel the difference.'",
      },
    ],
    roadmap: {
      jobId: "copywriter",
      currentPhase: 3,
      totalPhases: 3,
      completionPercentage: 72,
      phases: [
        { phase: 1, label: "Beginner", status: "completed", completedAt: "2025-01-05" },
        { phase: 2, label: "Intermediate", status: "completed", completedAt: "2025-01-20" },
        { phase: 3, label: "Advanced", status: "in_progress", completedAt: null },
      ],
    },
    availability: "Part-time (20 hrs/week)",
    workPreference: "remote",
    salaryExpectation: "₱18,000 – ₱30,000/month",
    languages: ["Filipino", "English"],
    joinedAt: "2025-01-01",
    profileViews: 42,
    isAvailableForWork: true,
    verifiedPWD: true,
  },

  {
    id: "worker_002",
    name: "Jose Miguel Reyes",
    email: "jose.reyes@gmail.com",
    avatar: "JR",
    avatarColor: "#648FBF",
    location: "Cebu City, Cebu",
    disability: "hearing",
    disabilityLabel: "Hearing Impairment",
    accessibilityNeeds: ["Visual notifications only", "No audio-required tasks", "Captions on videos"],
    jobTrack: "social_media",
    jobId: "smm_manager",
    jobTitle: "Social Media Manager",
    phase: 3,
    bio: "Deaf social media enthusiast who has been managing pages for local Cebu businesses since 2022. I communicate entirely through text and I'm fast, accurate, and creative. My hearing loss has made me more visually attuned — which is a superpower in this industry.",
    skills: [
      { name: "Content Strategy & Planning", verified: true, score: 94, badge: "gold" },
      { name: "Copywriting & Caption Writing", verified: true, score: 89, badge: "gold" },
      { name: "Analytics & Reporting", verified: true, score: 82, badge: "silver" },
      { name: "Basic Design (Canva)", verified: true, score: 87, badge: "silver" },
      { name: "Social Media Platform Knowledge", verified: true, score: 91, badge: "gold" },
    ],
    completedChallenges: ["smm_challenge_1", "smm_challenge_2", "smm_challenge_3"],
    badges: [
      { id: "badge_smm_1", label: "Content Strategist", icon: "📱", earnedAt: "2025-01-08", challengeId: "smm_challenge_1" },
      { id: "badge_smm_2", label: "Crisis Manager", icon: "🛡️", earnedAt: "2025-01-18", challengeId: "smm_challenge_2" },
      { id: "badge_smm_3", label: "Data-Driven Creator", icon: "📊", earnedAt: "2025-01-28", challengeId: "smm_challenge_3" },
      { id: "badge_verified", label: "Verified PWD Professional", icon: "✅", earnedAt: "2025-01-02" },
    ],
    portfolioItems: [
      {
        id: "port_002",
        challengeId: "smm_challenge_1",
        title: "Kain Tayo — 7-Day Instagram Content Calendar",
        description: "Created a complete content calendar for a Filipino food delivery brand, mixing promo and lifestyle content with authentic Filipino brand voice.",
        skills: ["Content Strategy & Planning", "Copywriting & Caption Writing"],
        aiScore: 94,
        aiVerified: true,
        submittedAt: "2025-01-08",
        excerpt: "7-day calendar with varied formats (Reels, Carousels, Stories), 2 organic Lutong Nanay promos, 1 Taglish post, all with engagement CTAs.",
      },
      {
        id: "port_003",
        challengeId: "smm_challenge_2",
        title: "Kain Tayo — Social Media Crisis Response",
        description: "Handled a viral negative comment with empathy and professionalism, including a moderation plan and trust-rebuilding strategy.",
        skills: ["Content Strategy & Planning", "Social Media Platform Knowledge"],
        aiScore: 89,
        aiVerified: true,
        submittedAt: "2025-01-18",
        excerpt: "Public reply, DM script, moderation plan, 3-point prevention strategy, and a trust-rebuilding post — all delivered within the simulated 1-hour window.",
      },
      {
        id: "port_004",
        challengeId: "smm_challenge_3",
        title: "Kain Tayo — Monthly Analytics Review & Strategy",
        description: "Analysed mock Instagram data and pitched a data-driven content strategy for the following month.",
        skills: ["Analytics & Reporting", "Content Strategy & Planning"],
        aiScore: 82,
        aiVerified: true,
        submittedAt: "2025-01-28",
        excerpt: "Identified that BTS Reels outperform static promos 24x, recommended 60% Reels / 25% Carousels / 15% Static mix for next month.",
      },
    ],
    roadmap: {
      jobId: "smm_manager",
      currentPhase: 3,
      totalPhases: 3,
      completionPercentage: 100,
      phases: [
        { phase: 1, label: "Beginner", status: "completed", completedAt: "2025-01-10" },
        { phase: 2, label: "Intermediate", status: "completed", completedAt: "2025-01-22" },
        { phase: 3, label: "Advanced", status: "completed", completedAt: "2025-01-30" },
      ],
    },
    availability: "Full-time (40 hrs/week)",
    workPreference: "remote",
    salaryExpectation: "₱20,000 – ₱40,000/month",
    languages: ["Filipino", "English"],
    joinedAt: "2025-01-01",
    profileViews: 87,
    isAvailableForWork: true,
    verifiedPWD: true,
  },

  {
    id: "worker_003",
    name: "Ana Cristina Villanueva",
    email: "ana.villanueva@gmail.com",
    avatar: "AV",
    avatarColor: "#8891C9",
    location: "Davao City, Davao del Sur",
    disability: "learning",
    disabilityLabel: "Learning Disability (Dyslexia)",
    accessibilityNeeds: ["Dyslexia-friendly font", "Distraction-free layout", "Extended time for tasks"],
    jobTrack: "customer_service",
    jobId: "va_general",
    jobTitle: "Virtual Assistant",
    phase: 2,
    bio: "I was diagnosed with dyslexia at 24, but it never stopped me from being one of the most organised people I know. I use Bionic Reading and structured checklists to work efficiently. I've been doing VA work informally for family businesses for 3 years.",
    skills: [
      { name: "Email & Calendar Management", verified: true, score: 86, badge: "silver" },
      { name: "Organisation & Time Management", verified: true, score: 90, badge: "gold" },
      { name: "Written Communication", verified: true, score: 78, badge: "silver" },
      { name: "Computer & Digital Tools", verified: false, score: null, badge: null },
      { name: "Attention to Detail", verified: false, score: null, badge: null },
    ],
    completedChallenges: ["va_challenge_1"],
    badges: [
      { id: "badge_va_1", label: "Inbox Master", icon: "📬", earnedAt: "2025-01-20", challengeId: "va_challenge_1" },
      { id: "badge_verified", label: "Verified PWD Professional", icon: "✅", earnedAt: "2025-01-12" },
    ],
    portfolioItems: [
      {
        id: "port_005",
        challengeId: "va_challenge_1",
        title: "Client Inbox & Calendar Overhaul",
        description: "Organised a simulated overloaded inbox of 94 emails, created a priority system, drafted client responses, and built a weekly calendar template.",
        skills: ["Email & Calendar Management", "Organisation & Time Management"],
        aiScore: 86,
        aiVerified: true,
        submittedAt: "2025-01-20",
        excerpt: "Created 6-label Gmail system, prioritised 12 urgent emails for same-day action, drafted professional reply to Client B, and designed a time-blocked weekly calendar.",
      },
    ],
    roadmap: {
      jobId: "va_general",
      currentPhase: 2,
      totalPhases: 3,
      completionPercentage: 55,
      phases: [
        { phase: 1, label: "Beginner", status: "completed", completedAt: "2025-01-22" },
        { phase: 2, label: "Intermediate", status: "in_progress", completedAt: null },
        { phase: 3, label: "Advanced", status: "locked", completedAt: null },
      ],
    },
    availability: "Part-time (25 hrs/week)",
    workPreference: "remote",
    salaryExpectation: "₱15,000 – ₱25,000/month",
    languages: ["Filipino", "English"],
    joinedAt: "2025-01-10",
    profileViews: 31,
    isAvailableForWork: true,
    verifiedPWD: true,
  },

  {
    id: "worker_004",
    name: "Ramon Dela Cruz",
    email: "ramon.delacruz@gmail.com",
    avatar: "RD",
    avatarColor: "#479880",
    location: "Pasig City, Metro Manila",
    disability: "hearing",
    disabilityLabel: "Hearing Impairment",
    accessibilityNeeds: ["Text-based communication only", "Visual alerts", "No voice calls"],
    jobTrack: "customer_service",
    jobId: "customer_support",
    jobTitle: "Customer Support Representative",
    phase: 2,
    bio: "Chat support specialist with 2 years of informal experience moderating a large Facebook community. I am fully proficient in text-based communication and type at 65 WPM. Deaf since birth — I consider it a professional advantage in written support roles.",
    skills: [
      { name: "Written Communication", verified: true, score: 92, badge: "gold" },
      { name: "Empathy & Active Listening", verified: true, score: 88, badge: "gold" },
      { name: "Problem Solving", verified: true, score: 84, badge: "silver" },
      { name: "Patience & Stress Management", verified: false, score: null, badge: null },
      { name: "Computer & Digital Tools", verified: false, score: null, badge: null },
    ],
    completedChallenges: ["cs_challenge_1"],
    badges: [
      { id: "badge_cs_1", label: "Support Specialist", icon: "🎧", earnedAt: "2025-01-25", challengeId: "cs_challenge_1" },
      { id: "badge_verified", label: "Verified PWD Professional", icon: "✅", earnedAt: "2025-01-15" },
    ],
    portfolioItems: [
      {
        id: "port_006",
        challengeId: "cs_challenge_1",
        title: "ShopLocal PH — Support Shift Simulation",
        description: "Handled 4 different customer scenarios including an angry customer, a senior Tagalog-speaking customer, an unreasonable return request, and a compliment.",
        skills: ["Written Communication", "Empathy & Active Listening", "Problem Solving"],
        aiScore: 92,
        aiVerified: true,
        submittedAt: "2025-01-25",
        excerpt: "Responded to all 4 tickets with appropriate tone — Taglish for Ticket 2, firm but kind policy explanation for Ticket 3, and personalized acknowledgment of Mia for Ticket 4.",
      },
    ],
    roadmap: {
      jobId: "customer_support",
      currentPhase: 2,
      totalPhases: 3,
      completionPercentage: 60,
      phases: [
        { phase: 1, label: "Beginner", status: "completed", completedAt: "2025-01-26" },
        { phase: 2, label: "Intermediate", status: "in_progress", completedAt: null },
        { phase: 3, label: "Advanced", status: "locked", completedAt: null },
      ],
    },
    availability: "Full-time (40 hrs/week)",
    workPreference: "remote",
    salaryExpectation: "₱18,000 – ₱28,000/month",
    languages: ["Filipino", "English"],
    joinedAt: "2025-01-13",
    profileViews: 56,
    isAvailableForWork: true,
    verifiedPWD: true,
  },

  {
    id: "worker_005",
    name: "Lena Grace Buenaventura",
    email: "lena.buenaventura@gmail.com",
    avatar: "LB",
    avatarColor: "#A899C4",
    location: "Iloilo City, Iloilo",
    disability: "learning",
    disabilityLabel: "Learning Disability (ADHD)",
    accessibilityNeeds: ["Distraction-free layout", "Clear task structure", "Short deadlines preferred"],
    jobTrack: "content_writing",
    jobId: "seo_writer",
    jobTitle: "SEO Blog Writer",
    phase: 2,
    bio: "I have ADHD and I hyperfocus like a laser when I love what I'm writing. I've been writing SEO articles for Filipino lifestyle blogs since 2023. My ADHD makes me incredibly fast at research and pattern recognition — I find angles no one else notices.",
    skills: [
      { name: "Long-form Writing", verified: true, score: 88, badge: "gold" },
      { name: "SEO Fundamentals", verified: true, score: 83, badge: "silver" },
      { name: "Research Skills", verified: true, score: 91, badge: "gold" },
      { name: "Grammar & Clarity", verified: false, score: null, badge: null },
      { name: "Content Structure & Formatting", verified: false, score: null, badge: null },
    ],
    completedChallenges: ["seo_challenge_1"],
    badges: [
      { id: "badge_seo_1", label: "SEO Writer", icon: "🔍", earnedAt: "2025-02-01", challengeId: "seo_challenge_1" },
      { id: "badge_verified", label: "Verified PWD Professional", icon: "✅", earnedAt: "2025-01-20" },
    ],
    portfolioItems: [
      {
        id: "port_007",
        challengeId: "seo_challenge_1",
        title: "WorkFromHomePH — '5 Best Free Tools for Filipino VAs'",
        description: "Wrote a complete 900-word SEO-optimised blog article targeting Filipino virtual assistants, with proper keyword placement, H2 structure, and mobile-friendly formatting.",
        skills: ["SEO Fundamentals", "Long-form Writing"],
        aiScore: 88,
        aiVerified: true,
        submittedAt: "2025-02-01",
        excerpt: "Keyword 'free tools for virtual assistants Philippines' placed in title, intro, 2 H2s. Covered Trello, Canva, Google Workspace, Grammarly, and Clockify with Filipino VA context for each.",
      },
    ],
    roadmap: {
      jobId: "seo_writer",
      currentPhase: 2,
      totalPhases: 3,
      completionPercentage: 58,
      phases: [
        { phase: 1, label: "Beginner", status: "completed", completedAt: "2025-02-02" },
        { phase: 2, label: "Intermediate", status: "in_progress", completedAt: null },
        { phase: 3, label: "Advanced", status: "locked", completedAt: null },
      ],
    },
    availability: "Freelance / Project-based",
    workPreference: "remote",
    salaryExpectation: "₱12,000 – ₱25,000/month",
    languages: ["Filipino", "English"],
    joinedAt: "2025-01-18",
    profileViews: 29,
    isAvailableForWork: true,
    verifiedPWD: true,
  },

  {
    id: "worker_006",
    name: "Daniel Fortuno",
    email: "daniel.fortuno@gmail.com",
    avatar: "DF",
    avatarColor: "#4B959E",
    location: "Cagayan de Oro, Misamis Oriental",
    disability: "visual",
    disabilityLabel: "Low Vision",
    accessibilityNeeds: ["High contrast mode", "Magnification tools", "Screen reader compatible"],
    jobTrack: "customer_service",
    jobId: "data_entry",
    jobTitle: "Data Entry Specialist",
    phase: 1,
    bio: "I have low vision and use ZoomText to work. Despite this, I've maintained a 99.2% accuracy rate in all encoding tasks I've done for a local NGO. I am methodical, patient, and take data integrity seriously.",
    skills: [
      { name: "Accuracy & Attention to Detail", verified: true, score: 95, badge: "gold" },
      { name: "Spreadsheet Skills", verified: true, score: 79, badge: "silver" },
      { name: "Computer & Digital Tools", verified: false, score: null, badge: null },
      { name: "Organisation", verified: false, score: null, badge: null },
      { name: "Speed & Consistency", verified: false, score: null, badge: null },
    ],
    completedChallenges: ["de_challenge_1"],
    badges: [
      { id: "badge_de_1", label: "Data Cleaner", icon: "🧹", earnedAt: "2025-02-05", challengeId: "de_challenge_1" },
      { id: "badge_verified", label: "Verified PWD Professional", icon: "✅", earnedAt: "2025-01-28" },
    ],
    portfolioItems: [
      {
        id: "port_008",
        challengeId: "de_challenge_1",
        title: "Customer Dataset Cleaning — 200-Row Simulation",
        description: "Described step-by-step how to clean a messy 200-row customer dataset including inconsistent headers, mixed date formats, duplicates, and invalid status values.",
        skills: ["Accuracy & Attention to Detail", "Spreadsheet Skills"],
        aiScore: 95,
        aiVerified: true,
        submittedAt: "2025-02-05",
        excerpt: "Used TRIM/PROPER for headers, TEXT formula for date standardisation, COUNTIF for duplicates, and Data Validation for Status column. Proposed keeping incomplete rows flagged rather than deleted.",
      },
    ],
    roadmap: {
      jobId: "data_entry",
      currentPhase: 1,
      totalPhases: 3,
      completionPercentage: 35,
      phases: [
        { phase: 1, label: "Beginner", status: "in_progress", completedAt: null },
        { phase: 2, label: "Intermediate", status: "locked", completedAt: null },
        { phase: 3, label: "Advanced", status: "locked", completedAt: null },
      ],
    },
    availability: "Part-time (20 hrs/week)",
    workPreference: "remote",
    salaryExpectation: "₱10,000 – ₱18,000/month",
    languages: ["Filipino", "English"],
    joinedAt: "2025-01-25",
    profileViews: 18,
    isAvailableForWork: true,
    verifiedPWD: true,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// MOCK EMPLOYER PROFILES
// Types: Tech Startup, Marketing Agency, NGO / Non-profit, Small Business / SME
// ─────────────────────────────────────────────────────────────────────────────

export const MOCK_EMPLOYERS = [
  {
    id: "employer_001",
    companyName: "BrandPulse Digital",
    logo: "BP",
    logoColor: "#648FBF",
    type: "Marketing Agency",
    size: "11–50 employees",
    location: "Makati City, Metro Manila",
    email: "hiring@brandpulse.ph",
    website: "brandpulse.ph",
    description: "A full-service digital marketing agency helping Filipino SMEs grow their online presence through data-driven social media, content, and paid ad strategies.",
    inclusiveEmployer: true,
    accommodationsOffered: ["100% remote work", "Flexible hours", "Async-first communication", "Mental health leave"],
    activeJobPosts: ["smm_manager", "content_creator", "copywriter"],
    hiredPWDs: 3,
    joinedAt: "2025-01-05",
    verified: true,
  },
  {
    id: "employer_002",
    companyName: "DataBridge Solutions",
    logo: "DB",
    logoColor: "#479880",
    type: "Tech Startup",
    size: "1–10 employees",
    location: "Taguig City, Metro Manila (Remote-first)",
    email: "talent@databridgeph.com",
    website: "databridgeph.com",
    description: "A data management startup providing clean data pipelines and reporting solutions for Philippine SMEs. We believe in hiring for skill, not background.",
    inclusiveEmployer: true,
    accommodationsOffered: ["Fully remote", "No video call required", "Own-pace output", "Assistive tech reimbursement"],
    activeJobPosts: ["data_entry"],
    hiredPWDs: 2,
    joinedAt: "2025-01-10",
    verified: true,
  },
  {
    id: "employer_003",
    companyName: "InklusiHire Partners",
    logo: "IH",
    logoColor: "#8891C9",
    type: "NGO / Non-profit",
    size: "11–50 employees",
    location: "Quezon City, Metro Manila",
    email: "inclusion@inklusihire.org",
    website: "inklusihire.org",
    description: "A non-profit organisation dedicated to connecting PWD professionals with inclusive employers across the Philippines. We walk the talk — 40% of our staff are PWDs.",
    inclusiveEmployer: true,
    accommodationsOffered: ["Fully remote option", "Job coaching support", "Buddy system", "Flexible hours", "All disability types welcome"],
    activeJobPosts: ["va_general", "customer_support"],
    hiredPWDs: 12,
    joinedAt: "2025-01-03",
    verified: true,
  },
  {
    id: "employer_004",
    companyName: "WordFlow Agency",
    logo: "WF",
    logoColor: "#A899C4",
    type: "Small Business / SME",
    size: "1–10 employees",
    location: "Cebu City, Cebu (Remote)",
    email: "projects@wordflowagency.ph",
    website: "wordflowagency.ph",
    description: "A boutique content and copywriting agency serving local and international clients. We value quality over credentials — your portfolio is your application.",
    inclusiveEmployer: true,
    accommodationsOffered: ["Remote only", "Async feedback", "Flexible deadlines", "No client calls required"],
    activeJobPosts: ["copywriter", "seo_writer", "email_writer"],
    hiredPWDs: 1,
    joinedAt: "2025-01-15",
    verified: true,
  },
  {
    id: "employer_005",
    companyName: "RemoteReady PH",
    logo: "RR",
    logoColor: "#4B9DB5",
    type: "Tech Startup",
    size: "1–10 employees",
    location: "Manila / 100% Remote",
    email: "hire@remotereadyph.com",
    website: "remotereadyph.com",
    description: "A remote staffing platform that connects trained Filipino remote workers with international clients. We actively recruit from underrepresented communities including PWDs.",
    inclusiveEmployer: true,
    accommodationsOffered: ["Equipment provided", "Paid training", "Accessibility tools budget", "Flexible start time"],
    activeJobPosts: ["va_general", "customer_support", "data_entry"],
    hiredPWDs: 5,
    joinedAt: "2025-01-08",
    verified: true,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// MOCK JOB LISTINGS (used in employer dashboard + worker job discovery)
// ─────────────────────────────────────────────────────────────────────────────

export const MOCK_JOB_POSTINGS = [
  {
    id: "posting_001",
    employerId: "employer_001",
    companyName: "BrandPulse Digital",
    logo: "BP",
    logoColor: "#648FBF",
    title: "Social Media Manager",
    track: "social_media",
    jobId: "smm_manager",
    type: "Full-time",
    setup: "100% Remote",
    salary: "₱20,000 – ₱40,000/month",
    description: "We're looking for a creative, data-savvy Social Media Manager to handle 3 client accounts. Must have verified portfolio challenges. No prior work experience required — let your portfolio speak.",
    requiredSkills: ["Content Strategy & Planning", "Copywriting & Caption Writing", "Analytics & Reporting"],
    accommodations: ["Fully remote", "Async communication", "Flexible schedule"],
    pwdFriendly: true,
    applicants: 4,
    postedAt: "2025-02-10",
    status: "open",
    urgent: true,
  },
  {
    id: "posting_002",
    employerId: "employer_004",
    companyName: "WordFlow Agency",
    logo: "WF",
    logoColor: "#A899C4",
    title: "Copywriter (Remote)",
    track: "content_writing",
    jobId: "copywriter",
    type: "Freelance / Part-time",
    setup: "100% Remote",
    salary: "₱18,000 – ₱35,000/month",
    description: "Looking for a skilled copywriter to produce ad copy, landing pages, and product descriptions for our growing roster of Filipino and international clients.",
    requiredSkills: ["Persuasive Writing", "Brand Voice Adaptation", "Research & Fact-checking"],
    accommodations: ["Remote only", "Async feedback", "Flexible deadlines"],
    pwdFriendly: true,
    applicants: 2,
    postedAt: "2025-02-08",
    status: "open",
    urgent: false,
  },
  {
    id: "posting_003",
    employerId: "employer_003",
    companyName: "InklusiHire Partners",
    logo: "IH",
    logoColor: "#8891C9",
    title: "Virtual Assistant",
    track: "customer_service",
    jobId: "va_general",
    type: "Part-time",
    setup: "100% Remote",
    salary: "₱15,000 – ₱25,000/month",
    description: "Join our operations team as a VA supporting our inclusive hiring programs. Tasks include email management, scheduling, research, and document preparation.",
    requiredSkills: ["Email & Calendar Management", "Organisation & Time Management", "Written Communication"],
    accommodations: ["Fully remote", "Flexible hours", "Accessibility tools provided", "Buddy system"],
    pwdFriendly: true,
    applicants: 6,
    postedAt: "2025-02-05",
    status: "open",
    urgent: false,
  },
  {
    id: "posting_004",
    employerId: "employer_002",
    companyName: "DataBridge Solutions",
    logo: "DB",
    logoColor: "#479880",
    title: "Data Entry Specialist",
    track: "customer_service",
    jobId: "data_entry",
    type: "Project-based",
    setup: "100% Remote",
    salary: "₱10,000 – ₱18,000/month",
    description: "We have ongoing data encoding, cleaning, and verification projects. Work at your own pace. Accuracy is everything — speed is secondary.",
    requiredSkills: ["Accuracy & Attention to Detail", "Spreadsheet Skills", "Organisation"],
    accommodations: ["Own pace", "No meetings", "Fully async", "Assistive tech reimbursement"],
    pwdFriendly: true,
    applicants: 3,
    postedAt: "2025-02-12",
    status: "open",
    urgent: true,
  },
  {
    id: "posting_005",
    employerId: "employer_005",
    companyName: "RemoteReady PH",
    logo: "RR",
    logoColor: "#4B9DB5",
    title: "Chat Support Agent",
    track: "customer_service",
    jobId: "customer_support",
    type: "Full-time",
    setup: "100% Remote",
    salary: "₱20,000 – ₱30,000/month",
    description: "Handle customer inquiries via chat for an international e-commerce client. No voice calls ever. Equipment provided. Ideal for deaf/hard-of-hearing applicants.",
    requiredSkills: ["Written Communication", "Empathy & Active Listening", "Problem Solving"],
    accommodations: ["Equipment provided", "No voice calls", "Visual-only notifications", "Paid training"],
    pwdFriendly: true,
    applicants: 5,
    postedAt: "2025-02-07",
    status: "open",
    urgent: false,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// MOCK WORK REQUESTS / APPLICATIONS
// ─────────────────────────────────────────────────────────────────────────────

export const MOCK_WORK_REQUESTS = [
  {
    id: "request_001",
    employerId: "employer_001",
    workerId: "worker_002",
    jobPostingId: "posting_001",
    status: "pending",
    message: "Hi Jose! We reviewed your portfolio and are very impressed — especially your crisis response challenge. We'd love to discuss having you manage 2 of our client accounts. Can we chat via text or async video?",
    sentAt: "2025-02-14T09:30:00",
    workerRead: false,
  },
  {
    id: "request_002",
    employerId: "employer_004",
    workerId: "worker_001",
    jobPostingId: "posting_002",
    status: "accepted",
    message: "Hi Maria! Your Ganda Mo ad campaign was outstanding — the SMS copy especially. We'd like to bring you on for 3 client projects this month.",
    sentAt: "2025-02-10T14:00:00",
    workerRead: true,
    workerResponse: "Thank you so much! I'd be happy to start. Please send over the briefs when ready.",
    respondedAt: "2025-02-10T18:00:00",
  },
  {
    id: "request_003",
    employerId: "employer_003",
    workerId: "worker_003",
    jobPostingId: "posting_003",
    status: "pending",
    message: "Hi Ana! We think you'd be a great fit for our VA role. Your inbox management challenge showed exactly the kind of thinking we need. Are you available for a text-based intro this week?",
    sentAt: "2025-02-13T11:00:00",
    workerRead: false,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// MOCK NOTIFICATIONS
// ─────────────────────────────────────────────────────────────────────────────

export const MOCK_NOTIFICATIONS = {
  worker_001: [
    { id: "notif_001", type: "work_request", message: "WordFlow Agency sent you a work request!", read: true, createdAt: "2025-02-10T14:00:00" },
    { id: "notif_002", type: "badge_earned", message: "You earned the 'Campaign Writer' badge! 🎉", read: true, createdAt: "2025-01-15T10:00:00" },
    { id: "notif_003", type: "profile_view", message: "3 employers viewed your portfolio this week.", read: false, createdAt: "2025-02-15T09:00:00" },
  ],
  worker_002: [
    { id: "notif_004", type: "work_request", message: "BrandPulse Digital sent you a work request!", read: false, createdAt: "2025-02-14T09:30:00" },
    { id: "notif_005", type: "challenge_passed", message: "You passed the Analytics Challenge with 82/100! 📊", read: true, createdAt: "2025-01-28T16:00:00" },
    { id: "notif_006", type: "roadmap_complete", message: "Congratulations! You completed your full Social Media Manager roadmap! 🏆", read: true, createdAt: "2025-01-30T10:00:00" },
  ],
  worker_003: [
    { id: "notif_007", type: "work_request", message: "InklusiHire Partners sent you a work request!", read: false, createdAt: "2025-02-13T11:00:00" },
    { id: "notif_008", type: "badge_earned", message: "You earned the 'Inbox Master' badge! 📬", read: true, createdAt: "2025-01-20T12:00:00" },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// MOCK ROADMAP TEMPLATE (AI fallback)
// Used when Gemini API is slow or unavailable
// Based on the SMM Manager track as default example
// ─────────────────────────────────────────────────────────────────────────────

export const MOCK_ROADMAP_FALLBACK = {
  smm_manager: {
    jobId: "smm_manager",
    jobTitle: "Social Media Manager",
    generatedAt: "2025-02-01T00:00:00",
    totalPhases: 3,
    estimatedWeeks: 8,
    summary: "You have strong instincts for social media but need to build strategic and analytical foundations. This roadmap focuses on content strategy first, then analytics, then platform mastery.",
    phases: [
      {
        phase: 1,
        label: "Beginner",
        title: "Content Foundations",
        estimatedWeeks: 3,
        focus: "Learn the fundamentals of content strategy and caption writing",
        skills: ["Content Strategy & Planning", "Copywriting & Caption Writing"],
        resources: ["smm_r1", "smm_r2"],
        challenge: "smm_challenge_1",
        milestones: [
          "Understand the difference between content strategy and random posting",
          "Write 5 captions with strong hooks and CTAs",
          "Build a 7-day content calendar",
        ],
      },
      {
        phase: 2,
        label: "Intermediate",
        title: "Analytics & Design",
        estimatedWeeks: 3,
        focus: "Learn to read data and design on-brand graphics",
        skills: ["Analytics & Reporting", "Basic Design (Canva)"],
        resources: ["smm_r3", "smm_r4"],
        challenge: "smm_challenge_2",
        milestones: [
          "Interpret reach, impressions, and engagement rate",
          "Create a basic analytics report for a client",
          "Design 3 on-brand Instagram templates in Canva",
        ],
      },
      {
        phase: 3,
        label: "Advanced",
        title: "Platform Mastery",
        estimatedWeeks: 2,
        focus: "Master Meta Business Suite and multi-platform management",
        skills: ["Social Media Platform Knowledge"],
        resources: ["smm_r5"],
        challenge: "smm_challenge_3",
        milestones: [
          "Schedule a full week of posts in Meta Business Suite",
          "Set up automated responses for a Facebook Page",
          "Pitch a data-driven monthly content strategy",
        ],
      },
    ],
  },

  va_general: {
    jobId: "va_general",
    jobTitle: "Virtual Assistant",
    generatedAt: "2025-02-01T00:00:00",
    totalPhases: 3,
    estimatedWeeks: 6,
    summary: "Your organisational strengths are a great foundation. This roadmap builds your digital tool proficiency and professional communication skills step by step.",
    phases: [
      {
        phase: 1,
        label: "Beginner",
        title: "Digital Tools & Communication",
        estimatedWeeks: 2,
        focus: "Master Google Workspace and professional email writing",
        skills: ["Email & Calendar Management", "Written Communication"],
        resources: ["va_r1", "va_r2"],
        challenge: "va_challenge_1",
        milestones: [
          "Set up a Gmail label system for a client inbox",
          "Write 3 professional emails in different contexts",
          "Build a weekly calendar time-block template",
        ],
      },
      {
        phase: 2,
        label: "Intermediate",
        title: "Client Management",
        estimatedWeeks: 2,
        focus: "Handle real client scenarios and difficult situations professionally",
        skills: ["Organisation & Time Management", "Attention to Detail"],
        resources: [],
        challenge: "va_challenge_2",
        milestones: [
          "Create a task prioritisation system for multiple clients",
          "Draft professional responses to difficult client situations",
          "Build a personal SOP for common VA tasks",
        ],
      },
      {
        phase: 3,
        label: "Advanced",
        title: "Systems & Reliability",
        estimatedWeeks: 2,
        focus: "Build reliable systems that make you indispensable",
        skills: ["Computer & Digital Tools"],
        resources: [],
        challenge: null,
        milestones: [
          "Set up a full client onboarding checklist",
          "Create templates for common email responses",
          "Document a repeatable weekly workflow",
        ],
      },
    ],
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// MOCK QUIZ FALLBACK DATA
// Used when AI quiz generation (Gemini) is slow or unavailable
// Based on existing learn-content.js question structure
// ─────────────────────────────────────────────────────────────────────────────

export const MOCK_QUIZ_FALLBACK = {
  // Social Media Manager quizzes
  smm_r1: [
    {
      id: "smm_r1_q1_fallback",
      type: "single",
      question: "You're managing Instagram for a small bakery. They ask you to post 5 times a day to grow faster. What do you advise?",
      options: [
        { value: "a", label: "Agree — more posts always means more reach" },
        { value: "b", label: "Suggest 1–2 quality posts per day with strong captions and engagement" },
        { value: "c", label: "Post 5 times but only use Stories to avoid overloading the feed" },
        { value: "d", label: "Tell them frequency doesn't matter, only content quality does" },
      ],
      correct: "b",
      explanation: "Posting too frequently without quality leads to lower engagement rates. Consistent, quality posting beats volume.",
    },
    {
      id: "smm_r1_q2_fallback",
      type: "single",
      question: "A client says 'I want to go viral.' What is the most honest and strategic response?",
      options: [
        { value: "a", label: "Promise them a viral post if they increase the budget" },
        { value: "b", label: "Virality can't be guaranteed, but you can optimise for reach through consistency, trends, and hooks" },
        { value: "c", label: "Focus on making every post controversial to drive engagement" },
        { value: "d", label: "Tell them virality is only for big brands with big budgets" },
      ],
      correct: "b",
      explanation: "Virality is unpredictable but strategy can improve reach. Setting honest expectations builds trust.",
    },
    {
      id: "smm_r1_q3_fallback",
      type: "single",
      question: "Which metric best shows whether your content is resonating with the right audience?",
      options: [
        { value: "a", label: "Total follower count" },
        { value: "b", label: "Number of likes per post" },
        { value: "c", label: "Saves and shares — indicating people found the content valuable enough to keep or recommend" },
        { value: "d", label: "Post impressions" },
      ],
      correct: "c",
      explanation: "Saves and shares are high-intent actions showing genuine value. They also signal quality to the algorithm.",
    },
  ],

  // Virtual Assistant quizzes
  va_r1: [
    {
      id: "va_r1_q1_fallback",
      type: "single",
      question: "Your client asks you to schedule a recurring weekly meeting every Monday at 9am Manila time with a US-based collaborator in New York. What do you check first?",
      options: [
        { value: "a", label: "Just set it for 9am and let the US person figure out the time" },
        { value: "b", label: "Check the time zone difference — Manila is UTC+8, New York is UTC-5 (that's 9pm Sunday NY time)" },
        { value: "c", label: "Use GMT for all meetings to avoid confusion" },
        { value: "d", label: "Ask the client to handle time zone conversions themselves" },
      ],
      correct: "b",
      explanation: "Time zone awareness is a core VA skill. Always convert and confirm both times with all parties before sending invites.",
    },
    {
      id: "va_r1_q2_fallback",
      type: "single",
      question: "A client forwards you 15 emails and says 'handle these.' What is your first step?",
      options: [
        { value: "a", label: "Reply to all of them immediately" },
        { value: "b", label: "Categorise by urgency and type, then ask the client to clarify priorities before acting" },
        { value: "c", label: "Archive all of them and start fresh" },
        { value: "d", label: "Reply to the oldest email first" },
      ],
      correct: "b",
      explanation: "Acting without clarity leads to mistakes. A quick triage + one clarifying message saves time and prevents errors.",
    },
    {
      id: "va_r1_q3_fallback",
      type: "single",
      question: "What is the best way to organise a client's Google Drive for a project with multiple deliverables?",
      options: [
        { value: "a", label: "Put everything in one folder and use the search function" },
        { value: "b", label: "Create a logical folder hierarchy: Project → Deliverables → Drafts/Finals, with consistent naming conventions" },
        { value: "c", label: "Use Google Drive's color-coding feature only" },
        { value: "d", label: "Save everything to your own Drive and share links" },
      ],
      correct: "b",
      explanation: "Organised file systems save everyone time. A clear hierarchy + naming convention makes it easy for anyone to find files.",
    },
  ],

  // Customer Support quizzes
  cs_r1: [
    {
      id: "cs_r1_q1_fallback",
      type: "single",
      question: "An angry customer says: 'This is ridiculous! I've been waiting 3 weeks for my order and nobody cares!' What is your first response?",
      options: [
        { value: "a", label: "I understand your frustration. Let me pull up your order right now and find out exactly what happened." },
        { value: "b", label: "Our shipping times are listed on the website. This is within our policy." },
        { value: "c", label: "I'll transfer you to a supervisor immediately." },
        { value: "d", label: "I'm so sorry! I promise it will never happen again!" },
      ],
      correct: "a",
      explanation: "Acknowledge + Act. Don't make promises you can't keep, don't be defensive, and don't escalate without trying to help first.",
    },
    {
      id: "cs_r1_q2_fallback",
      type: "single",
      question: "What is the LEAST appropriate thing to say to an upset customer?",
      options: [
        { value: "a", label: "I completely understand why you're frustrated." },
        { value: "b", label: "That's not my department." },
        { value: "c", label: "Let me check on this for you right away." },
        { value: "d", label: "I want to make sure we resolve this for you." },
      ],
      correct: "b",
      explanation: "'That's not my department' makes customers feel passed around. Own the problem even if you need to involve others.",
    },
  ],

  // SEO Writer quizzes
  seo_r1: [
    {
      id: "seo_r1_q1_fallback",
      type: "single",
      question: "A client wants to rank for 'best coffee shop in Manila.' This keyword has very high competition. What's your advice?",
      options: [
        { value: "a", label: "Target it anyway — high competition keywords are worth it" },
        { value: "b", label: "Target long-tail variations like 'best specialty coffee shop in Makati for remote workers' — lower competition, higher intent" },
        { value: "c", label: "Avoid coffee-related keywords entirely" },
        { value: "d", label: "Pay for ads instead of trying to rank organically" },
      ],
      correct: "b",
      explanation: "Long-tail keywords have less competition and higher purchase intent. A new site should target specific niches before broad terms.",
    },
    {
      id: "seo_r1_q2_fallback",
      type: "single",
      question: "What is 'search intent' and why does it matter for SEO writing?",
      options: [
        { value: "a", label: "The number of people searching for a keyword" },
        { value: "b", label: "What the searcher actually wants to find — informational, navigational, or transactional. Your content must match it to rank." },
        { value: "c", label: "Google's algorithm for measuring keyword difficulty" },
        { value: "d", label: "It only matters for paid ads, not organic content" },
      ],
      correct: "b",
      explanation: "Mismatching search intent = low rankings regardless of optimization. Always write for what the searcher actually needs.",
    },
  ],

  // Data Entry quizzes
  de_r1: [
    {
      id: "de_r1_q1_fallback",
      type: "single",
      question: "You're given a spreadsheet with 500 rows and need to find all entries where the 'Status' column says 'Pending'. What's the fastest method?",
      options: [
        { value: "a", label: "Scroll through all 500 rows manually" },
        { value: "b", label: "Use Filter or Ctrl+F to search for 'Pending'" },
        { value: "c", label: "Copy the data to a new sheet and delete non-pending rows one by one" },
        { value: "d", label: "Ask a colleague to help scan through it" },
      ],
      correct: "b",
      explanation: "Filters are one of the most essential data entry skills. Always use tools to work smarter, not harder.",
    },
    {
      id: "de_r1_q2_fallback",
      type: "single",
      question: "You notice that a column of dates has mixed formats: MM/DD/YYYY, DD-MM-YY, and 'January 5, 2024'. Why is this a problem?",
      options: [
        { value: "a", label: "It's not a problem — all formats show the same date" },
        { value: "b", label: "It's a visual issue only" },
        { value: "c", label: "Inconsistent date formats cause sorting errors, formula failures, and data import issues" },
        { value: "d", label: "The dates will automatically standardise when you save the file" },
      ],
      correct: "c",
      explanation: "Data consistency is a core accuracy principle. Mixed formats break formulas, sorting, and exports. Always standardise.",
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// MOCK AI SKILL GAP ANALYSIS (fallback when AI is slow)
// ─────────────────────────────────────────────────────────────────────────────

export const MOCK_SKILL_GAP_FALLBACK = {
  smm_manager: {
    overallReadiness: 42,
    strengths: [
      "You're already active on major platforms and understand basic content concepts.",
      "Your caption writing sample shows a natural ability to write engaging, relatable copy.",
    ],
    gaps: [
      { skill: "Analytics & Reporting", severity: "high", reason: "You haven't worked with platform insights yet. This is critical for proving ROI to clients." },
      { skill: "Content Strategy & Planning", severity: "medium", reason: "You understand posting but haven't built structured content calendars yet." },
      { skill: "Basic Design (Canva)", severity: "low", reason: "You have some exposure but need to build consistency and brand application skills." },
    ],
    recommendation: "Start with Phase 1 to build your strategic foundation. Your natural writing instincts are an asset — the roadmap will structure them into professional-grade output.",
    estimatedWeeksToJobReady: 8,
  },
  va_general: {
    overallReadiness: 55,
    strengths: [
      "Your organisation and time management instincts are strong.",
      "You communicate clearly in writing with a professional tone.",
    ],
    gaps: [
      { skill: "Email & Calendar Management", severity: "medium", reason: "You manage email personally but haven't handled a client inbox at scale yet." },
      { skill: "Computer & Digital Tools", severity: "medium", reason: "You know the basics but need to master Google Workspace and collaboration tools." },
      { skill: "Attention to Detail", severity: "low", reason: "Your accuracy is good — this just needs practice under pressure." },
    ],
    recommendation: "You're closer to job-ready than most beginners. Phase 1 will formalise your existing skills and Phase 2 will build your client-handling confidence.",
    estimatedWeeksToJobReady: 6,
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// HELPER: Get mock worker by email (used after Firebase login)
// ─────────────────────────────────────────────────────────────────────────────

export function getMockWorkerByEmail(email) {
  return MOCK_WORKERS.find((w) => w.email === email) || null;
}

export function getMockEmployerByEmail(email) {
  return MOCK_EMPLOYERS.find((e) => e.email === email) || null;
}

export function getMockWorkerById(id) {
  return MOCK_WORKERS.find((w) => w.id === id) || null;
}

export function getMockEmployerById(id) {
  return MOCK_EMPLOYERS.find((e) => e.id === id) || null;
}

export function getMockJobPostingsByTrack(track) {
  return MOCK_JOB_POSTINGS.filter((j) => j.track === track);
}

export function getMockJobPostingsByEmployer(employerId) {
  return MOCK_JOB_POSTINGS.filter((j) => j.employerId === employerId);
}

export function getQuizFallback(resourceId) {
  return MOCK_QUIZ_FALLBACK[resourceId] || [];
}

export function getRoadmapFallback(jobId) {
  return MOCK_ROADMAP_FALLBACK[jobId] || null;
}

export function getSkillGapFallback(jobId) {
  return MOCK_SKILL_GAP_FALLBACK[jobId] || null;
}

export function getNotificationsForUser(userId) {
  return MOCK_NOTIFICATIONS[userId] || [];
}

export function getWorkRequestsForWorker(workerId) {
  return MOCK_WORK_REQUESTS.filter((r) => r.workerId === workerId);
}

export function getWorkRequestsForEmployer(employerId) {
  return MOCK_WORK_REQUESTS.filter((r) => r.employerId === employerId);
}