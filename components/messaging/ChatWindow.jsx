"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { useMessages } from "@/hooks/useMessages";

const AVATAR_COLORS = [
  "bg-violet-600", "bg-emerald-600", "bg-sky-600",
  "bg-rose-600", "bg-amber-600", "bg-teal-600",
];

function formatTime(isoString) {
  if (!isoString) return "";
  return new Date(isoString).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function TypingIndicator({ avatarInitials, colorClass }) {
  return (
    <div className="flex items-end gap-2 mt-4">
      <div className={`w-8 h-8 rounded-full ${colorClass} flex items-center justify-center text-white text-xs font-semibold shrink-0`}>
        {avatarInitials}
      </div>
      <div className="bg-white/[0.07] border border-white/8 rounded-2xl rounded-bl-sm px-4 py-3">
        <div className="flex items-center gap-1.5 h-4">
          {[0, 150, 300].map((delay, i) => (
            <span
              key={i}
              className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce"
              style={{ animationDelay: `${delay}ms` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function MessageBubble({ message, isMe, showAvatar, avatarInitials, colorClass }) {
  return (
    <div className={`flex items-end gap-2 ${isMe ? "flex-row-reverse" : "flex-row"}`}>
      {!isMe && (
        <div className="w-8 shrink-0">
          {showAvatar && (
            <div className={`w-8 h-8 rounded-full ${colorClass} flex items-center justify-center text-white text-xs font-semibold`}>
              {avatarInitials}
            </div>
          )}
        </div>
      )}
      <div className={`max-w-[68%] flex flex-col gap-0.5 ${isMe ? "items-end" : "items-start"}`}>
        <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
          isMe
            ? "bg-violet-600 text-white rounded-br-sm"
            : "bg-white/[0.07] border border-white/8 text-white/85 rounded-bl-sm"
        }`}>
          {message.content}
        </div>
        <div className={`flex items-center gap-1 px-1 ${isMe ? "flex-row-reverse" : "flex-row"}`}>
          <span className="text-[10px] text-white/25">{formatTime(message.created_at)}</span>
          {isMe && (
            <svg className={`w-3 h-3 ${message.is_read ? "text-violet-400" : "text-white/25"}`} fill="currentColor" viewBox="0 0 24 24">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
            </svg>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ChatWindow({ conversation, currentUserId, onMessageSent }) {
  const [input, setInput] = useState("");
  const bottomRef = useRef(null);
  const textareaRef = useRef(null);
  const convIndex = conversation
    ? parseInt(conversation.id.replace("conv-", "")) - 1
    : 0;
  const colorClass = AVATAR_COLORS[convIndex % AVATAR_COLORS.length];

  const {
    messages,
    loading,
    sending,
    isTyping,
    sendMessage,
    markMessagesAsRead,
  } = useMessages(conversation?.id, currentUserId, {
    onNewMessage: onMessageSent,
  });

  // Scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Mark as read when conversation is opened
  useEffect(() => {
    if (conversation) markMessagesAsRead();
  }, [conversation?.id]);

  const handleSend = useCallback(async () => {
    if (!input.trim() || sending) return;
    const text = input.trim();
    setInput("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
    const sent = await sendMessage(text);
    if (sent) onMessageSent?.(sent);
  }, [input, sending, sendMessage, onMessageSent]);

  if (!conversation) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-[#0d0f14] text-center px-8">
        <div className="w-20 h-20 rounded-2xl bg-white/4 border border-white/6 flex items-center justify-center mb-5">
          <svg className="w-9 h-9 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        </div>
        <h3 className="text-white/60 font-medium mb-2">Your Messages</h3>
        <p className="text-white/25 text-sm max-w-xs leading-relaxed">
          Select a conversation to connect with employers and workers.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-[#0d0f14] min-w-0">
      {/* Header */}
      <div className="flex items-center gap-3 px-6 py-4 border-b border-white/6 bg-[#0f1117]/80 backdrop-blur-sm">
        <div className="relative">
          <div className={`w-10 h-10 rounded-full ${colorClass} flex items-center justify-center text-white text-sm font-semibold`}>
            {conversation.participant.avatar_initials}
          </div>
          {conversation.participant.is_online && (
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-[#0f1117]" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-medium text-sm">{conversation.participant.name}</h3>
          <p className="text-xs mt-0.5">
            {conversation.participant.is_online
              ? <span className="text-emerald-400">● Online</span>
              : <span className="text-white/40">Last seen recently</span>}
            {conversation.participant.company && (
              <span className="text-white/40"> · {conversation.participant.company}</span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-1">
          {[
            "M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z",
            "M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
          ].map((path, i) => (
            <button key={i} className="w-9 h-9 rounded-lg hover:bg-white/6 transition-colors flex items-center justify-center text-white/40 hover:text-white/70">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={path} />
              </svg>
            </button>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-5">
        {loading && (
          <div className="flex flex-col gap-3 animate-pulse">
            {[...Array(4)].map((_, i) => (
              <div key={i} className={`flex ${i % 2 === 0 ? "justify-start" : "justify-end"}`}>
                <div className={`h-9 rounded-2xl bg-white/6 ${i % 2 === 0 ? "w-48" : "w-36"}`} />
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
            <div key={msg.id} className={`${prevSame ? "mt-1" : "mt-4"}`}>
              <MessageBubble
                message={msg}
                isMe={isMe}
                showAvatar={showAvatar}
                avatarInitials={conversation.participant.avatar_initials}
                colorClass={colorClass}
              />
            </div>
          );
        })}

        {isTyping && (
          <TypingIndicator
            avatarInitials={conversation.participant.avatar_initials}
            colorClass={colorClass}
          />
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-5 py-4 border-t border-white/6 bg-[#0f1117]/80">
        <div className="flex items-end gap-3">
          <button className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/8 border border-white/8 flex items-center justify-center text-white/40 hover:text-white/70 transition-all shrink-0">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
            </svg>
          </button>
          <div className="flex-1">
            <textarea
              ref={textareaRef}
              rows={1}
              value={input}
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
              }}
              placeholder="Type a message..."
              className="w-full bg-white/5 border border-white/8 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-violet-500/40 transition-all resize-none leading-relaxed"
            />
          </div>
          <button
            onClick={handleSend}
            disabled={!input.trim() || sending}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all shrink-0 ${
              input.trim() && !sending
                ? "bg-violet-600 hover:bg-violet-500 text-white shadow-lg shadow-violet-500/25"
                : "bg-white/5 text-white/20 cursor-not-allowed"
            }`}
          >
            {sending ? (
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : (
              <svg className="w-4 h-4 rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            )}
          </button>
        </div>
        <p className="text-[10px] text-white/20 mt-2 text-center">Enter to send · Shift+Enter for new line</p>
      </div>
    </div>
  );
}