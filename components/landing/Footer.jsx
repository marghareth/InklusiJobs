"use client";

import Link from "next/link";

const footerStyles = `
  .footer-link {
    color: rgba(224,248,250,0.55);
    transition: color 0.15s;
    text-decoration: none;
    cursor: pointer;
    background: none;
    border: none;
    padding: 0;
    font-family: inherit;
    font-size: inherit;
    text-align: left;
  }
  .footer-link:hover {
    color: #E0F8FA;
  }
`;

// Platform links → actual pages; auth-gated items open the modal
const platformLinks = [
  { label: "Find Work",        href: "/find-work" },
  { label: "For Employers",    href: "/for-employers" },
  { label: "Skill Challenges", authRequired: true },
  { label: "Portfolio",        authRequired: true },
  { label: "Roadmap",          authRequired: true },
];

const companyLinks = [
  { label: "About",           href: "/about" },
  { label: "Learn",           href: "/learn" },
  { label: "Privacy Policy",  href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
  { label: "Contact",         authRequired: true },
];

function FooterLink({ item }) {
  if (item.authRequired) {
    return (
      <button
        className="footer-link text-sm font-['Lexend'] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7DDCE8] rounded"
        onClick={() => window.dispatchEvent(new CustomEvent("inklusijobs:open-modal"))}
      >
        {item.label}
      </button>
    );
  }
  return (
    <Link
      href={item.href}
      className="footer-link text-sm font-['Lexend'] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7DDCE8] rounded"
    >
      {item.label}
    </Link>
  );
}

export default function Footer() {
  return (
    <>
      <style>{footerStyles}</style>
      <footer
        className="py-16 px-6 md:px-20"
        style={{ background: "#0A2E38" }}
        role="contentinfo"
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">

            {/* Brand */}
            <div className="md:col-span-2">
              <div style={{ display: "inline-block", background: "#FFFFFF", borderRadius: 12, padding: "8px 14px", marginBottom: 16 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/logo.png"
                  alt="InklusiJobs"
                  style={{ height: "40px", width: "auto", display: "block" }}
                />
              </div>
              <p
                className="text-sm font-['Lexend'] leading-relaxed max-w-xs mb-4"
                style={{ color: "rgba(224,248,250,0.65)" }}
              >
                Helping Persons with Disabilities become verified, job-ready professionals in the Philippines.
              </p>
              <div className="flex flex-wrap gap-2">
                <span
                  className="text-xs font-semibold rounded-full px-3 py-1"
                  style={{ background: "rgba(52,211,153,0.15)", color: "#34D399", border: "1px solid rgba(52,211,153,0.3)" }}
                >
                  ✓ WCAG 2.1 AA
                </span>
                <span
                  className="text-xs font-semibold rounded-full px-3 py-1"
                  style={{ background: "rgba(125,220,232,0.12)", color: "#7DDCE8", border: "1px solid rgba(125,220,232,0.25)" }}
                >
                  🇵🇭 RA 7277 Aligned
                </span>
              </div>
            </div>

            {/* Platform links */}
            <div>
              <h3
                className="text-sm font-semibold font-['Lexend'] uppercase tracking-widest mb-4"
                style={{ color: "#E0F8FA" }}
              >
                Platform
              </h3>
              <ul className="space-y-2" role="list">
                {platformLinks.map((item) => (
                  <li key={item.label}>
                    <FooterLink item={item} />
                  </li>
                ))}
              </ul>
            </div>

            {/* Company links */}
            <div>
              <h3
                className="text-sm font-semibold font-['Lexend'] uppercase tracking-widest mb-4"
                style={{ color: "#E0F8FA" }}
              >
                Company
              </h3>
              <ul className="space-y-2" role="list">
                {companyLinks.map((item) => (
                  <li key={item.label}>
                    <FooterLink item={item} />
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div
            className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4"
            style={{ borderTop: "1px solid rgba(125,220,232,0.12)" }}
          >
            <p className="text-sm font-['Lexend']" style={{ color: "rgba(224,248,250,0.35)" }}>
              © 2026 InklusiJobs · SDG 8 — Decent Work & Economic Growth
            </p>
            <p className="text-sm font-['Lexend']" style={{ color: "rgba(224,248,250,0.35)" }}>
              Built with ♿ accessibility first
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}