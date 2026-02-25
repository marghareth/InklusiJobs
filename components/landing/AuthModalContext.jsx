"use client";

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

  // SkillsSection "Start Your Journey" → worker signup directly
  const openAsWorker = useCallback(() => {
    setSelectedRole("worker");
    setAuthTab("signup");
    setAuthOpen(true);
  }, []);

  // SkillsSection "I'm an Employer" → employer signup directly
  const openAsEmployer = useCallback(() => {
    setSelectedRole("employer");
    setAuthTab("signup");
    setAuthOpen(true);
  }, []);

  // Navbar / Hero "Get Started" → show role picker first
  const openRoleSelector = useCallback(() => {
    setRoleOpen(true);
  }, []);

  // Navbar "Log In" → straight to sign-in, no role badge
  const openSignIn = useCallback(() => {
    setSelectedRole(null);
    setAuthTab("signin");
    setAuthOpen(true);
  }, []);

  // RoleSelector card clicked → close selector, open auth
  const handleRoleSelect = useCallback((role) => {
    setSelectedRole(role);
    setRoleOpen(false);
    setAuthTab("signup");
    setAuthOpen(true);
  }, []);

  // Sign UP complete — workers go to assessment, employers go to dashboard
  const handleSignUpComplete = useCallback((role) => {
    setAuthOpen(false);
    if (role === "worker") {
      router.push("/job-select");
    } else {
      router.push("/dashboard/employer");
    }
  }, [router]);

  // Sign IN complete — workers go to worker dashboard
  const handleSignInComplete = useCallback(() => {
    setAuthOpen(false);
    router.push("/dashboard/worker");
  }, [router]);

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
      <AuthModal
        isOpen={authOpen}
        onClose={closeAll}
        defaultTab={authTab}
        role={selectedRole}
        onSignUpComplete={() => handleSignUpComplete(selectedRole)}
        onSignInComplete={handleSignInComplete}
      />
    </AuthModalContext.Provider>
  );
}

export function useAuthModalContext() {
  const ctx = useContext(AuthModalContext);
  if (!ctx) throw new Error("useAuthModalContext must be used inside <AuthModalProvider>");
  return ctx;
}