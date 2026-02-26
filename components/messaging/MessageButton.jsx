"use client";
import { useChatPopup } from "./ChatPopupContext";

/**
 * Drop this button anywhere — JobCard, worker profile, employer profile, etc.
 *
 * Usage:
 *   <MessageButton
 *     participant={{
 *       id: "user-123",
 *       name: "Maria Santos",
 *       role: "employer",           // "employer" | "worker"
 *       company: "TechCorp PH",     // optional
 *       avatar_initials: "MS",
 *       is_online: true,
 *     }}
 *     variant="primary"   // "primary" | "secondary" | "icon"
 *   />
 */
export default function MessageButton({ participant, variant = "secondary", className = "" }) {
  const { openChat } = useChatPopup();

  const handleClick = (e) => {
    e.stopPropagation(); // prevent triggering parent card clicks
    e.preventDefault();
    openChat(participant);
  };

  // Icon only (small, for tight spaces like cards)
  if (variant === "icon") {
    return (
      <button
        onClick={handleClick}
        title={`Message ${participant.name}`}
        style={{
          width: 34, height: 34, borderRadius: 9,
          background: "rgba(139,92,246,0.12)",
          border: "1px solid rgba(139,92,246,0.2)",
          cursor: "pointer", display: "flex",
          alignItems: "center", justifyContent: "center",
          transition: "all 0.15s",
          flexShrink: 0,
        }}
        onMouseEnter={e => {
          e.currentTarget.style.background = "rgba(139,92,246,0.25)";
          e.currentTarget.style.borderColor = "rgba(139,92,246,0.4)";
        }}
        onMouseLeave={e => {
          e.currentTarget.style.background = "rgba(139,92,246,0.12)";
          e.currentTarget.style.borderColor = "rgba(139,92,246,0.2)";
        }}
      >
        <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="#a78bfa">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      </button>
    );
  }

  // Primary — solid violet (use on profile pages)
  if (variant === "primary") {
    return (
      <button
        onClick={handleClick}
        style={{
          display: "inline-flex", alignItems: "center", gap: 7,
          padding: "9px 18px", borderRadius: 10,
          background: "#7c3aed", border: "none",
          color: "white", fontSize: 13, fontWeight: 600,
          cursor: "pointer", transition: "background 0.15s",
          flexShrink: 0,
        }}
        onMouseEnter={e => e.currentTarget.style.background = "#6d28d9"}
        onMouseLeave={e => e.currentTarget.style.background = "#7c3aed"}
      >
        <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
        Message
      </button>
    );
  }

  // Secondary — outlined (default, use on cards)
  return (
    <button
      onClick={handleClick}
      style={{
        display: "inline-flex", alignItems: "center", gap: 7,
        padding: "7px 14px", borderRadius: 9,
        background: "rgba(139,92,246,0.08)",
        border: "1px solid rgba(139,92,246,0.2)",
        color: "#a78bfa", fontSize: 12, fontWeight: 500,
        cursor: "pointer", transition: "all 0.15s",
        flexShrink: 0,
      }}
      onMouseEnter={e => {
        e.currentTarget.style.background = "rgba(139,92,246,0.18)";
        e.currentTarget.style.borderColor = "rgba(139,92,246,0.35)";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = "rgba(139,92,246,0.08)";
        e.currentTarget.style.borderColor = "rgba(139,92,246,0.2)";
      }}
    >
      <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
      </svg>
      Message
    </button>
  );
}