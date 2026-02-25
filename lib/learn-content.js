// lib/learn-content.js
// Pre-built learning resources + 5 scenario-based quiz questions per resource
// Research basis: TESDA PTQF, O*NET, Bloom's Taxonomy (scenario = Application level)
// Resources: vetted free links only — YouTube, Google, TESDA Online, Coursera audit

// ─── TYPES ───────────────────────────────────────────────────────────────────
// Resource type: { id, jobId, phaseNumber, title, type, url, platform,
//                  language, estimatedHours, accessibilityNotes, questions[] }
// Question type: { id, type (single|text), question, options?, correct?, rubric? }

// ─── HELPER ──────────────────────────────────────────────────────────────────
export function getResourcesForJob(jobId) {
  return LEARN_CONTENT[jobId] || [];
}

export function getResourcesByPhase(jobId, phaseNumber) {
  return getResourcesForJob(jobId).filter(r => r.phaseNumber === phaseNumber);
}

export function getResource(jobId, resourceId) {
  return getResourcesForJob(jobId).find(r => r.id === resourceId) || null;
}

export function getChallengeForPhase(jobId, phaseNumber) {
  return CHALLENGES[jobId]?.find(c => c.phaseNumber === phaseNumber) || null;
}

export function getChallengeById(jobId, challengeId) {
  return CHALLENGES[jobId]?.find(c => c.id === challengeId) || null;
}

// ─── CHALLENGES (1 per phase per job) ────────────────────────────────────────
export const CHALLENGES = {

  smm_manager: [
    {
      id: "smm_challenge_1",
      jobId: "smm_manager",
      phaseNumber: 1,
      title: "Build a 1-Week Content Calendar",
      briefSummary: "Create a 7-day Instagram content calendar for a local Filipino brand.",
      brief: `You've just been hired as a Social Media Manager for "Kain Tayo" — a Filipino food delivery startup based in Cebu targeting young professionals aged 22–35.

Your first task from the Marketing Lead:

"We need a content calendar for next week. We post daily on Instagram. Our brand voice is warm, fun, and proudly Filipino. We want to promote our new 'Lutong Nanay' meal bundle but don't make every post about the promo — mix it up."

YOUR DELIVERABLE:
Create a 7-day Instagram content calendar (Monday to Sunday) that includes:
1. Content theme/topic for each day
2. Post format (Reel, Carousel, Static image, Story)
3. Caption draft (3–5 sentences + hashtags)
4. Posting time and why you chose it
5. One engagement prompt (question or CTA) per post

CONSTRAINTS:
- At least 2 posts must feature the 'Lutong Nanay' promo naturally
- At least 1 post must be in Filipino or Taglish
- No two consecutive posts can be the same format

Submit as a structured document or table. You can use Google Docs, Notion, or paste directly.`,
      skills: ["Content Strategy & Planning", "Copywriting & Caption Writing"],
      estimatedHours: 3,
      submissionType: "text",
      rubric: [
        { criterion: "Content variety", maxScore: 20, description: "Mix of formats, themes, and tones across 7 days" },
        { criterion: "Caption quality", maxScore: 25, description: "Engaging, on-brand, correct grammar, includes CTA" },
        { criterion: "Strategic thinking", maxScore: 25, description: "Posts build toward a goal, not random" },
        { criterion: "Filipino context", maxScore: 15, description: "Culturally relevant, authentic Filipino brand voice" },
        { criterion: "Completeness", maxScore: 15, description: "All 7 days filled with all required fields" },
      ],
      passingScore: 70,
    },
    {
      id: "smm_challenge_2",
      jobId: "smm_manager",
      phaseNumber: 2,
      title: "Respond to a Social Media Crisis",
      briefSummary: "Handle a negative viral comment and write a brand response strategy.",
      brief: `It's Monday morning and you check the Instagram notifications for "Kain Tayo". A post from last Friday has 47 angry comments after a customer posted: "My order was 2 hours late and the food was cold. Never ordering again. Worst delivery service in Cebu! 😤" — and it now has 3,200 likes and has been shared to a Facebook food review group with 80,000 members.

Your manager messages you: "Handle this. We need a response plan in the next hour."

YOUR DELIVERABLE:
1. Public Instagram reply (max 3 sentences — calm, empathetic, professional)
2. DM follow-up script (what you'd send the customer privately)
3. Comment moderation plan (which comments to respond to, which to ignore, any to hide?)
4. A 3-point action plan to prevent this from happening again on social media
5. One proactive post idea to rebuild trust this week

CONSTRAINTS:
- Do NOT be defensive or blame the customer
- Do NOT offer a refund publicly (move it to DM)
- Tone must stay warm and on-brand`,
      skills: ["Content Strategy & Planning", "Social Media Platform Knowledge"],
      estimatedHours: 2,
      submissionType: "text",
      rubric: [
        { criterion: "Public reply quality", maxScore: 25, description: "Empathetic, professional, non-defensive, concise" },
        { criterion: "DM script", maxScore: 20, description: "Resolves the issue, offers next step, warm tone" },
        { criterion: "Moderation plan", maxScore: 20, description: "Clear, fair, protects brand without censoring" },
        { criterion: "Prevention plan", maxScore: 20, description: "Practical, actionable, realistic" },
        { criterion: "Trust rebuild post", maxScore: 15, description: "Creative, authentic, on-brand" },
      ],
      passingScore: 70,
    },
    {
      id: "smm_challenge_3",
      jobId: "smm_manager",
      phaseNumber: 3,
      title: "Analyse Performance & Pitch Next Month's Strategy",
      briefSummary: "Read mock analytics data and pitch a data-driven content strategy.",
      brief: `Your manager shares last month's Instagram performance data for "Kain Tayo":

MOCK DATA:
- Followers: 4,200 (+180 this month)
- Average reach per post: 1,100
- Top performing post: A behind-the-scenes Reel of the kitchen (Reach: 8,400, Saves: 312)
- Lowest performing post: A static promo image for the Lutong Nanay bundle (Reach: 340, Likes: 12)
- Story views average: 280
- Profile visits from Stories: 45
- Link clicks from bio: 23

YOUR DELIVERABLE:
Write a short strategy pitch (can be bullet points or a short doc) that includes:
1. 3 key insights from this data (what is working, what isn't, and why)
2. Your recommended content mix for next month (% of Reels vs Carousels vs Static vs Stories)
3. One specific experiment you'd run next month and how you'd measure success
4. What you'd do differently with the Lutong Nanay promo posts`,
      skills: ["Analytics & Reporting", "Content Strategy & Planning"],
      estimatedHours: 2,
      submissionType: "text",
      rubric: [
        { criterion: "Data interpretation", maxScore: 30, description: "Correctly reads and explains the numbers" },
        { criterion: "Strategic recommendations", maxScore: 30, description: "Logical, data-backed content mix" },
        { criterion: "Experiment design", maxScore: 20, description: "Clear hypothesis and success metric" },
        { criterion: "Promo improvement", maxScore: 20, description: "Practical, creative fix for underperforming posts" },
      ],
      passingScore: 70,
    },
  ],

  va_general: [
    {
      id: "va_challenge_1",
      jobId: "va_general",
      phaseNumber: 1,
      title: "Organise a Client's Inbox & Schedule",
      briefSummary: "Sort a messy inbox scenario and set up a weekly schedule for a busy client.",
      brief: `You've been hired as a Virtual Assistant for Mark, a freelance web developer in Manila who works with 3 international clients. It's your first week.

Mark sends you this message: "I haven't touched my inbox in 2 weeks. There are 94 unread emails. I also need my calendar sorted — I keep missing calls. Can you handle this?"

YOU ARE GIVEN (simulate this in writing):
- Client A (USA): Emails about a project deadline, a revision request, and a payment confirmation
- Client B (Australia): 3 follow-up emails asking for a progress update Mark never replied to
- Client C (Singapore): A meeting request for next Tuesday at 10am SGT and a contract to review
- 12 newsletter/subscription emails
- 4 spam emails

YOUR DELIVERABLE:
1. An inbox organisation system (folders/labels you'd create and why)
2. A priority list — which emails does Mark need to respond to TODAY, this week, or can wait?
3. Draft a reply to Client B's follow-up on Mark's behalf (professional, apologetic, gives an update)
4. A simple weekly calendar block template for Mark (show time blocks for client work, calls, admin)
5. One system you'd set up to prevent this from happening again`,
      skills: ["Email & Calendar Management", "Organisation & Time Management"],
      estimatedHours: 2,
      submissionType: "text",
      rubric: [
        { criterion: "Inbox system", maxScore: 20, description: "Logical, practical folder/label structure" },
        { criterion: "Priority list", maxScore: 20, description: "Correctly identifies urgent vs non-urgent" },
        { criterion: "Client B reply", maxScore: 25, description: "Professional, warm, gives a clear update" },
        { criterion: "Calendar template", maxScore: 20, description: "Realistic, time-blocked, accounts for time zones" },
        { criterion: "Prevention system", maxScore: 15, description: "Practical and easy for a busy person to maintain" },
      ],
      passingScore: 70,
    },
    {
      id: "va_challenge_2",
      jobId: "va_general",
      phaseNumber: 2,
      title: "Handle a Difficult Client Situation",
      briefSummary: "Write professional responses to a frustrated client scenario.",
      brief: `Your client Sarah runs an online boutique. She messages you on a Friday afternoon:

"I needed that product description doc done by today. It's not in the folder. I have a photoshoot tomorrow and the photographer needs the copy. This is really stressful. I thought you were on top of this???"

The truth: Sarah never confirmed the deadline with you. Your last message exchange shows her saying "maybe get it done this week" with no specific day. The doc is 80% done.

YOUR DELIVERABLE:
1. Your immediate reply to Sarah (stay professional, do not be defensive, solve the problem)
2. A plan for the next 2 hours to finish the doc and deliver it tonight
3. A follow-up message to send after delivering the doc
4. One process you'd put in place going forward to avoid deadline confusion
5. Reflection: Was this your fault, Sarah's, or both? How do you handle blame in a VA relationship?`,
      skills: ["Written Communication", "Organisation & Time Management"],
      estimatedHours: 1,
      submissionType: "text",
      rubric: [
        { criterion: "Immediate reply", maxScore: 30, description: "Professional, calm, solution-focused, not defensive" },
        { criterion: "Action plan", maxScore: 20, description: "Realistic, prioritised, time-aware" },
        { criterion: "Follow-up message", maxScore: 20, description: "Warm, confirms delivery, rebuilds trust" },
        { criterion: "Process improvement", maxScore: 15, description: "Practical deadline confirmation system" },
        { criterion: "Reflection quality", maxScore: 15, description: "Mature, honest, shows professional growth mindset" },
      ],
      passingScore: 70,
    },
  ],

  copywriter: [
    {
      id: "cw_challenge_1",
      jobId: "copywriter",
      phaseNumber: 1,
      title: "Write a Full Ad Campaign for a Filipino Brand",
      briefSummary: "Write 3 ad variations for a local brand across different platforms.",
      brief: `You've been hired by "Ganda Mo" — a Filipina-owned skincare brand selling natural, affordable products for Filipino skin tones. Their best-seller is a papaya kojic soap at ₱149.

Their Marketing Manager briefs you: "We need copy for a small launch campaign. Our audience is Filipinas aged 18–35 who are budget-conscious but want to feel beautiful. They're tired of brands that show only light skin as the goal. We celebrate all Filipino skin tones."

YOUR DELIVERABLE — write all 3:
1. Facebook Ad (Headline + 3-sentence body + CTA button text)
2. Instagram Caption for a before/after post (authentic, not medical claims, 4–6 sentences + hashtags)
3. SMS/Viber Blast (max 160 characters — punchy, drives to website)

CONSTRAINTS:
- No whitening claims or language implying darker skin needs to be fixed
- Must feel authentic to Filipino culture — not translated Western copy
- Each piece must have a different angle (e.g. price, confidence, natural ingredients)`,
      skills: ["Persuasive Writing", "Brand Voice Adaptation"],
      estimatedHours: 2,
      submissionType: "text",
      rubric: [
        { criterion: "Facebook Ad", maxScore: 30, description: "Strong hook, clear benefit, compelling CTA" },
        { criterion: "Instagram Caption", maxScore: 25, description: "Authentic, engaging, appropriate hashtags" },
        { criterion: "SMS Copy", maxScore: 20, description: "Under 160 chars, punchy, clear action" },
        { criterion: "Cultural authenticity", maxScore: 15, description: "Feels genuinely Filipino, not translated" },
        { criterion: "Brand consistency", maxScore: 10, description: "All 3 pieces feel like same brand" },
      ],
      passingScore: 70,
    },
  ],

  seo_writer: [
    {
      id: "seo_challenge_1",
      jobId: "seo_writer",
      phaseNumber: 1,
      title: "Write a Full SEO Blog Article",
      briefSummary: "Write a complete 800-word SEO article for a Filipino audience.",
      brief: `Your client runs "WorkFromHomePH" — a blog for Filipino remote workers. They assign you this article:

BRIEF:
- Title: "5 Best Free Tools for Filipino Virtual Assistants in 2025"
- Target keyword: "free tools for virtual assistants Philippines"
- Word count: 800–1,000 words
- Audience: Filipinos new to remote work, mostly mobile users
- Tone: Friendly, practical, encouraging — like a Ate/Kuya who's been doing this for years

REQUIREMENTS:
- Keyword in title, first paragraph, at least 2 subheadings
- Short paragraphs (max 3–4 sentences)
- Each tool section: tool name, what it does, why it's great for Filipino VAs, link placeholder
- End with an encouraging closing paragraph + 1 CTA
- No fluff — every sentence must earn its place

YOUR DELIVERABLE: The full article. Write it as if submitting to the client.`,
      skills: ["SEO Fundamentals", "Long-form Writing"],
      estimatedHours: 3,
      submissionType: "text",
      rubric: [
        { criterion: "SEO structure", maxScore: 25, description: "Keyword placement, H2 headings, meta-friendly title" },
        { criterion: "Content quality", maxScore: 30, description: "Accurate, useful, well-researched tool descriptions" },
        { criterion: "Readability", maxScore: 20, description: "Short paragraphs, scannable, mobile-friendly" },
        { criterion: "Filipino context", maxScore: 15, description: "Relevant examples, local context, right tone" },
        { criterion: "CTA and closing", maxScore: 10, description: "Encouraging, clear next step for the reader" },
      ],
      passingScore: 70,
    },
  ],

  customer_support: [
    {
      id: "cs_challenge_1",
      jobId: "customer_support",
      phaseNumber: 1,
      title: "Handle a Full Customer Support Shift Simulation",
      briefSummary: "Respond to 4 different customer scenarios in a simulated support shift.",
      brief: `You are a Customer Support Agent for "ShopLocal PH" — a Filipino e-commerce platform. It's a busy Monday. Handle these 4 tickets:

TICKET 1 — Angry customer:
"I ordered last week and NOTHING. No tracking, no update. I want a refund NOW. This is the WORST service I've ever experienced."

TICKET 2 — Confused senior customer:
"Po, hindi ko maintindihan kung paano i-track ang order ko. Bago lang ako sa online shopping. Maari po ba kayong tumulong?"

TICKET 3 — Unreasonable request:
"I want to return this item. I've used it for 3 weeks but I don't like it anymore. I want a full refund." (Your policy: returns within 7 days, unused only)

TICKET 4 — Compliment:
"Just want to say your agent Mia was incredibly helpful last week! She went above and beyond."

YOUR DELIVERABLE — write a response to each ticket:
- Ticket 1: Empathetic, urgent, provides next step
- Ticket 2: In Filipino or Taglish, patient, step-by-step help
- Ticket 3: Firm but kind, explains policy, offers alternative
- Ticket 4: Gracious, personal, acknowledges Mia specifically`,
      skills: ["Empathy & Active Listening", "Written Communication", "Problem Solving"],
      estimatedHours: 2,
      submissionType: "text",
      rubric: [
        { criterion: "Ticket 1 response", maxScore: 25, description: "Empathetic, urgent, clear next step, not defensive" },
        { criterion: "Ticket 2 response", maxScore: 25, description: "Filipino/Taglish, patient, genuinely helpful" },
        { criterion: "Ticket 3 response", maxScore: 25, description: "Policy enforced kindly, alternative offered" },
        { criterion: "Ticket 4 response", maxScore: 15, description: "Warm, acknowledges Mia, feels human not scripted" },
        { criterion: "Overall professionalism", maxScore: 10, description: "Consistent tone, no typos, appropriate language" },
      ],
      passingScore: 70,
    },
  ],

  data_entry: [
    {
      id: "de_challenge_1",
      jobId: "data_entry",
      phaseNumber: 1,
      title: "Clean and Organise a Messy Dataset",
      briefSummary: "Describe how you would clean a real messy spreadsheet scenario.",
      brief: `Your supervisor sends you a Google Sheet with 200 rows of customer order data. They say: "This export came from our old system. It's a mess. Please clean it and give me a usable file by end of day."

YOU FIND THESE ISSUES:
1. Column headers are inconsistent: "First Name", "firstname", "FNAME" all refer to the same field
2. Some phone numbers have +63, some have 0, some have no country code
3. 34 rows have missing email addresses
4. Dates are in 3 different formats: MM/DD/YYYY, DD-MM-YY, and "January 5, 2024"
5. 12 duplicate rows (exact same name + email)
6. One column called "Status" has values: "paid", "Paid", "PAID", "p", "yes", "1"

YOUR DELIVERABLE — write your step-by-step cleaning process:
1. How you would fix each of the 6 issues above (be specific — what formula or method?)
2. What you would do with the 34 rows missing emails — delete or keep?
3. How you would verify your work before sending to your supervisor
4. What you would name the final file and why`,
      skills: ["Accuracy & Attention to Detail", "Spreadsheet Skills"],
      estimatedHours: 2,
      submissionType: "text",
      rubric: [
        { criterion: "Issue solutions", maxScore: 40, description: "Correct, specific methods for each of the 6 issues" },
        { criterion: "Missing data decision", maxScore: 20, description: "Logical, well-reasoned approach" },
        { criterion: "Verification process", maxScore: 20, description: "Thorough QA steps before submission" },
        { criterion: "File naming", maxScore: 10, description: "Professional, descriptive, version-controlled" },
        { criterion: "Clarity of explanation", maxScore: 10, description: "Easy to follow, well-structured" },
      ],
      passingScore: 70,
    },
  ],
};

// ─── LEARN CONTENT (resources + questions per job) ────────────────────────────
export const LEARN_CONTENT = {

  // ═══════════════════════════════════════════════════════════════════════════
  // SOCIAL MEDIA MANAGER
  // ═══════════════════════════════════════════════════════════════════════════
  smm_manager: [
    {
      id: "smm_r1",
      jobId: "smm_manager",
      phaseNumber: 1,
      skillMapped: "Content Strategy & Planning",
      title: "Social Media Marketing Full Course",
      type: "video",
      url: "https://www.youtube.com/watch?v=uy5JkHFbCJk",
      platform: "YouTube",
      channel: "HubSpot Marketing",
      language: "English",
      estimatedHours: 2,
      accessibilityNotes: "Auto-captions available. Enable in YouTube settings.",
      questions: [
        {
          id: "smm_r1_q1",
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
          id: "smm_r1_q2",
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
          id: "smm_r1_q3",
          type: "single",
          question: "Which metric best shows whether your content is resonating with the RIGHT audience?",
          options: [
            { value: "a", label: "Total follower count" },
            { value: "b", label: "Number of likes per post" },
            { value: "c", label: "Saves and shares — indicating people found the content valuable enough to keep or recommend" },
            { value: "d", label: "Post impressions" },
          ],
          correct: "c",
          explanation: "Saves and shares are high-intent actions showing genuine value. They also signal quality to the algorithm.",
        },
        {
          id: "smm_r1_q4",
          type: "single",
          question: "A food brand's Instagram engagement has dropped by 40% this month. Same posting frequency, same content style. What's your first move?",
          options: [
            { value: "a", label: "Immediately change the entire brand aesthetic" },
            { value: "b", label: "Check Instagram Insights to see which specific posts underperformed and identify patterns" },
            { value: "c", label: "Start boosting all posts with paid ads" },
            { value: "d", label: "Post more frequently to make up for the drop" },
          ],
          correct: "b",
          explanation: "Data diagnosis before action. You need to understand WHY before you change anything.",
        },
        {
          id: "smm_r1_q5",
          type: "text",
          question: "A client sells handmade Filipino jewelry and wants to attract younger buyers on Instagram. Based on what you've learned, describe your content strategy for their first month. Include format mix, posting frequency, and one specific content idea.",
          rubric: "Score based on: strategic thinking (is the plan logical?), format knowledge (Reels vs Carousels vs Stories), audience awareness (does it speak to young Filipinos?), and one specific creative idea.",
          placeholder: "My strategy for their first month would be...",
        },
      ],
    },
    {
      id: "smm_r2",
      jobId: "smm_manager",
      phaseNumber: 1,
      skillMapped: "Copywriting & Caption Writing",
      title: "How to Write Social Media Captions That Convert",
      type: "video",
      url: "https://www.youtube.com/watch?v=yPMWMzNFtbs",
      platform: "YouTube",
      channel: "Later",
      language: "English",
      estimatedHours: 1,
      accessibilityNotes: "Auto-captions available. Watch at 0.75x speed if needed.",
      questions: [
        {
          id: "smm_r2_q1",
          type: "single",
          question: "Which Instagram caption opening is most likely to stop someone from scrolling?",
          options: [
            { value: "a", label: "'We are excited to announce our new product launch!'" },
            { value: "b", label: "'This mistake cost us ₱50,000 — and it could happen to you too.'" },
            { value: "c", label: "'Follow us for more content like this!'" },
            { value: "d", label: "'Check out our latest blog post via the link in bio.'" },
          ],
          correct: "b",
          explanation: "Pattern interrupts and curiosity gaps stop scrolling. The first line is the most important — make it impossible to ignore.",
        },
        {
          id: "smm_r2_q2",
          type: "single",
          question: "A caption ends with 'Click the link in bio!' — what is wrong with this CTA?",
          options: [
            { value: "a", label: "Nothing — it's a standard effective CTA" },
            { value: "b", label: "It's too long" },
            { value: "c", label: "It's vague — it doesn't tell the reader WHAT they'll get or WHY they should click" },
            { value: "d", label: "Links in bio don't work on Instagram" },
          ],
          correct: "c",
          explanation: "Specific CTAs outperform vague ones. 'Click to grab your free content calendar' beats 'link in bio'.",
        },
        {
          id: "smm_r2_q3",
          type: "single",
          question: "You write a caption for a local coffee shop. Which version is stronger?",
          options: [
            { value: "a", label: "'Our coffee is made with high-quality beans sourced from local farms in Benguet.'" },
            { value: "b", label: "'That first sip feeling — amplified. ☕ Made with Benguet beans by farmers who've been at it for 3 generations. Come taste the difference.'" },
            { value: "c", label: "'New coffee available now. Visit us at our store.'" },
            { value: "d", label: "'We love coffee and we think you will too! Come by anytime!'" },
          ],
          correct: "b",
          explanation: "Option B leads with feeling, adds story (3 generations), and has a soft CTA. It sells the experience, not just the product.",
        },
        {
          id: "smm_r2_q4",
          type: "single",
          question: "How many hashtags are currently recommended for Instagram Reels in 2024?",
          options: [
            { value: "a", label: "30 — always max out the limit" },
            { value: "b", label: "0 — hashtags no longer work on Reels" },
            { value: "c", label: "3–10 highly relevant hashtags" },
            { value: "d", label: "1 branded hashtag only" },
          ],
          correct: "c",
          explanation: "Instagram's own guidance and creator data suggest 3–10 targeted hashtags. Over-hashtagging looks spammy and doesn't improve reach.",
        },
        {
          id: "smm_r2_q5",
          type: "text",
          question: "Write an Instagram caption for a local Filipino clothing brand called 'Habi' launching a new line of modern baro't saya. Target audience: young professional Filipinas aged 22–30. Include a hook, body, and CTA.",
          rubric: "Score based on: hook strength (does it stop scrolling?), brand voice (modern but proud Filipino), benefit-focused body, specific CTA, appropriate hashtags.",
          placeholder: "Write your caption here — emojis and hashtags welcome...",
        },
      ],
    },
    {
      id: "smm_r3",
      jobId: "smm_manager",
      phaseNumber: 2,
      skillMapped: "Analytics & Reporting",
      title: "Instagram Analytics for Beginners — What to Track and Why",
      type: "video",
      url: "https://www.youtube.com/watch?v=7dCHBvuJNjY",
      platform: "YouTube",
      channel: "Elise Darma",
      language: "English",
      estimatedHours: 1,
      accessibilityNotes: "Auto-captions available. Transcript available via YouTube.",
      questions: [
        {
          id: "smm_r3_q1",
          type: "single",
          question: "Your client's Reel got 50,000 views but only 12 new followers. What does this tell you?",
          options: [
            { value: "a", label: "The Reel was a failure — views don't matter" },
            { value: "b", label: "The content reached a wide audience but didn't compel people to follow — the profile or content niche may need adjustment" },
            { value: "c", label: "50,000 views always leads to 500+ followers — something technical went wrong" },
            { value: "d", label: "The client should delete the Reel and repost it" },
          ],
          correct: "b",
          explanation: "High reach but low follow-through suggests a profile optimisation or content-audience mismatch issue.",
        },
        {
          id: "smm_r3_q2",
          type: "single",
          question: "What is the difference between 'reach' and 'impressions' on Instagram?",
          options: [
            { value: "a", label: "They are the same metric with different names" },
            { value: "b", label: "Reach = unique accounts who saw your content; Impressions = total times your content was displayed (including multiple views by same person)" },
            { value: "c", label: "Reach = paid views; Impressions = organic views" },
            { value: "d", label: "Impressions = unique viewers; Reach = total views" },
          ],
          correct: "b",
          explanation: "Understanding the difference is essential for reporting. High impressions vs reach gap means people are rewatching — usually a good sign.",
        },
        {
          id: "smm_r3_q3",
          type: "single",
          question: "A client asks 'Is our social media working?' — which metrics do you report to answer this meaningfully?",
          options: [
            { value: "a", label: "Follower count only" },
            { value: "b", label: "Follower count, likes per post, and total impressions" },
            { value: "c", label: "Engagement rate, reach growth, website clicks, and conversion actions tied to business goals" },
            { value: "d", label: "Only paid ad performance" },
          ],
          correct: "c",
          explanation: "Vanity metrics (likes, followers) don't show business impact. Tie metrics to the client's actual goals.",
        },
        {
          id: "smm_r3_q4",
          type: "single",
          question: "You're presenting monthly analytics to a client who isn't tech-savvy. What's the best approach?",
          options: [
            { value: "a", label: "Show them the raw data export from Meta Business Suite" },
            { value: "b", label: "Use visual charts, plain language, and connect each number to a business outcome they care about" },
            { value: "c", label: "Only show them the positive numbers to keep them happy" },
            { value: "d", label: "Send a spreadsheet with all available metrics" },
          ],
          correct: "b",
          explanation: "Client communication is as important as the data itself. Translate numbers into business language.",
        },
        {
          id: "smm_r3_q5",
          type: "text",
          question: "Look at this mock data for a brand's Instagram last month: Posts: 20 | Avg reach per post: 800 | Avg likes: 45 | Avg comments: 3 | Saves: 8 per post | Story views: 200 | Bio link clicks: 15. Write a short analytics summary for the client — what's working, what needs improvement, and one specific recommendation.",
          rubric: "Score based on: correct interpretation of metrics, identification of strengths (saves relative to reach), weaknesses (low comments = low conversation), and a specific actionable recommendation.",
          placeholder: "Analytics Summary — [Month]\n\nWhat's working:\n...\n\nWhat needs improvement:\n...\n\nMy recommendation:\n...",
        },
      ],
    },
    {
      id: "smm_r4",
      jobId: "smm_manager",
      phaseNumber: 2,
      skillMapped: "Basic Design (Canva/similar)",
      title: "Canva for Social Media — Full Beginner Tutorial",
      type: "video",
      url: "https://www.youtube.com/watch?v=4_-PeT9VGBY",
      platform: "YouTube",
      channel: "Canva",
      language: "English",
      estimatedHours: 1.5,
      accessibilityNotes: "Captions available. Official Canva tutorial — keyboard navigable interface.",
      questions: [
        {
          id: "smm_r4_q1",
          type: "single",
          question: "You're designing an Instagram post for a brand whose colors are navy blue and gold. You want to add text. Which text color choice is most accessible and on-brand?",
          options: [
            { value: "a", label: "Light grey text on navy background" },
            { value: "b", label: "White or gold text on navy background — high contrast, on-brand" },
            { value: "c", label: "Navy text on navy background with a shadow effect" },
            { value: "d", label: "Any color — just make the font bigger" },
          ],
          correct: "b",
          explanation: "High contrast is both accessible (WCAG) and visually strong. Always ensure text is readable at a glance.",
        },
        {
          id: "smm_r4_q2",
          type: "single",
          question: "A client gives you their logo in JPG format with a white background. You need to place it on a coloured banner. What do you do?",
          options: [
            { value: "a", label: "Use the JPG as-is and match the banner color to white" },
            { value: "b", label: "Ask for a PNG with transparent background, or use Canva's background remover tool" },
            { value: "c", label: "Place the JPG and crop it to hide the white edges" },
            { value: "d", label: "Skip the logo — it's too complicated" },
          ],
          correct: "b",
          explanation: "PNG with transparency is the professional standard for logos. Canva's background remover makes this easy even without a PNG.",
        },
        {
          id: "smm_r4_q3",
          type: "single",
          question: "What is the recommended pixel size for an Instagram feed post in 2024?",
          options: [
            { value: "a", label: "500 x 500px" },
            { value: "b", label: "1080 x 1080px (square) or 1080 x 1350px (portrait)" },
            { value: "c", label: "1920 x 1080px (landscape)" },
            { value: "d", label: "Any size — Instagram resizes automatically" },
          ],
          correct: "b",
          explanation: "1080x1080 for square, 1080x1350 for portrait (takes up more feed space). Always design at the correct resolution to avoid blurry exports.",
        },
        {
          id: "smm_r4_q4",
          type: "single",
          question: "You're designing a promotional post and you want it to feel premium and clean. Which design principle is most important?",
          options: [
            { value: "a", label: "Use as many design elements as possible to show effort" },
            { value: "b", label: "Use maximum 2–3 fonts and embrace white space — less is more for premium brands" },
            { value: "c", label: "Always use a gradient background" },
            { value: "d", label: "Match whatever the competitor brands are doing" },
          ],
          correct: "b",
          explanation: "Premium design is defined by restraint. Too many elements create visual noise. White space is not empty — it's breathing room.",
        },
        {
          id: "smm_r4_q5",
          type: "text",
          question: "Describe the design you would create for an Instagram carousel post (5 slides) promoting a free webinar called 'How to Start Freelancing in the Philippines'. What would each slide contain, what colors/fonts would you use, and why?",
          rubric: "Score based on: logical slide flow (hook → value → proof → CTA), design rationale (color and font choices justified), practical knowledge of carousel format, and Filipino context awareness.",
          placeholder: "Slide 1: ...\nSlide 2: ...\nSlide 3: ...\nSlide 4: ...\nSlide 5: ...\n\nColors & fonts: ...\nWhy this works: ...",
        },
      ],
    },
    {
      id: "smm_r5",
      jobId: "smm_manager",
      phaseNumber: 3,
      skillMapped: "Social Media Platform Knowledge",
      title: "Meta Business Suite Complete Tutorial 2024",
      type: "video",
      url: "https://www.youtube.com/watch?v=n7vkMF6PNWE",
      platform: "YouTube",
      channel: "Social Media Examiner",
      language: "English",
      estimatedHours: 1.5,
      accessibilityNotes: "Auto-captions available. Detailed walkthrough — pause and follow along.",
      questions: [
        {
          id: "smm_r5_q1",
          type: "single",
          question: "A client gives you access to their Facebook Page and Instagram account. What is the first thing you should set up in Meta Business Suite?",
          options: [
            { value: "a", label: "Immediately start posting content" },
            { value: "b", label: "Connect both accounts, set up your posting schedule, and review the existing analytics baseline" },
            { value: "c", label: "Delete all old posts to start fresh" },
            { value: "d", label: "Change the profile picture to something more modern" },
          ],
          correct: "b",
          explanation: "Always establish a baseline before making changes. You can't measure improvement if you don't know the starting point.",
        },
        {
          id: "smm_r5_q2",
          type: "single",
          question: "What is the advantage of scheduling posts in Meta Business Suite instead of posting manually?",
          options: [
            { value: "a", label: "Scheduled posts get more reach than manual posts" },
            { value: "b", label: "It allows consistent posting at optimal times without being online, and you can plan content in advance" },
            { value: "c", label: "Scheduled posts bypass the algorithm" },
            { value: "d", label: "There is no advantage — manual is always better" },
          ],
          correct: "b",
          explanation: "Scheduling enables consistency (the #1 factor in social media growth) and lets you work on strategy instead of scrambling to post daily.",
        },
        {
          id: "smm_r5_q3",
          type: "single",
          question: "You manage 3 client Facebook Pages. A message comes in at 11pm on a Friday. What should you do?",
          options: [
            { value: "a", label: "Always reply immediately — response time affects page rating" },
            { value: "b", label: "Set up an automated away message in Meta Business Suite, then reply first thing Monday" },
            { value: "c", label: "Ignore it — after-hours messages don't need replies" },
            { value: "d", label: "Delete the message to keep the inbox clean" },
          ],
          correct: "b",
          explanation: "Auto-responses manage expectations professionally. You can't be online 24/7, but you can set up systems that communicate your availability.",
        },
        {
          id: "smm_r5_q4",
          type: "single",
          question: "A client asks why their boosted post performed worse than their organic post last week. What's the most likely explanation?",
          options: [
            { value: "a", label: "Boosting always underperforms — it's a waste of money" },
            { value: "b", label: "The boosted post may have had poor targeting, weak creative, or was boosted without a clear objective" },
            { value: "c", label: "Facebook's algorithm punishes boosted posts" },
            { value: "d", label: "They needed to spend more money for it to work" },
          ],
          correct: "b",
          explanation: "Boosting amplifies what's already there — a weak post + bad targeting = poor results. Strategy first, budget second.",
        },
        {
          id: "smm_r5_q5",
          type: "text",
          question: "You're onboarding a new client — a small Filipino restaurant chain with 3 locations. They have a Facebook Page with 2,000 followers and no Instagram. Describe your first 2 weeks as their Social Media Manager: what you'd audit, set up, and plan.",
          rubric: "Score based on: audit completeness (existing content, engagement, competitors), setup steps (Instagram, Meta Business Suite, scheduling), planning quality (content calendar, goals), and realistic timeline.",
          placeholder: "Week 1:\n...\n\nWeek 2:\n...\n\nTools I'd use:\n...",
        },
      ],
    },
  ],

  // ═══════════════════════════════════════════════════════════════════════════
  // VIRTUAL ASSISTANT — Phase 1 resources
  // ═══════════════════════════════════════════════════════════════════════════
  va_general: [
    {
      id: "va_r1",
      jobId: "va_general",
      phaseNumber: 1,
      skillMapped: "Email & Calendar Management",
      title: "Google Workspace for Beginners — Gmail, Calendar, Drive",
      type: "course",
      url: "https://www.youtube.com/watch?v=pBBHBY0Rcmk",
      platform: "YouTube",
      channel: "Kevin Stratvert",
      language: "English",
      estimatedHours: 1.5,
      accessibilityNotes: "Auto-captions available. Slow-paced tutorial, good for beginners.",
      questions: [
        {
          id: "va_r1_q1",
          type: "single",
          question: "Your client asks you to schedule a recurring weekly meeting every Monday at 9am Manila time with a US-based collaborator in New York. What do you check first?",
          options: [
            { value: "a", label: "Just set it for 9am and let the US person figure out the time" },
            { value: "b", label: "Check the time zone difference — Manila is UTC+8, New York is UTC-5 (or -4 in summer) — that's 9pm Sunday NY time" },
            { value: "c", label: "Use GMT for all meetings to avoid confusion" },
            { value: "d", label: "Ask the client to handle time zone conversions themselves" },
          ],
          correct: "b",
          explanation: "Time zone awareness is a core VA skill. Always convert and confirm both times with all parties before sending invites.",
        },
        {
          id: "va_r1_q2",
          type: "single",
          question: "A client forwards you 15 emails and says 'handle these.' What is your first step?",
          options: [
            { value: "a", label: "Reply to all of them immediately" },
            { value: "b", label: "Categorise by urgency and type, then ask the client to clarify their priorities before acting" },
            { value: "c", label: "Archive all of them and start fresh" },
            { value: "d", label: "Reply to the oldest email first" },
          ],
          correct: "b",
          explanation: "Acting without clarity leads to mistakes. A quick triage + one clarifying message saves time and prevents errors.",
        },
        {
          id: "va_r1_q3",
          type: "single",
          question: "What is the best way to organise a client's Google Drive for a project with multiple deliverables?",
          options: [
            { value: "a", label: "Put everything in one folder and use the search function" },
            { value: "b", label: "Create a logical folder hierarchy: Project → Deliverables → Drafts/Finals, with consistent naming conventions" },
            { value: "c", label: "Use Google Drive's color-coding feature only" },
            { value: "d", label: "Save everything to your own Drive and share links" },
          ],
          correct: "b",
          explanation: "Organised file systems save everyone time. A clear hierarchy + naming convention makes it easy for anyone to find files — including the client.",
        },
        {
          id: "va_r1_q4",
          type: "single",
          question: "Your client has a Google Calendar meeting that conflicts with another one you just scheduled. What do you do?",
          options: [
            { value: "a", label: "Delete the older meeting — the new one takes priority" },
            { value: "b", label: "Alert the client immediately with both options and let them decide which to reschedule" },
            { value: "c", label: "Accept both meetings and hope the client figures it out" },
            { value: "d", label: "Cancel both to avoid the conflict" },
          ],
          correct: "b",
          explanation: "Never make unilateral decisions about your client's schedule. Flag conflicts immediately and present options.",
        },
        {
          id: "va_r1_q5",
          type: "text",
          question: "Your client is a busy entrepreneur who gets 80+ emails a day. Design an email management system for them using Gmail. Include: folder/label structure, daily routine, and how you'd handle urgent vs non-urgent emails.",
          rubric: "Score based on: practical folder structure, realistic daily routine, clear urgency system, and whether the system could actually reduce the client's stress.",
          placeholder: "Gmail Label Structure:\n...\n\nDaily Routine:\n...\n\nUrgent vs Non-urgent:\n...",
        },
      ],
    },
    {
      id: "va_r2",
      jobId: "va_general",
      phaseNumber: 1,
      skillMapped: "Written Communication",
      title: "Professional Email Writing for Remote Workers",
      type: "article",
      url: "https://www.grammarly.com/blog/professional-email-writing/",
      platform: "Grammarly Blog",
      language: "English",
      estimatedHours: 0.5,
      accessibilityNotes: "Screen reader compatible. Text-based article with clear headings.",
      questions: [
        {
          id: "va_r2_q1",
          type: "single",
          question: "Which subject line is most professional and effective for a follow-up email?",
          options: [
            { value: "a", label: "Following up" },
            { value: "b", label: "Hey, just checking in again..." },
            { value: "c", label: "Follow-up: Project Proposal — Action Needed by Friday" },
            { value: "d", label: "RE: RE: RE: RE: Our conversation" },
          ],
          correct: "c",
          explanation: "Specific subject lines with a clear action and deadline get higher open and response rates than vague ones.",
        },
        {
          id: "va_r2_q2",
          type: "single",
          question: "You need to tell a client that a deliverable will be 2 days late. Which email opening is most appropriate?",
          options: [
            { value: "a", label: "'I'm so sorry, I completely failed you and I understand if you want to fire me.'" },
            { value: "b", label: "'Just to let you know, things have been really busy on my end lately.'" },
            { value: "c", label: "'I want to update you on the [Project Name] timeline — I'm writing to let you know I need 2 additional days.'" },
            { value: "d", label: "'Quick question — does Friday actually work for the deadline?'" },
          ],
          correct: "c",
          explanation: "Professional communication is direct, clear, and solution-focused — not overly apologetic or vague.",
        },
        {
          id: "va_r2_q3",
          type: "single",
          question: "When is it appropriate to use 'Reply All' in a professional email thread?",
          options: [
            { value: "a", label: "Always — everyone in the thread should see all replies" },
            { value: "b", label: "Only when your reply is genuinely relevant to everyone on the thread" },
            { value: "c", label: "Never — always reply only to the sender" },
            { value: "d", label: "Only when you're CCing your supervisor" },
          ],
          correct: "b",
          explanation: "Unnecessary Reply All emails are a common workplace frustration. Only use it when your message adds value for all recipients.",
        },
        {
          id: "va_r2_q4",
          type: "single",
          question: "A client sends a long, rambling email with 5 different questions mixed in. How do you respond?",
          options: [
            { value: "a", label: "Answer only the most important question to keep your reply short" },
            { value: "b", label: "Copy-paste their questions and answer each one clearly with numbered responses" },
            { value: "c", label: "Call them instead — emails with multiple questions are too complicated" },
            { value: "d", label: "Ask them to resend the email more clearly before you respond" },
          ],
          correct: "b",
          explanation: "Numbered responses to multi-question emails are clear, organised, and easy to act on. They show professionalism and thoroughness.",
        },
        {
          id: "va_r2_q5",
          type: "text",
          question: "Write a professional email to a client (UK-based, formal industry) letting them know you've completed their monthly report, attaching it, and flagging one key insight you found. Sign off as their VA.",
          rubric: "Score based on: professional tone appropriate for UK formal business, clear subject line, concise body, specific mention of the insight (not vague), and professional sign-off.",
          placeholder: "Subject: ...\n\nDear [Client Name],\n\n...\n\nBest regards,\n[Your Name]\nVirtual Assistant",
        },
      ],
    },
  ],

  // ═══════════════════════════════════════════════════════════════════════════
  // COPYWRITER — Phase 1 resources
  // ═══════════════════════════════════════════════════════════════════════════
  copywriter: [
    {
      id: "cw_r1",
      jobId: "copywriter",
      phaseNumber: 1,
      skillMapped: "Persuasive Writing",
      title: "Copywriting Fundamentals — How to Write Copy That Sells",
      type: "video",
      url: "https://www.youtube.com/watch?v=2ydK1eV9DyQ",
      platform: "YouTube",
      channel: "Alex Cattoni",
      language: "English",
      estimatedHours: 1,
      accessibilityNotes: "Auto-captions available. Transcript available via YouTube.",
      questions: [
        {
          id: "cw_r1_q1",
          type: "single",
          question: "What is the fundamental difference between copywriting and content writing?",
          options: [
            { value: "a", label: "Copywriting is longer and more detailed" },
            { value: "b", label: "Copywriting is written to persuade a specific action; content writing is written to inform or entertain" },
            { value: "c", label: "Content writing is for social media only" },
            { value: "d", label: "There is no real difference — they are the same thing" },
          ],
          correct: "b",
          explanation: "Every word in copy serves a conversion goal. Content builds relationship and trust over time. Both matter — but the intent is different.",
        },
        {
          id: "cw_r1_q2",
          type: "single",
          question: "A client sells an online course for ₱3,500. Which headline is most likely to convert?",
          options: [
            { value: "a", label: "'Online Course Available Now for ₱3,500'" },
            { value: "b", label: "'Learn Everything About Digital Marketing'" },
            { value: "c", label: "'Get Your First Freelance Client in 30 Days — Even If You Have Zero Experience'" },
            { value: "d", label: "'Digital Marketing Course by Certified Expert'" },
          ],
          correct: "c",
          explanation: "The winning headline names a specific outcome (first client), sets a timeline (30 days), and removes an objection (zero experience).",
        },
        {
          id: "cw_r1_q3",
          type: "single",
          question: "What does 'writing to one person' mean in copywriting?",
          options: [
            { value: "a", label: "Only write for an audience of one — small businesses only" },
            { value: "b", label: "Write as if speaking directly to one specific ideal reader, using 'you' language and their exact struggles" },
            { value: "c", label: "Never use plural language like 'you all' or 'everyone'" },
            { value: "d", label: "Personalise every email with the reader's name" },
          ],
          correct: "b",
          explanation: "Copy that speaks to everyone speaks to no one. When a reader thinks 'this was written for me,' conversion rates increase dramatically.",
        },
        {
          id: "cw_r1_q4",
          type: "single",
          question: "You write a product description that lists 10 features of a laptop. Your client says it's not converting. What's most likely wrong?",
          options: [
            { value: "a", label: "The list is too long — shorten it to 5 features" },
            { value: "b", label: "Features don't sell — benefits do. You need to explain what each feature means for the buyer's life" },
            { value: "c", label: "Add more technical specifications to build credibility" },
            { value: "d", label: "The font is probably too small" },
          ],
          correct: "b",
          explanation: "Features = what it is. Benefits = what it does for you. '8-hour battery' is a feature. 'Work through a full day without hunting for outlets' is a benefit.",
        },
        {
          id: "cw_r1_q5",
          type: "text",
          question: "Write a short landing page headline + subheadline + 3-sentence body copy for a Filipino virtual assistant service called 'RemoteReady PH' that helps small business owners hire trained Filipino VAs.",
          rubric: "Score based on: headline specificity and benefit clarity, subheadline that supports the headline, body copy that addresses a real pain point, CTA that's specific and action-driven.",
          placeholder: "Headline: ...\n\nSubheadline: ...\n\nBody:\n...\n\nCTA: ...",
        },
      ],
    },
  ],

  // ═══════════════════════════════════════════════════════════════════════════
  // SEO WRITER — Phase 1 resources
  // ═══════════════════════════════════════════════════════════════════════════
  seo_writer: [
    {
      id: "seo_r1",
      jobId: "seo_writer",
      phaseNumber: 1,
      skillMapped: "SEO Fundamentals",
      title: "SEO for Beginners — Rank #1 on Google",
      type: "video",
      url: "https://www.youtube.com/watch?v=DvwS7cV9GmQ",
      platform: "YouTube",
      channel: "Ahrefs",
      language: "English",
      estimatedHours: 1.5,
      accessibilityNotes: "Auto-captions available. One of the best free SEO tutorials — highly recommended.",
      questions: [
        {
          id: "seo_r1_q1",
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
          id: "seo_r1_q2",
          type: "single",
          question: "What is the purpose of a meta description in SEO?",
          options: [
            { value: "a", label: "It directly boosts your ranking on Google" },
            { value: "b", label: "It's the snippet shown in search results — it influences click-through rate but not ranking directly" },
            { value: "c", label: "It's hidden from users and only read by search engines" },
            { value: "d", label: "It replaces the need for H1 headings" },
          ],
          correct: "b",
          explanation: "A compelling meta description improves CTR, which can indirectly improve rankings. Treat it like an ad for your page.",
        },
        {
          id: "seo_r1_q3",
          type: "single",
          question: "You're writing a 1,000-word article targeting the keyword 'how to start freelancing in the Philippines.' Where should the keyword appear?",
          options: [
            { value: "a", label: "Only in the title" },
            { value: "b", label: "Title, first 100 words, at least one H2 subheading, and naturally throughout" },
            { value: "c", label: "Every paragraph — keyword density should be above 5%" },
            { value: "d", label: "Only in the meta description" },
          ],
          correct: "b",
          explanation: "Keyword placement signals relevance without keyword stuffing. Natural integration across title, intro, and subheadings is the sweet spot.",
        },
        {
          id: "seo_r1_q4",
          type: "single",
          question: "What is 'search intent' and why does it matter for SEO writing?",
          options: [
            { value: "a", label: "It's the number of people searching for a keyword — higher intent means more searches" },
            { value: "b", label: "It's what the searcher actually wants to find — informational, navigational, or transactional. Your content must match it to rank." },
            { value: "c", label: "It's Google's algorithm for measuring keyword difficulty" },
            { value: "d", label: "It only matters for paid ads, not organic content" },
          ],
          correct: "b",
          explanation: "If someone searches 'how to make coffee' they want a guide, not a product page. Mismatching intent = low rankings regardless of optimization.",
        },
        {
          id: "seo_r1_q5",
          type: "text",
          question: "You're writing an article targeting: 'work from home jobs Philippines no experience'. Describe your approach: what search intent does this keyword have, how would you structure the article, and write the first 2 paragraphs of the article.",
          rubric: "Score based on: correct search intent identification (informational), logical article structure with H2s, intro paragraph that includes the keyword naturally and hooks the reader, and Filipino context relevance.",
          placeholder: "Search intent: ...\n\nArticle structure:\nH1: ...\nH2: ...\nH2: ...\n\nIntro (first 2 paragraphs):\n...",
        },
      ],
    },
  ],

  // ═══════════════════════════════════════════════════════════════════════════
  // CUSTOMER SUPPORT — Phase 1 resources
  // ═══════════════════════════════════════════════════════════════════════════
  customer_support: [
    {
      id: "cs_r1",
      jobId: "customer_support",
      phaseNumber: 1,
      skillMapped: "Empathy & Active Listening",
      title: "Customer Service Excellence — De-escalation and Empathy",
      type: "video",
      url: "https://www.youtube.com/watch?v=PSbNVLYO9rg",
      platform: "YouTube",
      channel: "LinkedIn Learning (free preview)",
      language: "English",
      estimatedHours: 1,
      accessibilityNotes: "Captions available. Clear audio, no background music.",
      questions: [
        {
          id: "cs_r1_q1",
          type: "single",
          question: "An angry customer says: 'This is ridiculous! I've been waiting 3 weeks for my order and nobody cares!' What is your first response?",
          options: [
            { value: "a", label: "'I understand your frustration. Let me pull up your order right now and find out exactly what happened.'" },
            { value: "b", label: "'Our shipping times are listed on the website. This is within our policy.'" },
            { value: "c", label: "'I'll transfer you to a supervisor immediately.'" },
            { value: "d", label: "'I'm so sorry! I promise it will never happen again!'" },
          ],
          correct: "a",
          explanation: "Acknowledge + Act. Don't make promises you can't keep, don't be defensive, and don't escalate immediately without trying to help first.",
        },
        {
          id: "cs_r1_q2",
          type: "single",
          question: "What is the LEAST appropriate thing to say to an upset customer?",
          options: [
            { value: "a", label: "'I completely understand why you're frustrated.'" },
            { value: "b", label: "'That's not my department.'" },
            { value: "c", label: "'Let me check on this for you right away.'" },
            { value: "d", label: "'I want to make sure we resolve this for you.'" },
          ],
          correct: "b",
          explanation: "'That's not my department' makes customers feel passed around and uncared for. Own the problem even if you need to involve others.",
        },
        {
          id: "cs_r1_q3",
          type: "single",
          question: "A customer calls in already having spoken to 2 other agents who couldn't help. They're very frustrated and repeat their story. What do you do?",
          options: [
            { value: "a", label: "Ask them to repeat their order number and start from scratch" },
            { value: "b", label: "Acknowledge that they've already explained this multiple times, show empathy for that frustration, then read the notes so they don't have to repeat" },
            { value: "c", label: "Transfer them to a supervisor immediately — they're too difficult" },
            { value: "d", label: "Tell them you'll call back once you review their case" },
          ],
          correct: "b",
          explanation: "Being asked to repeat your story multiple times is one of the top customer frustrations. Acknowledging it builds immediate trust.",
        },
        {
          id: "cs_r1_q4",
          type: "single",
          question: "What does 'active listening' mean in a customer support context?",
          options: [
            { value: "a", label: "Taking notes while the customer speaks" },
            { value: "b", label: "Listening without interrupting, reflecting back what you heard, and asking clarifying questions before jumping to solutions" },
            { value: "c", label: "Staying quiet until the customer finishes talking" },
            { value: "d", label: "Using a script to respond to common complaints" },
          ],
          correct: "b",
          explanation: "Active listening = listen + reflect + clarify. Many CS agents jump to solutions before fully understanding the problem — this creates frustration.",
        },
        {
          id: "cs_r1_q5",
          type: "text",
          question: "A customer chats in: 'I ordered a birthday cake for my daughter's party tomorrow and it just arrived completely crushed. I'm devastated. This was supposed to be special.' Write your full chat response — from your first message through to resolving the issue.",
          rubric: "Score based on: genuine empathy (not scripted), acknowledging the emotional weight (birthday, daughter), offering a concrete solution, appropriate urgency given the timeline (tomorrow), and warm professional tone.",
          placeholder: "Agent: ...\n\n[Continue the conversation as needed]",
        },
      ],
    },
  ],

  // ═══════════════════════════════════════════════════════════════════════════
  // DATA ENTRY — Phase 1 resources
  // ═══════════════════════════════════════════════════════════════════════════
  data_entry: [
    {
      id: "de_r1",
      jobId: "data_entry",
      phaseNumber: 1,
      skillMapped: "Spreadsheet Skills",
      title: "Google Sheets Full Tutorial for Beginners 2024",
      type: "video",
      url: "https://www.youtube.com/watch?v=FIkZ1sPmKNw",
      platform: "YouTube",
      channel: "Kevin Stratvert",
      language: "English",
      estimatedHours: 2,
      accessibilityNotes: "Auto-captions available. Step-by-step with clear on-screen demonstrations.",
      questions: [
        {
          id: "de_r1_q1",
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
          id: "de_r1_q2",
          type: "single",
          question: "What does the formula =IFERROR(VLOOKUP(A2,Sheet2!A:B,2,FALSE),\"Not Found\") do?",
          options: [
            { value: "a", label: "It searches for the value in A2 across all sheets and returns an error if found" },
            { value: "b", label: "It looks up the value in A2 in Sheet2's column A, returns the matching value from column B, and shows 'Not Found' if there's no match" },
            { value: "c", label: "It counts how many times A2 appears in Sheet2" },
            { value: "d", label: "It deletes rows where there is no match" },
          ],
          correct: "b",
          explanation: "VLOOKUP + IFERROR is a core data entry combo. IFERROR prevents ugly #N/A errors when there's no match.",
        },
        {
          id: "de_r1_q3",
          type: "single",
          question: "You notice that a column of dates has some as '01/15/2024', some as 'January 15, 2024', and some as '15-Jan-24'. Why is this a problem?",
          options: [
            { value: "a", label: "It's not a problem — all formats show the same date" },
            { value: "b", label: "It's a visual issue only — the data is still correct" },
            { value: "c", label: "Inconsistent date formats cause sorting errors, formula failures, and data import issues" },
            { value: "d", label: "The dates will automatically standardise when you save the file" },
          ],
          correct: "c",
          explanation: "Data consistency is a core accuracy principle. Mixed formats break formulas, sorting, and exports. Always standardise.",
        },
        {
          id: "de_r1_q4",
          type: "single",
          question: "What is the best way to prevent data entry errors in a spreadsheet that multiple people will fill in?",
          options: [
            { value: "a", label: "Trust everyone to follow the instructions document" },
            { value: "b", label: "Use Data Validation to restrict what can be entered in each cell (dropdowns, number ranges, etc.)" },
            { value: "c", label: "Lock all cells except the ones they need to fill" },
            { value: "d", label: "Review all entries manually after each person submits" },
          ],
          correct: "b",
          explanation: "Data validation prevents errors at entry — far more efficient than catching them after. This is standard in professional data management.",
        },
        {
          id: "de_r1_q5",
          type: "text",
          question: "You're given a Google Sheet with employee attendance data for 50 staff across 30 days. Your supervisor needs: total days present per employee, total absences, and a highlight of anyone with more than 5 absences. Describe your exact step-by-step process — which formulas would you use and how would you present the final output?",
          rubric: "Score based on: correct formula knowledge (COUNTIF, conditional formatting), logical step-by-step process, practical output presentation, and data accuracy awareness.",
          placeholder: "Step 1: ...\nStep 2: ...\nFormulas I'd use: ...\nFinal output format: ...",
        },
      ],
    },
  ],
};