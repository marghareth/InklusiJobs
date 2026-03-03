"use client";
import { useState } from "react";
import { useConversations } from "@/hooks/useConversations";

const AVATAR_COLORS = [
  "#0d9488", // teal-600
  "#7c3aed", // violet-600
  "#0284c7", // sky-600
  "#059669", // emerald-600
  "#d97706", // amber-600
  "#db2777", // pink-600
];

function formatTime(isoString) {
  if (!isoString) return "";
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m`;
  if (diffHours < 24) return `${diffHours}h`;
  if (diffDays === 1) return "Yesterday";
  return `${diffDays}d ago`;
}

function ConversationSkeleton() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 16px" }}>
      <div style={{ width: 44, height: 44, borderRadius: "50%", background: "#e2e8f0", flexShrink: 0 }} />
      <div style={{ flex: 1 }}>
        <div style={{ height: 12, background: "#e2e8f0", borderRadius: 6, width: "60%", marginBottom: 6 }} />
        <div style={{ height: 10, background: "#edf2f7", borderRadius: 6, width: "85%" }} />
      </div>
    </div>
  );
}

export default function ConversationList({ currentUserId, selectedId, onSelect }) {
  const [search, setSearch] = useState("");
  const { conversations, loading, error, totalUnread } = useConversations(currentUserId);

  const filtered = conversations.filter(c =>
    c.participant.name.toLowerCase().includes(search.toLowerCase()) ||
    (c.participant.company || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div
      role="navigation"
      aria-label="Conversations"
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        background: "#ffffff",
        borderRight: "1px solid #e2e8f0",
      }}
    >
      {/* Header */}
      <div style={{ padding: "20px 20px 12px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
          <h2
            style={{
              fontSize: 18,
              fontWeight: 700,
              color: "#0f172a",
              margin: 0,
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            Messages
          </h2>
          {totalUnread > 0 && (
            <span
              aria-label={`${totalUnread} unread messages`}
              style={{
                fontSize: 11,
                fontWeight: 700,
                background: "linear-gradient(135deg, #0d9488, #0f766e)",
                color: "white",
                padding: "3px 10px",
                borderRadius: 99,
              }}
            >
              {totalUnread} unread
            </span>
          )}
        </div>

        {/* Search */}
        <div style={{ position: "relative" }}>
          <svg
            style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }}
            width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="search"
            aria-label="Search conversations"
            placeholder="Search conversations..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: "100%",
              background: "#f8fafc",
              border: "1.5px solid #e2e8f0",
              borderRadius: 12,
              padding: "9px 14px 9px 36px",
              fontSize: 13,
              color: "#0f172a",
              outline: "none",
              boxSizing: "border-box",
              transition: "border-color 0.15s",
              fontFamily: "'DM Sans', sans-serif",
            }}
            onFocus={e => (e.target.style.borderColor = "#0d9488")}
            onBlur={e => (e.target.style.borderColor = "#e2e8f0")}
          />
        </div>
      </div>

      {/* List */}
      <div
        role="list"
        style={{ flex: 1, overflowY: "auto", padding: "4px 8px" }}
      >
        {loading && Array.from({ length: 4 }).map((_, i) => <ConversationSkeleton key={i} />)}

        {error && (
          <p role="alert" style={{ color: "#ef4444", fontSize: 12, textAlign: "center", padding: "24px 16px" }}>
            Failed to load conversations. Please try again.
          </p>
        )}

        {!loading && !error && filtered.length === 0 && (
          <p style={{ color: "#94a3b8", fontSize: 13, textAlign: "center", padding: "32px 16px" }}>
            {search ? "No results found" : "No conversations yet"}
          </p>
        )}

        {!loading && filtered.map((conv, i) => {
          const isSelected = selectedId === conv.id;
          const avatarColor = AVATAR_COLORS[i % AVATAR_COLORS.length];

          return (
            <button
              key={conv.id}
              role="listitem"
              aria-label={`Conversation with ${conv.participant.name}${conv.unread_count > 0 ? `, ${conv.unread_count} unread` : ""}`}
              aria-pressed={isSelected}
              onClick={() => onSelect(conv)}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "10px 12px",
                borderRadius: 12,
                border: isSelected ? "1.5px solid #99f6e4" : "1.5px solid transparent",
                background: isSelected
                  ? "linear-gradient(135deg, #f0fdfa, #ccfbf1)"
                  : "transparent",
                cursor: "pointer",
                textAlign: "left",
                marginBottom: 2,
                transition: "all 0.15s ease",
              }}
              onMouseEnter={e => {
                if (!isSelected) e.currentTarget.style.background = "#f8fafc";
              }}
              onMouseLeave={e => {
                if (!isSelected) e.currentTarget.style.background = "transparent";
              }}
            >
              {/* Avatar */}
              <div style={{ position: "relative", flexShrink: 0 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: "50%",
                  background: avatarColor,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "white", fontSize: 14, fontWeight: 700,
                  fontFamily: "'DM Sans', sans-serif",
                }}>
                  {conv.participant.avatar_initials}
                </div>
                {conv.participant.is_online && (
                  <span
                    aria-label="Online"
                    style={{
                      position: "absolute", bottom: 1, right: 1,
                      width: 11, height: 11, background: "#22c55e",
                      borderRadius: "50%", border: "2px solid white",
                    }}
                  />
                )}
              </div>

              {/* Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 3 }}>
                  <span style={{
                    fontSize: 13,
                    fontWeight: conv.unread_count > 0 ? 700 : 600,
                    color: "#0f172a",
                    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                    fontFamily: "'DM Sans', sans-serif",
                  }}>
                    {conv.participant.name}
                  </span>
                  <span style={{ fontSize: 11, color: "#94a3b8", flexShrink: 0, marginLeft: 6 }}>
                    {formatTime(conv.last_message_at)}
                  </span>
                </div>

                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <p style={{
                    fontSize: 12,
                    color: conv.unread_count > 0 ? "#334155" : "#64748b",
                    fontWeight: conv.unread_count > 0 ? 500 : 400,
                    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                    flex: 1, paddingRight: 6,
                    fontFamily: "'DM Sans', sans-serif",
                  }}>
                    {conv.last_message || "No messages yet"}
                  </p>
                  {conv.unread_count > 0 && (
                    <span style={{
                      flexShrink: 0,
                      minWidth: 20, height: 20,
                      background: "linear-gradient(135deg, #0d9488, #0f766e)",
                      borderRadius: 99,
                      fontSize: 10, fontWeight: 700,
                      color: "white",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      padding: "0 5px",
                    }}>
                      {conv.unread_count}
                    </span>
                  )}
                </div>

                {conv.participant.company && (
                  <p style={{ fontSize: 10, color: "#0d9488", marginTop: 2, fontWeight: 500 }}>
                    {conv.participant.company}
                  </p>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* New Message Button */}
      <div style={{ padding: 16, borderTop: "1px solid #e2e8f0" }}>
        <button
          aria-label="Start a new message"
          style={{
            width: "100%",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            background: "linear-gradient(135deg, #0d9488, #0f766e)",
            color: "white",
            fontSize: 13, fontWeight: 600,
            padding: "11px 0",
            borderRadius: 12,
            border: "none",
            cursor: "pointer",
            transition: "opacity 0.15s, transform 0.15s",
            fontFamily: "'DM Sans', sans-serif",
            boxShadow: "0 4px 12px rgba(13,148,136,0.3)",
          }}
          onMouseEnter={e => (e.currentTarget.style.opacity = "0.9")}
          onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
        >
          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
          </svg>
          New Message
        </button>
      </div>
    </div>
  );
}