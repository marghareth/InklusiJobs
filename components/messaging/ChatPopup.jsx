"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useChatPopup } from "./ChatPopupContext";
import { useMessages } from "@/hooks/useMessages";

// TODO Phase 3: Replace with real current user from auth session
const MOCK_CURRENT_USER_ID = "user-worker-1";
const MOCK_CONV_ID = "conv-popup"; // Phase 3: look up or create real conversation

const AVATAR_COLORS = [
  "#7c3aed", "#059669", "#0284c7", "#e11d48", "#d97706", "#0891b2"
];

function getColor(name = "") {
  const i = name.charCodeAt(0) % AVATAR_COLORS.length;
  return AVATAR_COLORS[i];
}

function formatTime(isoString) {
  if (!isoString) return "";
  return new Date(isoString).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function ChatPopup() {
  const router = useRouter();
  const { isOpen, participant, closeChat } = useChatPopup();
  const [input, setInput] = useState("");
  const [isMinimized, setIsMinimized] = useState(false);
  const [visible, setVisible] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  const {
    messages,
    loading,
    sending,
    isTyping,
    sendMessage,
  } = useMessages(
    isOpen ? MOCK_CONV_ID : null,
    MOCK_CURRENT_USER_ID
  );

  // Animate in/out
  useEffect(() => {
    if (isOpen) {
      setVisible(true);
      setIsMinimized(false);
      setTimeout(() => inputRef.current?.focus(), 300);
    } else {
      setTimeout(() => setVisible(false), 250);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isMinimized) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping, isMinimized]);

  const handleSend = useCallback(async () => {
    if (!input.trim() || sending) return;
    const text = input.trim();
    setInput("");
    await sendMessage(text);
  }, [input, sending, sendMessage]);

  const handleOpenInbox = () => {
    closeChat();
    router.push("/messages");
  };

  if (!visible || !participant) return null;

  const avatarColor = getColor(participant.name);
  const initials = participant.avatar_initials ||
    participant.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();

  return (
    <>
      {/* Backdrop (subtle) */}
      <div
        onClick={closeChat}
        style={{
          position: "fixed", inset: 0, zIndex: 49,
          background: "rgba(0,0,0,0.3)",
          opacity: isOpen ? 1 : 0,
          transition: "opacity 0.2s ease",
          pointerEvents: isOpen ? "auto" : "none",
        }}
      />

      {/* Popup */}
      <div
        style={{
          position: "fixed",
          bottom: 24,
          right: 24,
          width: 340,
          zIndex: 50,
          borderRadius: 16,
          overflow: "hidden",
          background: "#0f1117",
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "0 24px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(139,92,246,0.1)",
          transform: isOpen ? "translateY(0) scale(1)" : "translateY(16px) scale(0.97)",
          opacity: isOpen ? 1 : 0,
          transition: "transform 0.25s cubic-bezier(0.34,1.56,0.64,1), opacity 0.2s ease",
        }}
      >
        {/* Header */}
        <div style={{
          display: "flex", alignItems: "center", gap: 10,
          padding: "12px 14px",
          background: "rgba(15,17,23,0.95)",
          borderBottom: isMinimized ? "none" : "1px solid rgba(255,255,255,0.06)",
          cursor: "pointer",
        }}
          onClick={() => setIsMinimized(p => !p)}
        >
          {/* Avatar */}
          <div style={{ position: "relative", flexShrink: 0 }}>
            <div style={{
              width: 36, height: 36, borderRadius: "50%",
              background: avatarColor,
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "white", fontSize: 13, fontWeight: 600,
            }}>
              {initials}
            </div>
            {participant.is_online && (
              <span style={{
                position: "absolute", bottom: 0, right: 0,
                width: 9, height: 9, background: "#34d399",
                borderRadius: "50%", border: "2px solid #0f1117",
              }} />
            )}
          </div>

          {/* Info */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ color: "white", fontWeight: 600, fontSize: 13, lineHeight: 1.2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {participant.name}
            </p>
            <p style={{ fontSize: 11, color: participant.is_online ? "#34d399" : "rgba(255,255,255,0.4)", lineHeight: 1.3 }}>
              {participant.is_online ? "● Online" : "Offline"}
              {participant.company && ` · ${participant.company}`}
            </p>
          </div>

          {/* Actions */}
          <div style={{ display: "flex", gap: 2 }} onClick={e => e.stopPropagation()}>
            {/* Open in inbox */}
            <button
              onClick={handleOpenInbox}
              title="Open in Messages"
              style={{
                width: 28, height: 28, borderRadius: 8,
                background: "transparent", border: "none", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "rgba(255,255,255,0.4)",
              }}
            >
              <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </button>
            {/* Minimize */}
            <button
              onClick={() => setIsMinimized(p => !p)}
              title={isMinimized ? "Expand" : "Minimize"}
              style={{
                width: 28, height: 28, borderRadius: 8,
                background: "transparent", border: "none", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "rgba(255,255,255,0.4)",
              }}
            >
              <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMinimized ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"} />
              </svg>
            </button>
            {/* Close */}
            <button
              onClick={closeChat}
              title="Close"
              style={{
                width: 28, height: 28, borderRadius: 8,
                background: "transparent", border: "none", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "rgba(255,255,255,0.4)",
              }}
            >
              <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Body — hidden when minimized */}
        <div style={{
          maxHeight: isMinimized ? 0 : 400,
          overflow: "hidden",
          transition: "max-height 0.3s cubic-bezier(0.4,0,0.2,1)",
        }}>
          {/* "Open in inbox" banner */}
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "8px 14px",
            background: "rgba(139,92,246,0.08)",
            borderBottom: "1px solid rgba(139,92,246,0.12)",
          }}>
            <p style={{ fontSize: 11, color: "rgba(167,139,250,0.8)" }}>
              💬 Want the full experience?
            </p>
            <button
              onClick={handleOpenInbox}
              style={{
                fontSize: 11, color: "#a78bfa", fontWeight: 600,
                background: "none", border: "none", cursor: "pointer",
                textDecoration: "underline", padding: 0,
              }}
            >
              Open in Messages →
            </button>
          </div>

          {/* Messages */}
          <div style={{
            height: 260, overflowY: "auto",
            padding: "12px 14px",
            display: "flex", flexDirection: "column", gap: 6,
          }}>
            {loading && (
              <div style={{ display: "flex", flexDirection: "column", gap: 8, animation: "pulse 1.5s infinite" }}>
                {[60, 80, 50].map((w, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: i % 2 === 0 ? "flex-start" : "flex-end" }}>
                    <div style={{ height: 32, width: `${w}%`, borderRadius: 12, background: "rgba(255,255,255,0.06)" }} />
                  </div>
                ))}
              </div>
            )}

            {!loading && messages.length === 0 && (
              <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8, paddingTop: 20 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="rgba(255,255,255,0.2)">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                </div>
                <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 12, textAlign: "center" }}>
                  Start the conversation with {participant.name.split(" ")[0]}!
                </p>
              </div>
            )}

            {!loading && messages.map((msg, i) => {
              const isMe = msg.sender_id === MOCK_CURRENT_USER_ID;
              const prevSame = i > 0 && messages[i - 1].sender_id === msg.sender_id;
              return (
                <div key={msg.id} style={{ display: "flex", flexDirection: isMe ? "row-reverse" : "row", alignItems: "flex-end", gap: 6, marginTop: prevSame ? 2 : 8 }}>
                  {!isMe && !prevSame && (
                    <div style={{ width: 24, height: 24, borderRadius: "50%", background: avatarColor, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 9, fontWeight: 600, flexShrink: 0 }}>
                      {initials}
                    </div>
                  )}
                  {!isMe && prevSame && <div style={{ width: 24, flexShrink: 0 }} />}
                  <div style={{ maxWidth: "75%" }}>
                    <div style={{
                      padding: "7px 11px",
                      borderRadius: isMe ? "12px 12px 3px 12px" : "12px 12px 12px 3px",
                      background: isMe ? "#7c3aed" : "rgba(255,255,255,0.07)",
                      border: isMe ? "none" : "1px solid rgba(255,255,255,0.08)",
                      color: isMe ? "white" : "rgba(255,255,255,0.85)",
                      fontSize: 12, lineHeight: 1.5,
                    }}>
                      {msg.content}
                    </div>
                    <p style={{ fontSize: 9, color: "rgba(255,255,255,0.25)", marginTop: 2, textAlign: isMe ? "right" : "left", paddingLeft: 3, paddingRight: 3 }}>
                      {formatTime(msg.created_at)}
                    </p>
                  </div>
                </div>
              );
            })}

            {isTyping && (
              <div style={{ display: "flex", alignItems: "flex-end", gap: 6, marginTop: 8 }}>
                <div style={{ width: 24, height: 24, borderRadius: "50%", background: avatarColor, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 9, fontWeight: 600 }}>{initials}</div>
                <div style={{ padding: "8px 12px", background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "12px 12px 12px 3px" }}>
                  <div style={{ display: "flex", gap: 4 }}>
                    {[0, 150, 300].map((d, i) => (
                      <div key={i} style={{ width: 5, height: 5, borderRadius: "50%", background: "rgba(255,255,255,0.4)", animation: `bounce 1s ${d}ms infinite` }} />
                    ))}
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div style={{ padding: "10px 12px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <input
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); handleSend(); } }}
                placeholder={`Message ${participant.name.split(" ")[0]}...`}
                style={{
                  flex: 1, background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 10, padding: "8px 12px",
                  fontSize: 12, color: "white", outline: "none",
                }}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || sending}
                style={{
                  width: 34, height: 34, borderRadius: 10, flexShrink: 0,
                  background: input.trim() && !sending ? "#7c3aed" : "rgba(255,255,255,0.05)",
                  border: "none", cursor: input.trim() && !sending ? "pointer" : "not-allowed",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "background 0.15s",
                }}
              >
                <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke={input.trim() ? "white" : "rgba(255,255,255,0.2)"} style={{ transform: "rotate(90deg)" }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-3px)} }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
      `}</style>
    </>
  );
}