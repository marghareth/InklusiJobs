"use client";

/**
 * LogoutButton.jsx
 * Place in: components/employer/LogoutButton.jsx
 *
 * Drop-in logout button for the employer dashboard profile dropdown.
 * Opens LogoutModal on click.
 *
 * Usage in EmployerDashboard profile dropdown:
 *   import LogoutButton from "@/components/employer/LogoutButton";
 *   <LogoutButton />
 */

import { useState } from "react";
import LogoutModal from "./LogoutModal";

export default function LogoutButton({ style }) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setModalOpen(true)}
        aria-label="Log out of employer account"
        aria-haspopup="dialog"
        style={{
          width: "100%",
          padding: "12px 18px",
          minHeight: 44, // WCAG minimum touch target
          background: "none",
          border: "none",
          fontSize: 13,
          color: "#DC2626",
          fontWeight: 700,
          textAlign: "left",
          cursor: "pointer",
          fontFamily: "inherit",
          display: "flex",
          alignItems: "center",
          gap: 8,
          borderRadius: 8,
          transition: "background 0.15s",
          ...style,
        }}
        onMouseEnter={e => e.currentTarget.style.background = "#FEE2E2"}
        onMouseLeave={e => e.currentTarget.style.background = "none"}
        onFocus={e => e.currentTarget.style.outline = "3px solid #0023FF"}
        onBlur={e => e.currentTarget.style.outline = "none"}
      >
        {/* Logout icon */}
        <svg
          width="15" height="15" viewBox="0 0 24 24"
          fill="none" stroke="currentColor"
          strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
          <polyline points="16 17 21 12 16 7"/>
          <line x1="21" y1="12" x2="9" y2="12"/>
        </svg>
        Log Out
      </button>

      <LogoutModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
}