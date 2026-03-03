"use client";
import { useState } from "react";
import ConversationList from "./ConversationList";
import ChatWindow from "./ChatWindow";

const MOCK_CURRENT_USER_ID = "user-worker-1";

export default function MessagingInbox() {
  const [selectedConv, setSelectedConv] = useState(null);
  const [showList, setShowList] = useState(true); // mobile toggle

  return (
    <div
      style={{
        display: "flex",
        height: "calc(100vh - 58px)",
        overflow: "hidden",
        background: "#f0f4f8",
        fontFamily: "'DM Sans', 'Inter', sans-serif",
      }}
    >
      {/* Sidebar */}
      <div
        style={{
          width: 340,
          flexShrink: 0,
          display: showList || !selectedConv ? "flex" : "none",
          flexDirection: "column",
        }}
        className="messaging-sidebar"
      >
        <ConversationList
          currentUserId={MOCK_CURRENT_USER_ID}
          selectedId={selectedConv?.id}
          onSelect={(conv) => {
            setSelectedConv(conv);
            setShowList(false);
          }}
        />
      </div>

      {/* Chat Area */}
      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
        <ChatWindow
          conversation={selectedConv}
          currentUserId={MOCK_CURRENT_USER_ID}
          onMessageSent={() => {}}
          onBack={() => setShowList(true)}
        />
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
        @media (max-width: 768px) {
          .messaging-sidebar { width: 100% !important; }
        }
      `}</style>
    </div>
  );
}