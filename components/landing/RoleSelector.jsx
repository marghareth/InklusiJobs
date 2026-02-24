"use client";

import { useEffect, useRef, useCallback } from "react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600;700&display=swap');

  .role-overlay {
    position: fixed;
    inset: 0;
    z-index: 9998;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 16px;
    background: rgba(15, 28, 27, 0.50);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    animation: role-fade-in 0.22s ease;
  }
  @keyframes role-fade-in {
    from { opacity: 0; }
    to   { opacity: 1; }
  }

  .role-modal {
    position: relative;
    width: 100%;
    max-width: 760px;
    background: #F7F6F4;
    border-radius: 28px;
    padding: 52px 52px 48px;
    box-shadow: 0 32px 80px rgba(15,28,27,0.28);
    animation: role-slide-up 0.28s cubic-bezier(0.22, 1, 0.36, 1);
    box-sizing: border-box;
  }
  @keyframes role-slide-up {
    from { opacity: 0; transform: translateY(24px) scale(0.97); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }

  .role-close {
    position: absolute;
    top: 18px; right: 18px;
    width: 32px; height: 32px;
    border-radius: 50%;
    border: none;
    background: #E2E8F0;
    color: #1E293B;
    font-size: 16px;
    cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    transition: background 0.18s;
  }
  .role-close:hover { background: #CBD5E1; }
  .role-close:focus-visible { outline: 2px solid #2563EB; outline-offset: 2px; }

  .role-eyebrow {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    font-family: 'DM Sans', sans-serif;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: #1E40AF;
    margin-bottom: 12px;
  }

  .role-title {
    font-family: 'DM Serif Display', serif;
    font-size: clamp(28px, 4vw, 40px);
    font-weight: 400;
    color: #1E293B;
    text-align: center;
    margin: 0 0 8px;
    letter-spacing: -0.5px;
  }

  .role-subtitle {
    font-family: 'DM Sans', sans-serif;
    font-size: 15px;
    color: #94A3B8;
    text-align: center;
    margin: 0 0 40px;
    font-weight: 400;
  }

  .role-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
  }

  .role-card {
    position: relative;
    border-radius: 20px;
    padding: 32px 28px 28px;
    cursor: pointer;
    border: 2px solid transparent;
    transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    text-align: left;
  }
  .role-card:hover { transform: translateY(-4px); box-shadow: 0 16px 48px rgba(0,0,0,0.18); }
  .role-card:focus-visible { outline: 2px solid #2563EB; outline-offset: 3px; }

  .role-card.worker {
    background: linear-gradient(145deg, #1a6b7a 0%, #0e4d6e 60%, #1E293B 100%);
  }
  .role-card.worker:hover { border-color: rgba(109,191,184,0.5); }

  .role-card.employer {
    background: linear-gradient(145deg, #2d3a8c 0%, #1E40AF 60%, #1e1b5e 100%);
  }
  .role-card.employer:hover { border-color: rgba(147,130,255,0.5); }

  .role-card::before {
    content: '';
    position: absolute;
    top: -40%; right: -20%;
    width: 200px; height: 200px;
    border-radius: 50%;
    background: rgba(255,255,255,0.05);
    pointer-events: none;
  }

  .role-icon-box {
    width: 64px; height: 64px;
    background: rgba(255,255,255,0.15);
    border-radius: 16px;
    display: flex; align-items: center; justify-content: center;
    margin-bottom: 24px;
    backdrop-filter: blur(4px);
  }

  .role-card-title {
    font-family: 'DM Serif Display', serif;
    font-size: 26px;
    font-weight: 400;
    color: #ffffff;
    margin: 0 0 10px;
    letter-spacing: -0.3px;
  }

  .role-card-desc {
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    color: rgba(255,255,255,0.72);
    line-height: 1.6;
    margin: 0 0 32px;
    font-weight: 400;
    flex: 1;
  }

  .role-card-btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: rgba(255,255,255,0.15);
    color: #ffffff;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    font-weight: 600;
    padding: 10px 20px;
    border-radius: 100px;
    border: 1.5px solid rgba(255,255,255,0.25);
    width: fit-content;
    backdrop-filter: blur(4px);
    pointer-events: none;
  }
  .role-card:hover .role-card-btn {
    background: rgba(255,255,255,0.25);
    border-color: rgba(255,255,255,0.45);
  }

  @media (max-width: 560px) {
    .role-modal { padding: 36px 20px 32px; }
    .role-grid  { grid-template-columns: 1fr; }
  }
`;

const SparkleIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1E40AF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"/>
  </svg>
);

const WorkerIcon = () => (
  <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);

const EmployerIcon = () => (
  <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="14" rx="2"/>
    <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
    <line x1="12" y1="12" x2="12" y2="16"/>
    <line x1="10" y1="14" x2="14" y2="14"/>
  </svg>
);

const ArrowRight = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/>
    <polyline points="12 5 19 12 12 19"/>
  </svg>
);

export default function RoleSelector({ isOpen, onClose, onSelectRole }) {
  const overlayRef = useRef(null);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handle = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handle);
    return () => document.removeEventListener("keydown", handle);
  }, [isOpen, onClose]);

  const handleOverlay = useCallback((e) => {
    if (e.target === overlayRef.current) onClose();
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <>
      <style>{styles}</style>
      <div
        className="role-overlay"
        ref={overlayRef}
        onClick={handleOverlay}
        role="dialog"
        aria-modal="true"
        aria-label="Choose your role"
      >
        <div className="role-modal">

          <button className="role-close" onClick={onClose} aria-label="Close">✕</button>

          <div className="role-eyebrow">
            <SparkleIcon /> Welcome to
          </div>
          <h2 className="role-title">InklusiJobs</h2>
          <p className="role-subtitle">Choose your path to get started</p>

          <div className="role-grid">

            <button
              className="role-card worker"
              onClick={() => onSelectRole("worker")}
              aria-label="I am a Worker"
            >
              <div className="role-icon-box"><WorkerIcon /></div>
              <h3 className="role-card-title">Worker</h3>
              <p className="role-card-desc">
                Showcase your skills and discover meaningful opportunities
              </p>
              <span className="role-card-btn">Get Started <ArrowRight /></span>
            </button>

            <button
              className="role-card employer"
              onClick={() => onSelectRole("employer")}
              aria-label="I am an Employer"
            >
              <div className="role-icon-box"><EmployerIcon /></div>
              <h3 className="role-card-title">Employer</h3>
              <p className="role-card-desc">
                Connect with talented individuals and build inclusive teams
              </p>
              <span className="role-card-btn">Get Started <ArrowRight /></span>
            </button>

          </div>
        </div>
      </div>
    </>
  );
}