"use client";
import { useState } from "react";
import ConversationList from "./ConversationList";
import ChatWindow from "./ChatWindow";

// TODO Phase 3: Replace with real current user from auth session
const MOCK_CURRENT_USER_ID = "user-worker-1";

export default function MessagingInbox() {
  const [selectedConv, setSelectedConv] = useState(null);

  return (
    <div style={{ display: "flex", height: "calc(100vh - 58px)", overflow: "hidden" }}>
      <div style={{ width: 320, flexShrink: 0 }}>
        <ConversationList
          currentUserId={MOCK_CURRENT_USER_ID}
          selectedId={selectedConv?.id}
          onSelect={setSelectedConv}
        />
      </div>
      <ChatWindow
        conversation={selectedConv}
        currentUserId={MOCK_CURRENT_USER_ID}
        onMessageSent={() => {}}
      />
    </div>
  );
}