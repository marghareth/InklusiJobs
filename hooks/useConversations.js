"use client";
import { useState, useEffect, useCallback } from "react";

// ============================================================
// MOCK DATA — shaped exactly like Supabase will return
// When Phase 3 comes, only the fetch/subscribe sections change
// ============================================================
const MOCK_CONVERSATIONS = [
  {
    id: "conv-1",
    created_at: "2026-02-26T02:30:00Z",
    employer_id: "user-employer-1",
    worker_id: "user-worker-1",
    last_message: "Hi! I saw your profile and I think you'd be a great fit for our team.",
    last_message_at: "2026-02-26T11:02:00Z",
    unread_count: 2,
    participant: {
      id: "user-employer-1",
      name: "Maria Santos",
      role: "employer",
      company: "TechCorp PH",
      avatar_initials: "MS",
      is_online: true,
    },
  },
  {
    id: "conv-2",
    created_at: "2026-02-26T01:00:00Z",
    employer_id: "user-employer-2",
    worker_id: "user-worker-1",
    last_message: "Thank you for the opportunity! I'm very interested.",
    last_message_at: "2026-02-26T10:15:00Z",
    unread_count: 0,
    participant: {
      id: "user-worker-2",
      name: "Juan dela Cruz",
      role: "worker",
      company: null,
      avatar_initials: "JD",
      is_online: true,
    },
  },
  {
    id: "conv-3",
    created_at: "2026-02-25T14:00:00Z",
    employer_id: "user-employer-3",
    worker_id: "user-worker-1",
    last_message: "Can we schedule an interview this Friday?",
    last_message_at: "2026-02-25T15:05:00Z",
    unread_count: 1,
    participant: {
      id: "user-employer-3",
      name: "Ana Reyes",
      role: "employer",
      company: "BPO Solutions",
      avatar_initials: "AR",
      is_online: false,
    },
  },
  {
    id: "conv-4",
    created_at: "2026-02-24T09:00:00Z",
    employer_id: "user-employer-4",
    worker_id: "user-worker-1",
    last_message: "I have attached my updated resume.",
    last_message_at: "2026-02-24T09:30:00Z",
    unread_count: 0,
    participant: {
      id: "user-worker-4",
      name: "Carlo Mendoza",
      role: "worker",
      company: null,
      avatar_initials: "CM",
      is_online: false,
    },
  },
  {
    id: "conv-5",
    created_at: "2026-02-23T10:00:00Z",
    employer_id: "user-employer-5",
    worker_id: "user-worker-1",
    last_message: "We'd love to have you on board. Let's talk details!",
    last_message_at: "2026-02-23T10:30:00Z",
    unread_count: 0,
    participant: {
      id: "user-employer-5",
      name: "Liza Gomez",
      role: "employer",
      company: "Inclusive Hire Co.",
      avatar_initials: "LG",
      is_online: false,
    },
  },
];

// ============================================================
// HOOK
// ============================================================
export function useConversations(currentUserId) {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ----------------------------------------------------------
  // FETCH conversations
  // ⬇ Phase 3: Replace body with:
  //   const { data, error } = await supabase
  //     .from("conversations")
  //     .select(`*, participant:profiles!conversations_participant_id_fkey(*)`)
  //     .or(`employer_id.eq.${currentUserId},worker_id.eq.${currentUserId}`)
  //     .order("last_message_at", { ascending: false });
  //   if (error) throw error;
  //   setConversations(data);
  // ----------------------------------------------------------
  const fetchConversations = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      await new Promise(res => setTimeout(res, 400)); // simulate network
      setConversations(MOCK_CONVERSATIONS);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [currentUserId]);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  // ----------------------------------------------------------
  // REALTIME subscription
  // ⬇ Phase 3: Replace body with:
  //   const channel = supabase
  //     .channel("conversations-changes")
  //     .on("postgres_changes", {
  //       event: "*", schema: "public", table: "conversations",
  //       filter: `employer_id=eq.${currentUserId}` // or worker_id
  //     }, () => fetchConversations())
  //     .subscribe();
  //   return () => supabase.removeChannel(channel);
  // ----------------------------------------------------------
  useEffect(() => {
    return () => {}; // Phase 2: no-op
  }, []);

  // ----------------------------------------------------------
  // CREATE a new conversation
  // ⬇ Phase 3: Replace body with:
  //   const { data, error } = await supabase
  //     .from("conversations")
  //     .insert({ employer_id: employerId, worker_id: workerId })
  //     .select()
  //     .single();
  //   if (error) throw error;
  //   return data;
  // ----------------------------------------------------------
  const createConversation = useCallback(async ({ employerId, workerId, participantProfile }) => {
    try {
      const existing = conversations.find(
        c => c.employer_id === employerId && c.worker_id === workerId
      );
      if (existing) return existing;

      const newConv = {
        id: `conv-${Date.now()}`,
        created_at: new Date().toISOString(),
        employer_id: employerId,
        worker_id: workerId,
        last_message: null,
        last_message_at: new Date().toISOString(),
        unread_count: 0,
        participant: participantProfile,
      };
      setConversations(prev => [newConv, ...prev]);
      return newConv;
    } catch (err) {
      setError(err.message);
      return null;
    }
  }, [conversations]);

  // ----------------------------------------------------------
  // MARK conversation as read
  // ⬇ Phase 3: Replace body with:
  //   await supabase
  //     .from("messages")
  //     .update({ is_read: true })
  //     .eq("conversation_id", conversationId)
  //     .neq("sender_id", currentUserId);
  //   await supabase
  //     .from("conversations")
  //     .update({ unread_count: 0 })
  //     .eq("id", conversationId);
  // ----------------------------------------------------------
  const markAsRead = useCallback(async (conversationId) => {
    setConversations(prev =>
      prev.map(c => c.id === conversationId ? { ...c, unread_count: 0 } : c)
    );
  }, []);

  // ----------------------------------------------------------
  // UPDATE last message preview (called by useMessages after send)
  // ⬇ Phase 3: This can stay the same OR be driven by realtime
  // ----------------------------------------------------------
  const updateLastMessage = useCallback((conversationId, text) => {
    setConversations(prev =>
      prev
        .map(c => c.id === conversationId
          ? { ...c, last_message: text, last_message_at: new Date().toISOString() }
          : c
        )
        .sort((a, b) => new Date(b.last_message_at) - new Date(a.last_message_at))
    );
  }, []);

  const totalUnread = conversations.reduce((sum, c) => sum + (c.unread_count || 0), 0);

  return {
    conversations,
    loading,
    error,
    totalUnread,
    fetchConversations,
    createConversation,
    markAsRead,
    updateLastMessage,
  };
}