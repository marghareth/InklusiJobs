"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { useMessages } from "@/hooks/useMessages";

const AVATAR_COLORS = [
  "#0d9488", "#7c3aed", "#0284c7",
  "#059669", "#d97706", "#db2777",
];

function formatTime(isoString) {
  if (!isoString) return "";
  return new Date(isoString).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

// Speech-to-text hook using Web Speech API
function useMicrophone({ onTranscript, onError }) {
  const [isRecording, setIsRecording] = useState(false);
  const [isSupported] = useState(() =>
    typeof window !== "undefined" &&
    ("SpeechRecognition" in window || "webkitSpeechRecognition" in window)
  );
  const recognitionRef = useRef(null);

  const start = useCallback(() => {
    if (!isSupported) {
      onError?.("Speech recognition is not supported in this browser. Try Chrome or Edge.");
      return;
    }
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const rec = new SR();
    rec.lang = "en-PH";
    rec.interimResults = true;
    rec.continuous = false;
    rec.onstart = () => setIsRecording(true);
    rec.onresult = (e) => {
      const transcript = Array.from(e.results)
        .map(r => r[0].transcript)
        .join("");
      onTranscript?.(transcript, e.results[e.results.length - 1].isFinal);
    };
    rec.onerror = (e) => {
      setIsRecording(false);
      if (e.error === "not-allowed") onError?.("Microphone access was denied. Please allow microphone permission.");
      else if (e.error === "no-speech") onError?.("No speech detected. Please try again.");
      else onError?.(`Voice input error: ${e.error}`);
    };
    rec.onend = () => setIsRecording(false);
    recognitionRef.current = rec;
    rec.start();
  }, [isSupported, onTranscript, onError]);

  const stop = useCallback(() => {
    recognitionRef.current?.stop();
    setIsRecording(false);
  }, []);

  return { isRecording, isSupported, start, stop };
}

function MicButton({ onTranscript, onError, disabled }) {
  const [toast, setToast] = useState(null);
  const [interim, setInterim] = useState("");

  const showToast = (msg, type = "info") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const { isRecording, isSupported, start, stop } = useMicrophone({
    onTranscript: (text, isFinal) => {
      setInterim(isFinal ? "" : text);
      if (isFinal) onTranscript?.(text);
    },
    onError: (msg) => showToast(msg, "error"),
  });

  const toggle = () => {
    if (isRecording) { stop(); setInterim(""); }
    else start();
  };

  return (
    <div style={{ position: "relative", flexShrink: 0 }}>
      {/* Mic button */}
      <button
        onClick={toggle}
        disabled={disabled || !isSupported}
        aria-label={isRecording ? "Stop voice input" : "Start voice input"}
        title={!isSupported ? "Voice input not supported in this browser" : isRecording ? "Stop recording" : "Voice input"}
        style={{
          width: 34, height: 34, borderRadius: "50%",
          background: isRecording
            ? "linear-gradient(135deg, #ef4444, #dc2626)"
            : "white",
          border: `1.5px solid ${isRecording ? "#fca5a5" : "#e2e8f0"}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: isSupported && !disabled ? "pointer" : "not-allowed",
          flexShrink: 0, transition: "all 0.2s",
          boxShadow: isRecording ? "0 0 0 4px rgba(239,68,68,0.15)" : "none",
          position: "relative",
          opacity: !isSupported ? 0.4 : 1,
        }}
      >
        {/* Pulse ring while recording */}
        {isRecording && (
          <span style={{
            position: "absolute", inset: -4,
            borderRadius: "50%",
            border: "2px solid rgba(239,68,68,0.4)",
            animation: "micPulse 1.2s ease-out infinite",
          }} />
        )}
        <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke={isRecording ? "white" : "#64748b"} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M19 10v2a7 7 0 01-14 0v-2M12 19v4M8 23h8" />
        </svg>
      </button>

      {/* Live interim transcript bubble */}
      {interim && (
        <div style={{
          position: "absolute", bottom: 44, left: "50%", transform: "translateX(-50%)",
          background: "#1e293b", color: "white",
          fontSize: 11, padding: "5px 10px", borderRadius: 8,
          whiteSpace: "nowrap", maxWidth: 200,
          overflow: "hidden", textOverflow: "ellipsis",
          boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
          pointerEvents: "none",
          zIndex: 10,
        }}>
          🎙 {interim}
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div style={{
          position: "absolute", bottom: 44, left: "50%", transform: "translateX(-50%)",
          background: toast.type === "error" ? "#fef2f2" : "#f0fdfa",
          border: `1px solid ${toast.type === "error" ? "#fca5a5" : "#99f6e4"}`,
          color: toast.type === "error" ? "#dc2626" : "#0d9488",
          fontSize: 11, padding: "6px 12px", borderRadius: 8,
          whiteSpace: "nowrap", maxWidth: 240,
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          zIndex: 10, fontWeight: 500,
        }}>
          {toast.type === "error" ? "⚠️ " : "✅ "}{toast.msg}
        </div>
      )}
    </div>
  );
}

// Text-to-speech helper
function speak(text) {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  utter.rate = 0.95;
  window.speechSynthesis.speak(utter);
}

function TypingIndicator({ avatarInitials, avatarColor }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 8, marginTop: 12 }} aria-live="polite" aria-label="Contact is typing">
      <div style={{
        width: 32, height: 32, borderRadius: "50%", background: avatarColor,
        display: "flex", alignItems: "center", justifyContent: "center",
        color: "white", fontSize: 11, fontWeight: 700, flexShrink: 0,
      }}>
        {avatarInitials}
      </div>
      <div style={{
        background: "#f1f5f9", border: "1.5px solid #e2e8f0",
        borderRadius: "18px 18px 18px 4px", padding: "10px 14px",
      }}>
        <div style={{ display: "flex", gap: 4, alignItems: "center", height: 14 }}>
          {[0, 150, 300].map((delay, i) => (
            <span
              key={i}
              style={{
                width: 6, height: 6, background: "#94a3b8", borderRadius: "50%",
                display: "inline-block",
                animation: "bounce 1.2s ease-in-out infinite",
                animationDelay: `${delay}ms`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function MessageBubble({ message, isMe, showAvatar, avatarInitials, avatarColor, fontSize, highContrast }) {
  const bubbleBg = isMe
    ? (highContrast ? "#0f766e" : "linear-gradient(135deg, #0d9488, #0f766e)")
    : (highContrast ? "#e2e8f0" : "#f1f5f9");
  const textColor = isMe ? "#ffffff" : (highContrast ? "#000000" : "#0f172a");
  const borderColor = isMe ? "none" : (highContrast ? "2px solid #0f172a" : "1.5px solid #e2e8f0");

  return (
    <div
      role="listitem"
      style={{
        display: "flex",
        flexDirection: isMe ? "row-reverse" : "row",
        alignItems: "flex-end",
        gap: 8,
      }}
    >
      {!isMe && (
        <div style={{ width: 32, flexShrink: 0 }}>
          {showAvatar && (
            <div style={{
              width: 32, height: 32, borderRadius: "50%", background: avatarColor,
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "white", fontSize: 11, fontWeight: 700,
            }}>
              {avatarInitials}
            </div>
          )}
        </div>
      )}

      <div style={{ maxWidth: "68%", display: "flex", flexDirection: "column", gap: 3, alignItems: isMe ? "flex-end" : "flex-start" }}>
        <div style={{
          padding: "10px 14px",
          borderRadius: isMe ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
          background: bubbleBg,
          border: borderColor,
          fontSize: fontSize || 14,
          lineHeight: 1.55,
          color: textColor,
          fontFamily: "'DM Sans', sans-serif",
          boxShadow: isMe ? "0 2px 8px rgba(13,148,136,0.2)" : "0 1px 3px rgba(0,0,0,0.06)",
          position: "relative",
        }}>
          {message.content}

          {/* Read aloud button */}
          <button
            aria-label={`Read message aloud: ${message.content}`}
            title="Read aloud"
            onClick={() => speak(message.content)}
            style={{
              position: "absolute",
              top: -8, right: isMe ? "auto" : -8, left: isMe ? -8 : "auto",
              width: 22, height: 22, borderRadius: "50%",
              background: "white", border: "1.5px solid #e2e8f0",
              cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
              opacity: 0, transition: "opacity 0.15s",
              boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
            }}
            className="read-aloud-btn"
          >
            <svg width="10" height="10" fill="none" viewBox="0 0 24 24" stroke="#0d9488">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072M12 6v12m0-12L8 9H5v6h3l4 3V6z" />
            </svg>
          </button>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 4, paddingLeft: 4, paddingRight: 4, flexDirection: isMe ? "row-reverse" : "row" }}>
          <span style={{ fontSize: 10, color: "#94a3b8" }}>{formatTime(message.created_at)}</span>
          {isMe && (
            <svg width="12" height="12" fill="currentColor" viewBox="0 0 24 24"
              style={{ color: message.is_read ? "#0d9488" : "#cbd5e1" }}
              aria-label={message.is_read ? "Read" : "Sent"}
            >
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
            </svg>
          )}
        </div>
      </div>
    </div>
  );
}

const JOB_TEMPLATES = [
  { label: "👋 Introduction", text: "Hi! I came across this opportunity and I'm very interested. I'd love to learn more about the role." },
  { label: "📅 Schedule Interview", text: "Thank you for reaching out! I'm available for an interview. Could we schedule a call this week?" },
  { label: "📄 Send Resume", text: "I've attached my updated resume for your review. Please let me know if you need any additional information." },
  { label: "✅ Confirm Interest", text: "Thank you for the opportunity! I'm very interested in the position and look forward to hearing from you." },
  { label: "🙏 Thank You", text: "Thank you so much for your time and consideration. I appreciate this opportunity!" },
  { label: "❓ Ask About Role", text: "Could you tell me more about the day-to-day responsibilities and what you're looking for in an ideal candidate?" },
  { label: "📍 Ask Location", text: "Is this position on-site, remote, or hybrid? I'd like to know more about the work arrangement." },
  { label: "💰 Ask Compensation", text: "Could you share more details about the compensation package and benefits for this role?" },
];

function TemplatesBar({ onSelect }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = JOB_TEMPLATES.filter(t =>
    t.label.toLowerCase().includes(search.toLowerCase()) ||
    t.text.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ background: "white", borderTop: "1px solid #f1f5f9", position: "relative" }}>
      {/* Toggle bar */}
      <button
        aria-label="Message templates for job seekers"
        aria-expanded={open}
        onClick={() => setOpen(p => !p)}
        style={{
          width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "8px 16px",
          background: "none", border: "none", cursor: "pointer",
          borderBottom: open ? "1px solid #f1f5f9" : "none",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
          <div style={{
            width: 22, height: 22, borderRadius: 6,
            background: "linear-gradient(135deg, #f0fdfa, #ccfbf1)",
            border: "1px solid #99f6e4",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <svg width="11" height="11" fill="none" viewBox="0 0 24 24" stroke="#0d9488" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <span style={{ fontSize: 12, fontWeight: 600, color: "#0d9488", fontFamily: "'DM Sans', sans-serif" }}>
            Message Templates
          </span>
          <span style={{
            fontSize: 10, fontWeight: 700,
            background: "#f0fdfa", color: "#0d9488",
            border: "1px solid #99f6e4",
            borderRadius: 99, padding: "1px 7px",
          }}>
            {JOB_TEMPLATES.length}
          </span>
        </div>
        <svg
          width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="#94a3b8"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Panel */}
      <div style={{
        maxHeight: open ? 260 : 0,
        overflow: "hidden",
        transition: "max-height 0.25s cubic-bezier(0.4,0,0.2,1)",
        background: "#fafafa",
      }}>
        {/* Search */}
        <div style={{ padding: "10px 14px 6px" }}>
          <div style={{ position: "relative" }}>
            <svg style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }}
              width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="search"
              aria-label="Search templates"
              placeholder="Search templates..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                width: "100%", background: "white",
                border: "1.5px solid #e2e8f0", borderRadius: 10,
                padding: "6px 10px 6px 28px",
                fontSize: 12, color: "#0f172a", outline: "none",
                boxSizing: "border-box", fontFamily: "'DM Sans', sans-serif",
                transition: "border-color 0.15s",
              }}
              onFocus={e => (e.target.style.borderColor = "#0d9488")}
              onBlur={e => (e.target.style.borderColor = "#e2e8f0")}
            />
          </div>
        </div>

        {/* Templates list */}
        <div style={{ overflowY: "auto", maxHeight: 190, padding: "4px 10px 10px" }}>
          {filtered.length === 0 && (
            <p style={{ fontSize: 12, color: "#94a3b8", textAlign: "center", padding: "16px 0" }}>No templates found</p>
          )}
          {filtered.map((tpl, i) => (
            <button
              key={i}
              aria-label={`Use template: ${tpl.label}`}
              onClick={() => { onSelect(tpl.text); setOpen(false); setSearch(""); }}
              style={{
                width: "100%", textAlign: "left",
                padding: "9px 12px", borderRadius: 10,
                background: "white", border: "1.5px solid #e2e8f0",
                cursor: "pointer", marginBottom: 5,
                transition: "all 0.12s",
                fontFamily: "'DM Sans', sans-serif",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = "#99f6e4";
                e.currentTarget.style.background = "#f0fdfa";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = "#e2e8f0";
                e.currentTarget.style.background = "white";
              }}
            >
              <div style={{ fontSize: 12, fontWeight: 600, color: "#0f172a", marginBottom: 3 }}>{tpl.label}</div>
              <div style={{
                fontSize: 11, color: "#64748b", lineHeight: 1.45,
                overflow: "hidden", display: "-webkit-box",
                WebkitLineClamp: 2, WebkitBoxOrient: "vertical",
              }}>
                {tpl.text}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ChatWindow({ conversation, currentUserId, onMessageSent, onBack }) {
  const [input, setInput] = useState("");
  const [fontSize, setFontSize] = useState(14);
  const [highContrast, setHighContrast] = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(false);
  const [showA11yPanel, setShowA11yPanel] = useState(false);
  const bottomRef = useRef(null);
  const textareaRef = useRef(null);
  const messagesRef = useRef(null);
  const prevMessagesLen = useRef(0);

  const convIndex = conversation
    ? parseInt(conversation.id.replace("conv-", "")) - 1
    : 0;
  const avatarColor = AVATAR_COLORS[convIndex % AVATAR_COLORS.length];

  const {
    messages, loading, sending, isTyping, sendMessage, markMessagesAsRead,
  } = useMessages(conversation?.id, currentUserId, { onNewMessage: onMessageSent });

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  useEffect(() => {
    if (conversation) markMessagesAsRead();
  }, [conversation?.id]);

  // Auto-read new incoming messages
  useEffect(() => {
    if (!ttsEnabled || messages.length === 0) return;
    if (messages.length > prevMessagesLen.current) {
      const latest = messages[messages.length - 1];
      if (latest.sender_id !== currentUserId) {
        speak(`${conversation?.participant?.name} says: ${latest.content}`);
      }
    }
    prevMessagesLen.current = messages.length;
  }, [messages, ttsEnabled]);

  const handleSend = useCallback(async () => {
    if (!input.trim() || sending) return;
    const text = input.trim();
    setInput("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
    const sent = await sendMessage(text);
    if (sent) onMessageSent?.(sent);
  }, [input, sending, sendMessage, onMessageSent]);

  const bg = highContrast ? "#ffffff" : "#f8fafc";
  const borderColor = highContrast ? "#0f172a" : "#e2e8f0";

  // Empty state
  if (!conversation) {
    return (
      <div style={{
        flex: 1, display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        background: "#f8fafc", padding: 32, textAlign: "center",
      }}>
        <div style={{
          width: 72, height: 72, borderRadius: 20,
          background: "linear-gradient(135deg, #f0fdfa, #ccfbf1)",
          border: "2px solid #99f6e4",
          display: "flex", alignItems: "center", justifyContent: "center",
          marginBottom: 20,
          boxShadow: "0 8px 24px rgba(13,148,136,0.1)",
        }}>
          <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="#0d9488" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        </div>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: "#0f172a", marginBottom: 8, fontFamily: "'DM Sans', sans-serif" }}>
          Your Messages
        </h3>
        <p style={{ fontSize: 13, color: "#64748b", maxWidth: 240, lineHeight: 1.6, fontFamily: "'DM Sans', sans-serif" }}>
          Select a conversation to connect with employers and workers.
        </p>
      </div>
    );
  }

  return (
    <div
      style={{
        flex: 1, display: "flex", flexDirection: "column",
        background: bg, minWidth: 0,
        fontFamily: "'DM Sans', sans-serif",
      }}
      role="main"
      aria-label={`Chat with ${conversation.participant.name}`}
    >
      {/* Header */}
      <div style={{
        display: "flex", alignItems: "center", gap: 12,
        padding: "14px 20px",
        background: "white",
        borderBottom: `1px solid ${borderColor}`,
        boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
      }}>
        {/* Back button (mobile) */}
        {onBack && (
          <button
            aria-label="Back to conversations"
            onClick={onBack}
            style={{
              width: 36, height: 36, borderRadius: 10,
              background: "#f1f5f9", border: "none", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#64748b", flexShrink: 0,
            }}
          >
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}

        {/* Avatar */}
        <div style={{ position: "relative", flexShrink: 0 }}>
          <div style={{
            width: 42, height: 42, borderRadius: "50%", background: avatarColor,
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "white", fontSize: 14, fontWeight: 700,
          }}>
            {conversation.participant.avatar_initials}
          </div>
          {conversation.participant.is_online && (
            <span aria-label="Online" style={{
              position: "absolute", bottom: 1, right: 1,
              width: 11, height: 11, background: "#22c55e",
              borderRadius: "50%", border: "2px solid white",
            }} />
          )}
        </div>

        {/* Name + status */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: "#0f172a", margin: 0 }}>
            {conversation.participant.name}
          </h3>
          <p style={{ fontSize: 11, margin: 0, marginTop: 2, color: conversation.participant.is_online ? "#16a34a" : "#94a3b8" }}>
            {conversation.participant.is_online ? "● Online" : "Last seen recently"}
            {conversation.participant.company && (
              <span style={{ color: "#94a3b8" }}> · {conversation.participant.company}</span>
            )}
          </p>
        </div>

        {/* Accessibility Panel Toggle */}
        <div style={{ position: "relative" }}>
          <button
            aria-label="Accessibility settings"
            aria-expanded={showA11yPanel}
            title="Accessibility settings"
            onClick={() => setShowA11yPanel(p => !p)}
            style={{
              width: 38, height: 38, borderRadius: 10,
              background: showA11yPanel ? "#f0fdfa" : "#f8fafc",
              border: `1.5px solid ${showA11yPanel ? "#99f6e4" : "#e2e8f0"}`,
              cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: showA11yPanel ? "#0d9488" : "#64748b",
              transition: "all 0.15s",
            }}
          >
            {/* Accessibility icon */}
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <circle cx="12" cy="5" r="1.5" fill="currentColor" stroke="none"/>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M5 8h14M12 8v4m0 0l-3 5m3-5l3 5" />
            </svg>
          </button>

          {/* Accessibility Panel */}
          {showA11yPanel && (
            <div
              role="dialog"
              aria-label="Accessibility settings"
              style={{
                position: "absolute", top: 46, right: 0,
                background: "white", border: "1.5px solid #e2e8f0",
                borderRadius: 16, padding: 16, width: 240,
                boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
                zIndex: 100,
              }}
            >
              <p style={{ fontSize: 12, fontWeight: 700, color: "#0f172a", marginBottom: 12, marginTop: 0 }}>
                ♿ Accessibility
              </p>

              {/* Font Size */}
              <div style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 11, color: "#64748b", fontWeight: 600, display: "block", marginBottom: 6 }}>
                  Text Size
                </label>
                <div style={{ display: "flex", gap: 6 }}>
                  {[12, 14, 16, 18].map(size => (
                    <button
                      key={size}
                      aria-label={`Set text size to ${size}`}
                      aria-pressed={fontSize === size}
                      onClick={() => setFontSize(size)}
                      style={{
                        flex: 1, padding: "5px 0", borderRadius: 8,
                        border: `1.5px solid ${fontSize === size ? "#0d9488" : "#e2e8f0"}`,
                        background: fontSize === size ? "#f0fdfa" : "white",
                        color: fontSize === size ? "#0d9488" : "#64748b",
                        fontSize: 11, fontWeight: 600, cursor: "pointer",
                      }}
                    >
                      {size === 12 ? "S" : size === 14 ? "M" : size === 16 ? "L" : "XL"}
                    </button>
                  ))}
                </div>
              </div>

              {/* High Contrast */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                <div>
                  <p style={{ fontSize: 12, fontWeight: 600, color: "#0f172a", margin: 0 }}>High Contrast</p>
                  <p style={{ fontSize: 10, color: "#94a3b8", margin: 0 }}>Stronger borders & colors</p>
                </div>
                <button
                  role="switch"
                  aria-checked={highContrast}
                  aria-label="Toggle high contrast mode"
                  onClick={() => setHighContrast(p => !p)}
                  style={{
                    width: 40, height: 22, borderRadius: 99,
                    background: highContrast ? "#0d9488" : "#e2e8f0",
                    border: "none", cursor: "pointer", position: "relative",
                    transition: "background 0.2s", flexShrink: 0,
                  }}
                >
                  <span style={{
                    position: "absolute", top: 2,
                    left: highContrast ? 20 : 2,
                    width: 18, height: 18, borderRadius: "50%",
                    background: "white",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                    transition: "left 0.2s",
                    display: "block",
                  }} />
                </button>
              </div>

              {/* Text-to-Speech */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                <div>
                  <p style={{ fontSize: 12, fontWeight: 600, color: "#0f172a", margin: 0 }}>Read Aloud</p>
                  <p style={{ fontSize: 10, color: "#94a3b8", margin: 0 }}>Auto-reads new messages</p>
                </div>
                <button
                  role="switch"
                  aria-checked={ttsEnabled}
                  aria-label="Toggle read aloud for new messages"
                  onClick={() => setTtsEnabled(p => !p)}
                  style={{
                    width: 40, height: 22, borderRadius: 99,
                    background: ttsEnabled ? "#0d9488" : "#e2e8f0",
                    border: "none", cursor: "pointer", position: "relative",
                    transition: "background 0.2s", flexShrink: 0,
                  }}
                >
                  <span style={{
                    position: "absolute", top: 2,
                    left: ttsEnabled ? 20 : 2,
                    width: 18, height: 18, borderRadius: "50%",
                    background: "white",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                    transition: "left 0.2s",
                    display: "block",
                  }} />
                </button>
              </div>

              {/* Keyboard shortcuts reminder */}
              <div style={{ background: "#f8fafc", borderRadius: 10, padding: 10, border: "1px solid #e2e8f0" }}>
                <p style={{ fontSize: 10, fontWeight: 700, color: "#64748b", margin: "0 0 6px" }}>KEYBOARD SHORTCUTS</p>
                <p style={{ fontSize: 10, color: "#94a3b8", margin: "0 0 3px" }}>↵ Enter — Send message</p>
                <p style={{ fontSize: 10, color: "#94a3b8", margin: "0 0 3px" }}>⇧ Shift+Enter — New line</p>
                <p style={{ fontSize: 10, color: "#94a3b8", margin: 0 }}>Esc — Close accessibility panel</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Messages */}
      <div
        ref={messagesRef}
        role="list"
        aria-label="Message history"
        aria-live="polite"
        style={{ flex: 1, overflowY: "auto", padding: "20px 24px" }}
      >
        {loading && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[...Array(4)].map((_, i) => (
              <div key={i} style={{ display: "flex", justifyContent: i % 2 === 0 ? "flex-start" : "flex-end" }}>
                <div style={{
                  height: 38, width: i % 2 === 0 ? "45%" : "35%",
                  borderRadius: 14, background: "#e2e8f0",
                  animation: "shimmer 1.5s ease infinite",
                }} />
              </div>
            ))}
          </div>
        )}

        {!loading && messages.map((msg, i) => {
          const isMe = msg.sender_id === currentUserId;
          const prevMsg = messages[i - 1];
          const prevSame = prevMsg?.sender_id === msg.sender_id;
          const showAvatar = !isMe && !prevSame;
          return (
            <div key={msg.id} style={{ marginTop: prevSame ? 4 : 16 }}>
              <MessageBubble
                message={msg}
                isMe={isMe}
                showAvatar={showAvatar}
                avatarInitials={conversation.participant.avatar_initials}
                avatarColor={avatarColor}
                fontSize={fontSize}
                highContrast={highContrast}
              />
            </div>
          );
        })}

        {isTyping && (
          <TypingIndicator
            avatarInitials={conversation.participant.avatar_initials}
            avatarColor={avatarColor}
          />
        )}
        <div ref={bottomRef} />
      </div>

      {/* Message Templates */}
      <TemplatesBar onSelect={(text) => {
        setInput(text);
        setTimeout(() => textareaRef.current?.focus(), 50);
      }} />

      {/* Input Area — matches screenshot exactly */}
      <div style={{
        padding: "12px 16px 14px",
        background: "white",
        borderTop: `1px solid ${borderColor}`,
      }}>
        <div style={{
          display: "flex", alignItems: "center", gap: 10,
          background: "#f1f5f9",
          border: "1.5px solid #e2e8f0",
          borderRadius: 999,
          padding: "6px 6px 6px 14px",
          transition: "border-color 0.15s",
        }}
          onFocusCapture={e => e.currentTarget.style.borderColor = "#0d9488"}
          onBlurCapture={e => e.currentTarget.style.borderColor = "#e2e8f0"}
        >
          {/* Attachment */}
          <button
            aria-label="Attach a file"
            style={{
              width: 34, height: 34, borderRadius: "50%",
              background: "white",
              border: "1.5px solid #e2e8f0",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#94a3b8", cursor: "pointer", flexShrink: 0,
              transition: "all 0.15s",
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "#99f6e4"; e.currentTarget.style.color = "#0d9488"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.color = "#94a3b8"; }}
          >
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
            </svg>
          </button>

          {/* Mic */}
          <MicButton
            disabled={sending}
            onTranscript={(text) => {
              setInput(prev => prev ? prev + " " + text : text);
              setTimeout(() => textareaRef.current?.focus(), 50);
            }}
          />

          {/* Textarea */}
          <textarea
            ref={textareaRef}
            rows={1}
            value={input}
            aria-label="Type your message"
            aria-multiline="true"
            onChange={e => {
              setInput(e.target.value);
              e.target.style.height = "auto";
              e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
            }}
            onKeyDown={e => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
              if (e.key === "Escape") setShowA11yPanel(false);
            }}
            placeholder="Type a message..."
            style={{
              flex: 1,
              background: "transparent",
              border: "none",
              outline: "none",
              resize: "none",
              fontSize: fontSize,
              color: highContrast ? "#000" : "#0f172a",
              lineHeight: 1.55,
              fontFamily: "'DM Sans', sans-serif",
              padding: "4px 0",
              maxHeight: 120,
              overflowY: "auto",
            }}
          />

          {/* Send */}
          <button
            onClick={handleSend}
            disabled={!input.trim() || sending}
            aria-label="Send message"
            style={{
              width: 36, height: 36, borderRadius: "50%", flexShrink: 0,
              background: input.trim() && !sending
                ? "linear-gradient(135deg, #0d9488, #0f766e)"
                : "transparent",
              border: "none",
              cursor: input.trim() && !sending ? "pointer" : "default",
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "all 0.15s",
            }}
          >
            {sending ? (
              <svg width="15" height="15" fill="none" viewBox="0 0 24 24" style={{ animation: "spin 0.8s linear infinite" }}>
                <circle cx="12" cy="12" r="10" stroke="#0d9488" strokeWidth="3" strokeOpacity="0.3" />
                <path fill="#0d9488" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : (
              <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke={input.trim() ? "white" : "#cbd5e1"} style={{ transform: "rotate(90deg)" }} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            )}
          </button>
        </div>

        <p style={{ fontSize: 10, color: "#94a3b8", textAlign: "center", marginTop: 8, marginBottom: 0 }}>
          Enter to send · Shift+Enter for new line
        </p>
      </div>

      <style>{`
        @keyframes bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-4px)} }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes shimmer { 0%,100%{opacity:1} 50%{opacity:0.4} }
        @keyframes micPulse { 0%{transform:scale(1);opacity:0.8} 100%{transform:scale(1.7);opacity:0} }
        .read-aloud-btn { opacity: 0 !important; }
        [role="listitem"]:hover .read-aloud-btn { opacity: 1 !important; }
      `}</style>
    </div>
  );
}