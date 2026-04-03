<div align="center">

# 💼 InklusiJobs

### *Bridging the gap between capability and opportunity for Persons with Disabilities in the Philippines.*

[![Live Demo](https://img.shields.io/badge/🚀%20Live%20Demo-inklusi--jobs.vercel.app-4CAF50?style=for-the-badge)](https://inklusi-jobs.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Firebase](https://img.shields.io/badge/Firebase-Auth%20%2B%20Firestore-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![SDG 8](https://img.shields.io/badge/SDG%208-Decent%20Work%20%26%20Economic%20Growth-E5243B?style=for-the-badge)](https://sdgs.un.org/goals/goal8)
[![WCAG 2.1 AA](https://img.shields.io/badge/WCAG%202.1-AA%20Compliant-005A9C?style=for-the-badge)](https://www.w3.org/WAI/WCAG21/quickref/)

</div>

---

> An accessibility-first platform that helps Persons with Disabilities become verified, job-ready professionals through personalized learning paths, portfolio-based challenges, and AI-driven skill and identity verification.

---

## 📋 Table of Contents

- [🌐 Live Demo](#-live-demo)
- [🔍 Problem Statement](#-problem-statement)
- [💡 Solution](#-solution)
- [✨ Key Features](#-key-features)
- [🛡️ PWD Identity Verification System](#%EF%B8%8F-pwd-identity-verification-system)
- [🛠️ Tech Stack](#%EF%B8%8F-tech-stack)
- [🚀 Getting Started](#-getting-started)
- [🔐 Environment Variables](#-environment-variables)
- [🔄 User Flows](#-user-flows)
- [🏆 What Makes InklusiJobs Different](#-what-makes-inklusijobs-different)
- [📊 Existing Alternatives and Gaps](#-existing-alternatives-and-gaps)
- [👥 Team](#-team)

---

## 🌐 Live Demo

**🔗 [https://inklusi-jobs.vercel.app](https://inklusi-jobs.vercel.app)**

| Role | How to Access |
|---|---|
| 👤 Job Seeker (PWD) | Sign up → Select **Worker** → Complete onboarding |
| 🏢 Employer | Sign up → Select **Employer** → Complete company profile |
| 🛡️ Admin | `/admin/review-queue` — PWD verification review dashboard |

---

## 🔍 Problem Statement

Despite the Magna Carta for Persons with Disabilities (RA 7277), many PWDs in the Philippines remain unemployed — not due to lack of ability, but due to a persistent skills and experience gap. Employers require prior experience even for entry-level roles, creating a cycle where capable workers cannot gain experience because they are not hired, and cannot be hired because they lack experience.

Certificates from online courses do not equate to real-world competence. PWDs struggle to prove their skills without work history or credible portfolios, while employers lack reliable ways to verify whether applicants can actually perform the job.

There is also currently no scalable, centralized system for verifying PWD identity in the Philippines. Fake PWD IDs remain a known and widespread problem that undermines trust across employment, retail, healthcare, and government services — a critical infrastructure gap that InklusiJobs directly addresses.

### Current Pain Points

| Pain Point | Description |
|---|---|
| 🔀 Mismatched Opportunities | Job platforms are not designed to highlight the skills and adaptable working style of PWDs, leading to mismatches with employer needs |
| 📉 Skill Gap Anxiety | Many PWDs are eager to work but lack a clear, structured path to bridge the gap between their current abilities and job requirements |
| 📄 Proof-of-Skill Drawback | Without traditional work history, it is difficult to build a compelling resume or portfolio that demonstrates real capability |
| 🏢 Employer Hiring Challenges | Employers struggle to find and confidently hire skilled workers from the PWD community due to a lack of verified skills and portfolio evidence |
| 🪪 PWD Identity Verification Gap | No reliable, scalable system exists for verifying PWD identity in the Philippines, enabling fraud that undermines trust across sectors |

---

## 💡 Solution

InklusiJobs is an end-to-end ecosystem connecting three key stakeholders: job seekers (primarily PWDs), employers, and an AI-powered verification system that bridges the trust gap between them.

The platform integrates personalized AI-generated learning roadmaps, hands-on portfolio-building challenges with automated evaluation, inclusive job matching, and multi-layer PWD identity verification — all within a single, WCAG 2.1 AA-compliant interface that dynamically adapts to the user's specific accessibility needs.

```
PWD Job Seeker  ──▶  Onboarding  ──▶  AI Roadmap  ──▶  Portfolio Challenges
                                                               │
                                                     AI Rubric Evaluation
                                                               │
                          Employer  ◀──  Verified Profile  ◀──┘
                              │
                    PWD Verification Badge
                    (Multi-layer AI + Human Review)
```

---

## ✨ Key Features

### 👤 For Job Seekers (PWDs)

| Feature | Description |
|---|---|
| **Guided Multi-Step Onboarding** | Structured profile creation covering technical skills, soft skills, career goals, and optional disability disclosure — gives the AI sufficient context for personalized recommendations |
| **AI Skills Gap Analysis** | Powered by the Gemini API; identifies specific skill gaps with actionable, encouraging insights tailored to the user's target role |
| **Interactive Visual Roadmap** | Personalized learning pathway displayed as an interactive visual timeline with phases from Beginner to Advanced, recommended resources, and estimated completion timeframes |
| **Portfolio Challenge Library** | Curated practical tasks spanning multiple skill categories and difficulty levels, including both pre-written and AI-generated challenges that simulate real work scenarios |
| **Rubric-Based AI Evaluation** | Automated quality assessment with detailed feedback; each challenge is evaluated against strict rubrics for quality, completeness, and technical accuracy before being added to the portfolio |
| **Badge & Certification System** | Visual recognition of verified skills with milestone achievement ceremonies |
| **Public Portfolio Pages** | Shareable profile URLs showcasing verified work, AI evaluation scores, and demonstrated skills — a credential-free alternative to traditional resumes |
| **PWD Identity Verification** | Multi-layer system granting a "PWD Verified" badge visible to all employers on the platform |

### 🏢 For Employers

| Feature | Description |
|---|---|
| **Advanced Candidate Search** | Filter the verified talent pool by specific skills, availability, work arrangement preference, and disability type |
| **Work Request System** | Streamlined hiring communication with in-platform notifications between employers and candidates |
| **Employer Dashboard** | Centralized interface for candidate management, job posting, portfolio review, and hiring workflow |
| **Inclusive Employer Badge** | A verified badge issued upon hiring through the platform — suitable for websites, job postings, and LinkedIn; supports CSR and employer branding |

### 🌐 Platform-Wide

| Feature | Description |
|---|---|
| **Dual Dashboards** | Fully separate, role-based interfaces for workers (progress, portfolio, roadmap) and employers (candidates, listings, pipeline) |
| **Messaging System** | In-platform real-time chat between job seekers and employers with conversation history and notification support |
| **Accessibility Panel** | Dynamic UI adjustments based on the user's disability profile; strict WCAG 2.1 AA adherence including screen reader support, keyboard navigation, high contrast modes, and skip links |

---

## 🛡️ PWD Identity Verification System

One of InklusiJobs' core differentiators is its multi-layer PWD identity verification system, which directly addresses the widespread problem of fake PWD IDs in the Philippines. This system is built as both an internal platform feature and a foundation for a licensable B2B product.

### ⚙️ How It Works

```
Step 1: Multi-Document Upload
   └── PWD ID (front + back) + supporting document (medical cert / barangay cert / PhilHealth)

Step 2: Gemini Vision AI Analysis
   └── OCR extraction → field validation → LGU format check → forgery flag detection

Step 3: Browser Liveness Check
   └── Real-time selfie holding PWD ID (KYC-standard, no special hardware required)

Step 4: Duplicate ID Detection
   └── PWD ID number cross-checked against all Firestore records

Step 5: Human Review Queue
   └── Flagged submissions routed to admin dashboard → Approve / Reject / Request Resubmission
        └── Only passes get the "PWD Verified" badge ✅
```

### 🗺️ Verification Roadmap

| Phase | Timeline | Target |
|---|---|---|
| ✅ Short Term | MVP (Current) | Multi-document upload with Gemini Vision AI analysis and human review queue |
| 🔄 Medium Term | Post-launch | Partnership with NCDA and select LGUs to cross-reference ID numbers against official PWD registries |
| 🔮 Long Term | Future | PhilSys (Philippine National ID) integration for fully digital, government-backed verification |

### 🏦 Verification-as-a-Service (VaaS)

Beyond the employment platform, InklusiJobs is designed to operate a licensable B2B verification product. Every business that offers PWD discounts or must comply with RA 7277 — including SM, Robinsons, Mercury Drug, Jollibee, airlines, and hospitals — currently has no reliable way to verify whether a PWD ID is legitimate.

InklusiJobs addresses this gap by enabling businesses to verify PWD status instantly at point-of-sale, during online transactions, or at service counters through a simple API integration. This is not a future plan — it is a core component of the InklusiJobs business model from launch.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 16, React 19, JavaScript |
| **Styling** | Tailwind CSS v4 |
| **UI Components** | shadcn/ui, Lucide React, React Dropzone |
| **Authentication** | Firebase Authentication (email/password + Google OAuth) |
| **Database** | Firestore (Firebase) |
| **File Storage** | Firebase Storage |
| **AI — Text** | Google Gemini API (skill gap analysis, roadmap generation, challenge evaluation) |
| **AI — Vision** | Google Gemini Vision API (OCR, PWD document analysis, formatting validation) |
| **AI — Fallback** | OpenRouter API (alternative model routing for reliability) |
| **PWD Verification** | Gemini Vision API + Browser Camera API (liveness check) + Firestore (duplicate detection) |
| **PDF Export** | jsPDF + html2canvas |
| **Deployment** | Vercel |
| **Dev Tools** | VS Code, Git / GitHub, npm / pnpm, Figma, Canva |

> ⚠️ **Implementation Note:** The original proposal referenced Supabase for authentication and database. The final implemented system uses **Firebase Authentication** and **Firestore** instead.

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or pnpm
- A Firebase project with **Authentication**, **Firestore**, and **Storage** enabled
- A Google Gemini API key (with Vision API access)
- An OpenRouter API key (optional, used as fallback)

> ⚠️ **Important — Firebase Domain Authorization:** After deploying to Vercel, you must add your Vercel domain to Firebase's authorized domains list. Go to **Firebase Console → Authentication → Settings → Authorized domains** and add your deployment URL (e.g. `your-app.vercel.app`). Without this, sign-up and Google OAuth will not work on the deployed site.

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/marghareth/InklusiJobs.git
   cd InklusiJobs
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Download face detection models** (required for liveness check)
   ```bash
   node scripts/download-face-models.js
   ```

4. **Configure environment variables**

   Create a `.env.local` file in the root directory. See the [Environment Variables](#-environment-variables) section below.

5. **Test your connections** (optional but recommended)
   ```bash
   node scripts/test-connections.js
   ```

6. **Run the development server**
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

7. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔐 Environment Variables

Create a `.env.local` file in the project root with the following variables:

> **Never commit `.env.local` to version control.** It is listed in `.gitignore` by default.

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# Google Gemini API (text + Vision)
GEMINI_API_KEY=

# OpenRouter API (fallback AI routing)
OPENROUTER_API_KEY=
```

> All `NEXT_PUBLIC_` variables are exposed to the browser. Never commit your `.env.local` file to version control.

---

## 🔄 User Flows

### 👤 Job Seeker (PWD)

```
Sign Up / Google OAuth
       │
       ▼
Select Role: Worker
       │
       ▼
Multi-Step Onboarding (personal info, skills, career goals, disability profile)
       │
       ▼
Skill Assessment Quiz
       │
       ▼
AI-Generated Learning Roadmap (Gemini API)
       │
       ├──▶ [Optional] PWD ID Verification → "PWD Verified" badge
       │
       ▼
Complete Portfolio Challenges → AI Rubric Evaluation
       │
       ▼
Browse Job Listings (filtered by skill match %)
       │
       ▼
One-Click Apply (portfolio auto-shared) → Message Employer
```

### 🏢 Employer

```
Sign Up / Google OAuth
       │
       ▼
Select Role: Employer
       │
       ▼
Employer Onboarding (company profile, inclusive hiring preferences)
       │
       ▼
Post Job Listings (skills, work arrangement, compensation, accommodations)
       │
       ▼
Browse & Search Verified Candidate Pool
       │
       ▼
Review Portfolio Pages (challenge scores, AI ratings, verified badges)
       │
       ▼
Message Candidates → Mark Position Filled → Earn Inclusive Employer Badge
```

---

## 🏆 What Makes InklusiJobs Different

| Differentiator | Details |
|---|---|
| **End-to-End Platform** | Learning roadmaps, AI-evaluated portfolio challenges, job matching, and PWD identity verification integrated into one platform — no switching between tools |
| **Evidence-Based Portfolios** | Skills are demonstrated through completed, AI-graded challenges rather than stated credentials, removing the traditional work history barrier entirely |
| **Multi-Layer PWD Verification** | The only platform in the Philippines combining Gemini Vision AI document analysis, browser-based liveness detection, duplicate ID checking, and human review |
| **Skills-First Employer Presentation** | Employer-facing profiles lead with verified skill scores and challenge outcomes before any disability context appears — framing PWD hiring as a talent decision, not a charitable one |
| **Built-In Employer Value Proposition** | Reduces time-to-hire, surfaces pre-verified candidates, supports RA 7277 compliance, and helps employers maximize the 25% additional tax deduction under the Magna Carta for PWDs |
| **Verification-as-a-Service Infrastructure** | The verification system is architected from day one to be licensable to retailers, hospitals, airlines, and institutions — making InklusiJobs not just a job platform, but PWD verification infrastructure |

---

## 📊 Existing Alternatives and Gaps

| Platform | Category | Gap |
|---|---|---|
| PWD-E Inclusive Job Matching | PWD Employment | No skill development, portfolio building, or AI verification |
| Workera / Glider AI | Skill Assessment | No inclusivity features; no end-to-end learning-to-employment support |
| LinkedIn / Jobstreet / Upwork | General Employment | Relies on traditional credentials and work history; creates barriers for PWDs without conventional backgrounds |
| LinkedIn Learning / roadmap.sh | Upskilling | No AI-verified portfolio challenges, job matching, or PWD-specific accessibility features |
| Any existing platform | PWD Verification | No scalable, AI-assisted PWD identity verification infrastructure currently exists in the Philippines |

---

## 👥 Team

Built by a team of five for a hackathon under **SDG 8 — Decent Work & Economic Growth**.

| Name | Role |
|---|---|
| Mary Marghareth Bueno | Team Lead & Developer |
| Julianni Jade Cuartero | Developer |
| Stephanie Comendador | Developer |
| Irish Francisco | Developer |
| Methuselah Noreen Presbitero | Developer |

---

<div align="center">

**🌐 [inklusi-jobs.vercel.app](https://inklusi-jobs.vercel.app/)**

*InklusiJobs — Built for PWDs.*

[![SDG 8](https://img.shields.io/badge/SDG%208-Decent%20Work%20%26%20Economic%20Growth-E5243B?style=flat-square)](https://sdgs.un.org/goals/goal8)
[![WCAG 2.1 AA](https://img.shields.io/badge/WCAG%202.1-AA%20Compliant-005A9C?style=flat-square)](https://www.w3.org/WAI/WCAG21/quickref/)
[![Made in Philippines](https://img.shields.io/badge/Made%20in-Philippines%20🇵🇭-0038A8?style=flat-square)](https://inklusi-jobs.vercel.app)

</div>