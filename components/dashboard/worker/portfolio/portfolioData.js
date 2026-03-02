import { storage } from "@/lib/storage";
import { auth } from "@/lib/firebase";   // ✅ ADD THIS IMPORT

export function getUserData() {
  const { profile, disability, workPreference } = storage.get();
  const firstName = profile.firstName || profile.name?.split(" ")[0] || "";
  const lastName  = profile.lastName  || profile.name?.split(" ").slice(1).join(" ") || "";
  const fullName  = profile.name      || `${firstName} ${lastName}`.trim() || "Your Name";

  // ✅ Fall back to Firebase Auth email if storage email is missing or is the placeholder
  const storageEmail = profile.email;
  const firebaseEmail = auth.currentUser?.email || "";
  const email = (storageEmail && storageEmail !== "your@email.com")
    ? storageEmail
    : firebaseEmail || "—";

  return {
    name:        fullName,
    initials:    profile.avatarInitials || getInitials(firstName, lastName),
    email,                               // ✅ uses resolved email
    phone:       profile.contactNumber  || "—",
    age:         profile.age            || "—",
    address:     profile.address        || "—",
    disability:  disability?.primaryType || disability?.types?.[0] || "Not specified",
    pwdIdNo:     disability?.pwdId       || "—",
    field:       workPreference?.industry || "General",
    memberSince: formatMemberSince(),
    lastUpdated: formatNow(),
    prevUpdate:  "—",
  };
}

function getInitials(firstName, lastName) {
  const f = (firstName || "").trim()[0] || "";
  const l = (lastName  || "").trim()[0] || "";
  return (f + l).toUpperCase() || "YN";
}

function formatMemberSince() {
  return new Date().toLocaleString("en-US", { month: "long", year: "numeric" });
}

function formatNow() {
  const now  = new Date();
  const date = now.toLocaleString("en-US", { month: "long", day: "numeric", year: "numeric" });
  const time = now.toLocaleString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
  return `${date} · ${time}`;
}

export const SKILLS_DATA = [
  { name: "HTML & CSS",     pct: 92, tag: "Frontend"  },
  { name: "JavaScript",    pct: 78, tag: "Core"       },
  { name: "React",         pct: 71, tag: "Framework"  },
  { name: "Accessibility", pct: 88, tag: "Specialty"  },
  { name: "UI/UX Design",  pct: 65, tag: "Design"     },
  { name: "Node.js",       pct: 55, tag: "Backend"    },
];

export const CHALLENGES_DATA = [
  { id: "c1", title: "Build a RESTful API with Authentication", status: "ongoing",   pct: 65,  pts: 250, tag: "Backend",  date: "Feb 2025", desc: "Secure backend API with JWT authentication, role-based access control, and data validation." },
  { id: "c2", title: "Accessible E-Commerce Dashboard",         status: "completed", pct: 100, pts: 300, tag: "Frontend", date: "Jan 2025", desc: "Built a fully accessible e-commerce admin dashboard meeting WCAG 2.1 AA standards." },
  { id: "c3", title: "React Component Library",                 status: "completed", pct: 100, pts: 220, tag: "Frontend", date: "Jan 2025", desc: "Created a reusable accessible component library with Storybook documentation." },
  { id: "c4", title: "Database Design Fundamentals",            status: "completed", pct: 100, pts: 180, tag: "Backend",  date: "Dec 2024", desc: "Designed normalized relational database schemas for a multi-tenant SaaS application." },
  { id: "c5", title: "CSS Animations & Microinteractions",      status: "completed", pct: 100, pts: 150, tag: "Frontend", date: "Dec 2024", desc: "Implemented performant, accessible CSS animations that respect prefers-reduced-motion." },
  { id: "c6", title: "Node.js REST API Basics",                 status: "completed", pct: 100, pts: 200, tag: "Backend",  date: "Nov 2024", desc: "Built a basic REST API using Node.js and Express with proper error handling and validation." },
];

export const INIT_BIO = "Passionate frontend developer with a love for building accessible, inclusive web experiences. I believe great software should work for everyone — and I build it that way.";

export const INIT_HEADLINE = "Frontend Developer · Accessibility Advocate";

export function getInitSections(name = "") {
  const slug = name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "")
    .replace(/[^a-z0-9]/g, "");

  return [
    {
      id: "sec_links", type: "links", title: "Links & Profiles",
      items: [
        { id: "lk1", label: "GitHub",   url: `https://github.com/${slug || "your-username"}` },
        { id: "lk2", label: "LinkedIn", url: `https://linkedin.com/in/${slug || "your-name"}` },
        { id: "lk3", label: "Facebook", url: `https://facebook.com/${slug || "your-name"}` },
      ],
    },
    {
      id: "sec_about", type: "text", title: "Professional Summary",
      content: "I bring a unique perspective to frontend engineering — I use assistive technology every day, which shapes how deeply I approach accessibility. Currently seeking hybrid or remote roles in Metro Manila. Available for interviews starting March 2025.",
    },
  ];
}