"use client";

import { createContext, useContext, useState, useCallback } from "react";
import RoleSelector from "@/components/landing/RoleSelector";
import AuthModal from "@/components/landing/AuthModal";

const AuthModalContext = createContext(null);

/**
 * Wrap your root layout or page with <AuthModalProvider>.
 * Any component can then call useAuthModalContext() to open the modal.
 */
export function AuthModalProvider({ children }) {
  const [roleOpen, setRoleOpen]         = useState(false);
  const [authOpen, setAuthOpen]         = useState(false);
  const [authTab, setAuthTab]           = useState("signup");
  const [selectedRole, setSelectedRole] = useState(null);

  // "Get Started" / "Start Your Journey" → open RoleSelector first
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

  // Navbar "Get Started" → show role picker first
  const openRoleSelector = useCallback(() => {
    setRoleOpen(true);
  }, []);

  // Navbar "Log In" → straight to sign-in, no role badge
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
      <AuthModal
        isOpen={authOpen}
        onClose={closeAll}
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