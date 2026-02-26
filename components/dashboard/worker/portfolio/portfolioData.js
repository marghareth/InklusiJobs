// USER DATA
export const USER = {
  name: "Sarah Johnson",
  initials: "SJ",
  email: "sarah.johnson@email.com",
  phone: "+63 917 123 4567",
  age: 26,
  birthday: "March 14, 1998",
  address: "Quezon City, Metro Manila, Philippines",
  disability: "Mobility / Physical",
  pwdIdNo: "QC-2023-00412",
  field: "Technology",
  memberSince: "January 2024",
  lastUpdated: "February 24, 2025 · 3:41 PM",
  prevUpdate: "February 10, 2025",
};

// SKILLS DATA
export const SKILLS_DATA = [
  { name: "HTML & CSS",    pct: 92, tag: "Frontend"  },
  { name: "JavaScript",   pct: 78, tag: "Core"       },
  { name: "React",        pct: 71, tag: "Framework"  },
  { name: "Accessibility",pct: 88, tag: "Specialty"  },
  { name: "UI/UX Design", pct: 65, tag: "Design"     },
  { name: "Node.js",      pct: 55, tag: "Backend"    },
];

// CHALLENGES DATA
export const CHALLENGES_DATA = [
  {
    id: "c1",
    title: "Build a RESTful API with Authentication",
    status: "ongoing",
    pct: 65,
    pts: 250,
    tag: "Backend",
    date: "Feb 2025",
    desc: "Secure backend API with JWT authentication, role-based access control, and data validation.",
  },
  {
    id: "c2",
    title: "Accessible E-Commerce Dashboard",
    status: "completed",
    pct: 100,
    pts: 300,
    tag: "Frontend",
    date: "Jan 2025",
    desc: "Built a fully accessible e-commerce admin dashboard meeting WCAG 2.1 AA standards.",
  },
  {
    id: "c3",
    title: "React Component Library",
    status: "completed",
    pct: 100,
    pts: 220,
    tag: "Frontend",
    date: "Jan 2025",
    desc: "Created a reusable accessible component library with Storybook documentation.",
  },
  {
    id: "c4",
    title: "Database Design Fundamentals",
    status: "completed",
    pct: 100,
    pts: 180,
    tag: "Backend",
    date: "Dec 2024",
    desc: "Designed normalized relational database schemas for a multi-tenant SaaS application.",
  },
  {
    id: "c5",
    title: "CSS Animations & Microinteractions",
    status: "completed",
    pct: 100,
    pts: 150,
    tag: "Frontend",
    date: "Dec 2024",
    desc: "Implemented performant, accessible CSS animations that respect prefers-reduced-motion.",
  },
  {
    id: "c6",
    title: "Node.js REST API Basics",
    status: "completed",
    pct: 100,
    pts: 200,
    tag: "Backend",
    date: "Nov 2024",
    desc: "Built a basic REST API using Node.js and Express with proper error handling and validation.",
  },
];

// INITIAL BIO
export const INIT_BIO =
  "Passionate frontend developer with a love for building accessible, inclusive web experiences. I believe great software should work for everyone — and I build it that way.";

// INITIAL HEADLINE
export const INIT_HEADLINE = "Frontend Developer · Accessibility Advocate";

// INITIAL SECTIONS
export const INIT_SECTIONS = [
  {
    id: "sec_links",
    type: "links",
    title: "Links & Profiles",
    items: [
      { id: "lk1", label: "GitHub",   url: "https://github.com/sarahjohnson" },
      { id: "lk2", label: "LinkedIn", url: "https://linkedin.com/in/sarahjohnson" },
      { id: "lk3", label: "Facebook", url: "https://facebook.com/sarahjohnson.dev" },
    ],
  },
  {
    id: "sec_about",
    type: "text",
    title: "Professional Summary",
    content:
      "I bring a unique perspective to frontend engineering — I use assistive technology every day, which shapes how deeply I approach accessibility. Currently seeking hybrid or remote roles in Metro Manila. Available for interviews starting March 2025.",
  },
];