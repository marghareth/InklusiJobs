"use client";

/**
 * LogoutModal.jsx
 * Place in: components/employer/LogoutModal.jsx
 *
 * Accessible confirmation modal before logging out.
 * WCAG 2.2 AA compliant:
 * - Focus trapped inside modal when open
 * - Escape key closes modal
 * - aria-modal, aria-labelledby, aria-describedby
 * - Minimum 44px touch targets
 * - Visible focus indicators
 */

import { useEffect, useRef } from "react";
import { useLogout } from "@/hooks/useLogout";

export default function LogoutModal({ isOpen, onClose }) {
  const { logoutCurrentDevice, logoutAllDevices, loading, error } = useLogout();
  const modalRef = useRef(null);
  const cancelRef = useRef(null);
  const primaryRef = useRef(null);

  // Focus the cancel button when modal opens (safer default)
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => cancelRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Focus trap + Escape key handler
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }

      if (e.key === "Tab") {
        const modal = modalRef.current;
        if (!modal) return;
        const focusable = modal.querySelectorAll(
          'button:not([disabled]), [href], input, [tabindex]:not([tabindex="-1"])'
        );
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last?.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first?.focus();
          }
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    // Prevent background scroll while modal is open
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed", inset: 0, zIndex: 10000,
          background: "rgba(26, 39, 68, 0.55)",
          backdropFilter: "blur(4px)",
          animation: "fadeIn 0.15s ease",
        }}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="logout-modal-title"
        aria-describedby="logout-modal-desc"
        style={{
          position: "fixed",
          top: "50%", left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 10001,
          background: "#FFFFFF",
          borderRadius: 20,
          padding: "36px 32px",
          width: "100%",
          maxWidth: 440,
          boxShadow: "0 24px 80px rgba(26,39,68,0.2)",
          animation: "slideUp 0.2s cubic-bezier(0.4,0,0.2,1)",
          fontFamily: "'Lexend', 'DM Sans', sans-serif",
        }}
      >
        {/* Icon */}
        <div style={{
          width: 56, height: 56, borderRadius: "50%",
          background: "#FEE2E2", display: "flex",
          alignItems: "center", justifyContent: "center",
          margin: "0 auto 20px",
        }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
            stroke="#DC2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            aria-hidden="true">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
        </div>

        {/* Title */}
        <h2
          id="logout-modal-title"
          style={{
            fontSize: 20, fontWeight: 900, color: "#1A2744",
            textAlign: "center", margin: "0 0 10px",
          }}
        >
          Log out of InklusiJobs?
        </h2>

        {/* Description */}
        <p
          id="logout-modal-desc"
          style={{
            fontSize: 14, color: "#6B7280", textAlign: "center",
            lineHeight: 1.7, margin: "0 0 28px",
          }}
        >
          You're about to log out of your employer account. Any unsaved changes will be lost. Confidential applicant data will remain secure.
        </p>

        {/* Error message */}
        {error && (
          <div
            role="alert"
            style={{
              background: "#FEE2E2", border: "1px solid #FCA5A5",
              borderRadius: 10, padding: "10px 14px",
              marginBottom: 16, fontSize: 13, color: "#DC2626",
              fontWeight: 600,
            }}
          >
            {error}
          </div>
        )}

        {/* Primary actions */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {/* Log out this device */}
          <button
            ref={primaryRef}
            onClick={logoutCurrentDevice}
            disabled={loading}
            aria-label="Log out of employer account on this device"
            style={{
              width: "100%", minHeight: 48, // WCAG 44px min
              padding: "12px 20px",
              borderRadius: 12, border: "none",
              background: loading
                ? "#9CA3AF"
                : "linear-gradient(135deg, #DC2626, #B91C1C)",
              color: "#fff",
              fontSize: 14, fontWeight: 800,
              cursor: loading ? "not-allowed" : "pointer",
              fontFamily: "inherit",
              display: "flex", alignItems: "center",
              justifyContent: "center", gap: 8,
              boxShadow: "0 4px 14px rgba(220,38,38,0.25)",
              transition: "opacity 0.15s",
            }}
            onMouseEnter={e => { if (!loading) e.currentTarget.style.opacity = "0.9"; }}
            onMouseLeave={e => e.currentTarget.style.opacity = "1"}
          >
            {loading ? (
              <>
                <span style={{
                  width: 16, height: 16,
                  border: "2px solid rgba(255,255,255,0.3)",
                  borderTopColor: "#fff",
                  borderRadius: "50%",
                  display: "inline-block",
                  animation: "spin 0.7s linear infinite",
                }} aria-hidden="true" />
                Logging out…
              </>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
                  strokeLinejoin="round" aria-hidden="true">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                  <polyline points="16 17 21 12 16 7"/>
                  <line x1="21" y1="12" x2="9" y2="12"/>
                </svg>
                Log Out
              </>
            )}
          </button>

          {/* Log out all devices */}
          <button
            onClick={logoutAllDevices}
            disabled={loading}
            aria-label="Log out of employer account on all devices for enhanced security"
            style={{
              width: "100%", minHeight: 48,
              padding: "12px 20px",
              borderRadius: 12,
              border: "2px solid #E5E7EB",
              background: "#FAFBFF",
              color: "#1A2744",
              fontSize: 13, fontWeight: 700,
              cursor: loading ? "not-allowed" : "pointer",
              fontFamily: "inherit",
              display: "flex", alignItems: "center",
              justifyContent: "center", gap: 8,
              transition: "border-color 0.15s, background 0.15s",
            }}
            onMouseEnter={e => {
              if (!loading) {
                e.currentTarget.style.borderColor = "#1A2744";
                e.currentTarget.style.background = "#EEF1FF";
              }
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = "#E5E7EB";
              e.currentTarget.style.background = "#FAFBFF";
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round"
              strokeLinejoin="round" aria-hidden="true">
              <rect x="2" y="3" width="20" height="14" rx="2"/>
              <line x1="8" y1="21" x2="16" y2="21"/>
              <line x1="12" y1="17" x2="12" y2="21"/>
            </svg>
            Log Out from All Devices
          </button>

          {/* Cancel */}
          <button
            ref={cancelRef}
            onClick={onClose}
            disabled={loading}
            aria-label="Cancel and stay logged in"
            style={{
              width: "100%", minHeight: 48,
              padding: "12px 20px",
              borderRadius: 12, border: "none",
              background: "transparent",
              color: "#6B7280",
              fontSize: 13, fontWeight: 600,
              cursor: loading ? "not-allowed" : "pointer",
              fontFamily: "inherit",
              transition: "color 0.15s",
            }}
            onMouseEnter={e => { if (!loading) e.currentTarget.style.color = "#1A2744"; }}
            onMouseLeave={e => e.currentTarget.style.color = "#6B7280"}
          >
            Cancel — Stay Logged In
          </button>
        </div>

        {/* Security note */}
        <p style={{
          fontSize: 11, color: "#9CA3AF",
          textAlign: "center", marginTop: 20, lineHeight: 1.6,
        }}>
          🔒 Your session data and applicant information are protected. Logging out clears all local session tokens.
        </p>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translate(-50%, -46%); } to { opacity: 1; transform: translate(-50%, -50%); } }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </>
  );
}