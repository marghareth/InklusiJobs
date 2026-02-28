// lib/supabase/server.js
// DEMO VERSION — Supabase replaced with localStorage
// Server-side Supabase removed. Auth is now handled by Firebase (client-side).
// This stub exists so any server components that import createClient() don't break.

export async function createClient() {
  return {
    auth: {
      getUser: async () => {
        // Server components can't access localStorage directly.
        // Auth checks should be done client-side using Firebase + localStorage.
        return { data: { user: null }, error: null };
      },
      getSession: async () => {
        return { data: { session: null }, error: null };
      },
    },

    from: (table) => ({
      select: () => ({ data: [], error: null }),
      insert: () => ({ data: null, error: null }),
      update: () => ({ data: null, error: null }),
      upsert: () => ({ data: null, error: null }),
      delete: () => ({ data: null, error: null }),
      eq: () => ({ data: [], error: null }),
      single: () => ({ data: null, error: null }),
    }),
  };
}