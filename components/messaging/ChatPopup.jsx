"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useChatPopup } from "./ChatPopupContext";
import { useMessages } from "@/hooks/useMessages";

const MOCK_CURRENT_USER_ID = "user-worker-1";
const MOCK_CONV_ID = "conv-popup";

const AVATAR_COLORS = ["#0d9488", "#7c3aed", "#0284c7", "#059669", "#d97706", "#db2777"];

function getColor(name = "") {
  return AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];
}

function formatTime(isoString) {
  if (!isoString) return "";
  return new Date(isoString).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function speak(text) {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.rate = 0.95;
  window.speechSynthesis.speak(u);
}

export default function ChatPopup() {
  const router = useRouter();
  const { isOpen, participant, closeChat } = useChatPopup();
  const [input, setInput] = useState("");
  const [isMinimized, setIsMinimized] = useState(false);
  const [visible, setVisible] = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(false);
  const [fontSize, setFontSize] = useState(13);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const prevLen = useRef(0);

  const { messages, loading, sending, isTyping, sendMessage } = useMessages(
    isOpen ? MOCK_CONV_ID : null,
    MOCK_CURRENT_USER_ID
  );

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
    if (!isMinimized) bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping, isMinimized]);

  // Auto-read new messages
  useEffect(() => {
    if (!ttsEnabled || messages.length === 0) return;
    if (messages.length > prevLen.current) {
      const latest = messages[messages.length - 1];
      if (latest.sender_id !== MOCK_CURRENT_USER_ID) {
        speak(`${participant?.name?.split(" ")[0]} says: ${latest.content}`);
      }
    }
    prevLen.current = messages.length;
  }, [messages, ttsEnabled]);

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
      {/* Backdrop */}
      <div
        role="presentation"
        onClick={closeChat}
        style={{
          position: "fixed", inset: 0, zIndex: 49,
          background: "rgba(15,23,42,0.25)",
          opacity: isOpen ? 1 : 0,
          transition: "opacity 0.2s ease",
          pointerEvents: isOpen ? "auto" : "none",
          backdropFilter: "blur(2px)",
        }}
      />

      {/* Popup */}
      <div
        role="dialog"
        aria-label={`Chat with ${participant.name}`}
        aria-modal="true"
        style={{
          position: "fixed",
          bottom: 24, right: 24,
          width: 348,
          zIndex: 50,
          borderRadius: 20,
          overflow: "hidden",
          background: "white",
          border: "1.5px solid #e2e8f0",
          boxShadow: "0 20px 60px rgba(15,23,42,0.18), 0 0 0 1px rgba(13,148,136,0.08)",
          transform: isOpen ? "translateY(0) scale(1)" : "translateY(16px) scale(0.97)",
          opacity: isOpen ? 1 : 0,
          transition: "transform 0.25s cubic-bezier(0.34,1.56,0.64,1), opacity 0.2s ease",
          fontFamily: "'DM Sans', 'Inter', sans-serif",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex", alignItems: "center", gap: 10,
            padding: "12px 14px",
            background: "linear-gradient(135deg, #f0fdfa, #ffffff)",
            borderBottom: isMinimized ? "none" : "1px solid #e2e8f0",
            cursor: "pointer",
          }}
          onClick={() => setIsMinimized(p => !p)}
        >
          <div style={{ position: "relative", flexShrink: 0 }}>
            <div style={{
              width: 38, height: 38, borderRadius: "50%",
              background: avatarColor,
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "white", fontSize: 13, fontWeight: 700,
            }}>
              {initials}
            </div>
            {participant.is_online && (
              <span aria-label="Online" style={{
                position: "absolute", bottom: 0, right: 0,
                width: 10, height: 10, background: "#22c55e",
                borderRadius: "50%", border: "2px solid white",
              }} />
            )}
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ color: "#0f172a", fontWeight: 700, fontSize: 13, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {participant.name}
            </p>
            <p style={{ fontSize: 11, color: participant.is_online ? "#16a34a" : "#94a3b8", margin: 0 }}>
              {participant.is_online ? "● Online" : "Offline"}
              {participant.company && ` · ${participant.company}`}
            </p>
          </div>

          <div style={{ display: "flex", gap: 2 }} onClick={e => e.stopPropagation()}>
            {/* Open in inbox */}
            <button
              onClick={handleOpenInbox}
              aria-label="Open full inbox"
              title="Open in Messages"
              style={iconBtnStyle}
            >
              <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </button>

            {/* Minimize */}
            <button
              onClick={() => setIsMinimized(p => !p)}
              aria-label={isMinimized ? "Expand chat" : "Minimize chat"}
              aria-expanded={!isMinimized}
              style={iconBtnStyle}
            >
              <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMinimized ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"} />
              </svg>
            </button>

            {/* Close */}
            <button
              onClick={closeChat}
              aria-label="Close chat"
              style={iconBtnStyle}
            >
              <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Body */}
        <div style={{
          maxHeight: isMinimized ? 0 : 440,
          overflow: "hidden",
          transition: "max-height 0.3s cubic-bezier(0.4,0,0.2,1)",
        }}>
          {/* Banner */}
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "8px 14px",
            background: "linear-gradient(90deg, #f0fdfa, #f8fafc)",
            borderBottom: "1px solid #e2e8f0",
          }}>
            <p style={{ fontSize: 11, color: "#0d9488", fontWeight: 500, margin: 0 }}>
              💬 Want the full experience?
            </p>
            <button
              onClick={handleOpenInbox}
              style={{ fontSize: 11, color: "#0d9488", fontWeight: 700, background: "none", border: "none", cursor: "pointer", textDecoration: "underline", padding: 0 }}
            >
              Open in Messages →
            </button>
          </div>

          {/* Accessibility Mini Bar */}
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "6px 14px",
            background: "#fafafa",
            borderBottom: "1px solid #f1f5f9",
          }}>
            <span style={{ fontSize: 10, color: "#94a3b8", fontWeight: 500 }}>Accessibility</span>
            <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
              {/* Font size */}
              {[12, 13, 15].map(s => (
                <button
                  key={s}
                  aria-label={`Text size ${s}`}
                  aria-pressed={fontSize === s}
                  onClick={() => setFontSize(s)}
                  style={{
                    fontSize: 9, fontWeight: 700, padding: "2px 6px", borderRadius: 6,
                    border: `1.5px solid ${fontSize === s ? "#0d9488" : "#e2e8f0"}`,
                    background: fontSize === s ? "#f0fdfa" : "white",
                    color: fontSize === s ? "#0d9488" : "#94a3b8",
                    cursor: "pointer",
                  }}
                >
                  {s === 12 ? "A" : s === 13 ? "A" : "A"}
                </button>
              ))}
              {/* Read aloud toggle */}
              <button
                role="switch"
                aria-checked={ttsEnabled}
                aria-label="Toggle read-aloud for new messages"
                onClick={() => setTtsEnabled(p => !p)}
                title="Auto read-aloud"
                style={{
                  width: 32, height: 18, borderRadius: 99,
                  background: ttsEnabled ? "#0d9488" : "#e2e8f0",
                  border: "none", cursor: "pointer", position: "relative", flexShrink: 0,
                  transition: "background 0.2s",
                }}
              >
                <span style={{
                  position: "absolute", top: 2,
                  left: ttsEnabled ? 14 : 2,
                  width: 14, height: 14, borderRadius: "50%",
                  background: "white", display: "block",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                  transition: "left 0.2s",
                }} />
              </button>
              <span style={{ fontSize: 9, color: "#94a3b8" }}>🔊</span>
            </div>
          </div>

          {/* Messages */}
          <div
            aria-live="polite"
            aria-label="Messages"
            style={{
              height: 240, overflowY: "auto",
              padding: "12px 14px",
              display: "flex", flexDirection: "column", gap: 6,
              background: "#f8fafc",
            }}
          >
            {loading && (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {[60, 80, 50].map((w, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: i % 2 === 0 ? "flex-start" : "flex-end" }}>
                    <div style={{ height: 32, width: `${w}%`, borderRadius: 12, background: "#e2e8f0" }} />
                  </div>
                ))}
              </div>
            )}

            {!loading && messages.length === 0 && (
              <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8, paddingTop: 16 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 14,
                  background: "linear-gradient(135deg, #f0fdfa, #ccfbf1)",
                  border: "1.5px solid #99f6e4",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#0d9488">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                </div>
                <p style={{ color: "#64748b", fontSize: 12, textAlign: "center" }}>
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
                    <div style={{
                      width: 24, height: 24, borderRadius: "50%", background: avatarColor,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: "white", fontSize: 9, fontWeight: 700, flexShrink: 0,
                    }}>
                      {initials}
                    </div>
                  )}
                  {!isMe && prevSame && <div style={{ width: 24, flexShrink: 0 }} />}
                  <div style={{ maxWidth: "75%", position: "relative" }}>
                    <div style={{
                      padding: "8px 12px",
                      borderRadius: isMe ? "14px 14px 3px 14px" : "14px 14px 14px 3px",
                      background: isMe ? "linear-gradient(135deg, #0d9488, #0f766e)" : "white",
                      border: isMe ? "none" : "1.5px solid #e2e8f0",
                      color: isMe ? "white" : "#0f172a",
                      fontSize: fontSize,
                      lineHeight: 1.5,
                      boxShadow: isMe ? "0 2px 8px rgba(13,148,136,0.2)" : "0 1px 3px rgba(0,0,0,0.05)",
                    }}>
                      {msg.content}
                    </div>
                    <div style={{ display: "flex", justifyContent: isMe ? "flex-end" : "flex-start", marginTop: 2, paddingLeft: 3, paddingRight: 3 }}>
                      <span style={{ fontSize: 9, color: "#94a3b8" }}>{formatTime(msg.created_at)}</span>
                    </div>
                  </div>
                </div>
              );
            })}

            {isTyping && (
              <div style={{ display: "flex", alignItems: "flex-end", gap: 6, marginTop: 8 }} aria-live="polite" aria-label="Contact is typing">
                <div style={{ width: 24, height: 24, borderRadius: "50%", background: avatarColor, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 9, fontWeight: 700 }}>{initials}</div>
                <div style={{ padding: "8px 12px", background: "white", border: "1.5px solid #e2e8f0", borderRadius: "14px 14px 14px 3px" }}>
                  <div style={{ display: "flex", gap: 4 }}>
                    {[0, 150, 300].map((d, i) => (
                      <div key={i} style={{ width: 5, height: 5, borderRadius: "50%", background: "#94a3b8", animation: `bounce 1.2s ${d}ms infinite` }} />
                    ))}
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div style={{ padding: "10px 12px", borderTop: "1px solid #e2e8f0", background: "white" }}>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <input
                ref={inputRef}
                value={input}
                aria-label={`Type a message to ${participant.name}`}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); handleSend(); } }}
                placeholder={`Message ${participant.name.split(" ")[0]}...`}
                style={{
                  flex: 1,
                  background: "#f8fafc",
                  border: "1.5px solid #e2e8f0",
                  borderRadius: 12,
                  padding: "8px 12px",
                  fontSize: fontSize,
                  color: "#0f172a",
                  outline: "none",
                  fontFamily: "'DM Sans', sans-serif",
                  transition: "border-color 0.15s",
                }}
                onFocus={e => (e.target.style.borderColor = "#0d9488")}
                onBlur={e => (e.target.style.borderColor = "#e2e8f0")}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || sending}
                aria-label="Send message"
                style={{
                  width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                  background: input.trim() && !sending ? "linear-gradient(135deg, #0d9488, #0f766e)" : "#f1f5f9",
                  border: "none",
                  cursor: input.trim() && !sending ? "pointer" : "not-allowed",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "all 0.15s",
                  boxShadow: input.trim() && !sending ? "0 3px 10px rgba(13,148,136,0.3)" : "none",
                }}
              >
                <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke={input.trim() ? "white" : "#94a3b8"} style={{ transform: "rotate(90deg)" }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
        @keyframes bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-4px)} }
      `}</style>
    </>
  );
}

const iconBtnStyle = {
  width: 30, height: 30, borderRadius: 8,
  background: "transparent", border: "none", cursor: "pointer",
  display: "flex", alignItems: "center", justifyContent: "center",
  color: "#64748b", transition: "background 0.15s, color 0.15s",
};