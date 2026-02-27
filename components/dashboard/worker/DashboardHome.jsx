'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import StatCard from './StatCard';

const STATS = [
  { icon: '🏅', value: '12', label: 'Skills Mastered',       delta: '+3',  color: '#2DB8A0' },
  { icon: '⚡', value: '8',  label: 'Challenges Completed',  delta: '+2',  color: '#1A2744' },
  { icon: '📈', value: '68%',label: 'Overall Progress',      delta: '+5%', color: '#2DB8A0' },
  { icon: '🗂️', value: '5',  label: 'Portfolio Items',       delta: '+1',  color: '#1A2744' },
];

const RECENT_ACTIVITY = [
  { icon: '✅', title: 'Completed challenge',  sub: 'Database Design Fundamentals', time: '2 hours ago',  c: '#2DB8A0', bg: 'rgba(45,184,160,0.08)' },
  { icon: '🏆', title: 'Unlocked achievement', sub: 'Fast Learner',                 time: '1 day ago',    c: '#1A2744', bg: 'rgba(26,39,68,0.08)'   },
  { icon: '🎯', title: 'Added to portfolio',   sub: 'E-commerce Dashboard',         time: '2 days ago',   c: '#2DB8A0', bg: 'rgba(45,184,160,0.08)' },
  { icon: '🕐', title: 'Started challenge',    sub: 'Build a RESTful API',          time: '3 days ago',   c: '#1A2744', bg: 'rgba(26,39,68,0.06)'   },
];

const LEARNING_PATH = [
  { label: 'Beginner',     progress: 100, status: 'Completed',   color: '#2DB8A0', locked: false },
  { label: 'Intermediate', progress: 68,  status: 'In Progress', color: '#1A2744', locked: false },
  { label: 'Advanced',     progress: 0,   status: 'Locked',      color: '#9BADC8', locked: true  },
];

export default function DashboardHome() {
  const [firstName, setFirstName] = useState('');

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return;

      supabase
        .from('profiles')
        .select('first_name')
        .eq('id', user.id)
        .single()
        .then(({ data }) => {
          if (data?.first_name) setFirstName(data.first_name);
        });
    });
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Instrument+Sans:wght@400;500;600;700&display=swap');

        /* ─── Root canvas ─────────────────────────────────────────────────────── */
        .dh-root {
          display: flex; flex-direction: column; gap: 24px;
          padding: 36px;
          min-height: 100%;
          font-family: 'Instrument Sans', sans-serif;
          color: #1A2744;
        }

        /* ─── Warm glass mixin ─────────────────────────────────────────────────*/
        .dh-card {
          background: rgba(255,255,255,0.92);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          border: 1px solid rgba(26,39,68,0.12);
          border-radius: 18px;
          box-shadow:
            0 2px 12px rgba(26,39,68,0.08),
            0 1px 3px rgba(26,39,68,0.05);
          transition: box-shadow .2s ease, transform .2s ease;
        }
        .dh-card:hover {
          box-shadow:
            0 6px 24px rgba(26,39,68,0.12),
            0 2px 6px rgba(26,39,68,0.07);
        }

        /* ─── Header ──────────────────────────────────────────────────────────── */
        .dh-topbar {
          display: flex; align-items: flex-start; justify-content: space-between; gap: 16px;
        }
        .dh-greet {
          font-family: 'Playfair Display', serif;
          font-size: 40px; font-weight: 700;
          color: #1A2744; letter-spacing: -0.3px;
          line-height: 1.2;
        }
        .dh-greet-wave { font-style: normal; }
        .dh-sub {
          font-size: 13px; color: rgba(26,39,68,0.50);
          margin-top: 5px; font-weight: 400; letter-spacing: 0.1px;
        }
        .dh-actions { display: flex; align-items: center; gap: 10px; flex-shrink: 0; }

        .dh-btn-outline {
          padding: 9px 18px; border-radius: 10px;
          border: 1px solid rgba(26,39,68,0.20);
          color: rgba(26,39,68,0.70); font-size: 12.5px;
          font-family: 'Instrument Sans', sans-serif; font-weight: 600;
          cursor: pointer;
          background: rgba(255,255,255,0.8);
          transition: all .2s; letter-spacing: 0.1px;
        }
        .dh-btn-outline:hover {
          border-color: rgba(45,184,160,0.50);
          color: #1A7A6E; background: rgba(45,184,160,0.06);
        }
        .dh-btn-primary {
          padding: 9px 18px; border-radius: 10px; border: none;
          background: linear-gradient(135deg, #1A2744, #2D3F6B);
          color: #fff; font-size: 12.5px;
          font-family: 'Instrument Sans', sans-serif; font-weight: 700;
          cursor: pointer; transition: all .2s; letter-spacing: 0.2px;
          box-shadow: 0 4px 14px rgba(26,39,68,0.25);
        }
        .dh-btn-primary:hover {
          box-shadow: 0 6px 20px rgba(26,39,68,0.35);
          transform: translateY(-1px);
        }

        /* ─── Stats grid ───────────────────────────────────────────────────────── */
        .dh-stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
        }
        @media (max-width: 1100px) { .dh-stats { grid-template-columns: repeat(2,1fr); } }
        @media (max-width: 650px)  { .dh-stats { grid-template-columns: 1fr; } }

        /* ─── Middle row ───────────────────────────────────────────────────────── */
        .dh-mid {
          display: grid;
          grid-template-columns: 1fr 330px;
          gap: 20px;
        }
        @media (max-width: 900px) { .dh-mid { grid-template-columns: 1fr; } }

        /* ─── Section title ─────────────────────────────────────────────────── */
        .dh-section-title {
          font-family: 'Playfair Display', serif;
          font-size: 16px; font-weight: 600;
          color: #1A2744; letter-spacing: -0.2px;
        }

        /* ─── Current Challenge ─────────────────────────────────────────────── */
        .dh-challenge { padding: 26px; }
        .dh-challenge-header {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 20px;
        }
        .dh-badge-inprogress {
          padding: 4px 12px;
          background: rgba(45,184,160,0.10);
          border: 1px solid rgba(45,184,160,0.28);
          border-radius: 20px;
          font-size: 11px; font-weight: 600;
          color: #1A7A6E; letter-spacing: 0.3px;
        }
        .dh-challenge-inner {
          background: rgba(248,250,253,0.80);
          border: 1px solid rgba(26,39,68,0.10);
          border-radius: 14px; padding: 20px;
          display: flex; gap: 16px; align-items: flex-start;
        }
        .dh-challenge-icon {
          width: 46px; height: 46px; flex-shrink: 0;
          background: linear-gradient(135deg, #1A2744, #2D3F6B);
          border-radius: 13px;
          display: flex; align-items: center; justify-content: center;
          font-size: 22px;
          box-shadow: 0 4px 14px rgba(26,39,68,0.25);
        }
        .dh-challenge-name {
          font-family: 'Playfair Display', serif;
          font-size: 15px; font-weight: 600; color: #1A2744;
          margin-bottom: 6px; letter-spacing: -0.1px; line-height: 1.3;
        }
        .dh-challenge-desc {
          font-size: 12.5px; color: rgba(26,39,68,0.50);
          line-height: 1.65; margin-bottom: 14px;
        }
        .dh-challenge-meta { display: flex; gap: 16px; margin-bottom: 16px; }
        .dh-meta-item {
          display: flex; align-items: center; gap: 6px;
          font-size: 12px; color: rgba(26,39,68,0.45);
        }
        .dh-prog-label {
          display: flex; justify-content: space-between;
          font-size: 12px; color: rgba(26,39,68,0.45); margin-bottom: 8px;
        }
        .dh-prog-track {
          height: 6px;
          background: rgba(26,39,68,0.10);
          border-radius: 10px; overflow: hidden;
        }
        .dh-prog-fill {
          height: 100%; border-radius: 10px;
          background: linear-gradient(90deg, #2DB8A0, #1A9E88);
          position: relative;
          transition: width 0.8s cubic-bezier(0.4,0,0.2,1);
        }
        .dh-prog-fill::after {
          content: '';
          position: absolute; top: 0; right: 0; bottom: 0; left: 0;
          background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%);
          animation: shimmer 2.4s infinite;
        }
        @keyframes shimmer { 0%{transform:translateX(-100%)} 100%{transform:translateX(100%)} }

        .dh-continue-btn {
          margin-top: 20px; width: 100%; padding: 13px;
          background: linear-gradient(135deg, #1A2744, #2D3F6B);
          border: none; border-radius: 12px;
          color: #fff; font-size: 13px; font-weight: 700;
          font-family: 'Instrument Sans', sans-serif;
          cursor: pointer; transition: all .2s;
          box-shadow: 0 4px 16px rgba(26,39,68,0.25);
          letter-spacing: 0.3px;
        }
        .dh-continue-btn:hover {
          box-shadow: 0 6px 24px rgba(26,39,68,0.35);
          transform: translateY(-1px);
        }

        /* ─── Learning Path ─────────────────────────────────────────────────── */
        .dh-path { padding: 26px; display: flex; flex-direction: column; }
        .dh-path-item { margin-top: 18px; }
        .dh-path-row {
          display: flex; align-items: center; gap: 12px; margin-bottom: 8px;
        }
        .dh-path-icon {
          width: 32px; height: 32px; flex-shrink: 0;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 14px;
        }
        .dh-path-name {
          font-family: 'Instrument Sans', sans-serif;
          font-size: 13px; font-weight: 600; color: #1A2744;
        }
        .dh-path-status {
          font-size: 11px; color: rgba(26,39,68,0.40); margin-top: 1px;
        }
        .dh-path-pct { font-size: 13px; font-weight: 700; }
        .dh-path-bar {
          height: 5px;
          background: rgba(26,39,68,0.10);
          border-radius: 10px; overflow: hidden;
          margin-left: 44px;
        }
        .dh-path-fill {
          height: 100%; border-radius: 10px;
          transition: width 0.8s cubic-bezier(0.4,0,0.2,1);
        }
        .dh-viewmap-btn {
          margin-top: 22px; width: 100%; padding: 12px;
          background: transparent;
          border: 1px solid rgba(26,39,68,0.18);
          border-radius: 12px; color: rgba(26,39,68,0.55);
          font-size: 12.5px; font-weight: 600;
          font-family: 'Instrument Sans', sans-serif;
          cursor: pointer; transition: all .2s; letter-spacing: 0.2px;
        }
        .dh-viewmap-btn:hover {
          border-color: rgba(45,184,160,0.45);
          color: #1A7A6E; background: rgba(45,184,160,0.05);
        }

        /* ─── Job Match ─────────────────────────────────────────────────────── */
        .dh-match {
          padding: 24px;
          display: flex; align-items: center; gap: 22px;
          background: rgba(255,255,255,0.92);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          border: 1px solid rgba(26,39,68,0.12);
          border-radius: 18px;
          box-shadow: 0 2px 12px rgba(26,39,68,0.08);
          position: relative; overflow: hidden;
        }
        .dh-match::before {
          content:''; position:absolute; inset:0; pointer-events:none;
          background: linear-gradient(135deg, rgba(45,184,160,0.04) 0%, rgba(26,39,68,0.03) 100%);
        }
        .dh-match-ring { width: 78px; height: 78px; flex-shrink: 0; position: relative; }
        .dh-match-ring svg { width: 100%; height: 100%; transform: rotate(-90deg); }
        .dh-match-ring-bg { stroke: rgba(26,39,68,0.12); fill: none; }
        .dh-match-ring-fill {
          stroke: url(#brandMatchGrad); fill: none;
          stroke-linecap: round;
          stroke-dasharray: 251; stroke-dashoffset: 75;
          transition: stroke-dashoffset 1s ease;
        }
        .dh-match-pct {
          position: absolute; inset: 0;
          display: flex; align-items: center; justify-content: center;
          font-family: 'Playfair Display', serif;
          font-size: 15px; font-weight: 700; color: #1A2744;
        }
        .dh-match-title {
          font-family: 'Playfair Display', serif;
          font-size: 15px; font-weight: 600; color: #1A2744; margin-bottom: 5px;
        }
        .dh-match-desc {
          font-size: 12.5px; color: rgba(26,39,68,0.50); line-height: 1.65;
        }
        .dh-match-cta {
          margin-left: auto; flex-shrink: 0;
          padding: 9px 16px;
          border: 1px solid rgba(45,184,160,0.30);
          border-radius: 10px; color: #1A7A6E;
          font-size: 12px; font-weight: 600;
          font-family: 'Instrument Sans', sans-serif;
          cursor: pointer;
          background: rgba(45,184,160,0.06);
          transition: all .2s; white-space: nowrap;
        }
        .dh-match-cta:hover {
          background: rgba(45,184,160,0.12);
          border-color: rgba(45,184,160,0.50);
          color: #157062;
        }

        /* ─── Activity ──────────────────────────────────────────────────────── */
        .dh-activity { padding: 26px; }
        .dh-activity-list { display: flex; flex-direction: column; gap: 2px; margin-top: 18px; }
        .dh-act-item {
          display: flex; align-items: center; gap: 14px;
          padding: 13px 14px; border-radius: 12px;
          transition: background .15s; cursor: default;
        }
        .dh-act-item:hover { background: rgba(26,39,68,0.04); }
        .dh-act-icon {
          width: 36px; height: 36px; flex-shrink: 0;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 15px;
        }
        .dh-act-title {
          font-size: 13px; font-weight: 600; color: #1A2744;
        }
        .dh-act-sub {
          font-size: 11.5px; color: rgba(26,39,68,0.42); margin-top: 1px;
        }
        .dh-act-time {
          margin-left: auto;
          font-size: 11px; color: rgba(26,39,68,0.30);
          white-space: nowrap; flex-shrink: 0;
        }

        /* ─── Divider ──────────────────────────────────────────────────────── */
        .dh-divider {
          height: 1px;
          background: rgba(26,39,68,0.08);
          border: none; margin: 0;
        }
      `}</style>

      <div className="dh-root">

        {/* ── Header ── */}
        <div className="dh-topbar">
          <div>
            <div className="dh-greet">
              Welcome back, {firstName || 'there'} <span className="dh-greet-wave">👋</span>
            </div>
            <div className="dh-sub">You're on a roll — keep the momentum going.</div>
          </div>
          <div className="dh-actions">
            <button className="dh-btn-outline">View Profile</button>
            <button className="dh-btn-primary">+ New Challenge</button>
          </div>
        </div>

        {/* ── Stats ── */}
        <div className="dh-stats">
          {STATS.map((s, i) => <StatCard key={i} {...s} />)}
        </div>

        {/* ── Middle row ── */}
        <div className="dh-mid">

          {/* Current Challenge */}
          <div className="dh-card dh-challenge">
            <div className="dh-challenge-header">
              <span className="dh-section-title">Current Challenge</span>
              <span className="dh-badge-inprogress">In Progress</span>
            </div>
            <div className="dh-challenge-inner">
              <div className="dh-challenge-icon">⚡</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="dh-challenge-name">Build a RESTful API with Authentication</div>
                <div className="dh-challenge-desc">
                  Create a secure backend API with user authentication, role-based access control, and data validation. Demonstrate best practices in security and architecture.
                </div>
                <div className="dh-challenge-meta">
                  <span className="dh-meta-item">⏱️ Est. 12 hours</span>
                  <span className="dh-meta-item">🏆 250 points</span>
                </div>
                <div className="dh-prog-label">
                  <span>Challenge Progress</span>
                  <span style={{ color: '#2DB8A0', fontWeight: 700 }}>65%</span>
                </div>
                <div className="dh-prog-track">
                  <div className="dh-prog-fill" style={{ width: '65%' }} />
                </div>
              </div>
            </div>
            <button className="dh-continue-btn">Continue Challenge →</button>
          </div>

          {/* Learning Path */}
          <div className="dh-card dh-path">
            <span className="dh-section-title">Learning Path</span>
            {LEARNING_PATH.map((step, i) => (
              <div className="dh-path-item" key={i}>
                <div className="dh-path-row">
                  <div className="dh-path-icon" style={{ background: `${step.color}14`, border: `1px solid ${step.color}28` }}>
                    {step.progress === 100 ? '✅' : step.locked ? '🔒' : '🕐'}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div className="dh-path-name" style={{ color: step.locked ? 'rgba(26,39,68,0.30)' : '#1A2744' }}>
                      {step.label}
                    </div>
                    <div className="dh-path-status">{step.status}</div>
                  </div>
                  <div className="dh-path-pct" style={{ color: step.locked ? 'rgba(26,39,68,0.25)' : step.color }}>
                    {step.progress}%
                  </div>
                </div>
                <div className="dh-path-bar">
                  <div className="dh-path-fill" style={{ width: `${step.progress}%`, background: `linear-gradient(90deg, ${step.color}, ${step.color}99)` }} />
                </div>
              </div>
            ))}
            <button className="dh-viewmap-btn">View Full Roadmap →</button>
          </div>
        </div>

        {/* ── Job Match ── */}
        <div className="dh-match">
          <svg style={{ position: 'absolute', width: 0, height: 0 }}>
            <defs>
              <linearGradient id="brandMatchGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%"   stopColor="#2DB8A0" />
                <stop offset="100%" stopColor="#1A2744" />
              </linearGradient>
            </defs>
          </svg>
          <div className="dh-match-ring">
            <svg viewBox="0 0 88 88">
              <circle className="dh-match-ring-bg"   cx="44" cy="44" r="40" strokeWidth="7" />
              <circle className="dh-match-ring-fill" cx="44" cy="44" r="40" strokeWidth="7" />
            </svg>
            <div className="dh-match-pct">70%</div>
          </div>
          <div>
            <div className="dh-match-title">Job Match Preview</div>
            <div className="dh-match-desc">
              You match 70% of requirements for <strong style={{ color: '#1A2744' }}>3 open roles</strong> based on your current skills. Complete the Intermediate path to unlock more.
            </div>
          </div>
          <button className="dh-match-cta">Explore Jobs →</button>
        </div>

        {/* ── Recent Activity ── */}
        <div className="dh-card dh-activity">
          <span className="dh-section-title">Recent Activity</span>
          <div className="dh-activity-list">
            {RECENT_ACTIVITY.map((a, i) => (
              <div className="dh-act-item" key={i}>
                <div className="dh-act-icon" style={{ background: a.bg }}>{a.icon}</div>
                <div>
                  <div className="dh-act-title">{a.title}</div>
                  <div className="dh-act-sub">{a.sub}</div>
                </div>
                <div className="dh-act-time">{a.time}</div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </>
  );
}