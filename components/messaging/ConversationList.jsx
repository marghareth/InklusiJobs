"use client";
import { useState } from "react";
import { useConversations } from "@/hooks/useConversations";

const AVATAR_COLORS = [
  "bg-violet-600", "bg-emerald-600", "bg-sky-600",
  "bg-rose-600", "bg-amber-600", "bg-teal-600",
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
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return "Yesterday";
  return `${diffDays} days ago`;
}

function ConversationSkeleton() {
  return (
    <div className="flex items-center gap-3 px-3 py-3 animate-pulse">
      <div className="w-11 h-11 rounded-full bg-white/6 shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-3 bg-white/6 rounded w-3/4" />
        <div className="h-2.5 bg-white/4 rounded w-full" />
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
    <div className="flex flex-col h-full bg-[#0f1117] border-r border-white/6">
      <div className="px-5 pt-6 pb-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white font-semibold text-lg tracking-tight">Messages</h2>
          {totalUnread > 0 && (
            <span className="text-xs bg-violet-500 text-white font-semibold px-2 py-0.5 rounded-full">
              {totalUnread} unread
            </span>
          )}
        </div>
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search conversations..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-white/5 border border-white/8 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-violet-500/50 transition-all"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-2 pb-4 space-y-0.5">
        {loading && Array.from({ length: 4 }).map((_, i) => <ConversationSkeleton key={i} />)}
        {error && <p className="text-red-400/70 text-xs text-center py-6 px-4">Failed to load conversations.</p>}
        {!loading && !error && filtered.length === 0 && (
          <p className="text-white/30 text-sm text-center py-8">{search ? "No results found" : "No conversations yet"}</p>
        )}
        {!loading && filtered.map((conv, i) => (
          <button
            key={conv.id}
            onClick={() => onSelect(conv)}
            className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left transition-all
              ${selectedId === conv.id
                ? "bg-violet-600/20 border border-violet-500/20"
                : "hover:bg-white/4 border border-transparent"}`}
          >
            <div className="relative shrink-0">
              <div className={`w-11 h-11 rounded-full ${AVATAR_COLORS[i % AVATAR_COLORS.length]} flex items-center justify-center text-white text-sm font-semibold`}>
                {conv.participant.avatar_initials}
              </div>
              {conv.participant.is_online && (
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 rounded-full border-2 border-[#0f1117]" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-0.5">
                <span className={`text-sm font-medium truncate ${selectedId === conv.id ? "text-white" : "text-white/80"}`}>
                  {conv.participant.name}
                </span>
                <span className="text-xs text-white/30 shrink-0 ml-2">{formatTime(conv.last_message_at)}</span>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-xs text-white/40 truncate pr-2">{conv.last_message || "No messages yet"}</p>
                {conv.unread_count > 0 && (
                  <span className="shrink-0 w-5 h-5 bg-violet-500 rounded-full text-[10px] text-white font-semibold flex items-center justify-center">
                    {conv.unread_count}
                  </span>
                )}
              </div>
              {conv.participant.company && (
                <p className="text-[10px] text-violet-400/60 mt-0.5">{conv.participant.company}</p>
              )}
            </div>
          </button>
        ))}
      </div>

      <div className="p-4 border-t border-white/6">
        <button className="w-full flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-500 transition-colors text-white text-sm font-medium py-2.5 rounded-xl">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Message
        </button>
      </div>
    </div>
  );
}