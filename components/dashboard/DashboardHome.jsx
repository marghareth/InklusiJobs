'use client';

import StatCard from './StatCard';

const STATS = [
  { icon: '🏅', value: '12', label: 'Skills Mastered', delta: '+3', color: '#f59e0b' },
  { icon: '⚡', value: '8',  label: 'Challenges Completed', delta: '+2', color: '#6366f1' },
  { icon: '📈', value: '68%',label: 'Overall Progress', delta: '+5%', color: '#10b981' },
  { icon: '🗂️', value: '5',  label: 'Portfolio Items', delta: '+1', color: '#06b6d4' },
];

const RECENT_ACTIVITY = [
  { type: 'challenge', icon: '✅', title: 'Completed challenge', sub: 'Database Design Fundamentals', time: '2 hours ago', c: '#10b981', bg: 'rgba(16,185,129,0.1)' },
  { type: 'achievement', icon: '🏆', title: 'Unlocked achievement', sub: 'Fast Learner', time: '1 day ago', c: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
  { type: 'portfolio', icon: '🎯', title: 'Added to portfolio', sub: 'E-commerce Dashboard', time: '2 days ago', c: '#6366f1', bg: 'rgba(99,102,241,0.1)' },
  { type: 'challenge', icon: '🕐', title: 'Started challenge', sub: 'Build a RESTful API', time: '3 days ago', c: '#8b5cf6', bg: 'rgba(139,92,246,0.1)' },
];

const LEARNING_PATH = [
  { label: 'Beginner', progress: 100, status: 'Completed', color: '#10b981', locked: false },
  { label: 'Intermediate', progress: 68, status: 'In Progress', color: '#6366f1', locked: false },
  { label: 'Advanced', progress: 0, status: 'Locked', color: '#374151', locked: true },
];

export default function DashboardHome() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Mono:wght@400;500&display=swap');

        .dh-root {
          display: flex;
          flex-direction: column;
          gap: 24px;
          padding: 32px;
          min-height: 100%;
          font-family: 'Syne', sans-serif;
        }

        /* ── Header ── */
        .dh-topbar {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 16px;
        }
        .dh-greet {
          font-size: 26px;
          font-weight: 800;
          color: #fff;
          letter-spacing: -0.5px;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .dh-sub {
          font-size: 13px;
          color: rgba(255,255,255,0.4);
          margin-top: 4px;
          font-weight: 400;
        }
        .dh-actions {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-shrink: 0;
        }
        .dh-btn-outline {
          padding: 9px 18px;
          border-radius: 10px;
          border: 1px solid rgba(99,102,241,0.3);
          color: rgba(255,255,255,0.65);
          font-size: 12.5px;
          font-family: 'Syne', sans-serif;
          font-weight: 600;
          cursor: pointer;
          background: rgba(99,102,241,0.06);
          transition: all .2s;
          letter-spacing: 0.2px;
        }
        .dh-btn-outline:hover { border-color: rgba(99,102,241,0.6); color: #c7d2fe; background: rgba(99,102,241,0.12); }
        .dh-btn-primary {
          padding: 9px 18px;
          border-radius: 10px;
          border: none;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          color: #fff;
          font-size: 12.5px;
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          cursor: pointer;
          transition: all .2s;
          box-shadow: 0 4px 16px rgba(99,102,241,0.35);
          letter-spacing: 0.2px;
        }
        .dh-btn-primary:hover { box-shadow: 0 6px 24px rgba(99,102,241,0.5); transform: translateY(-1px); }

        /* ── Stats Grid ── */
        .dh-stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
        }
        @media (max-width: 1100px) { .dh-stats { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 650px)  { .dh-stats { grid-template-columns: 1fr; } }

        /* ── Middle Row ── */
        .dh-mid {
          display: grid;
          grid-template-columns: 1fr 340px;
          gap: 20px;
        }
        @media (max-width: 900px) { .dh-mid { grid-template-columns: 1fr; } }

        /* ── Challenge Card ── */
        .dh-challenge {
          background: linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.02) 100%);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 18px;
          padding: 26px;
          position: relative;
          overflow: hidden;
          backdrop-filter: blur(10px);
        }
        .dh-challenge::before {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(99,102,241,0.05) 0%, transparent 60%);
          pointer-events: none;
        }
        .dh-challenge-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
        }
        .dh-section-title {
          font-size: 15px;
          font-weight: 700;
          color: #fff;
          letter-spacing: -0.2px;
        }
        .dh-badge-inprogress {
          padding: 4px 12px;
          background: rgba(245,158,11,0.12);
          border: 1px solid rgba(245,158,11,0.22);
          border-radius: 20px;
          font-size: 11px;
          font-weight: 700;
          color: #fbbf24;
          font-family: 'DM Mono', monospace;
          letter-spacing: 0.5px;
        }
        .dh-challenge-card {
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.05);
          border-radius: 14px;
          padding: 20px;
          display: flex;
          gap: 16px;
          align-items: flex-start;
        }
        .dh-challenge-icon {
          width: 48px; height: 48px; flex-shrink: 0;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          border-radius: 14px;
          display: flex; align-items: center; justify-content: center;
          font-size: 22px;
          box-shadow: 0 4px 16px rgba(99,102,241,0.35);
        }
        .dh-challenge-name {
          font-size: 15px;
          font-weight: 700;
          color: #fff;
          margin-bottom: 6px;
          letter-spacing: -0.2px;
        }
        .dh-challenge-desc {
          font-size: 12.5px;
          color: rgba(255,255,255,0.4);
          line-height: 1.6;
          margin-bottom: 14px;
          font-family: 'DM Mono', monospace;
          font-weight: 400;
        }
        .dh-challenge-meta {
          display: flex;
          gap: 16px;
          margin-bottom: 16px;
        }
        .dh-meta-item {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          color: rgba(255,255,255,0.45);
          font-family: 'DM Mono', monospace;
        }
        .dh-prog-label {
          display: flex;
          justify-content: space-between;
          font-size: 12px;
          color: rgba(255,255,255,0.45);
          margin-bottom: 8px;
          font-family: 'DM Mono', monospace;
        }
        .dh-prog-track {
          height: 6px;
          background: rgba(255,255,255,0.08);
          border-radius: 10px;
          overflow: hidden;
        }
        .dh-prog-fill {
          height: 100%;
          border-radius: 10px;
          background: linear-gradient(90deg, #6366f1, #8b5cf6, #06b6d4);
          position: relative;
          transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .dh-prog-fill::after {
          content: '';
          position: absolute;
          top: 0; right: 0; bottom: 0; left: 0;
          background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.25) 50%, transparent 100%);
          animation: shimmer 2s infinite;
        }
        @keyframes shimmer { 0%{transform:translateX(-100%)} 100%{transform:translateX(100%)} }
        .dh-continue-btn {
          margin-top: 20px;
          width: 100%;
          padding: 13px;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          border: none;
          border-radius: 12px;
          color: #fff;
          font-size: 13px;
          font-weight: 700;
          font-family: 'Syne', sans-serif;
          cursor: pointer;
          transition: all .2s;
          box-shadow: 0 4px 20px rgba(99,102,241,0.35);
          letter-spacing: 0.3px;
        }
        .dh-continue-btn:hover { box-shadow: 0 6px 28px rgba(99,102,241,0.55); transform: translateY(-1px); }

        /* ── Learning Path ── */
        .dh-path {
          background: linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.02) 100%);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 18px;
          padding: 26px;
          backdrop-filter: blur(10px);
          position: relative;
          overflow: hidden;
        }
        .dh-path::before {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(139,92,246,0.04) 0%, transparent 60%);
          pointer-events: none;
        }
        .dh-path-item {
          margin-top: 20px;
        }
        .dh-path-row {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 8px;
        }
        .dh-path-icon {
          width: 32px; height: 32px; flex-shrink: 0;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 14px;
        }
        .dh-path-info { flex: 1; }
        .dh-path-name {
          font-size: 13px;
          font-weight: 700;
          color: rgba(255,255,255,0.85);
        }
        .dh-path-status { font-size: 11px; color: rgba(255,255,255,0.35); font-family: 'DM Mono', monospace; }
        .dh-path-pct {
          font-size: 13px;
          font-weight: 700;
          font-family: 'DM Mono', monospace;
        }
        .dh-path-bar {
          height: 5px;
          background: rgba(255,255,255,0.06);
          border-radius: 10px;
          overflow: hidden;
          margin-left: 44px;
        }
        .dh-path-fill {
          height: 100%;
          border-radius: 10px;
          transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .dh-viewmap-btn {
          margin-top: 22px;
          width: 100%;
          padding: 12px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.09);
          border-radius: 12px;
          color: rgba(255,255,255,0.6);
          font-size: 12.5px;
          font-weight: 600;
          font-family: 'Syne', sans-serif;
          cursor: pointer;
          transition: all .2s;
          letter-spacing: 0.3px;
        }
        .dh-viewmap-btn:hover { background: rgba(99,102,241,0.1); border-color: rgba(99,102,241,0.25); color: #c7d2fe; }

        /* ── Activity ── */
        .dh-activity {
          background: linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.02) 100%);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 18px;
          padding: 26px;
          backdrop-filter: blur(10px);
        }
        .dh-activity-list { display: flex; flex-direction: column; gap: 4px; margin-top: 18px; }
        .dh-act-item {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 14px 16px;
          border-radius: 12px;
          transition: background .15s;
          cursor: default;
        }
        .dh-act-item:hover { background: rgba(255,255,255,0.03); }
        .dh-act-icon {
          width: 36px; height: 36px; flex-shrink: 0;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 16px;
        }
        .dh-act-title {
          font-size: 13px;
          font-weight: 700;
          color: rgba(255,255,255,0.85);
        }
        .dh-act-sub {
          font-size: 11.5px;
          color: rgba(255,255,255,0.35);
          font-family: 'DM Mono', monospace;
          margin-top: 1px;
        }
        .dh-act-time {
          margin-left: auto;
          font-size: 11px;
          color: rgba(255,255,255,0.25);
          font-family: 'DM Mono', monospace;
          white-space: nowrap;
          flex-shrink: 0;
        }

        /* ── Match Preview ── */
        .dh-match {
          background: linear-gradient(135deg, rgba(6,182,212,0.08) 0%, rgba(99,102,241,0.06) 100%);
          border: 1px solid rgba(6,182,212,0.15);
          border-radius: 18px;
          padding: 26px;
          display: flex;
          align-items: center;
          gap: 24px;
          position: relative;
          overflow: hidden;
        }
        .dh-match::before {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.03) 0%, transparent 60%);
          pointer-events: none;
        }
        .dh-match-ring {
          width: 80px; height: 80px; flex-shrink: 0;
          position: relative;
        }
        .dh-match-ring svg { width: 100%; height: 100%; transform: rotate(-90deg); }
        .dh-match-ring-bg { stroke: rgba(255,255,255,0.07); fill: none; }
        .dh-match-ring-fill { stroke: url(#matchGrad); fill: none; stroke-linecap: round; stroke-dasharray: 251; stroke-dashoffset: 75; transition: stroke-dashoffset 1s ease; }
        .dh-match-pct {
          position: absolute; inset: 0;
          display: flex; align-items: center; justify-content: center;
          font-family: 'DM Mono', monospace; font-size: 14px; font-weight: 700; color: #fff;
        }
        .dh-match-title { font-size: 15px; font-weight: 700; color: #fff; margin-bottom: 4px; }
        .dh-match-desc { font-size: 12px; color: rgba(255,255,255,0.4); font-family: 'DM Mono', monospace; line-height: 1.6; }
        .dh-match-cta {
          margin-left: auto; flex-shrink: 0;
          padding: 9px 16px;
          border: 1px solid rgba(6,182,212,0.3);
          border-radius: 10px;
          color: #22d3ee;
          font-size: 12px;
          font-weight: 600;
          font-family: 'Syne', sans-serif;
          cursor: pointer;
          background: rgba(6,182,212,0.06);
          transition: all .2s;
          white-space: nowrap;
        }
        .dh-match-cta:hover { background: rgba(6,182,212,0.14); border-color: rgba(6,182,212,0.5); }
      `}</style>

      <div className="dh-root">
        {/* Top bar */}
        <div className="dh-topbar">
          <div>
            <div className="dh-greet">Welcome back, Sarah! 👋</div>
            <div className="dh-sub">You're on a roll — keep the momentum going.</div>
          </div>
          <div className="dh-actions">
            <button className="dh-btn-outline">View Profile</button>
            <button className="dh-btn-primary">+ New Challenge</button>
          </div>
        </div>

        {/* Stats */}
        <div className="dh-stats">
          {STATS.map((s, i) => (
            <StatCard key={i} {...s} />
          ))}
        </div>

        {/* Middle: Current Challenge + Learning Path */}
        <div className="dh-mid">
          {/* Current Challenge */}
          <div className="dh-challenge">
            <div className="dh-challenge-header">
              <span className="dh-section-title">Current Challenge</span>
              <span className="dh-badge-inprogress">In Progress</span>
            </div>
            <div className="dh-challenge-card">
              <div className="dh-challenge-icon">⚡</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="dh-challenge-name">Build a RESTful API with Authentication</div>
                <div className="dh-challenge-desc">
                  Create a secure backend API with user authentication, role-based access control, and data validation. Demonstrate best practices in security and architecture.
                </div>
                <div className="dh-challenge-meta">
                  <div className="dh-meta-item">⏱️ Est. 12 hours</div>
                  <div className="dh-meta-item">🏆 250 points</div>
                </div>
                <div className="dh-prog-label">
                  <span>Challenge Progress</span>
                  <span style={{ color: '#818cf8', fontWeight: 700 }}>65%</span>
                </div>
                <div className="dh-prog-track">
                  <div className="dh-prog-fill" style={{ width: '65%' }} />
                </div>
              </div>
            </div>
            <button className="dh-continue-btn">Continue Challenge →</button>
          </div>

          {/* Learning Path */}
          <div className="dh-path">
            <div className="dh-section-title">Learning Path</div>
            {LEARNING_PATH.map((step, i) => (
              <div className="dh-path-item" key={i}>
                <div className="dh-path-row">
                  <div className="dh-path-icon" style={{ background: `${step.color}18`, border: `1px solid ${step.color}30` }}>
                    {step.progress === 100 ? '✅' : step.locked ? '🔒' : '🕐'}
                  </div>
                  <div className="dh-path-info">
                    <div className="dh-path-name" style={{ color: step.locked ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.85)' }}>{step.label}</div>
                    <div className="dh-path-status">{step.status}</div>
                  </div>
                  <div className="dh-path-pct" style={{ color: step.color }}>{step.progress}%</div>
                </div>
                <div className="dh-path-bar">
                  <div className="dh-path-fill" style={{ width: `${step.progress}%`, background: `linear-gradient(90deg, ${step.color}, ${step.color}aa)` }} />
                </div>
              </div>
            ))}
            <button className="dh-viewmap-btn">View Full Roadmap →</button>
          </div>
        </div>

        {/* Job Match Preview */}
        <div className="dh-match">
          <svg style={{ position: 'absolute', width: 0, height: 0 }}>
            <defs>
              <linearGradient id="matchGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#06b6d4" />
                <stop offset="100%" stopColor="#6366f1" />
              </linearGradient>
            </defs>
          </svg>
          <div className="dh-match-ring">
            <svg viewBox="0 0 88 88">
              <circle className="dh-match-ring-bg" cx="44" cy="44" r="40" strokeWidth="7" />
              <circle className="dh-match-ring-fill" cx="44" cy="44" r="40" strokeWidth="7" />
            </svg>
            <div className="dh-match-pct">70%</div>
          </div>
          <div>
            <div className="dh-match-title">Job Match Preview</div>
            <div className="dh-match-desc">
              You match 70% of requirements for <strong style={{ color: 'rgba(255,255,255,0.7)' }}>3 open roles</strong> based on your current skills. Complete the Intermediate path to unlock more.
            </div>
          </div>
          <button className="dh-match-cta">Explore Jobs →</button>
        </div>

        {/* Recent Activity */}
        <div className="dh-activity">
          <div className="dh-section-title">Recent Activity</div>
          <div className="dh-activity-list">
            {RECENT_ACTIVITY.map((a, i) => (
              <div className="dh-act-item" key={i}>
                <div className="dh-act-icon" style={{ background: a.bg }}>
                  {a.icon}
                </div>
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