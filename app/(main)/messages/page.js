"use client";
import { useState, useCallback } from "react";
import ConversationList from "@/components/messaging/ConversationList";
import ChatWindow from "@/components/messaging/ChatWindow";
import { useConversations } from "@/hooks/useConversations";

// TODO Phase 3: Replace with real user from your auth session
// e.g. const { data: { session } } = await supabase.auth.getSession();
const MOCK_CURRENT_USER_ID = "user-worker-1";

export default function MessagesPage() {
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [mobileView, setMobileView] = useState("list");

  const { markAsRead, updateLastMessage } = useConversations(MOCK_CURRENT_USER_ID);

  const handleSelectConversation = useCallback((conv) => {
    setSelectedConversation(conv);
    setMobileView("chat");
    markAsRead(conv.id);
  }, [markAsRead]);

  const handleMessageSent = useCallback((message) => {
    if (selectedConversation) {
      updateLastMessage(selectedConversation.id, message.content);
    }
  }, [selectedConversation, updateLastMessage]);

  return (
    <div className="h-screen bg-[#0d0f14] flex flex-col">
      {/* Top bar */}
      <div className="flex items-center gap-3 px-6 py-4 border-b border-white/6 bg-[#0f1117]">
        {mobileView === "chat" && selectedConversation && (
          <button
            onClick={() => setMobileView("list")}
            className="md:hidden w-8 h-8 rounded-lg hover:bg-white/6 flex items-center justify-center text-white/60 mr-1"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-violet-600/20 border border-violet-500/20 flex items-center justify-center">
            <svg className="w-4 h-4 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </div>
          <span className="text-white font-semibold text-sm">InklusJobs Messaging</span>
        </div>
      </div>

      {/* Main layout */}
      <div className="flex-1 flex overflow-hidden">
        <div className={`w-80 shrink-0 ${mobileView === "chat" ? "hidden md:flex md:flex-col" : "flex flex-col w-full md:w-80"}`}>
          <ConversationList
            currentUserId={MOCK_CURRENT_USER_ID}
            selectedId={selectedConversation?.id}
            onSelect={handleSelectConversation}
          />
        </div>
        <div className={`flex-1 min-w-0 ${mobileView === "list" ? "hidden md:flex" : "flex"}`}>
          <ChatWindow
            conversation={selectedConversation}
            currentUserId={MOCK_CURRENT_USER_ID}
            onMessageSent={handleMessageSent}
          />
        </div>
      </div>
    </div>
  );
}