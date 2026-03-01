'use client';

// ─── DashboardHome.jsx ────────────────────────────────────────────────────────
// UPDATED: all data now reads from localStorage via useAppData().
// UI, styles, and layout are 100% identical to the original.
//
// DATA SOURCES:
//   profile.name              → Welcome name
//   challenges[]              → stat cards + current challenge + learning path
//   tracker.stats             → skills mastered, challenges completed, progress
//   tracker.phases[]          → learning path bars
//   tracker.submissions[]     → recent activity
//   scoring.overallScore      → job match percentage
//   tracker.applications[]    → portfolio count fallback

import { useState, useEffect, useMemo } from 'react';
import { useAppData } from '@/hooks/useAppData';
import StatCard from './StatCard';

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Returns the first in-progress or not-started challenge across all phases */
function getCurrentChallenge(challenges) {
  return (
    challenges.find(c => c.status === 'pending') ||
    challenges.find(c => c.status === 'not_started') ||
    null
  );
}

/** Calculates phase progress as % of approved challenges */
function getPhaseProgress(phase, challenges) {
  const phaseChallenges = challenges.filter(c => c.phase_id === phase.id);
  if (!phaseChallenges.length) return 0;
  const approved = phaseChallenges.filter(c => c.status === 'approved').length;
  return Math.round((approved / phaseChallenges.length) * 100);
}

/** Maps phase status + progress to a learning path display config */
function getPhaseDisplayStatus(phase, progress) {
  if (progress === 100)           return 'Completed';
  if (phase.status === 'active')  return 'In Progress';
  if (phase.status === 'locked')  return 'Locked';
  return 'Not Started';
}

/** Formats a submission into a recent activity entry */
function submissionToActivity(submission) {
  const statusConfig = {
    approved:       { icon: '✅', title: 'Completed challenge',  c: '#2DB8A0', bg: 'rgba(45,184,160,0.08)' },
    pending:        { icon: '⏳', title: 'Submitted for review', c: '#1A2744', bg: 'rgba(26,39,68,0.08)'   },
    rejected:       { icon: '🔁', title: 'Needs revision',       c: '#C0392B', bg: 'rgba(192,57,43,0.08)'  },
    needs_revision: { icon: '📝', title: 'Revision requested',   c: '#B07D20', bg: 'rgba(176,125,32,0.08)' },
  };
  const cfg = statusConfig[submission.status] || { icon: '🕐', title: 'Started challenge', c: '#1A2744', bg: 'rgba(26,39,68,0.06)' };
  return {
    icon:  cfg.icon,
    title: cfg.title,
    sub:   submission.challengeTitle,
    time:  formatTimeAgo(submission.submitted_at),
    c:     cfg.c,
    bg:    cfg.bg,
  };
}

function formatTimeAgo(isoString) {
  if (!isoString) return '';
  const diff = Math.floor((Date.now() - new Date(isoString)) / 1000);
  if (diff < 60)     return 'Just now';
  if (diff < 3600)   return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400)  return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return new Date(isoString).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// ─── Fallback data (shown before assessment is completed) ──────────────────────
const FALLBACK_STATS = [
  { icon: '🏅', value: '—', label: 'Skills Mastered',      delta: '',    color: '#2DB8A0' },
  { icon: '⚡', value: '—', label: 'Challenges Completed', delta: '',    color: '#1A2744' },
  { icon: '📈', value: '—', label: 'Overall Progress',     delta: '',    color: '#2DB8A0' },
  { icon: '🗂️', value: '—', label: 'Portfolio Items',      delta: '',    color: '#1A2744' },
];

const FALLBACK_ACTIVITY = [
  { icon: '👋', title: 'Welcome to InklusiJobs', sub: 'Complete your assessment to get started', time: 'Now', c: '#2DB8A0', bg: 'rgba(45,184,160,0.08)' },
];

// ─── Component ────────────────────────────────────────────────────────────────
export default function DashboardHome() {
  const appData = useAppData();

  // ── Derived data ────────────────────────────────────────────────────────────
  const firstName = useMemo(() => {
    const name = appData.profile?.name;
    if (!name || name === 'Your Name') return '';
    return name.split(' ')[0];
  }, [appData.profile?.name]);

  const hasAssessment = useMemo(() =>
    appData.challenges?.length > 0 || appData.tracker?.submissions?.length > 0
  , [appData.challenges, appData.tracker?.submissions]);

  // Stat cards
  const stats = useMemo(() => {
    if (!hasAssessment) return FALLBACK_STATS;
    const challenges   = appData.challenges || [];
    const trackerStats = appData.tracker?.stats || {};
    const approved     = challenges.filter(c => c.status === 'approved').length;
    const total        = challenges.length;
    const overallPct   = total > 0 ? Math.round(approved / total * 100) : 0;
    const portfolioCount = challenges.filter(c => c.portfolioWorthy && c.status === 'approved').length;

    return [
      { icon: '🏅', value: String(trackerStats.totalApproved || 0),  label: 'Skills Mastered',      delta: '', color: '#2DB8A0' },
      { icon: '⚡', value: String(approved),                          label: 'Challenges Completed', delta: '', color: '#1A2744' },
      { icon: '📈', value: `${overallPct}%`,                          label: 'Overall Progress',     delta: '', color: '#2DB8A0' },
      { icon: '🗂️', value: String(portfolioCount),                   label: 'Portfolio Items',      delta: '', color: '#1A2744' },
    ];
  }, [appData.challenges, appData.tracker?.stats, hasAssessment]);

  // Current challenge
  const currentChallenge = useMemo(() =>
    hasAssessment ? getCurrentChallenge(appData.challenges || []) : null
  , [appData.challenges, hasAssessment]);

  // Challenge progress %
  const challengeProgress = useMemo(() => {
    if (!currentChallenge) return 0;
    const submissions = appData.tracker?.submissions || [];
    const attempts    = submissions.filter(s => s.challengeId === currentChallenge.id);
    if (!attempts.length) return 0;
    // Crude progress: pending = 50%, approved = 100%
    const latest = attempts[0];
    if (latest.status === 'approved') return 100;
    if (latest.status === 'pending')  return 50;
    return 20;
  }, [currentChallenge, appData.tracker?.submissions]);

  // Learning path
  const learningPath = useMemo(() => {
    const phases     = appData.tracker?.phases     || [];
    const challenges = appData.challenges           || [];
    if (!phases.length) {
      // Fallback if no roadmap yet
      return [
        { label: 'Beginner',     progress: 0,  status: 'Not Started', color: '#2DB8A0', locked: false },
        { label: 'Intermediate', progress: 0,  status: 'Locked',      color: '#1A2744', locked: true  },
        { label: 'Advanced',     progress: 0,  status: 'Locked',      color: '#9BADC8', locked: true  },
      ];
    }
    return phases.slice(0, 3).map((phase, i) => {
      const progress   = getPhaseProgress(phase, challenges);
      const dispStatus = getPhaseDisplayStatus(phase, progress);
      const locked     = phase.status === 'locked';
      return {
        label:    phase.phase_name,
        progress,
        status:   dispStatus,
        color:    locked ? '#9BADC8' : i === 0 ? '#2DB8A0' : '#1A2744',
        locked,
      };
    });
  }, [appData.tracker?.phases, appData.challenges]);

  // Job match
  const jobMatchPct = useMemo(() =>
    appData.scoring?.overallScore || 0
  , [appData.scoring?.overallScore]);

  const jobMatchOffset = useMemo(() => {
    const circumference = 251;
    return circumference - (jobMatchPct / 100) * circumference;
  }, [jobMatchPct]);

  // Recent activity — last 4 submissions
  const recentActivity = useMemo(() => {
    const submissions = appData.tracker?.submissions || [];
    if (!submissions.length) return FALLBACK_ACTIVITY;
    return submissions.slice(0, 4).map(submissionToActivity);
  }, [appData.tracker?.submissions]);

  // Job title for match card
  const jobTitle = appData.job?.title || 'your target role';

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Instrument+Sans:wght@400;500;600;700&display=swap');

        .dh-root {
          display: flex; flex-direction: column; gap: 24px;
          padding: 36px;
          min-height: 100%;
          font-family: 'Instrument Sans', sans-serif;
          color: #1A2744;
        }

        .dh-card {
          background: rgba(255,255,255,0.92);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          border: 1px solid rgba(26,39,68,0.12);
          border-radius: 18px;
          box-shadow: 0 2px 12px rgba(26,39,68,0.08), 0 1px 3px rgba(26,39,68,0.05);
          transition: box-shadow .2s ease, transform .2s ease;
        }
        .dh-card:hover {
          box-shadow: 0 6px 24px rgba(26,39,68,0.12), 0 2px 6px rgba(26,39,68,0.07);
        }

        .dh-topbar {
          display: flex; align-items: flex-start; justify-content: space-between; gap: 16px;
        }
        .dh-greet {
          font-family: 'Playfair Display', serif;
          font-size: 40px; font-weight: 700;
          color: #1A2744; letter-spacing: -0.3px; line-height: 1.2;
        }
        .dh-greet-wave { font-style: normal; }
        .dh-sub { font-size: 13px; color: rgba(26,39,68,0.50); margin-top: 5px; font-weight: 400; letter-spacing: 0.1px; }
        .dh-actions { display: flex; align-items: center; gap: 10px; flex-shrink: 0; }

        .dh-btn-outline {
          padding: 9px 18px; border-radius: 10px;
          border: 1px solid rgba(26,39,68,0.20);
          color: rgba(26,39,68,0.70); font-size: 12.5px;
          font-family: 'Instrument Sans', sans-serif; font-weight: 600;
          cursor: pointer; background: rgba(255,255,255,0.8);
          transition: all .2s; letter-spacing: 0.1px;
        }
        .dh-btn-outline:hover { border-color: rgba(45,184,160,0.50); color: #1A7A6E; background: rgba(45,184,160,0.06); }

        .dh-btn-primary {
          padding: 9px 18px; border-radius: 10px; border: none;
          background: linear-gradient(135deg, #1A2744, #2D3F6B);
          color: #fff; font-size: 12.5px;
          font-family: 'Instrument Sans', sans-serif; font-weight: 700;
          cursor: pointer; transition: all .2s; letter-spacing: 0.2px;
          box-shadow: 0 4px 14px rgba(26,39,68,0.25);
        }
        .dh-btn-primary:hover { box-shadow: 0 6px 20px rgba(26,39,68,0.35); transform: translateY(-1px); }

        .dh-stats {
          display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px;
        }
        @media (max-width: 1100px) { .dh-stats { grid-template-columns: repeat(2,1fr); } }
        @media (max-width: 650px)  { .dh-stats { grid-template-columns: 1fr; } }

        .dh-mid { display: grid; grid-template-columns: 1fr 330px; gap: 20px; }
        @media (max-width: 900px) { .dh-mid { grid-template-columns: 1fr; } }

        .dh-section-title {
          font-family: 'Playfair Display', serif;
          font-size: 16px; font-weight: 600; color: #1A2744; letter-spacing: -0.2px;
        }

        .dh-challenge { padding: 26px; }
        .dh-challenge-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
        .dh-badge-inprogress {
          padding: 4px 12px; background: rgba(45,184,160,0.10);
          border: 1px solid rgba(45,184,160,0.28); border-radius: 20px;
          font-size: 11px; font-weight: 600; color: #1A7A6E; letter-spacing: 0.3px;
        }
        .dh-badge-notstarted {
          padding: 4px 12px; background: rgba(26,39,68,0.06);
          border: 1px solid rgba(26,39,68,0.14); border-radius: 20px;
          font-size: 11px; font-weight: 600; color: rgba(26,39,68,0.45); letter-spacing: 0.3px;
        }
        .dh-challenge-inner {
          background: rgba(248,250,253,0.80); border: 1px solid rgba(26,39,68,0.10);
          border-radius: 14px; padding: 20px; display: flex; gap: 16px; align-items: flex-start;
        }
        .dh-challenge-icon {
          width: 46px; height: 46px; flex-shrink: 0;
          background: linear-gradient(135deg, #1A2744, #2D3F6B);
          border-radius: 13px; display: flex; align-items: center; justify-content: center;
          font-size: 22px; box-shadow: 0 4px 14px rgba(26,39,68,0.25);
        }
        .dh-challenge-name {
          font-family: 'Playfair Display', serif;
          font-size: 15px; font-weight: 600; color: #1A2744;
          margin-bottom: 6px; letter-spacing: -0.1px; line-height: 1.3;
        }
        .dh-challenge-desc { font-size: 12.5px; color: rgba(26,39,68,0.50); line-height: 1.65; margin-bottom: 14px; }
        .dh-challenge-meta { display: flex; gap: 16px; margin-bottom: 16px; }
        .dh-meta-item { display: flex; align-items: center; gap: 6px; font-size: 12px; color: rgba(26,39,68,0.45); }
        .dh-prog-label { display: flex; justify-content: space-between; font-size: 12px; color: rgba(26,39,68,0.45); margin-bottom: 8px; }
        .dh-prog-track { height: 6px; background: rgba(26,39,68,0.10); border-radius: 10px; overflow: hidden; }
        .dh-prog-fill {
          height: 100%; border-radius: 10px;
          background: linear-gradient(90deg, #2DB8A0, #1A9E88);
          position: relative; transition: width 0.8s cubic-bezier(0.4,0,0.2,1);
        }
        .dh-prog-fill::after {
          content: ''; position: absolute; top: 0; right: 0; bottom: 0; left: 0;
          background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%);
          animation: shimmer 2.4s infinite;
        }
        @keyframes shimmer { 0%{transform:translateX(-100%)} 100%{transform:translateX(100%)} }

        .dh-continue-btn {
          margin-top: 20px; width: 100%; padding: 13px;
          background: linear-gradient(135deg, #1A2744, #2D3F6B);
          border: none; border-radius: 12px; color: #fff;
          font-size: 13px; font-weight: 700;
          font-family: 'Instrument Sans', sans-serif;
          cursor: pointer; transition: all .2s;
          box-shadow: 0 4px 16px rgba(26,39,68,0.25); letter-spacing: 0.3px;
        }
        .dh-continue-btn:hover { box-shadow: 0 6px 24px rgba(26,39,68,0.35); transform: translateY(-1px); }

        .dh-no-challenge {
          text-align: center; padding: 32px 20px;
          color: rgba(26,39,68,0.40); font-size: 13px; line-height: 1.6;
        }
        .dh-no-challenge-emoji { font-size: 32px; margin-bottom: 10px; }

        .dh-path { padding: 26px; display: flex; flex-direction: column; }
        .dh-path-item { margin-top: 18px; }
        .dh-path-row { display: flex; align-items: center; gap: 12px; margin-bottom: 8px; }
        .dh-path-icon {
          width: 32px; height: 32px; flex-shrink: 0; border-radius: 50%;
          display: flex; align-items: center; justify-content: center; font-size: 14px;
        }
        .dh-path-name { font-family: 'Instrument Sans', sans-serif; font-size: 13px; font-weight: 600; color: #1A2744; }
        .dh-path-status { font-size: 11px; color: rgba(26,39,68,0.40); margin-top: 1px; }
        .dh-path-pct { font-size: 13px; font-weight: 700; }
        .dh-path-bar { height: 5px; background: rgba(26,39,68,0.10); border-radius: 10px; overflow: hidden; margin-left: 44px; }
        .dh-path-fill { height: 100%; border-radius: 10px; transition: width 0.8s cubic-bezier(0.4,0,0.2,1); }
        .dh-viewmap-btn {
          margin-top: 22px; width: 100%; padding: 12px; background: transparent;
          border: 1px solid rgba(26,39,68,0.18); border-radius: 12px;
          color: rgba(26,39,68,0.55); font-size: 12.5px; font-weight: 600;
          font-family: 'Instrument Sans', sans-serif; cursor: pointer; transition: all .2s; letter-spacing: 0.2px;
        }
        .dh-viewmap-btn:hover { border-color: rgba(45,184,160,0.45); color: #1A7A6E; background: rgba(45,184,160,0.05); }

        .dh-match {
          padding: 24px; display: flex; align-items: center; gap: 22px;
          background: rgba(255,255,255,0.92); backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px); border: 1px solid rgba(26,39,68,0.12);
          border-radius: 18px; box-shadow: 0 2px 12px rgba(26,39,68,0.08);
          position: relative; overflow: hidden;
        }
        .dh-match::before {
          content:''; position:absolute; inset:0; pointer-events:none;
          background: linear-gradient(135deg, rgba(45,184,160,0.04) 0%, rgba(26,39,68,0.03) 100%);
        }
        .dh-match-ring { width: 78px; height: 78px; flex-shrink: 0; position: relative; }
        .dh-match-ring svg { width: 100%; height: 100%; transform: rotate(-90deg); }
        .dh-match-ring-bg   { stroke: rgba(26,39,68,0.12); fill: none; }
        .dh-match-ring-fill {
          stroke: url(#brandMatchGrad); fill: none; stroke-linecap: round;
          stroke-dasharray: 251;
          transition: stroke-dashoffset 1s ease;
        }
        .dh-match-pct {
          position: absolute; inset: 0; display: flex; align-items: center; justify-content: center;
          font-family: 'Playfair Display', serif; font-size: 15px; font-weight: 700; color: #1A2744;
        }
        .dh-match-title { font-family: 'Playfair Display', serif; font-size: 15px; font-weight: 600; color: #1A2744; margin-bottom: 5px; }
        .dh-match-desc  { font-size: 12.5px; color: rgba(26,39,68,0.50); line-height: 1.65; }
        .dh-match-cta {
          margin-left: auto; flex-shrink: 0; padding: 9px 16px;
          border: 1px solid rgba(45,184,160,0.30); border-radius: 10px; color: #1A7A6E;
          font-size: 12px; font-weight: 600; font-family: 'Instrument Sans', sans-serif;
          cursor: pointer; background: rgba(45,184,160,0.06); transition: all .2s; white-space: nowrap;
        }
        .dh-match-cta:hover { background: rgba(45,184,160,0.12); border-color: rgba(45,184,160,0.50); color: #157062; }

        .dh-activity { padding: 26px; }
        .dh-activity-list { display: flex; flex-direction: column; gap: 2px; margin-top: 18px; }
        .dh-act-item {
          display: flex; align-items: center; gap: 14px;
          padding: 13px 14px; border-radius: 12px; transition: background .15s; cursor: default;
        }
        .dh-act-item:hover { background: rgba(26,39,68,0.04); }
        .dh-act-icon { width: 36px; height: 36px; flex-shrink: 0; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 15px; }
        .dh-act-title { font-size: 13px; font-weight: 600; color: #1A2744; }
        .dh-act-sub   { font-size: 11.5px; color: rgba(26,39,68,0.42); margin-top: 1px; }
        .dh-act-time  { margin-left: auto; font-size: 11px; color: rgba(26,39,68,0.30); white-space: nowrap; flex-shrink: 0; }

        .dh-divider { height: 1px; background: rgba(26,39,68,0.08); border: none; margin: 0; }
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

        {/* ── Stat cards ── */}
        <div className="dh-stats">
          {stats.map((s, i) => <StatCard key={i} {...s} />)}
        </div>

        {/* ── Middle row ── */}
        <div className="dh-mid">

          {/* Current Challenge */}
          <div className="dh-card dh-challenge">
            <div className="dh-challenge-header">
              <span className="dh-section-title">Current Challenge</span>
              {currentChallenge
                ? <span className={challengeProgress > 0 ? 'dh-badge-inprogress' : 'dh-badge-notstarted'}>
                    {challengeProgress > 0 ? 'In Progress' : 'Not Started'}
                  </span>
                : <span className="dh-badge-notstarted">No Active Challenge</span>
              }
            </div>

            {currentChallenge ? (
              <>
                <div className="dh-challenge-inner">
                  <div className="dh-challenge-icon">⚡</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="dh-challenge-name">{currentChallenge.title}</div>
                    <div className="dh-challenge-desc">
                      {currentChallenge.description || 'Complete this challenge to advance your roadmap.'}
                    </div>
                    <div className="dh-challenge-meta">
                      {currentChallenge.estimatedHours > 0 && (
                        <span className="dh-meta-item">⏱️ Est. {currentChallenge.estimatedHours}h</span>
                      )}
                      {currentChallenge.portfolioWorthy && (
                        <span className="dh-meta-item">🗂️ Portfolio item</span>
                      )}
                    </div>
                    <div className="dh-prog-label">
                      <span>Challenge Progress</span>
                      <span style={{ color: '#2DB8A0', fontWeight: 700 }}>{challengeProgress}%</span>
                    </div>
                    <div className="dh-prog-track">
                      <div className="dh-prog-fill" style={{ width: `${challengeProgress}%` }} />
                    </div>
                  </div>
                </div>
                <button className="dh-continue-btn">
                  {challengeProgress > 0 ? 'Continue Challenge →' : 'Start Challenge →'}
                </button>
              </>
            ) : (
              <div className="dh-no-challenge">
                <div className="dh-no-challenge-emoji">🎯</div>
                {hasAssessment
                  ? 'All caught up! Check your roadmap for next steps.'
                  : 'Complete your assessment to unlock challenges.'
                }
              </div>
            )}
          </div>

          {/* Learning Path */}
          <div className="dh-card dh-path">
            <span className="dh-section-title">Learning Path</span>
            {learningPath.map((step, i) => (
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
              <circle className="dh-match-ring-fill" cx="44" cy="44" r="40" strokeWidth="7"
                style={{ strokeDashoffset: jobMatchOffset }} />
            </svg>
            <div className="dh-match-pct">{jobMatchPct}%</div>
          </div>
          <div>
            <div className="dh-match-title">Job Match Preview</div>
            <div className="dh-match-desc">
              {jobMatchPct > 0
                ? <>You match <strong style={{ color: '#1A2744' }}>{jobMatchPct}%</strong> of requirements for <strong style={{ color: '#1A2744' }}>{jobTitle}</strong>. Keep completing challenges to improve your match.</>
                : <>Complete your assessment to see how well you match open roles.</>
              }
            </div>
          </div>
          <button className="dh-match-cta">Explore Jobs →</button>
        </div>

        {/* ── Recent Activity ── */}
        <div className="dh-card dh-activity">
          <span className="dh-section-title">Recent Activity</span>
          <div className="dh-activity-list">
            {recentActivity.map((a, i) => (
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