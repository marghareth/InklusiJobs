"use client";
import { createContext, useContext, useState, useCallback } from "react";

const ChatPopupContext = createContext(null);

export function ChatPopupProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [participant, setParticipant] = useState(null); // who we're chatting with

  // Call this from any MessageButton anywhere in the app
  // participant shape: { id, name, role, company, avatar_initials, is_online }
  const openChat = useCallback((participantData) => {
    setParticipant(participantData);
    setIsOpen(true);
  }, []);

  const closeChat = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <ChatPopupContext.Provider value={{ isOpen, participant, openChat, closeChat }}>
      {children}
    </ChatPopupContext.Provider>
  );
}

export function useChatPopup() {
  const ctx = useContext(ChatPopupContext);
  if (!ctx) throw new Error("useChatPopup must be used inside <ChatPopupProvider>");
  return ctx;
}