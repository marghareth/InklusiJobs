"use client";

import { useAuthModalContext } from "@/components/landing/AuthModalContext";

/**
 * OpenModalButton — renders a button that opens the auth/role selector modal.
 * Props:
 *   label     — button text (default: "Get Started")
 *   className — optional Tailwind classes
 *   style     — optional inline styles
 */
export default function OpenModalButton({ label = "Get Started", className = "", style = {} }) {
  const { openRoleSelector } = useAuthModalContext();

  return (
    <button
      onClick={openRoleSelector}
      className={className}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Arial, Helvetica, sans-serif",
        fontWeight: 700,
        fontSize: 15,
        padding: "13px 30px",
        borderRadius: 12,
        border: "none",
        background: "#0F5C6E",
        color: "#FFFFFF",
        boxShadow: "0 4px 20px rgba(15,92,110,0.35)",
        cursor: "pointer",
        transition: "transform 0.15s, box-shadow 0.15s",
        ...style,
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.boxShadow = "0 8px 28px rgba(15,92,110,0.45)";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 4px 20px rgba(15,92,110,0.35)";
      }}
    >
      {label}
    </button>
  );
}