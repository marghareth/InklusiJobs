// lib/supabase/client.js
// DEMO VERSION — Supabase replaced with localStorage
// This file exists so existing imports don't break.
// Instead of a Supabase client, we export localStorage-based auth helpers.

import { getCurrentUser, getCurrentRole } from "@/lib/initMockData";

/**
 * Drop-in replacement for createClient().
 * Returns a mock client that reads from localStorage instead of Supabase.
 */
export const createClient = () => {
  return {
    auth: {
      // Get the current logged-in user from localStorage
      getUser: async () => {
        const user = getCurrentUser();
        if (!user) return { data: { user: null }, error: { message: "Not authenticated" } };
        return { data: { user }, error: null };
      },

      // Get the current session (mirrors Supabase session shape)
      getSession: async () => {
        const user = getCurrentUser();
        if (!user) return { data: { session: null }, error: null };
        return {
          data: {
            session: {
              user,
              access_token: "mock_token_demo",
            },
          },
          error: null,
        };
      },

      // Sign out — clears localStorage auth data
      signOut: async () => {
        localStorage.removeItem("inklusi_current_user");
        localStorage.removeItem("inklusi_current_role");
        return { error: null };
      },

      // Listen for auth state changes (no-op for demo — Firebase handles this)
      onAuthStateChange: (callback) => {
        // Firebase handles auth state — this is a no-op stub
        return { data: { subscription: { unsubscribe: () => {} } } };
      },
    },

    // Stub .from() so any remaining Supabase DB calls fail gracefully
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
};