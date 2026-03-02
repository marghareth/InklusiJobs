"use client";

import { createContext, useContext, useState, useCallback, useEffect } from "react";
import RoleSelector from "@/components/landing/RoleSelector";
import AuthModal from "@/components/landing/AuthModal";

const AuthModalContext = createContext(null);

export function AuthModalProvider({ children }) {
  const [roleOpen, setRoleOpen]         = useState(false);
  const [authOpen, setAuthOpen]         = useState(false);
  const [authTab, setAuthTab]           = useState("signup");
  const [selectedRole, setSelectedRole] = useState(null);

  // Listen for footer / external open-modal events
  useEffect(() => {
    const handler = () => {
      setSelectedRole(null);
      setAuthTab("signin");
      setAuthOpen(true);
    };
    window.addEventListener("inklusijobs:open-modal", handler);
    return () => window.removeEventListener("inklusijobs:open-modal", handler);
  }, []);

  // "Start Your Journey" (worker signup)
  const openAsWorker = useCallback(() => {
    setSelectedRole("worker");
    setAuthTab("signup");
    setAuthOpen(true);
  }, []);

  // "I'm an Employer" (employer signup)
  const openAsEmployer = useCallback(() => {
    setSelectedRole("employer");
    setAuthTab("signup");
    setAuthOpen(true);
  }, []);

  // Navbar / Hero "Get Started" → role picker first
  const openRoleSelector = useCallback(() => {
    setRoleOpen(true);
  }, []);

  // Navbar "Log In"
  const openSignIn = useCallback(() => {
    setSelectedRole(null);
    setAuthTab("signin");
    setAuthOpen(true);
  }, []);

  // RoleSelector card clicked
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
    <AuthModalContext.Provider value={{
      openAsWorker,
      openAsEmployer,
      openRoleSelector,
      openSignIn,
      selectedRole,
    }}>
      {children}

      <RoleSelector
        isOpen={roleOpen}
        onClose={closeAll}
        onSelectRole={handleRoleSelect}
      />

      {/* 
        ✅ No onSignUpComplete / onSignInComplete props here.
        AuthModal.jsx handles ALL redirects internally after checking Firestore.
        Removing these prevents double-redirects and the "unregistered user" bug.
      */}
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