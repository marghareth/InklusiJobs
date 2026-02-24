// lib/assessment-questions.js
// InklusiJobs Skills Assessment — Research-Based Question Design
// Based on: InklusiJobs Skills Assessment Research Report (2025)
// Frameworks: TESDA PTQF, Universal Design for Assessment (UDA),
//             VARK Learning Model, CBA principles, RA 7277
// Anti-bias principles applied throughout (see Section 6 of research report)

// ─── PHASES ──────────────────────────────────────────────────────────────────
export const PHASES = [
  { id: 1, label: "Your Skills",   time: "~3 min", section: "A" },
  { id: 2, label: "Work Goals",    time: "~3 min", section: "B" },
  { id: 3, label: "Your Needs",    time: "~2 min", section: "C" },
];

// ─── PHASE COMPLETION MESSAGES ────────────────────────────────────────────────
export const PHASE_COMPLETE_MESSAGES = {
  1: { emoji: "🌟", message: "Great start! Section 1 done — you're doing amazing." },
  2: { emoji: "💪", message: "Halfway there! Just one more section to go." },
  3: { emoji: "🎉", message: "All done! Building your personalized roadmap now..." },
};

// ─── ALL 15 QUESTIONS ─────────────────────────────────────────────────────────

export const QUESTIONS = [

  // ═══════════════════════════════════════════════════════════════════════════
  // SECTION A — YOUR SKILLS RIGHT NOW  (Q1–Q5)
  // Required. Feeds primary AI roadmap signals.
  // Research: CBA principles, TESDA competency mapping, scaffolded assessment model
  // ═══════════════════════════════════════════════════════════════════════════

  {
    id: 1,
    phase: 1,
    section: "A",
    type: "single",
    required: true,
    aiKey: "digitalLiteracyLevel",
    // Research: Placed FIRST — least threatening question. Frames assessment
    // as exploratory, not evaluative. Avoids immediate discouragement.
    // AI signal → entry difficulty level for roadmap calibration
    question: "Which of the following best describes your current experience with computers or digital tools?",
    options: [
      {
        value: "basic_apps",
        label: "I'm just getting started",
        description: "I can use basic apps like messaging, browsing, and social media",
      },
      {
        value: "everyday_tools",
        label: "I'm comfortable with everyday tools",
        description: "Google Docs, email, social media — I use these regularly",
      },
      {
        value: "work_software",
        label: "I can use software for work tasks",
        description: "Spreadsheets, design tools, video editing",
      },
      {
        value: "advanced",
        label: "I have advanced skills",
        description: "Coding, professional software, or technical systems",
      },
    ],
  },

  {
    id: 2,
    phase: 1,
    section: "A",
    type: "multi",
    required: true,
    aiKey: "priorExperience",
    // Research: Identifies experience across broad skill domains WITHOUT requiring
    // formal credentials. "None of the above" prevents forced false selection
    // that corrupts AI roadmap data. Volunteer/personal experience treated as equal.
    // AI signal → currentStrengths → excluded from criticalGaps in roadmap
    question: "Have you done any of the following before?",
    hint: "Select all that apply — personal, school, or volunteer experience counts too",
    options: [
      { value: "written_docs",    label: "Written professional emails or documents" },
      { value: "created_content", label: "Created content",         description: "social media posts, videos, graphics, writing" },
      { value: "managed_data",    label: "Managed data or records", description: "spreadsheets, databases, filing" },
      { value: "helped_customers",label: "Helped customers or clients", description: "in-person or online" },
      { value: "built_technical", label: "Built or fixed something technical", description: "websites, hardware, software" },
      { value: "taught_others",   label: "Taught, tutored, or trained others" },
      { value: "none",            label: "None of the above — and that's okay!" },
    ],
  },

  {
    id: 3,
    phase: 1,
    section: "A",
    type: "single",
    required: true,
    aiKey: "problemSolvingStyle",
    // Research: Uses a BEHAVIORAL SCENARIO instead of self-rating.
    // Avoids Dunning-Kruger effect and confidence bias.
    // Behavioral scenarios are more reliable predictors of job performance
    // than self-assessment ratings (Section 7.1, research report).
    // No answer is framed as "wrong" — reduces assessment anxiety.
    // AI signal → support intensity needed in roadmap (more vs less scaffolding)
    question: "When you try something new and it doesn't work the first time, what do you usually do?",
    options: [
      { value: "gives_up",    label: "I usually give up and try something different" },
      { value: "seeks_help",  label: "I look for help online or ask someone" },
      { value: "tries_again", label: "I try again on my own a few times before asking for help" },
      { value: "researches",  label: "I research the problem until I figure it out" },
    ],
  },

  {
    id: 4,
    phase: 1,
    section: "A",
    type: "multi",
    required: true,
    maxSelect: 3,
    aiKey: "confidenceAreas",
    // Research: "Up to 3" constraint forces prioritization → cleaner AI signal
    // than unlimited multi-select. Framing as "most confident" (not "best at")
    // reduces Filipino cultural modesty bias (hiya effect).
    // Results cross-referenced with Q1 and Q2 for AI consistency checking.
    // AI signal → primary skill domain(s) → careerGoal + challengeCategory
    question: "Which of these tasks do you feel most confident doing right now?",
    hint: "Choose up to 3",
    options: [
      { value: "writing",   label: "Writing",               description: "reports, emails, documents" },
      { value: "design",    label: "Design",                description: "graphics, layouts, presentations" },
      { value: "data",      label: "Data & numbers",        description: "spreadsheets, budgets, records" },
      { value: "people",    label: "Talking with people",   description: "customer service, sales, coordination" },
      { value: "technical", label: "Technical work",        description: "coding, IT support, hardware" },
      { value: "creative",  label: "Creative work",         description: "video, photo, content creation" },
      { value: "teaching",  label: "Teaching or explaining things to others" },
      { value: "planning",  label: "Planning and organising", description: "admin, scheduling, project tracking" },
    ],
  },

  {
    id: 5,
    phase: 1,
    section: "A",
    type: "text",
    required: false,
    aiKey: "aspirationalSkill",
    // Research: Captures unmet learning aspirations not in skill domain lists.
    // Open text allows discovery of niche/emerging skills.
    // Optional — prevents blank-field anxiety (40% higher abandonment with
    // mandatory unexplained fields, per research report Section 5.1).
    // AI signal → aspirational direction appended to roadmap prompt
    question: "Is there a specific skill or area you've always wanted to learn but haven't had the chance to yet?",
    hint: "Optional — share anything that comes to mind",
    placeholder: "For example: video editing, web design, public speaking, bookkeeping...",
    maxLength: 300,
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // SECTION B — YOUR WORK GOALS & STYLE  (Q6–Q10)
  // Required. Feeds job matching filters and roadmap pacing.
  // ═══════════════════════════════════════════════════════════════════════════

  {
    id: 6,
    phase: 2,
    section: "B",
    type: "single",
    required: true,
    aiKey: "workPreference",
    // Research: Remote/hybrid listed first — more accessible for many PWDs.
    // No option implied as "less desirable."
    // AI signal → workPreference → job listing filter
    question: "What kind of work arrangement are you hoping for?",
    options: [
      { value: "remote",    label: "Fully remote",              description: "I work from home" },
      { value: "hybrid",    label: "Hybrid",                   description: "some days at home, some in office" },
      { value: "onsite",    label: "On-site",                  description: "I prefer working in a physical location" },
      { value: "freelance", label: "Freelance / project-based",description: "flexible and varied" },
      { value: "any",       label: "I'm open to any arrangement" },
    ],
  },

  {
    id: 7,
    phase: 2,
    section: "B",
    type: "single",
    required: true,
    aiKey: "availableHoursPerWeek",
    // Research: "Realistically available" framing normalises part-time.
    // Avoids stigmatising lower availability — common for PWDs with
    // medical appointments, fatigue, or caregiver responsibilities.
    // AI signal → availableHoursPerWeek → roadmap duration + milestone pacing
    question: "How many hours per week are you realistically available to work or learn?",
    options: [
      { value: 8,  label: "Less than 10 hours per week" },
      { value: 15, label: "10–20 hours per week",  description: "part-time" },
      { value: 25, label: "20–30 hours per week" },
      { value: 35, label: "30–40 hours per week", description: "full-time" },
      { value: 0,  label: "It varies a lot — I'm flexible" },
    ],
  },

  {
    id: 8,
    phase: 2,
    section: "B",
    type: "single",
    required: true,
    aiKey: "careerMode",
    // Research: Personalises roadmap tone and milestone framing.
    // Income-urgency users need different roadmap pace than long-term builders.
    // AI signal → careerMode + urgencyLevel → roadmap compression / dashboard emphasis
    question: "What is your main goal for joining InklusiJobs?",
    options: [
      { value: "employment",  label: "I want to find a job as soon as possible" },
      { value: "upskilling",  label: "I want to build my skills before looking for work" },
      { value: "freelance",   label: "I'm looking for freelance or project-based income" },
      { value: "career_up",   label: "I want to improve my current skills for a better job" },
      { value: "exploratory", label: "I'm exploring — I'm not sure yet" },
    ],
  },

  {
    id: 9,
    phase: 2,
    section: "B",
    type: "multi",
    required: true,
    aiKey: "preferredLearningStyle",
    // Research: Based on VARK model adapted for digital learning.
    // Multi-select — most people use multiple modalities.
    // Matching resource formats to learning preferences increases
    // engagement and completion rates.
    // AI signal → preferredLearningStyle → resource type weighting in roadmap
    question: "How do you prefer to learn new things?",
    hint: "Select all that apply",
    options: [
      { value: "video",        label: "Watching videos or tutorials" },
      { value: "reading",      label: "Reading guides or articles" },
      { value: "hands_on",     label: "Doing hands-on exercises and practicing" },
      { value: "step_by_step", label: "Following step-by-step instructions" },
      { value: "trial_error",  label: "Learning through trial and error" },
      { value: "mentorship",   label: "Having a mentor or someone explain it to me" },
    ],
  },

  {
    id: 10,
    phase: 2,
    section: "B",
    type: "single",
    required: true,
    aiKey: "productivityWindow",
    // Research: Enables platform to schedule roadmap reminders appropriately.
    // Circadian preference particularly relevant for PWDs with pain cycles,
    // fatigue patterns, or medical routines affecting productivity windows.
    // AI signal → productivityWindow → notification + reminder scheduling
    question: "When do you usually feel most productive?",
    options: [
      { value: "early_morning", label: "Early morning",  description: "before 9am" },
      { value: "mid_morning",   label: "Mid-morning",    description: "9am–12pm" },
      { value: "afternoon",     label: "Afternoon",      description: "12pm–5pm" },
      { value: "evening",       label: "Evening",        description: "5pm–9pm" },
      { value: "late_night",    label: "Late night",     description: "after 9pm" },
      { value: "varies",        label: "It varies — I don't have a consistent pattern" },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // SECTION C — YOUR PREFERENCES & NEEDS  (Q11–Q15)
  // Optional but encouraged. Placed LAST — voluntary disclosure after
  // trust is established through completing sections A and B.
  // Research: Trust-building before disclosure increases voluntary
  // completion rates by 60–70% in PWD populations (Section 6, research report).
  // ═══════════════════════════════════════════════════════════════════════════

  {
    id: 11,
    phase: 3,
    section: "C",
    type: "multi",
    required: false,
    aiKey: "disabilityAccommodations",
    // Research: CRITICAL — fully optional, placed late in sequence.
    // Framed with clear benefit explanation ("helps us personalize").
    // Research shows optional disclosure with benefit explanation achieves
    // 60–70% voluntary completion among PWD populations.
    // AI signal → disabilityAccommodations → uiMode + resource accessibility filter
    question: "Would you like to share your disability or accessibility needs with us?",
    hint: "This helps us personalize your experience. Completely optional — you can skip this.",
    options: [
      { value: "visual",         label: "Visual impairment or low vision" },
      { value: "hearing",        label: "Hearing impairment or deafness" },
      { value: "physical_motor", label: "Physical or motor disability" },
      { value: "learning_diff",  label: "Learning difference",      description: "e.g. dyslexia, dyscalculia" },
      { value: "attention_diff", label: "Attention or focus difference", description: "e.g. ADHD" },
      { value: "cognitive",      label: "Cognitive or intellectual disability" },
      { value: "mental_health",  label: "Mental health condition" },
      { value: "multiple",       label: "Multiple disabilities" },
      { value: "prefer_not",     label: "I prefer not to share" },
    ],
  },

  {
    id: 12,
    phase: 3,
    section: "C",
    type: "text",
    required: false,
    aiKey: "accommodationRequest",
    // Research: Captures accessibility needs not covered by the category list.
    // Open text allows unique/niche needs to be specified.
    // Data feeds UX improvement priorities and future feature development.
    question: "Are there any specific accommodations or adjustments that would help you use this platform better?",
    hint: "Optional — any details help us improve your experience",
    placeholder: "For example: I need larger font sizes, I use a screen reader, I need extra time to read...",
    maxLength: 300,
  },

  {
    id: 13,
    phase: 3,
    section: "C",
    type: "single",
    required: false,
    aiKey: "pwdDocumentationStatus",
    // Research: Relevant for RA 7277 employer PWD hiring quota matching
    // and TESDA scholarship/subsidy eligibility.
    // NOT used to gate any platform feature — purely informational.
    // AI signal → pwdDocumentationStatus → employer quota matching
    question: "Do you currently have a PWD ID or any documentation of your disability?",
    hint: "Optional — this helps match you with employers who have inclusive hiring programs under RA 7277",
    options: [
      { value: "has_pwdid",   label: "Yes, I have a Philippine PWD ID" },
      { value: "has_docs",    label: "I have documentation but not a PWD ID" },
      { value: "in_process",  label: "I'm in the process of getting one" },
      { value: "no_docs",     label: "No, I don't have documentation" },
      { value: "prefer_not",  label: "I prefer not to answer" },
    ],
  },

  {
    id: 14,
    phase: 3,
    section: "C",
    type: "single",
    required: false,
    aiKey: "acquisitionChannel",
    // Research: Standard marketing attribution. Placed near end to minimize
    // friction on critical earlier questions.
    // Signal → marketingChannel → partnership prioritization data
    question: "How did you hear about InklusiJobs?",
    options: [
      { value: "social_media", label: "Social media",         description: "Facebook, Instagram, TikTok" },
      { value: "referral",     label: "Referred by a friend or family member" },
      { value: "government",   label: "Government agency",    description: "DSWD, NCDA, PhilHealth" },
      { value: "ngo",          label: "NGO or disability organization" },
      { value: "school",       label: "School or university" },
      { value: "search",       label: "Search engine",        description: "Google, etc." },
      { value: "other",        label: "Other" },
    ],
  },

  {
    id: 15,
    phase: 3,
    section: "C",
    type: "text",
    required: false,
    aiKey: "additionalContext",
    // Research: THE MOST POWERFUL QUESTION in the assessment.
    // Gives users agency to share context structured questions cannot capture
    // (recent job loss, caregiver responsibilities, specific industry interest).
    // Fed DIRECTLY into the AI roadmap generation prompt as additional context.
    // Produces significantly more personalized roadmap results.
    // 300 char limit — encourages meaningful sharing without overwhelm.
    // AI signal → additionalContext → appended to ALL AI prompts
    question: "Is there anything else you'd like us to know about you or your goals before we build your roadmap?",
    hint: "Optional — even one sentence helps us personalize your roadmap significantly",
    placeholder: "For example: I am a caregiver with limited hours, I recently lost my job and need income urgently, I am a PWD-ID holder looking for remote work...",
    maxLength: 300,
  },
];

// ─── HELPERS ──────────────────────────────────────────────────────────────────
export const QUESTION_ORDER = QUESTIONS.map((q) => q.id); // [1,2,...,15]

export function getQuestion(id) {
  return QUESTIONS.find((q) => q.id === id);
}

export function getPhaseQuestions(phaseId) {
  return QUESTIONS.filter((q) => q.phase === phaseId);
}