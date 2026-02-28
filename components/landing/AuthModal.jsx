// components/landing/BasicInformation.jsx
"use client";

/**
 * AuthModal.jsx — Firebase Auth Version
 * Replaces localStorage auth with Firebase Email/Password auth.
 * Location: components/landing/AuthModal.jsx
 */

import { useEffect, useRef, useState, useCallback } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";

// ─── Google Provider (singleton) ─────────────────────────────────────────────
const googleProvider = new GoogleAuthProvider();

// ─── Hook ─────────────────────────────────────────────────────────────────────
export function useAuthModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [tab, setTab]       = useState("signin");
  const open  = useCallback((defaultTab = "signin") => { setTab(defaultTab); setIsOpen(true); }, []);
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
  .am-warning {
    font-family: 'DM Sans', sans-serif; font-size: 13px;
    color: #92400E; background: #FFFBEB; border: 1px solid #FDE68A;
    border-radius: 8px; padding: 10px 14px; margin-bottom: 4px;
  }
  .am-success {
    font-family: 'DM Sans', sans-serif; font-size: 13px;
    color: #065F46; background: #ECFDF5; border: 1px solid #A7F3D0;
    border-radius: 8px; padding: 10px 14px; margin-bottom: 4px;
  }

  .am-role-badge {
    display: inline-flex; align-items: center; gap: 6px;
    font-family: 'DM Sans', sans-serif; font-size: 11px; font-weight: 700;
    letter-spacing: 1.2px; text-transform: uppercase;
    padding: 5px 12px; border-radius: 100px; margin-bottom: 20px; width: fit-content;
  }
  .am-role-badge.worker   { background: #EFF6FF; color: #1E40AF; border: 1px solid #BFDBFE; }
  .am-role-badge.employer { background: #F5F3FF; color: #6D28D9; border: 1px solid #DDD6FE; }
  .am-role-badge::before {
    content: ''; width: 6px; height: 6px;
    border-radius: 50%; background: currentColor; opacity: 0.7;
  }

const inputStyle = {
  width: "100%", padding: "10px 14px", borderRadius: 10,
  border: `1.5px solid ${C.border}`, fontSize: 14, fontFamily: "inherit",
  background: "#FAFAFA", outline: "none", boxSizing: "border-box", color: C.navy,
};

const Input = ({ placeholder, value, onChange, type = "text", min, max }) => (
  <input
    type={type} placeholder={placeholder} value={value} onChange={onChange}
    min={min} max={max}
    style={inputStyle}
    onFocus={e => e.target.style.borderColor = C.accent}
    onBlur={e => e.target.style.borderColor = C.border}
  />
);

// ─── Icons ────────────────────────────────────────────────────────────────────
const EyeIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
  </svg>
);

const ChipSelect = ({ options, selected, onToggle, max }) => (
  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
    {options.map(opt => {
      const active = selected.includes(opt);
      const disabled = !active && max && selected.length >= max;
      return (
        <button key={opt} onClick={() => !disabled && onToggle(opt)}
          style={{
            padding: "7px 14px", borderRadius: 99, fontSize: 13, fontWeight: 600,
            border: `1.5px solid ${active ? C.accent : C.border}`,
            background: active ? C.light : C.card,
            color: active ? C.navy : C.muted,
            cursor: disabled ? "not-allowed" : "pointer",
            opacity: disabled ? 0.5 : 1,
            transition: "all 0.15s",
          }}>
          {opt}
        </button>
      );
    })}
  </div>
);

const Field = ({ label, required, children }) => (
  <div style={{ marginBottom: 20 }}>
    <Label required={required}>{label}</Label>
    {children}
  </div>
);

const Row = ({ children }) => (
  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>{children}</div>
);

// ─── Firebase error messages → human-friendly ─────────────────────────────────
function friendlyError(code) {
  switch (code) {
    case "auth/email-already-in-use":    return "An account with this email already exists. Please sign in instead.";
    case "auth/invalid-email":           return "Please enter a valid email address.";
    case "auth/weak-password":           return "Password must be at least 6 characters.";
    case "auth/user-not-found":          return "No account found with that email. Please sign up first.";
    case "auth/wrong-password":          return "Incorrect password. Please try again.";
    case "auth/invalid-credential":      return "Incorrect email or password. Please try again.";
    case "auth/too-many-requests":       return "Too many attempts. Please wait a moment and try again.";
    case "auth/network-request-failed":  return "Network error. Please check your connection.";
    default:                             return "Something went wrong. Please try again.";
  }
}

// ─── Google Sign-In (shared by both forms) ───────────────────────────────────
async function handleGoogleSignIn() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return { user: result.user, error: null };
  } catch (err) {
    // User closed the popup — not a real error, just ignore it
    if (err.code === "auth/user-cancelled" || err.code === "auth/popup-closed-by-user") {
      return { user: null, error: null };
    }
    // Popup was blocked by browser — fall back to redirect
    if (err.code === "auth/popup-blocked") {
      await signInWithRedirect(auth, googleProvider);
      return { user: null, error: null }; // page will redirect, result handled on return
    }
    console.error("Google sign-in error:", err.code, err.message);
    return { user: null, error: friendlyError(err.code) };
  }
}

// ─── SignInForm ───────────────────────────────────────────────────────────────
function SignInForm({ role, onSignIn, onSwitchTab }) {
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const data  = new FormData(e.target);
    const email = data.get("email")?.trim().toLowerCase();
    const pwd   = data.get("password");

    try {
      const credential = await signInWithEmailAndPassword(auth, email, pwd);
      onSignIn(credential.user);
    } catch (err) {
      setError(friendlyError(err.code));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 style={{ fontSize: 22, fontWeight: 800, color: C.navy, marginBottom: 4 }}>Your work preferences</h2>
      <p style={{ color: C.muted, fontSize: 14, marginBottom: 28 }}>Help us match you to jobs that fit your lifestyle and goals.</p>

      <Field label="Preferred Work Setup" required>
        <div style={{ display: "flex", gap: 8 }}>
          {workTypes.map(t => (
            <button key={t} onClick={() => set({ ...data, workType: t })}
              style={{
                flex: 1, padding: "10px 0", borderRadius: 10, fontSize: 13, fontWeight: 600,
                border: `1.5px solid ${data.workType === t ? C.accent : C.border}`,
                background: data.workType === t ? C.light : C.card,
                color: data.workType === t ? C.navy : C.muted, cursor: "pointer",
                transition: "all 0.15s",
              }}>
              {t}
            </button>
          ))}
        </div>
        <button type="submit" className="am-submit" disabled={loading}>
          {loading ? "Signing in…" : "Sign In"}
        </button>
        <div className="am-divider">or</div>
        <div className="am-social">
          <button type="button" className="am-social-btn" disabled={loading} onClick={async () => {
            setLoading(true); setError("");
            const { user, error: err } = await handleGoogleSignIn();
            setLoading(false);
            if (err) { setError(err); return; }
            if (user) onSignIn(user);
          }}><GoogleIcon /> Continue with Google</button>
          <button type="button" className="am-social-btn"><FacebookIcon /> Continue with Facebook</button>
        </div>
      </Field>

      <Field label="Tell us more about your career goals">
        <textarea
          placeholder="e.g. I'm looking for a remote role where I can use my design skills and grow in UX..."
          rows={3}
          value={data.goals || ""}
          onChange={e => set({ ...data, goals: e.target.value })}
          style={{ ...inputStyle, resize: "none" }}
          onFocus={e => e.target.style.borderColor = C.accent}
          onBlur={e => e.target.style.borderColor = C.border}
        />
      </Field>
    </div>
  );
}

// ─── SignUpForm ───────────────────────────────────────────────────────────────
function SignUpForm({ role, onSignUp, onSwitchTab }) {
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const data      = new FormData(e.target);
    const firstName = data.get("firstName")?.trim();
    const lastName  = data.get("lastName")?.trim();
    const email     = data.get("email")?.trim().toLowerCase();
    const pwd       = data.get("password");

    try {
      const credential = await createUserWithEmailAndPassword(auth, email, pwd);
      // Save display name to Firebase profile
      await updateProfile(credential.user, {
        displayName: `${firstName} ${lastName}`,
      });
      onSignUp(credential.user);
    } catch (err) {
      console.error("Firebase signup error:", err.code, err.message);
      setError(friendlyError(err.code));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {role && <div className={`am-role-badge ${role}`}>{role}</div>}
      <h2 className="am-heading">Create your account</h2>
      <p className="am-subtext">
        Already have an account?{" "}
        <button type="button" onClick={() => onSwitchTab("signin")}>Sign in</button>
      </p>
      {error && <div className="am-error">{error}</div>}
      <form className="am-form" onSubmit={handleSubmit}>
        <div className="am-name-row">
          <div className="am-field">
            <label className="am-label" htmlFor="su-fn">First Name</label>
            <input id="su-fn" name="firstName" type="text" className="am-input" placeholder="Juan" required />
          </div>
          <div className="am-field">
            <label className="am-label" htmlFor="su-ln">Last Name</label>
            <input id="su-ln" name="lastName" type="text" className="am-input" placeholder="Dela Cruz" required />
          </div>
        </div>
        <div className="am-field">
          <label className="am-label" htmlFor="su-email">Email</label>
          <input id="su-email" name="email" type="email" className="am-input" placeholder="you@example.com" required autoComplete="email" />
        </div>
      </Field>

      <Field label="PWD ID Number">
        <Input placeholder="e.g. 2024-QC-12345" value={data.pwdId || ""} onChange={e => set({ ...data, pwdId: e.target.value })} />
      </Field>

      <Field label="Workplace Accommodations Needed">
        <ChipSelect options={accommodations} selected={data.accommodations || []}
          onToggle={opt => {
            const c = data.accommodations || [];
            set({ ...data, accommodations: c.includes(opt) ? c.filter(a => a !== opt) : [...c, opt] });
          }} />
      </Field>

      <Field label="Additional notes about your needs">
        <textarea
          placeholder="e.g. I need an ergonomic chair and occasional breaks every 2 hours due to my condition..."
          rows={3}
          value={data.disabilityNotes || ""}
          onChange={e => set({ ...data, disabilityNotes: e.target.value })}
          style={{ ...inputStyle, resize: "none" }}
          onFocus={e => e.target.style.borderColor = C.accent}
          onBlur={e => e.target.style.borderColor = C.border}
        />
      </Field>

      <label style={{ display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer", marginTop: 8 }}>
        <input
          type="checkbox"
          checked={data.consentSharing || false}
          onChange={e => set({ ...data, consentSharing: e.target.checked })}
          style={{ width: 16, height: 16, accentColor: C.accent, cursor: "pointer", marginTop: 2, flexShrink: 0 }}
        />
        <span style={{ fontSize: 13, color: C.muted, lineHeight: 1.5 }}>
          I consent to sharing my disability information with employers I apply to through InklusiJobs for the purpose of requesting appropriate accommodations.
        </span>
      </label>
    </div>
  );
};

// ── Step 4 – Dashboard Preference ─────────────────────────────────────────────
const Step4 = ({ data, set }) => {
  const themes = [
    { id: "teal",  label: "Teal Focus", bg: "#0F4C4C", accent: "#2DD4BF" },
    { id: "navy",  label: "Navy Pro",   bg: "#1A2744", accent: "#7286D3" },
    { id: "slate", label: "Slate",      bg: "#334155", accent: "#94A3B8" },
    { id: "rose",  label: "Rose",       bg: "#881337", accent: "#FB7185" },
  ];
  const layouts = ["Compact", "Comfortable", "Spacious"];
  const widgets = ["Job Matches", "Application Tracker", "Saved Jobs", "Interview Schedule", "Skills Progress", "Recommended Employers"];

  return (
    <div>
      <h2 style={{ fontSize: 22, fontWeight: 800, color: C.navy, marginBottom: 4 }}>Personalize your dashboard</h2>
      <p style={{ color: C.muted, fontSize: 14, marginBottom: 28 }}>Choose how your InklusiJobs workspace looks and feels.</p>

      <Field label="Dashboard Theme">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10 }}>
          {themes.map(t => (
            <button key={t.id} onClick={() => set({ ...data, theme: t.id })}
              style={{
                padding: "14px 10px", borderRadius: 12,
                border: `2px solid ${data.theme === t.id ? C.accent : C.border}`,
                cursor: "pointer", background: C.card, transition: "all 0.15s",
              }}>
              <div style={{ display: "flex", gap: 4, justifyContent: "center", marginBottom: 8 }}>
                <div style={{ width: 20, height: 20, borderRadius: 6, background: t.bg }} />
                <div style={{ width: 20, height: 20, borderRadius: 6, background: t.accent }} />
              </div>
              <div style={{ fontSize: 12, fontWeight: 700, color: C.navy }}>{t.label}</div>
            </button>
          ))}
        </div>
        <button type="submit" className="am-submit" disabled={loading}>
          {loading ? "Creating account…" : "Get Started"}
        </button>
        <div className="am-divider">or</div>
        <div className="am-social">
          <button type="button" className="am-social-btn" disabled={loading} onClick={async () => {
            setLoading(true); setError("");
            // Save role BEFORE redirect so we know where to send them after Google auth
            localStorage.setItem("ij_role", role || "worker");
            const { user, error: err } = await handleGoogleSignIn();
            setLoading(false);
            if (err) { setError(err); return; }
            if (user) onSignUp(user);
          }}><GoogleIcon /> Continue with Google</button>
          <button type="button" className="am-social-btn"><FacebookIcon /> Continue with Facebook</button>
        </div>
      </Field>

      <Field label="Default Dashboard Widgets (pick up to 4)">
        <ChipSelect options={widgets} selected={data.widgets || []} max={4}
          onToggle={opt => {
            const c = data.widgets || [];
            set({ ...data, widgets: c.includes(opt) ? c.filter(w => w !== opt) : [...c, opt] });
          }} />
      </Field>

      <Field label="Email Notifications">
        {[
          { key: "newMatches",       label: "New job match alerts"          },
          { key: "appUpdates",       label: "Application status updates"    },
          { key: "interviewRemind",  label: "Interview reminders"           },
          { key: "weeklyDigest",     label: "Weekly job digest"             },
        ].map(({ key, label }) => (
          <label key={key} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12, cursor: "pointer" }}>
            <input
              type="checkbox"
              defaultChecked
              style={{ width: 16, height: 16, accentColor: C.accent, cursor: "pointer" }}
            />
            <span style={{ fontSize: 14, color: C.navy, fontWeight: 500 }}>{label}</span>
          </label>
        ))}
      </Field>
    </div>
  );
}

// ─── Modal ────────────────────────────────────────────────────────────────────
export default function AuthModal({
  isOpen,
  onClose,
  defaultTab = "signin",
  role = null,
  onSignUpComplete,
  onSignInComplete,
}) {
  const [tab, setTab] = useState(defaultTab);
  const overlayRef    = useRef(null);
  const modalRef      = useRef(null);
  const closeRef      = useRef(null);

  useEffect(() => { if (isOpen) setTab(defaultTab); }, [isOpen, defaultTab]);
  useEffect(() => { document.body.style.overflow = isOpen ? "hidden" : ""; return () => { document.body.style.overflow = ""; }; }, [isOpen]);
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  const handleOverlay = useCallback((e) => { if (e.target === overlayRef.current) onClose(); }, [onClose]);

  const router = useRouter();

  // Save role to localStorage so we can read it after Google redirect too
  const redirectByRole = (userRole) => {
    const resolvedRole = userRole || role || "worker";
    localStorage.setItem("ij_role", resolvedRole);
    onClose?.();
    if (resolvedRole === "employer") {
      router.push("/employer/dashboard");
    } else {
      router.push("/dashboard/worker");
    }
  };

  const handleSignIn = (firebaseUser) => {
    // On sign in, read saved role (set during signup)
    const savedRole = localStorage.getItem("ij_role") || role || "worker";
    onSignInComplete?.(savedRole);
    redirectByRole(savedRole);
  };

  const handleSignUp = (firebaseUser) => {
    // On sign up, role comes from the modal prop (set by RoleSelector)
    onSignUpComplete?.(role || "worker");
    redirectByRole(role || "worker");
  };

  const stepContent = () => {
    switch (step) {
      case 1: return <Step1 data={s1} set={setS1} />;
      case 2: return <Step2 data={s2} set={setS2} />;
      case 3: return <Step3 data={s3} set={setS3} />;
      case 4: return <Step4 data={s4} set={setS4} />;
    }
  };

  // ── Completion screen ──────────────────────────────────────────────────────
  if (complete) {
    return (
      <div style={{ minHeight: "100vh", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Lexend','DM Sans',sans-serif" }}>
        <div style={{ textAlign: "center", maxWidth: 480, padding: 40 }}>
          <div style={{ fontSize: 72, marginBottom: 20 }}>🎉</div>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: C.navy, marginBottom: 12 }}>You're all set, {s1.firstName || "there"}!</h1>
          <p style={{ color: C.muted, fontSize: 15, marginBottom: 8, lineHeight: 1.6 }}>
            Your profile is ready and we're already finding inclusive job matches for you.
          </p>
          <p style={{ color: C.muted, fontSize: 14, marginBottom: 32, lineHeight: 1.6 }}>
            InklusiJobs will surface PWD-friendly employers matching your <strong style={{ color: C.navy }}>{s2.workType || "preferred"}</strong> work setup.
          </p>
          <a href="/dashboard/worker" style={{
            display: "inline-block", padding: "14px 36px", borderRadius: 12,
            background: `linear-gradient(135deg, ${C.accentDim}, #0D7377)`,
            color: "#fff", fontSize: 15, fontWeight: 700, textDecoration: "none",
            boxShadow: "0 4px 16px rgba(13,115,119,0.35)",
          }}>
            Go to Dashboard →
          </a>
        </div>
      </div>
    );
  }

  // ── Wizard layout ──────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: "'Lexend','DM Sans',sans-serif", display: "flex" }}>

      {/* Left sidebar */}
      <div style={{
        width: 280, minWidth: 280,
        background: `linear-gradient(180deg, ${C.navy} 0%, #1E2F55 100%)`,
        padding: "40px 28px", display: "flex", flexDirection: "column",
      }}>
        <div style={{ marginBottom: 48 }}>
          <div style={{ fontSize: 20, fontWeight: 900, color: "#fff", letterSpacing: "-0.02em" }}>InklusiJobs</div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", fontWeight: 500 }}>Worker Setup</div>
        </div>

        <div style={{ flex: 1 }}>
          {STEPS.map((s, i) => {
            const done = step > s.id, current = step === s.id;
            return (
              <div key={s.id} style={{ display: "flex", gap: 14, marginBottom: 28, alignItems: "flex-start" }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: "50%", flexShrink: 0,
                    background: done ? C.success : current ? C.accent : "rgba(255,255,255,0.1)",
                    border: `2px solid ${done ? C.success : current ? C.accent : "rgba(255,255,255,0.2)"}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: done ? 16 : 14, fontWeight: 800, color: "#fff",
                    transition: "all 0.25s",
                  }}>
                    {done ? "✓" : s.icon}
                  </div>
                  {i < STEPS.length - 1 && (
                    <div style={{
                      width: 2, height: 20, marginTop: 4,
                      background: done ? C.success : "rgba(255,255,255,0.1)",
                      transition: "background 0.25s",
                    }} />
                  )}
                </div>
                <div style={{ paddingTop: 4 }}>
                  <div style={{
                    fontSize: 13, fontWeight: current ? 700 : 600,
                    color: current ? "#fff" : done ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.4)",
                  }}>{s.label}</div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginTop: 2 }}>{s.desc}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Progress bar */}
        <div style={{ marginTop: "auto" }}>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginBottom: 8 }}>Step {step} of {STEPS.length}</div>
          <div style={{ height: 4, borderRadius: 99, background: "rgba(255,255,255,0.1)" }}>
            <div style={{
              height: "100%", borderRadius: 99, background: C.accent,
              width: `${((step - 1) / (STEPS.length - 1)) * 100}%`,
              transition: "width 0.4s cubic-bezier(0.4,0,0.2,1)",
            }} />
          </div>
        </div>
      </div>

          <div className="am-right">
            <span className="am-logo">Inklusi<span>Jobs</span></span>
            <div className="am-tabs">
              <button className={`am-tab ${tab === "signin"  ? "active" : ""}`} onClick={() => setTab("signin")}>Sign In</button>
              <button className={`am-tab ${tab === "signup" ? "active" : ""}`} onClick={() => setTab("signup")}>Sign Up</button>
            </div>
            {tab === "signin"
              ? <SignInForm  role={role} onSignIn={handleSignIn}  onSwitchTab={setTab} />
              : <SignUpForm  role={role} onSignUp={handleSignUp}  onSwitchTab={setTab} />
            }
          </div>

          {step < 4 ? (
            <button
              onClick={() => canNext() && setStep(s => s + 1)}
              style={{
                padding: "10px 28px", borderRadius: 10, border: "none",
                background: canNext() ? `linear-gradient(135deg, ${C.accentDim}, #0D7377)` : C.border,
                color: canNext() ? "#fff" : C.muted, fontSize: 14, fontWeight: 700,
                cursor: canNext() ? "pointer" : "not-allowed",
                boxShadow: canNext() ? "0 4px 14px rgba(13,115,119,0.3)" : "none",
                transition: "all 0.2s",
              }}>
              Continue →
            </button>
          ) : (
            <button onClick={handleLaunch} style={{
              padding: "10px 28px", borderRadius: 10, border: "none",
              background: `linear-gradient(135deg, ${C.success}, #15803D)`,
              color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer",
              boxShadow: "0 4px 14px rgba(22,163,74,0.3)",
            }}>
              Launch Dashboard 🚀
            </button>
          )}
        </div>
      </div>
    </div>
  );
}