"use client";
import { useState, useEffect, useCallback, useRef } from "react";

// ============================================================
// MOCK DATA — shaped exactly like Supabase will return
// ============================================================
const MOCK_MESSAGES = {
  "conv-1": [
    { id: "msg-1-1", conversation_id: "conv-1", sender_id: "user-employer-1", content: "Hello! I came across your profile on InklusJobs and I'm really impressed with your background.", created_at: "2026-02-26T10:30:00Z", is_read: true },
    { id: "msg-1-2", conversation_id: "conv-1", sender_id: "user-employer-1", content: "We have an opening for a Customer Support Specialist that I think would be a perfect fit.", created_at: "2026-02-26T10:31:00Z", is_read: true },
    { id: "msg-1-3", conversation_id: "conv-1", sender_id: "user-worker-1", content: "Hi Maria! Thank you so much for reaching out. I'm definitely interested in learning more.", created_at: "2026-02-26T10:45:00Z", is_read: true },
    { id: "msg-1-4", conversation_id: "conv-1", sender_id: "user-worker-1", content: "Could you tell me more about the working setup? Is it remote or onsite?", created_at: "2026-02-26T10:46:00Z", is_read: true },
    { id: "msg-1-5", conversation_id: "conv-1", sender_id: "user-employer-1", content: "It's a hybrid setup — 3 days remote, 2 days onsite in Makati. We also have full accessibility accommodations.", created_at: "2026-02-26T10:50:00Z", is_read: true },
    { id: "msg-1-6", conversation_id: "conv-1", sender_id: "user-employer-1", content: "Hi! I saw your profile and I think you'd be a great fit for our team.", created_at: "2026-02-26T11:02:00Z", is_read: false },
  ],
  "conv-2": [
    { id: "msg-2-1", conversation_id: "conv-2", sender_id: "user-employer-2", content: "Good morning! I just reviewed your application for the Data Entry position.", created_at: "2026-02-26T09:00:00Z", is_read: true },
    { id: "msg-2-2", conversation_id: "conv-2", sender_id: "user-employer-2", content: "Your skills look great. Would you be available for a quick call this week?", created_at: "2026-02-26T09:01:00Z", is_read: true },
    { id: "msg-2-3", conversation_id: "conv-2", sender_id: "user-worker-1", content: "Thank you for the opportunity! I'm very interested in the position.", created_at: "2026-02-26T09:15:00Z", is_read: true },
  ],
  "conv-3": [
    { id: "msg-3-1", conversation_id: "conv-3", sender_id: "user-employer-3", content: "Hi there! We reviewed your assessment results and we're very impressed.", created_at: "2026-02-25T14:00:00Z", is_read: true },
    { id: "msg-3-2", conversation_id: "conv-3", sender_id: "user-worker-1", content: "That's great to hear! Thank you.", created_at: "2026-02-25T15:00:00Z", is_read: true },
    { id: "msg-3-3", conversation_id: "conv-3", sender_id: "user-employer-3", content: "Can we schedule an interview this Friday?", created_at: "2026-02-25T15:05:00Z", is_read: false },
  ],
  "conv-4": [
    { id: "msg-4-1", conversation_id: "conv-4", sender_id: "user-worker-1", content: "Hello! I wanted to follow up on my application.", created_at: "2026-02-24T09:00:00Z", is_read: true },
    { id: "msg-4-2", conversation_id: "conv-4", sender_id: "user-employer-4", content: "Hi Carlo! We received it. We'll review and get back to you soon.", created_at: "2026-02-24T09:10:00Z", is_read: true },
    { id: "msg-4-3", conversation_id: "conv-4", sender_id: "user-worker-1", content: "I have attached my updated resume. Please check it out.", created_at: "2026-02-24T09:30:00Z", is_read: true },
  ],
  "conv-5": [
    { id: "msg-5-1", conversation_id: "conv-5", sender_id: "user-employer-5", content: "We reviewed your profile and we think you're a great match!", created_at: "2026-02-23T10:00:00Z", is_read: true },
    { id: "msg-5-2", conversation_id: "conv-5", sender_id: "user-worker-1", content: "Wow, that's wonderful news! I'm very excited.", created_at: "2026-02-23T10:15:00Z", is_read: true },
    { id: "msg-5-3", conversation_id: "conv-5", sender_id: "user-employer-5", content: "We'd love to have you on board. Let's talk details!", created_at: "2026-02-23T10:30:00Z", is_read: true },
  ],
};

// Simulated auto-replies for demo
const AUTO_REPLIES = [
  "Thanks for your message! I'll get back to you shortly.",
  "That sounds great! Let me check my schedule.",
  "Sure, I'd be happy to discuss this further.",
  "Thank you for reaching out. I'll review and respond soon.",
  "Noted! I'll follow up with more details.",
];

// ============================================================
// HOOK
// ============================================================
export function useMessages(conversationId, currentUserId, { onNewMessage } = {}) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState(null);
  const messagesRef = useRef({}); // local store for mock persistence

  // ----------------------------------------------------------
  // FETCH messages for a conversation
  // ⬇ Phase 3: Replace body with:
  //   const { data, error } = await supabase
  //     .from("messages")
  //     .select("*")
  //     .eq("conversation_id", conversationId)
  //     .order("created_at", { ascending: true });
  //   if (error) throw error;
  //   setMessages(data);
  // ----------------------------------------------------------
  const fetchMessages = useCallback(async () => {
    if (!conversationId) return;
    try {
      setLoading(true);
      setError(null);
      await new Promise(res => setTimeout(res, 300)); // simulate network
      const stored = messagesRef.current[conversationId];
      const data = stored || MOCK_MESSAGES[conversationId] || [];
      messagesRef.current[conversationId] = data;
      setMessages(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [conversationId]);

  useEffect(() => {
    if (conversationId) fetchMessages();
  }, [fetchMessages, conversationId]);

  // ----------------------------------------------------------
  // REALTIME subscription for new messages
  // ⬇ Phase 3: Replace body with:
  //   const channel = supabase
  //     .channel(`messages-${conversationId}`)
  //     .on("postgres_changes", {
  //       event: "INSERT", schema: "public", table: "messages",
  //       filter: `conversation_id=eq.${conversationId}`
  //     }, (payload) => {
  //       setMessages(prev => [...prev, payload.new]);
  //       onNewMessage?.(payload.new);
  //     })
  //     .subscribe();
  //   return () => supabase.removeChannel(channel);
  // ----------------------------------------------------------
  useEffect(() => {
    return () => {}; // Phase 2: no-op
  }, [conversationId]);

  // ----------------------------------------------------------
  // SEND a message
  // ⬇ Phase 3: Replace body with:
  //   const { data, error } = await supabase
  //     .from("messages")
  //     .insert({
  //       conversation_id: conversationId,
  //       sender_id: currentUserId,
  //       content: content.trim(),
  //       is_read: false,
  //     })
  //     .select()
  //     .single();
  //   if (error) throw error;
  //   return data;
  // ----------------------------------------------------------
  const sendMessage = useCallback(async (content) => {
    if (!content?.trim() || !conversationId) return null;
    try {
      setSending(true);
      setError(null);

      const newMessage = {
        id: `msg-${Date.now()}`,
        conversation_id: conversationId,
        sender_id: currentUserId,
        content: content.trim(),
        created_at: new Date().toISOString(),
        is_read: false,
      };

      // Update local state
      setMessages(prev => {
        const updated = [...prev, newMessage];
        messagesRef.current[conversationId] = updated;
        return updated;
      });

      onNewMessage?.(newMessage);

      // Simulate other person typing then replying
      setTimeout(() => setIsTyping(true), 600);
      setTimeout(() => {
        setIsTyping(false);
        const reply = {
          id: `msg-${Date.now() + 1}`,
          conversation_id: conversationId,
          sender_id: "other",
          content: AUTO_REPLIES[Math.floor(Math.random() * AUTO_REPLIES.length)],
          created_at: new Date().toISOString(),
          is_read: false,
        };
        setMessages(prev => {
          const updated = [...prev, reply];
          messagesRef.current[conversationId] = updated;
          return updated;
        });
        onNewMessage?.(reply);
      }, 2200);

      return newMessage;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setSending(false);
    }
  }, [conversationId, currentUserId, onNewMessage]);

  // ----------------------------------------------------------
  // MARK messages as read
  // ⬇ Phase 3: Replace body with:
  //   await supabase
  //     .from("messages")
  //     .update({ is_read: true })
  //     .eq("conversation_id", conversationId)
  //     .neq("sender_id", currentUserId);
  // ----------------------------------------------------------
  const markMessagesAsRead = useCallback(async () => {
    setMessages(prev =>
      prev.map(m =>
        m.sender_id !== currentUserId ? { ...m, is_read: true } : m
      )
    );
  }, [conversationId, currentUserId]);

  return {
    messages,
    loading,
    sending,
    isTyping,
    error,
    sendMessage,
    markMessagesAsRead,
    fetchMessages,
  };
}