"use client";

/**
 * SkipLink.jsx
 * WCAG 2.2 Success Criterion 2.4.1 — Bypass Blocks
 *
 * Provides keyboard users a way to skip repetitive navigation
 * and jump directly to main content. Visually hidden until focused.
 *
 * Usage: Place as the FIRST element inside <body> in layout.jsx
 */

export default function SkipLink() {
  return (
    <>
      {/* Primary skip link — jumps to main content */}
      <a
        href="#main-content"
        className="skip-link"
        style={{
          position: "absolute",
          top: -100,
          left: 16,
          zIndex: 99999,
          padding: "12px 20px",
          background: "#0023FF",
          color: "#ffffff",
          fontWeight: 700,
          fontSize: 14,
          borderRadius: "0 0 10px 10px",
          textDecoration: "none",
          border: "2px solid #fff",
          boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
          transition: "top 0.15s",
          fontFamily: "inherit",
          // Visible on focus via CSS below
        }}
        onFocus={e => e.currentTarget.style.top = "0"}
        onBlur={e => e.currentTarget.style.top = "-100px"}
      >
        Skip to main content
      </a>

      {/* Secondary skip link — jumps to navigation */}
      <a
        href="#main-nav"
        style={{
          position: "absolute",
          top: -100,
          left: 200,
          zIndex: 99999,
          padding: "12px 20px",
          background: "#1A2744",
          color: "#ffffff",
          fontWeight: 700,
          fontSize: 14,
          borderRadius: "0 0 10px 10px",
          textDecoration: "none",
          border: "2px solid #fff",
          boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
          transition: "top 0.15s",
          fontFamily: "inherit",
        }}
        onFocus={e => e.currentTarget.style.top = "0"}
        onBlur={e => e.currentTarget.style.top = "-100px"}
      >
        Skip to navigation
      </a>
    </>
  );
}