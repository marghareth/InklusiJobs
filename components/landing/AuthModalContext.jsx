"use client";

/**
 * AuthModalContext.jsx
 * Location: components/landing/AuthModalContext.jsx
 *
 * Change summary vs original:
 *   - Imports useRouter from next/navigation
 *   - Adds handleAuthSuccess(role) → redirects to /dashboard/worker or /dashboard/employer
 *   - Passes onSuccess={handleAuthSuccess} to <AuthModal>
 *
 * When you add real auth later:
 *   - Put your token/session logic inside handleAuthSuccess before router.push
 *   - Everything else stays the same
 */

import { createContext, useContext, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import RoleSelector from "@/components/landing/RoleSelector";
import AuthModal from "@/components/landing/AuthModal";

const AuthModalContext = createContext(null);

export function AuthModalProvider({ children }) {
  const router = useRouter();

  const [roleOpen, setRoleOpen]         = useState(false);
  const [authOpen, setAuthOpen]         = useState(false);
  const [authTab, setAuthTab]           = useState("signup");
  const [selectedRole, setSelectedRole] = useState(null);

  // ─── Redirect handler ─────────────────────────────────────────────────────
  /**
   * Called by AuthModal's SignInForm / SignUpForm on submit.
   * @param {string|null} role - "worker" | "employer" | null
   *
   * TODO: when you wire up real auth, add your session/token logic here
   * before the router.push call. Example:
   *
   *   await saveSessionToStorage(token, role);
   *   router.push(`/dashboard/${role}`);
   */
  const handleAuthSuccess = useCallback((role) => {
    setAuthOpen(false);

    if (role === "worker") {
      router.push("/dashboard/worker");
    } else if (role === "employer") {
      router.push("/dashboard/employer");
    } else {
      // Fallback: no role selected (e.g. plain sign-in without role picker)
      // You can update this once your real auth returns a role from the server
      router.push("/dashboard/worker");
    }
  }, [router]);

  // ─── Existing openers (unchanged) ─────────────────────────────────────────
  const openAsWorker = useCallback(() => {
    setSelectedRole("worker");
    setAuthTab("signup");
    setAuthOpen(true);
  }, []);

  const openAsEmployer = useCallback(() => {
    setSelectedRole("employer");
    setAuthTab("signup");
    setAuthOpen(true);
  }, []);

  const openRoleSelector = useCallback(() => {
    setRoleOpen(true);
  }, []);

  const openSignIn = useCallback(() => {
    setSelectedRole(null);
    setAuthTab("signin");
    setAuthOpen(true);
  }, []);

  const handleRoleSelect = useCallback((role) => {
    setSelectedRole(role);
    setRoleOpen(false);
    setAuthTab("signup");
    setAuthOpen(true);
  }, []);

  const closeAll = useCallback(() => {
    setRoleOpen(false);
    setAuthOpen(false);
  }, []);

  return (
    <AuthModalContext.Provider value={{ openAsWorker, openAsEmployer, openRoleSelector, openSignIn }}>
      {children}

      <RoleSelector
        isOpen={roleOpen}
        onClose={closeAll}
        onSelectRole={handleRoleSelect}
      />

      {/* onSuccess is the only new prop — everything else is identical */}
      <AuthModal
        isOpen={authOpen}
        onClose={closeAll}
        onSuccess={handleAuthSuccess}
        defaultTab={authTab}
        role={selectedRole}
      />
    </AuthModalContext.Provider>
  );
}

export function useAuthModalContext() {
  const ctx = useContext(AuthModalContext);
  if (!ctx) throw new Error("useAuthModalContext must be used inside <AuthModalProvider>");
  return ctx;
}