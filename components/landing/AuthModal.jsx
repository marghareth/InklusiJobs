"use client";

/**
 * AuthModal.jsx
 * Location: components/landing/AuthModal.jsx
 */

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import EmailVerification from "./EmailVerification";
import BasicInformation from "./BasicInformation";
import WelcomeWorker from "./WelcomeWorker";
import WelcomeEmployer from "./WelcomeEmployer";
import { createClient } from "@/lib/supabase/client";

// ─── Hook ─────────────────────────────────────────────────────────────────────
export function useAuthModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [tab, setTab] = useState("signin");
  const open = useCallback((defaultTab = "signin") => {
    setTab(defaultTab);
    setIsOpen(true);
  }, []);
  const close = useCallback(() => setIsOpen(false), []);
  return { isOpen, tab, open, close };
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600;700&display=swap');

  .am-overlay {
    position: fixed; inset: 0; z-index: 9999;
    display: flex; align-items: center; justify-content: center;
    padding: 16px;
    background: rgba(15, 28, 27, 0.50);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    animation: am-fade 0.22s ease;
  }
  @keyframes am-fade { from { opacity: 0; } to { opacity: 1; } }

  .am-modal {
    position: relative; width: 100%; max-width: 860px; min-height: 500px;
    border-radius: 24px; overflow: hidden;
    display: grid; grid-template-columns: 40% 60%;
    box-shadow: 0 32px 80px rgba(15, 28, 27, 0.30);
    animation: am-up 0.28s cubic-bezier(0.22, 1, 0.36, 1);
  }
  @keyframes am-up {
    from { opacity: 0; transform: translateY(20px) scale(0.97); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }

  .am-close {
    position: absolute; top: 14px; right: 14px; z-index: 10;
    width: 30px; height: 30px; border-radius: 50%; border: none;
    background: rgba(255,255,255,0.15); color: #fff; font-size: 16px;
    cursor: pointer; display: flex; align-items: center; justify-content: center;
    transition: background 0.18s; backdrop-filter: blur(4px);
  }
  .am-close:hover { background: rgba(255,255,255,0.30); }
  .am-close:focus-visible { outline: 2px solid #2563EB; outline-offset: 2px; }

  .am-left {
    background: linear-gradient(155deg, #0F2942 0%, #1a5f7a 45%, #6dbfb8 80%, #c9a4d4 100%);
    display: flex; flex-direction: column; justify-content: flex-end;
    padding: 40px 32px; position: relative; overflow: hidden;
  }
  .am-left::before {
    content: ''; position: absolute; inset: 0;
    background:
      radial-gradient(ellipse at 25% 75%, rgba(109,191,184,0.35) 0%, transparent 60%),
      radial-gradient(ellipse at 80% 15%, rgba(201,164,212,0.25) 0%, transparent 55%);
  }
  .am-left-body  { position: relative; z-index: 1; }
  .am-left-quote {
    font-family: 'DM Serif Display', serif;
    font-size: clamp(17px, 2vw, 24px); font-style: italic;
    color: rgba(255,255,255,0.90); line-height: 1.45; margin: 0 0 14px;
  }
  .am-left-sub {
    font-family: 'DM Sans', sans-serif; font-size: 11px;
    color: rgba(255,255,255,0.50); letter-spacing: 0.3px;
  }

  .am-right {
    background: #F7F6F4; padding: 44px 48px;
    display: flex; flex-direction: column; justify-content: center;
    overflow-y: auto; max-height: 90vh;
  }

  .am-logo {
    font-family: 'DM Serif Display', serif; font-size: 19px;
    color: #1E293B; margin: 0 0 24px; letter-spacing: -0.3px; display: block;
  }
  .am-logo span { color: #15803D; }

  .am-tabs { display: flex; border-bottom: 2px solid #E2E8F0; margin-bottom: 24px; }
  .am-tab {
    font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 600;
    color: #94A3B8; background: none; border: none;
    padding: 0 0 11px; margin-right: 24px; cursor: pointer;
    position: relative; transition: color 0.18s;
  }
  .am-tab.active { color: #1E293B; }
  .am-tab.active::after {
    content: ''; position: absolute; bottom: -2px; left: 0; right: 0;
    height: 2px; background: #1E40AF; border-radius: 2px;
  }

  .am-heading {
    font-family: 'DM Sans', sans-serif;
    font-size: clamp(20px, 2.4vw, 26px); font-weight: 700;
    color: #1E293B; margin: 0 0 5px;
  }
  .am-subtext {
    font-family: 'DM Sans', sans-serif; font-size: 13px;
    color: #64748B; margin: 0 0 22px;
  }
  .am-subtext button {
    background: none; border: none; padding: 0; cursor: pointer;
    color: #1E40AF; font-weight: 600; font-size: 13px;
    font-family: 'DM Sans', sans-serif;
    text-decoration: underline; text-underline-offset: 3px;
  }

  .am-form     { display: flex; flex-direction: column; gap: 16px; }
  .am-field    { display: flex; flex-direction: column; gap: 5px; }
  .am-name-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }

  .am-label {
    font-family: 'DM Sans', sans-serif; font-size: 11px; font-weight: 600;
    color: #64748B; letter-spacing: 0.4px; text-transform: uppercase;
  }
  .am-input-wrap { position: relative; }
  .am-input {
    width: 100%; box-sizing: border-box;
    font-family: 'DM Sans', sans-serif; font-size: 14px; color: #1E293B;
    background: #fff; border: 1.5px solid #E2E8F0; border-radius: 10px;
    padding: 11px 14px; outline: none;
    transition: border-color 0.18s, box-shadow 0.18s;
  }
  .am-input::placeholder { color: #CBD5E1; }
  .am-input:focus { border-color: #2563EB; box-shadow: 0 0 0 3px rgba(37,99,235,0.10); }
  .am-input.with-icon { padding-right: 42px; }

  .am-eye {
    position: absolute; right: 12px; top: 50%; transform: translateY(-50%);
    background: none; border: none; cursor: pointer;
    color: #94A3B8; display: flex; align-items: center; padding: 4px;
    transition: color 0.18s;
  }
  .am-eye:hover { color: #1E293B; }

  .am-row { display: flex; align-items: center; justify-content: space-between; }
  .am-remember {
    display: flex; align-items: center; gap: 7px;
    font-family: 'DM Sans', sans-serif; font-size: 12px;
    color: #64748B; cursor: pointer; user-select: none;
  }
  .am-remember input { width: 14px; height: 14px; accent-color: #1E40AF; cursor: pointer; }
  .am-forgot {
    font-family: 'DM Sans', sans-serif; font-size: 12px; font-weight: 600;
    color: #1E40AF; text-decoration: underline; text-underline-offset: 3px;
    background: none; border: none; cursor: pointer; padding: 0;
  }

  .am-submit {
    width: 100%; font-family: 'DM Sans', sans-serif; font-weight: 700; font-size: 14px;
    color: #fff; background: #1E293B; border: none; border-radius: 12px; padding: 13px;
    cursor: pointer; letter-spacing: 0.3px; transition: background 0.2s, transform 0.15s;
  }
  .am-submit:hover         { background: #1E40AF; transform: translateY(-1px); }
  .am-submit:disabled      { opacity: 0.6; cursor: not-allowed; transform: none; }
  .am-submit:focus-visible { outline: 2px solid #2563EB; outline-offset: 3px; }

  .am-divider {
    display: flex; align-items: center; gap: 10px;
    font-family: 'DM Sans', sans-serif; font-size: 10px; font-weight: 700;
    color: #94A3B8; letter-spacing: 1.2px; text-transform: uppercase;
  }
  .am-divider::before, .am-divider::after { content: ''; flex: 1; height: 1px; background: #E2E8F0; }

  .am-social { display: flex; flex-direction: column; gap: 9px; }
  .am-social-btn {
    width: 100%; display: flex; align-items: center; justify-content: center; gap: 10px;
    font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 500;
    color: #1E293B; background: #fff; border: 1.5px solid #E2E8F0;
    border-radius: 12px; padding: 11px 18px; cursor: pointer;
    transition: border-color 0.18s, background 0.18s, transform 0.15s;
  }
  .am-social-btn:hover { background: #f8fafc; border-color: #CBD5E1; transform: translateY(-1px); }

  .am-error {
    font-family: 'DM Sans', sans-serif; font-size: 13px;
    color: #DC2626; background: #FEF2F2; border: 1px solid #FECACA;
    border-radius: 8px; padding: 10px 14px; margin-bottom: 4px;
  }

  .am-role-badge {
    display: inline-flex; align-items: center; gap: 6px;
    font-family: 'DM Sans', sans-serif; font-size: 11px; font-weight: 700;
    letter-spacing: 1.2px; text-transform: uppercase;
    padding: 5px 12px; border-radius: 100px; margin-bottom: 20px; width: fit-content;
  }
  .am-role-badge.worker  { background: #EFF6FF; color: #1E40AF; border: 1px solid #BFDBFE; }
  .am-role-badge.employer { background: #F5F3FF; color: #6D28D9; border: 1px solid #DDD6FE; }
  .am-role-badge::before {
    content: ''; width: 6px; height: 6px;
    border-radius: 50%; background: currentColor; opacity: 0.7;
  }

  @media (max-width: 600px) {
    .am-modal    { grid-template-columns: 1fr; border-radius: 20px; }
    .am-left     { display: none; }
    .am-right    { padding: 32px 24px; max-height: 95vh; }
    .am-name-row { grid-template-columns: 1fr; }
  }
`;

// ─── Icons ────────────────────────────────────────────────────────────────────
const EyeIcon = () => (
  <svg
    width="17"
    height="17"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);
const EyeOffIcon = () => (
  <svg
    width="17"
    height="17"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);
const GoogleIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
    />
  </svg>
);
const FacebookIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="#1877F2">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

// ─── Role Badge ───────────────────────────────────────────────────────────────
function RoleBadge({ role, tab }) {
  if (!role) return null;
  const isWorker = role === "worker";
  const label =
    tab === "signin"
      ? isWorker
        ? "👤 Signing in as Worker"
        : "💼 Signing in as Employer"
      : isWorker
        ? "👤 Creating a Worker account"
        : "💼 Creating an Employer account";
  return <span className={`am-role-badge ${role}`}>{label}</span>;
}

// ─── Sign In Form ─────────────────────────────────────────────────────────────
function SignInForm({ role, onSignIn }) {
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.target);
    const supabase = createClient();

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.get("email"),
        password: formData.get("password"),
      });
      if (error) throw error;
      onSignIn?.(data.user);
    } catch (err) {
      setError(err.message || "Sign in failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h2 className="am-heading">Sign in</h2>
      <p className="am-subtext">
        Welcome back! Enter your credentials to continue.
      </p>

      {error && <div className="am-error">{error}</div>}

      <form onSubmit={handleSubmit} className="am-form">
        <div className="am-field">
          <label className="am-label" htmlFor="si-email">
            E-mail
          </label>
          <input
            id="si-email"
            name="email"
            type="email"
            className="am-input"
            placeholder="example@gmail.com"
            autoComplete="email"
            required
          />
        </div>
        <div className="am-field">
          <label className="am-label" htmlFor="si-pwd">
            Password
          </label>
          <div className="am-input-wrap">
            <input
              id="si-pwd"
              name="password"
              type={showPwd ? "text" : "password"}
              className="am-input with-icon"
              placeholder="@#*%"
              autoComplete="current-password"
              required
            />
            <button
              type="button"
              className="am-eye"
              onClick={() => setShowPwd((p) => !p)}
              aria-label={showPwd ? "Hide" : "Show"}
            >
              {showPwd ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          </div>
        </div>
        <div className="am-row">
          <label className="am-remember">
            <input type="checkbox" name="remember" /> Remember me
          </label>
          <button type="button" className="am-forgot">
            Forgot Password?
          </button>
        </div>
        <button type="submit" className="am-submit" disabled={loading}>
          {loading ? "Signing in…" : "Sign in"}
        </button>
        <div className="am-divider">or</div>
        <div className="am-social">
          <button type="button" className="am-social-btn">
            <GoogleIcon /> Continue with Google
          </button>
          <button type="button" className="am-social-btn">
            <FacebookIcon /> Continue with Facebook
          </button>
        </div>
      </form>
    </>
  );
}

// ─── Sign Up Form ─────────────────────────────────────────────────────────────
function SignUpForm({ role, onSignUp }) {
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.target);
    const email = formData.get("email");
    const password = formData.get("password");
    const firstName = formData.get("firstName");
    const lastName = formData.get("lastName");

    if (!email || !password || !firstName || !lastName) {
      setError("Please fill in all fields.");
      setLoading(false);
      return;
    }

    const supabase = createClient();

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          // Supabase will append ?code=xxx to this URL — our callback route handles it
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: {
            first_name: firstName,
            last_name: lastName,
            role: role || "worker",
          },
        },
      });

      if (error) throw error;

      // Show EmailVerification step
      onSignUp?.(email);
    } catch (err) {
      // "Confirmation emails are rate-limited" or other Supabase messages
      if (err.message?.toLowerCase().includes("email")) {
        setError(
          "There was a problem sending the confirmation email. Please wait a moment and try again.",
        );
      } else {
        setError(err.message || "Sign up failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <RoleBadge role={role} tab="signup" />
      <h2 className="am-heading">Create account</h2>
      <p className="am-subtext">Join InklusiJobs and start your journey.</p>

      {error && <div className="am-error">{error}</div>}

      <form onSubmit={handleSubmit} className="am-form">
        <div className="am-name-row">
          <div className="am-field">
            <label className="am-label" htmlFor="su-first">
              First name
            </label>
            <input
              id="su-first"
              name="firstName"
              type="text"
              className="am-input"
              placeholder="Maria"
              autoComplete="given-name"
              required
            />
          </div>
          <div className="am-field">
            <label className="am-label" htmlFor="su-last">
              Last name
            </label>
            <input
              id="su-last"
              name="lastName"
              type="text"
              className="am-input"
              placeholder="Santos"
              autoComplete="family-name"
              required
            />
          </div>
        </div>
        <div className="am-field">
          <label className="am-label" htmlFor="su-email">
            E-mail
          </label>
          <input
            id="su-email"
            name="email"
            type="email"
            className="am-input"
            placeholder="example@gmail.com"
            autoComplete="email"
            required
          />
        </div>
        <div className="am-field">
          <label className="am-label" htmlFor="su-pwd">
            Password
          </label>
          <div className="am-input-wrap">
            <input
              id="su-pwd"
              name="password"
              type={showPwd ? "text" : "password"}
              className="am-input with-icon"
              placeholder="Min. 8 characters"
              autoComplete="new-password"
              minLength={8}
              required
            />
            <button
              type="button"
              className="am-eye"
              onClick={() => setShowPwd((p) => !p)}
              aria-label={showPwd ? "Hide" : "Show"}
            >
              {showPwd ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          </div>
        </div>
        <button type="submit" className="am-submit" disabled={loading}>
          {loading ? "Creating account…" : "Get Started"}
        </button>
        <div className="am-divider">or</div>
        <div className="am-social">
          <button type="button" className="am-social-btn">
            <GoogleIcon /> Continue with Google
          </button>
          <button type="button" className="am-social-btn">
            <FacebookIcon /> Continue with Facebook
          </button>
        </div>
      </form>
    </>
  );
}

// ─── Modal ────────────────────────────────────────────────────────────────────
export default function AuthModal({
  isOpen,
  onClose,
  defaultTab = "signin",
  role = null,
}) {
  const [step, setStep] = useState("auth");
  const [userEmail, setUserEmail] = useState("");
  const [tab, setTab] = useState(defaultTab);
  const [userData, setUserData] = useState(null); // holds { first_name, role } after verification
  const [welcome, setWelcome] = useState(false);

  const overlayRef = useRef(null);
  const modalRef = useRef(null);
  const closeRef = useRef(null);

  // ── Detect ?verified=true on page load (user returning from email link) ──
  useEffect(() => {
    if (typeof window === "undefined") return;

    const params = new URLSearchParams(window.location.search);

    if (params.get("verified") === "true") {
      // Clean the URL so a refresh doesn't re-trigger this
      const clean = window.location.pathname;
      window.history.replaceState({}, "", clean);

      // Pull the current session to get user metadata
      const bootstrap = async () => {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          setUserData({
            first_name: user.user_metadata?.first_name || "there",
            role: user.user_metadata?.role || "worker",
          });
          setStep("basic-info");
          // Open the modal so the user can see BasicInformation
          // (parent must handle isOpen — we signal via a custom event)
          window.dispatchEvent(new CustomEvent("inklusijobs:open-modal"));
        }
      };

      bootstrap();
    }

    if (params.get("verified") === "error") {
      window.history.replaceState({}, "", window.location.pathname);
      // Just open the modal at auth step so they can try again
      window.dispatchEvent(new CustomEvent("inklusijobs:open-modal"));
    }
  }, []);

  // Reset when modal opens fresh (not from verified redirect)
  useEffect(() => {
    if (isOpen && step === "auth") {
      setTab(defaultTab);
    }
  }, [isOpen, defaultTab]);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Escape key
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  // Focus trap
  useEffect(() => {
    if (!isOpen || !modalRef.current) return;
    const els = modalRef.current.querySelectorAll(
      'button,[href],input,select,textarea,[tabindex]:not([tabindex="-1"])',
    );
    const first = els[0];
    const last = els[els.length - 1];
    const trap = (e) => {
      if (e.key !== "Tab") return;
      if (
        e.shiftKey
          ? document.activeElement === first
          : document.activeElement === last
      ) {
        e.preventDefault();
        (e.shiftKey ? last : first).focus();
      }
    };
    document.addEventListener("keydown", trap);
    closeRef.current?.focus();
    return () => document.removeEventListener("keydown", trap);
  }, [isOpen, step]);

  const handleOverlay = useCallback(
    (e) => {
      if (e.target === overlayRef.current) onClose();
    },
    [onClose],
  );

  // Called after successful signup — go to EmailVerification
  const handleSignUp = (email) => {
    setUserEmail(email);
    setStep("verify-email");
  };

  // Called after BasicInformation saves successfully
  const handleBasicInfoComplete = (savedData) => {
    setUserData((prev) => ({ ...prev, ...savedData }));
    setStep("auth"); // reset internal step
    onClose(); // close the auth modal
    setWelcome(true); // show the welcome overlay
  };

  // Called when user dismisses Welcome
  const handleWelcomeClose = () => {
    setWelcome(false);
    const destination =
      userData?.role === "employer"
        ? "/employer/dashboard"
        : "/worker/dashboard";
    window.location.href = destination;
  };

  // Called after successful sign-in
  const handleSignIn = async (user) => {
    const supabase = createClient();
    // Check if profile is complete
    const { data: profile } = await supabase
      .from("profiles")
      .select("current_address")
      .eq("id", user.id)
      .single();

    onClose();

    if (!profile?.current_address) {
      // Profile incomplete — open basic info
      setUserData({
        first_name: user.user_metadata?.first_name || "there",
        role: user.user_metadata?.role || "worker",
      });
      setStep("basic-info");
      window.dispatchEvent(new CustomEvent("inklusijobs:open-modal"));
    } else {
      const destination =
        user.user_metadata?.role === "employer"
          ? "/employer/dashboard"
          : "/worker/dashboard";
      window.location.href = destination;
    }
  };

  const renderContent = () => {
    if (step === "verify-email") {
      return (
        <EmailVerification
          email={userEmail}
          onResend={async () => {
            const supabase = createClient();
            await supabase.auth.resend({ type: "signup", email: userEmail });
          }}
          onReturn={() => setStep("auth")}
        />
      );
    }

    if (step === "basic-info") {
      return (
        <BasicInformation
          initialData={{ firstName: userData?.first_name || "" }}
          onSubmit={handleBasicInfoComplete}
        />
      );
    }

    return (
      <>
        <span className="am-logo">
          Inklusi<span>Jobs</span>
        </span>
        {tab === "signin" ? (
          <SignInForm role={role} onSignIn={handleSignIn} />
        ) : (
          <SignUpForm role={role} onSignUp={handleSignUp} />
        )}
      </>
    );
  };

  return (
    <>
      <style>{css}</style>

      {/* Welcome overlays — rendered outside the modal so they appear after it closes */}
      {welcome && userData?.role === "employer" && (
        <WelcomeEmployer
          name={userData.first_name}
          onClose={handleWelcomeClose}
        />
      )}
      {welcome && userData?.role !== "employer" && (
        <WelcomeWorker
          name={userData?.first_name || "there"}
          onClose={handleWelcomeClose}
        />
      )}

      {isOpen && (
        <div
          className="am-overlay"
          ref={overlayRef}
          onClick={handleOverlay}
          role="dialog"
          aria-modal="true"
          aria-label="Authentication"
        >
          <div className="am-modal" ref={modalRef}>
            <button
              className="am-close"
              onClick={onClose}
              aria-label="Close modal"
              ref={closeRef}
            >
              ✕
            </button>

            <div className="am-left" aria-hidden="true">
              <div className="am-left-body">
                <p className="am-left-quote">
                  &ldquo;Skills that speak louder than credentials.&rdquo;
                </p>
                <p className="am-left-sub">
                  InklusiJobs · Built for PWDs. Powered by AI.
                </p>
              </div>
            </div>

            <div className="am-right">{renderContent()}</div>
          </div>
        </div>
      )}
    </>
  );
}
