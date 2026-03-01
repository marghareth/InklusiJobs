// dashboard/worker/TrackerPage.jsx
// ─── UPDATED: reads from localStorage via useAppData ─────────────────────────
// NO UI changes — only the data source changed.
// Previously received all data as props (empty defaults).
// Now reads live from localStorage and re-renders on any change.
//
// WHAT CHANGED FROM ORIGINAL:
//   1. Added: import { useAppData } from '@/hooks/useAppData'
//   2. Removed: all prop destructuring from function signature
//   3. Added: const appData = useAppData() at top of component
//   4. Added: mapping from appData to the variable names the UI already uses
//   Everything else is IDENTICAL to the original.

'use client';

import { useState, useEffect, useMemo } from 'react';
import { useAppData } from '@/hooks/useAppData';

/* ─────────────────────────────────────────────────────────────
   DESIGN TOKENS — InklusiJobs navy + teal
───────────────────────────────────────────────────────────── */
const C = {
  ink:         '#1A2744',
  inkMid:      'rgba(26,39,68,0.58)',
  inkFaint:    'rgba(26,39,68,0.36)',
  teal:        '#2DB8A0',
  tealDark:    '#1A9E88',
  tealBg:      'rgba(45,184,160,0.10)',
  tealBorder:  'rgba(45,184,160,0.28)',
  navy:        '#1A2744',
  navyMid:     '#2D3F6B',
  navyBg:      'rgba(26,39,68,0.07)',
  navyBorder:  'rgba(26,39,68,0.18)',
  amber:       '#B07D20',
  amberBg:     'rgba(176,125,32,0.10)',
  amberBorder: 'rgba(176,125,32,0.26)',
  red:         '#C0392B',
  redBg:       'rgba(192,57,43,0.08)',
  redBorder:   'rgba(192,57,43,0.22)',
  blue:        '#2D3F6B',
  blueBg:      'rgba(45,63,107,0.09)',
  blueBorder:  'rgba(45,63,107,0.22)',
  purp:        '#3A5A8A',
  purpBg:      'rgba(58,90,138,0.09)',
  purpBorder:  'rgba(58,90,138,0.22)',
  card:        'rgba(255,255,255,0.88)',
  muted:       'rgba(26,39,68,0.06)',
  mutedBorder: 'rgba(26,39,68,0.10)',
  font:        { display: '"Lexend", sans-serif', body: '"Lexend", sans-serif' },
};

/* ─────────────────────────────────────────────────────────────
   APP STATUS REGISTRY
───────────────────────────────────────────────────────────── */
const APP_STATUS = {
  applied:   { label: 'Applied',   color: C.blue,    bg: C.blueBg,   border: C.blueBorder,  step: 1, dot: '#2D3F6B' },
  screening: { label: 'Screening', color: C.amber,   bg: C.amberBg,  border: C.amberBorder, step: 2, dot: '#B07D20' },
  interview: { label: 'Interview', color: C.purp,    bg: C.purpBg,   border: C.purpBorder,  step: 3, dot: '#3A5A8A' },
  offer:     { label: 'Offer',     color: C.teal,    bg: C.tealBg,   border: C.tealBorder,  step: 4, dot: '#2DB8A0' },
  rejected:  { label: 'Rejected',  color: C.red,     bg: C.redBg,    border: C.redBorder,   step: 0, dot: '#C0392B' },
  withdrawn: { label: 'Withdrawn', color: C.inkFaint, bg: C.muted,   border: C.mutedBorder, step: 0, dot: 'rgba(26,39,68,0.25)' },
};

/* ─────────────────────────────────────────────────────────────
   UTILS
───────────────────────────────────────────────────────────── */
function fmt(d, opts) {
  if (!d) return '—';
  try { return new Date(d).toLocaleDateString('en-US', opts || { month: 'short', day: 'numeric', year: 'numeric' }); }
  catch { return '—'; }
}
function daysAgo(d) {
  if (!d) return null;
  const diff = Math.floor((Date.now() - new Date(d)) / 86400000);
  if (diff === 0) return 'Today';
  if (diff === 1) return '1d ago';
  if (diff < 30) return `${diff}d ago`;
  if (diff < 365) return `${Math.floor(diff / 30)}mo ago`;
  return `${Math.floor(diff / 365)}y ago`;
}

/* ─────────────────────────────────────────────────────────────
   CIRCULAR PROGRESS RING
───────────────────────────────────────────────────────────── */
function CircleRing({ pct, size = 120, stroke = 9, color = C.teal, label, sublabel, animate = true }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const [drawn, setDrawn] = useState(animate ? 0 : pct);

  useEffect(() => {
    if (!animate) { setDrawn(pct); return; }
    let start = null;
    const dur = 900;
    const frame = (ts) => {
      if (!start) start = ts;
      const prog = Math.min((ts - start) / dur, 1);
      const ease = 1 - Math.pow(1 - prog, 3);
      setDrawn(pct * ease);
      if (prog < 1) requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  }, [pct, animate]);

  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(26,39,68,0.10)" strokeWidth={stroke} />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
          strokeDasharray={`${circ * (drawn / 100)} ${circ}`} strokeLinecap="round" />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontFamily: C.font.display, fontSize: size * 0.19, fontWeight: 700, color: C.ink, lineHeight: 1 }}>{Math.round(drawn)}%</span>
        {label    && <span style={{ fontFamily: C.font.body, fontSize: size * 0.088, color: C.inkMid, marginTop: 2 }}>{label}</span>}
        {sublabel && <span style={{ fontFamily: C.font.body, fontSize: size * 0.075, color: C.inkFaint }}>{sublabel}</span>}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   STREAK FLAME
───────────────────────────────────────────────────────────── */
function StreakFlame({ streak, best }) {
  const intensity = best > 0 ? Math.min(streak / best, 1) : 0;
  const hue   = Math.round(174 - intensity * 34);
  const sat   = Math.round(60 + intensity * 20);
  const light = Math.round(48 - intensity * 12);
  const color = `hsl(${hue},${sat}%,${light}%)`;
  const glow  = `hsl(${hue},${sat}%,${light + 10}%)`;
  const size  = 56 + Math.round(intensity * 24);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, flexShrink: 0 }}>
      <div style={{ position: 'relative', width: size, height: size }}>
        {streak > 0 && (
          <div style={{ position: 'absolute', inset: -8, borderRadius: '50%', background: `radial-gradient(circle, ${glow}22 0%, transparent 70%)`, animation: 'flamePulse 2s ease-in-out infinite' }} />
        )}
        <svg width={size} height={size} viewBox="0 0 56 56" fill="none" style={{ display: 'block' }}>
          <ellipse cx="28" cy="50" rx="12" ry="4" fill={`${color}22`} />
          <path d="M28 4 C28 4 38 14 38 26 C38 32 34 36 32 38 C34 34 33 30 30 28 C30 28 34 20 28 12 C28 12 22 20 26 28 C23 30 22 34 24 38 C22 36 18 32 18 26 C18 14 28 4 28 4Z" fill="url(#flameGrad-outer)" style={{ animation: 'flameWaver 1.8s ease-in-out infinite' }} />
          <path d="M28 18 C28 18 33 24 33 31 C33 35 31 37 29.5 38.5 C30.5 36 30 33 28 31.5 C26 33 25.5 36 26.5 38.5 C25 37 23 35 23 31 C23 24 28 18 28 18Z" fill="url(#flameGrad-inner)" style={{ animation: 'flameWaver 1.4s ease-in-out infinite reverse' }} />
          {streak > 0 && <ellipse cx="28" cy="34" rx="3.5" ry="5" fill="rgba(200,240,235,0.85)" />}
          <defs>
            <linearGradient id="flameGrad-outer" x1="28" y1="4" x2="28" y2="50" gradientUnits="userSpaceOnUse">
              <stop offset="0%"   stopColor={color} />
              <stop offset="60%"  stopColor={`hsl(${hue+8},${sat}%,${light+10}%)`} />
              <stop offset="100%" stopColor={`hsl(${hue-5},${sat-10}%,${light-6}%)`} stopOpacity="0.7" />
            </linearGradient>
            <linearGradient id="flameGrad-inner" x1="28" y1="18" x2="28" y2="42" gradientUnits="userSpaceOnUse">
              <stop offset="0%"   stopColor="rgba(200,245,238,0.95)" />
              <stop offset="100%" stopColor={`hsl(${hue+5},${sat}%,${light+16}%)`} stopOpacity="0.6" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      <div style={{ textAlign: 'center' }}>
        <p style={{ fontFamily: C.font.display, fontSize: 28, fontWeight: 700, color: streak > 0 ? color : C.inkFaint, margin: 0, lineHeight: 1, transition: 'color .4s' }}>
          {streak}<span style={{ fontSize: 14, fontWeight: 400, marginLeft: 2 }}>d</span>
        </p>
        <p style={{ fontFamily: C.font.body, fontSize: 10, fontWeight: 700, color: C.inkFaint, textTransform: 'uppercase', letterSpacing: '0.7px', margin: '3px 0 0' }}>Current</p>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   ACTIVITY HEATMAP
───────────────────────────────────────────────────────────── */
function ActivityHeatmap({ activityData = {} }) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const WEEKS = 15;

  const cells = useMemo(() => {
    const grid = [];
    const start = new Date(today);
    start.setDate(today.getDate() - (WEEKS * 7) - today.getDay());
    for (let w = 0; w < WEEKS; w++) {
      const week = [];
      for (let d = 0; d < 7; d++) {
        const date = new Date(start);
        date.setDate(start.getDate() + w * 7 + d);
        const key = date.toISOString().split('T')[0];
        week.push({ date, key, count: activityData[key] || 0, isFuture: date > today });
      }
      grid.push(week);
    }
    return grid;
  }, [activityData]);

  const maxCount = useMemo(() => Math.max(1, ...Object.values(activityData)), [activityData]);
  const MONTH_LABELS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const DAY_LABELS   = ['S','M','T','W','T','F','S'];
  const [tooltip, setTooltip] = useState(null);

  function cellColor(count, isFuture) {
    if (isFuture || count === 0) return 'rgba(26,39,68,0.08)';
    const t = count / maxCount;
    if (t < 0.25) return 'rgba(45,184,160,0.25)';
    if (t < 0.5)  return 'rgba(45,184,160,0.50)';
    if (t < 0.75) return 'rgba(45,184,160,0.75)';
    return '#2DB8A0';
  }

  return (
    <div style={{ overflowX: 'auto', paddingBottom: 4 }}>
      <div style={{ display: 'inline-block', minWidth: 'max-content' }}>
        <div style={{ display: 'flex', gap: 0 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 3, marginRight: 5, marginTop: 18 }}>
            {DAY_LABELS.map((d, i) => (
              <div key={i} style={{ height: 14, width: 10, display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                {i % 2 === 1 && <span style={{ fontFamily: C.font.body, fontSize: 9, color: C.inkFaint, lineHeight: 1 }}>{d}</span>}
              </div>
            ))}
          </div>
          <div>
            <div style={{ display: 'flex', marginBottom: 3 }}>
              {cells.map((week, w) => {
                const firstDay = week[0].date;
                const showMonth = firstDay.getDate() <= 7;
                return (
                  <div key={w} style={{ width: 14, marginRight: 3, flexShrink: 0 }}>
                    {showMonth && <span style={{ fontFamily: C.font.body, fontSize: 9, color: C.inkFaint, whiteSpace: 'nowrap' }}>{MONTH_LABELS[firstDay.getMonth()]}</span>}
                  </div>
                );
              })}
            </div>
            <div style={{ display: 'flex', gap: 3 }}>
              {cells.map((week, w) => (
                <div key={w} style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  {week.map((cell, d) => (
                    <div key={d} onMouseEnter={(e) => setTooltip({ cell, x: e.clientX, y: e.clientY })} onMouseLeave={() => setTooltip(null)} className="heatmap-cell" style={{ width: 14, height: 14, borderRadius: 3, background: cellColor(cell.count, cell.isFuture), cursor: cell.count > 0 ? 'pointer' : 'default', opacity: cell.isFuture ? 0.3 : 1 }} />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 8, paddingLeft: 17 }}>
          <span style={{ fontFamily: C.font.body, fontSize: 10, color: C.inkFaint }}>Less</span>
          {[0, 0.25, 0.5, 0.75, 1].map((t, i) => (
            <div key={i} style={{ width: 12, height: 12, borderRadius: 2.5, background: t === 0 ? 'rgba(26,39,68,0.08)' : `rgba(45,184,160,${t * 0.9 + 0.1})` }} />
          ))}
          <span style={{ fontFamily: C.font.body, fontSize: 10, color: C.inkFaint }}>More</span>
        </div>
      </div>
      {tooltip && (
        <div style={{ position: 'fixed', top: tooltip.y - 44, left: tooltip.x - 70, background: 'rgba(26,39,68,0.94)', color: '#fff', fontFamily: C.font.body, fontSize: 11, fontWeight: 600, padding: '5px 10px', borderRadius: 7, pointerEvents: 'none', zIndex: 999, whiteSpace: 'nowrap' }}>
          {tooltip.cell.count} submission{tooltip.cell.count !== 1 ? 's' : ''} · {tooltip.cell.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   WEEKLY BARS
───────────────────────────────────────────────────────────── */
function WeeklyBars({ activityData = {} }) {
  const weeks = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return Array.from({ length: 8 }, (_, i) => {
      const w = 7 - i;
      let total = 0;
      for (let d = 0; d < 7; d++) {
        const date = new Date(today);
        date.setDate(today.getDate() - w * 7 - d);
        total += activityData[date.toISOString().split('T')[0]] || 0;
      }
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() - w * 7 - 6);
      return { total, label: weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) };
    });
  }, [activityData]);

  const max = Math.max(1, ...weeks.map(w => w.total));
  const [hovered, setHovered] = useState(null);

  return (
    <div>
      <p style={{ fontFamily: C.font.body, fontSize: 10, fontWeight: 700, color: C.inkFaint, textTransform: 'uppercase', letterSpacing: '0.6px', margin: '0 0 10px' }}>Weekly Activity</p>
      <div style={{ display: 'flex', gap: 6, alignItems: 'flex-end', height: 52 }}>
        {weeks.map((w, i) => {
          const h      = Math.max(3, Math.round((w.total / max) * 48));
          const isLast = i === weeks.length - 1;
          return (
            <div key={i} onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)} style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, cursor: 'default' }}>
              <div style={{ width: '100%', height: h, borderRadius: '3px 3px 2px 2px', background: isLast ? 'linear-gradient(180deg,#2DB8A0,#1A9E88)' : hovered === i ? 'rgba(45,184,160,0.55)' : 'rgba(45,184,160,0.25)', transition: 'background .15s', boxShadow: isLast ? '0 2px 8px rgba(45,184,160,0.28)' : 'none' }} />
              {hovered === i && (
                <div style={{ position: 'absolute', bottom: h + 6, background: 'rgba(26,39,68,0.92)', color: '#fff', fontFamily: C.font.body, fontSize: 10, fontWeight: 600, padding: '3px 7px', borderRadius: 5, whiteSpace: 'nowrap', zIndex: 10 }}>
                  {w.total} · {w.label}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   STREAK MILESTONES
───────────────────────────────────────────────────────────── */
function StreakMilestones({ currentStreak, bestStreak }) {
  const milestones = [3, 7, 14, 21, 30, 60, 90];
  const next = milestones.find(m => currentStreak < m);
  return (
    <div>
      <p style={{ fontFamily: C.font.body, fontSize: 10, fontWeight: 700, color: C.inkFaint, textTransform: 'uppercase', letterSpacing: '0.6px', margin: '0 0 10px' }}>Milestones</p>
      <div style={{ display: 'flex', gap: 0, alignItems: 'center', overflowX: 'auto' }}>
        {milestones.map((m, i) => {
          const done   = bestStreak >= m;
          const isNext = m === next;
          const pct    = isNext ? Math.min(currentStreak / m * 100, 100) : 0;
          return (
            <div key={m} style={{ display: 'flex', alignItems: 'center', flex: i < milestones.length - 1 ? 1 : undefined }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <div style={{ width: done ? 22 : isNext ? 18 : 14, height: done ? 22 : isNext ? 18 : 14, borderRadius: '50%', background: done ? 'linear-gradient(135deg,#2DB8A0,#1A9E88)' : isNext ? `conic-gradient(#2DB8A0 ${pct * 3.6}deg, rgba(26,39,68,0.12) 0deg)` : 'rgba(26,39,68,0.08)', border: done ? 'none' : isNext ? `2px solid rgba(45,184,160,0.45)` : `1.5px solid rgba(26,39,68,0.14)`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: done ? '0 2px 6px rgba(45,184,160,0.28)' : 'none' }}>
                  {done && <svg width="9" height="9" viewBox="0 0 9 9" fill="none"><path d="M1.5 4.5L3.5 6.5 7.5 2.5" stroke="#fff" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                </div>
                <span style={{ fontFamily: C.font.body, fontSize: 10, fontWeight: done ? 700 : 500, color: done ? C.teal : isNext ? C.amber : C.inkFaint, whiteSpace: 'nowrap' }}>{m}d</span>
              </div>
              {i < milestones.length - 1 && <div style={{ flex: 1, height: 2, background: done ? 'linear-gradient(90deg,#2DB8A0,rgba(45,184,160,0.35))' : 'rgba(26,39,68,0.09)', marginBottom: 18, minWidth: 8 }} />}
            </div>
          );
        })}
      </div>
      {next && <p style={{ fontFamily: C.font.body, fontSize: 11, color: C.inkMid, margin: '10px 0 0' }}><span style={{ fontWeight: 700, color: C.amber }}>{next - currentStreak}d</span> away from your next milestone</p>}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   STREAK SECTION
───────────────────────────────────────────────────────────── */
function StreakSection({ currentStreak, longestStreak, activityData = {} }) {
  const totalActiveDays = Object.values(activityData).filter(v => v > 0).length;
  const weeklyAvg = useMemo(() => {
    const vals  = Object.values(activityData).filter(v => v > 0);
    if (!vals.length) return '0.0';
    const total = vals.reduce((a, b) => a + b, 0);
    return (total / Math.max(1, Math.ceil(totalActiveDays / 7))).toFixed(1);
  }, [activityData, totalActiveDays]);

  const statItems = [
    { label: 'Current Streak', value: `${currentStreak}d`, sub: 'days in a row',    color: currentStreak > 0 ? C.amber : C.inkFaint, border: C.amberBorder },
    { label: 'Best Streak',    value: `${longestStreak}d`, sub: 'personal record',  color: C.teal,  border: C.tealBorder  },
    { label: 'Active Days',    value: totalActiveDays,     sub: 'total days',       color: C.blue,  border: C.blueBorder  },
    { label: 'Weekly Avg',     value: weeklyAvg,           sub: 'submissions / wk', color: C.purp,  border: C.purpBorder  },
  ];

  return (
    <div style={{ background: C.card, backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)', border: `1px solid rgba(26,39,68,0.10)`, borderRadius: 18, boxShadow: '0 2px 14px rgba(26,39,68,0.07)', overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '16px 22px', borderBottom: `1px solid rgba(26,39,68,0.08)` }}>
        <div style={{ width: 32, height: 32, borderRadius: 9, background: C.tealBg, border: `1px solid ${C.tealBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8 2C8 2 11 5 11 8.5C11 10.5 9.5 12 8 12C6.5 12 5 10.5 5 8.5C5 5 8 2 8 2Z" fill={C.teal} opacity="0.8"/>
            <path d="M8 7C8 7 9.5 8.5 9.5 10C9.5 10.83 8.83 11.5 8 11.5C7.17 11.5 6.5 10.83 6.5 10C6.5 8.5 8 7 8 7Z" fill="rgba(180,240,228,0.9)"/>
          </svg>
        </div>
        <h2 style={{ fontFamily: C.font.display, fontSize: 15.5, fontWeight: 600, color: C.ink, margin: 0 }}>Streak & Activity</h2>
      </div>
      <div style={{ padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div style={{ display: 'flex', gap: 22, alignItems: 'flex-start', flexWrap: 'wrap' }} className="streak-top-row">
          <div style={{ padding: '16px 20px', background: C.tealBg, border: `1px solid ${C.tealBorder}`, borderRadius: 14, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, flexShrink: 0, minWidth: 130 }}>
            <StreakFlame streak={currentStreak} best={longestStreak} />
            <div style={{ width: '100%', padding: '8px 10px', background: 'rgba(255,255,255,0.65)', borderRadius: 9, border: `1px solid ${C.tealBorder}`, textAlign: 'center' }}>
              <p style={{ fontFamily: C.font.display, fontSize: 16, fontWeight: 700, color: C.teal, margin: 0 }}>{longestStreak}d</p>
              <p style={{ fontFamily: C.font.body, fontSize: 9.5, fontWeight: 700, color: C.inkFaint, textTransform: 'uppercase', letterSpacing: '0.5px', margin: '2px 0 0' }}>Personal Best</p>
            </div>
            <div style={{ width: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontFamily: C.font.body, fontSize: 9.5, color: C.inkFaint }}>vs. best</span>
                <span style={{ fontFamily: C.font.body, fontSize: 9.5, fontWeight: 700, color: C.teal }}>{longestStreak > 0 ? Math.round(currentStreak / longestStreak * 100) : 0}%</span>
              </div>
              <div style={{ height: 5, background: 'rgba(26,39,68,0.08)', borderRadius: 6, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${longestStreak > 0 ? currentStreak / longestStreak * 100 : 0}%`, background: 'linear-gradient(90deg,#2DB8A0,#1A9E88)', borderRadius: 6, transition: 'width .6s cubic-bezier(0.4,0,0.2,1)' }} />
              </div>
            </div>
          </div>
          <div style={{ flex: 1, minWidth: 240, display: 'flex', flexDirection: 'column', gap: 18 }}>
            <StreakMilestones currentStreak={currentStreak} bestStreak={longestStreak} />
            <div style={{ height: 1, background: 'rgba(26,39,68,0.08)' }} />
            <WeeklyBars activityData={activityData} />
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10 }} className="streak-stat-row">
          {statItems.map((s, i) => (
            <div key={i} style={{ padding: '12px 14px', background: 'rgba(255,255,255,0.65)', border: `1.5px solid ${s.border}`, borderRadius: 11 }}>
              <p style={{ fontFamily: C.font.display, fontSize: 20, fontWeight: 700, color: s.color, margin: 0, lineHeight: 1 }}>{s.value}</p>
              <p style={{ fontFamily: C.font.body, fontSize: 10, fontWeight: 700, color: C.inkFaint, margin: '4px 0 1px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{s.label}</p>
              <p style={{ fontFamily: C.font.body, fontSize: 10.5, color: C.inkFaint, margin: 0 }}>{s.sub}</p>
            </div>
          ))}
        </div>
        <div>
          <p style={{ fontFamily: C.font.body, fontSize: 10, fontWeight: 700, color: C.inkFaint, textTransform: 'uppercase', letterSpacing: '0.6px', margin: '0 0 10px' }}>Submission Activity — Last 15 Weeks</p>
          <ActivityHeatmap activityData={activityData} />
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   FUNNEL VIZ, BADGES, PIPELINE — unchanged from original
───────────────────────────────────────────────────────────── */
function FunnelViz({ applications }) {
  const total      = applications.length || 1;
  const countBy    = (s) => applications.filter(a => a.status === s).length;
  const active     = countBy('applied') + countBy('screening') + countBy('interview') + countBy('offer');
  const interviews = countBy('interview') + countBy('offer');
  const offers     = countBy('offer');
  const stages = [
    { label: 'Applied',    count: total,      pct: 100,                              color: C.blue,  size: 130 },
    { label: 'Active',     count: active,     pct: Math.round(active/total*100),     color: C.purp,  size: 100 },
    { label: 'Interviews', count: interviews, pct: Math.round(interviews/total*100), color: C.amber, size: 74  },
    { label: 'Offers',     count: offers,     pct: Math.round(offers/total*100),     color: C.teal,  size: 52  },
  ];
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 28, flexWrap: 'wrap' }}>
      <div style={{ position: 'relative', width: 140, height: 140, flexShrink: 0 }}>
        {stages.map((s, i) => (
          <div key={i} style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }}>
            <CircleRing pct={s.pct} size={s.size} stroke={i === 0 ? 10 : 8} color={s.color} animate />
          </div>
        ))}
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontFamily: C.font.display, fontSize: 17, fontWeight: 700, color: C.ink }}>{total}</span>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 9, flex: 1, minWidth: 130 }}>
        {stages.map((s, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 9, height: 9, borderRadius: '50%', background: s.color, flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={{ fontFamily: C.font.body, fontSize: 12, fontWeight: 600, color: C.ink }}>{s.label}</span>
                <span style={{ fontFamily: C.font.display, fontSize: 13, fontWeight: 700, color: s.color }}>{s.count}</span>
              </div>
              <div style={{ height: 3, background: 'rgba(26,39,68,0.08)', borderRadius: 4, marginTop: 3, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${s.pct}%`, background: s.color, borderRadius: 4, opacity: 0.7 }} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AppBadge({ status }) {
  const cfg = APP_STATUS[status] || { label: status, color: C.inkFaint, bg: C.muted, border: C.mutedBorder, dot: 'rgba(26,39,68,0.25)' };
  return (
    <span style={{ fontFamily: C.font.body, fontSize: 10.5, fontWeight: 700, background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}`, borderRadius: 20, padding: '3px 10px', whiteSpace: 'nowrap', letterSpacing: '0.3px', display: 'inline-flex', alignItems: 'center', gap: 5 }}>
      <span style={{ width: 5, height: 5, borderRadius: '50%', background: cfg.dot, display: 'inline-block' }} />
      {cfg.label}
    </span>
  );
}

function Badge({ status }) {
  const cfg = {
    approved:       { bg: C.tealBg,  color: C.teal,    border: C.tealBorder,  label: 'Approved'    },
    pending:        { bg: C.amberBg, color: C.amber,   border: C.amberBorder, label: 'Pending'     },
    rejected:       { bg: C.redBg,   color: C.red,     border: C.redBorder,   label: 'Rejected'    },
    needs_revision: { bg: C.blueBg,  color: C.blue,    border: C.blueBorder,  label: 'Revision'    },
    not_started:    { bg: C.muted,   color: C.inkFaint, border: C.mutedBorder, label: 'Not started' },
  }[status] || { bg: C.muted, color: C.inkFaint, border: C.mutedBorder, label: status };
  return <span style={{ fontFamily: C.font.body, fontSize: 10.5, fontWeight: 700, background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}`, borderRadius: 20, padding: '3px 10px', whiteSpace: 'nowrap' }}>{cfg.label}</span>;
}

const STEPS = ['applied', 'screening', 'interview', 'offer'];
function PipelineStrip({ status }) {
  const step = APP_STATUS[status]?.step || 0;
  const isTerminal = status === 'rejected' || status === 'withdrawn';
  return (
    <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
      {STEPS.map((s, i) => {
        const cfg     = APP_STATUS[s];
        const active  = !isTerminal && step >= i + 1;
        const current = !isTerminal && step === i + 1;
        return (
          <div key={s} style={{ display: 'flex', alignItems: 'center', flex: i < STEPS.length - 1 ? 1 : undefined }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
              <div style={{ width: current ? 13 : 9, height: current ? 13 : 9, borderRadius: '50%', background: isTerminal ? 'rgba(26,39,68,0.12)' : active ? cfg.dot : 'rgba(26,39,68,0.12)', boxShadow: current ? `0 0 0 4px ${cfg.bg}` : 'none' }} />
              <span style={{ fontFamily: C.font.body, fontSize: 9.5, fontWeight: current ? 700 : 500, color: active && !isTerminal ? cfg.color : C.inkFaint, textTransform: 'uppercase', letterSpacing: '0.4px', whiteSpace: 'nowrap' }}>{cfg.label}</span>
            </div>
            {i < STEPS.length - 1 && <div style={{ flex: 1, height: 2, background: !isTerminal && step > i + 1 ? cfg.dot : 'rgba(26,39,68,0.09)', marginBottom: 18, marginTop: 2 }} />}
          </div>
        );
      })}
      {isTerminal && (
        <div style={{ marginLeft: 16, display: 'flex', alignItems: 'center', gap: 6, marginBottom: 16 }}>
          <div style={{ width: 9, height: 9, borderRadius: '50%', background: APP_STATUS[status]?.dot }} />
          <span style={{ fontFamily: C.font.body, fontSize: 10, fontWeight: 700, color: APP_STATUS[status]?.color, textTransform: 'uppercase', letterSpacing: '0.4px' }}>{APP_STATUS[status]?.label}</span>
        </div>
      )}
    </div>
  );
}

function AppTableRow({ app, expanded, onToggle }) {
  const hue = app.company ? (app.company.charCodeAt(0) * 7) % 360 : 200;
  return (
    <>
      <tr onClick={onToggle} style={{ cursor: 'pointer', background: expanded ? 'rgba(45,184,160,0.04)' : 'transparent' }} className="app-tr">
        <td style={{ padding: '13px 16px 13px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, flexShrink: 0, background: `hsl(${hue},22%,88%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: C.font.display, fontSize: 13, fontWeight: 700, color: `hsl(${hue},35%,38%)` }}>{(app.company || '?')[0].toUpperCase()}</div>
            <div>
              <p style={{ fontFamily: C.font.body, fontSize: 13, fontWeight: 700, color: C.ink, margin: 0, lineHeight: 1.2 }}>{app.company}</p>
              <p style={{ fontFamily: C.font.body, fontSize: 11, color: C.inkMid, margin: 0 }}>{app.role}</p>
            </div>
          </div>
        </td>
        <td style={{ padding: '13px 12px' }}><AppBadge status={app.status} /></td>
        <td style={{ padding: '13px 12px' }}>
          <p style={{ fontFamily: C.font.body, fontSize: 12, color: C.ink, margin: 0 }}>{fmt(app.applied_at, { month: 'short', day: 'numeric' })}</p>
          <p style={{ fontFamily: C.font.body, fontSize: 10, color: C.inkFaint, margin: 0 }}>{daysAgo(app.applied_at)}</p>
        </td>
        <td style={{ padding: '13px 12px' }}><p style={{ fontFamily: C.font.body, fontSize: 12, color: C.ink, margin: 0 }}>{fmt(app.last_update_at, { month: 'short', day: 'numeric' })}</p></td>
        <td style={{ padding: '13px 12px', fontFamily: C.font.body, fontSize: 12, color: C.inkMid }}>{app.location || '—'}</td>
        <td style={{ padding: '13px 16px 13px 8px', textAlign: 'right' }}>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ transform: expanded ? 'rotate(180deg)' : 'none', transition: 'transform .2s', display: 'block', marginLeft: 'auto' }}>
            <path d="M2.5 4.5l3.5 3.5 3.5-3.5" stroke={C.inkFaint} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </td>
      </tr>
      {expanded && (
        <tr>
          <td colSpan={6} style={{ padding: 0 }}>
            <div style={{ padding: '16px 20px 20px', background: 'rgba(45,184,160,0.03)', borderTop: `1px solid ${C.tealBorder}`, borderBottom: `1px solid ${C.tealBorder}` }}>
              <PipelineStrip status={app.status} />
              {app.notes && (
                <div style={{ marginTop: 14, padding: '10px 14px', background: 'rgba(255,255,255,0.70)', border: `1px solid rgba(26,39,68,0.10)`, borderRadius: 9 }}>
                  <p style={{ fontFamily: C.font.body, fontSize: 10, fontWeight: 700, color: C.inkFaint, textTransform: 'uppercase', letterSpacing: '0.6px', margin: '0 0 5px' }}>Notes</p>
                  <p style={{ fontFamily: C.font.body, fontSize: 12.5, color: C.inkMid, margin: 0, lineHeight: 1.55 }}>{app.notes}</p>
                </div>
              )}
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

/* ─────────────────────────────────────────────────────────────
   APPLICATION TRACKER
───────────────────────────────────────────────────────────── */
const ALL_FILTERS = ['All', 'Applied', 'Screening', 'Interview', 'Offer', 'Rejected', 'Withdrawn'];

function ApplicationTracker({ applications = [] }) {
  const [filter, setFilter]         = useState('All');
  const [search, setSearch]         = useState('');
  const [sort, setSort]             = useState('date_desc');
  const [expandedId, setExpandedId] = useState(null);

  const filtered = useMemo(() => {
    let arr = [...applications];
    if (filter !== 'All') arr = arr.filter(a => a.status === filter.toLowerCase());
    if (search.trim()) {
      const q = search.toLowerCase();
      arr = arr.filter(a => a.company?.toLowerCase().includes(q) || a.role?.toLowerCase().includes(q));
    }
    arr.sort((a, b) => {
      if (sort === 'date_desc') return new Date(b.applied_at) - new Date(a.applied_at);
      if (sort === 'date_asc')  return new Date(a.applied_at) - new Date(b.applied_at);
      if (sort === 'company')   return (a.company || '').localeCompare(b.company || '');
      if (sort === 'status')    return (APP_STATUS[b.status]?.step || 0) - (APP_STATUS[a.status]?.step || 0);
      return 0;
    });
    return arr;
  }, [applications, filter, search, sort]);

  const total   = applications.length;
  const countBy = (s) => applications.filter(a => a.status === s).length;

  return (
    <div>
      <div style={{ display: 'flex', gap: 5, marginBottom: 16, flexWrap: 'wrap' }}>
        {ALL_FILTERS.map(f => {
          const active = filter === f;
          const count  = f === 'All' ? total : countBy(f.toLowerCase());
          return (
            <button key={f} onClick={() => setFilter(f)} style={{ fontFamily: C.font.body, fontSize: 11.5, fontWeight: 600, padding: '5px 12px', borderRadius: 20, border: active ? 'none' : `1px solid rgba(26,39,68,0.14)`, background: active ? 'linear-gradient(135deg,#2DB8A0,#1A9E88)' : 'rgba(255,255,255,0.65)', color: active ? '#fff' : C.inkMid, cursor: 'pointer', display: 'inline-flex', gap: 5, alignItems: 'center' }}>
              {f}{count > 0 && <span style={{ background: active ? 'rgba(255,255,255,0.22)' : 'rgba(26,39,68,0.07)', borderRadius: 10, padding: '1px 6px', fontSize: 10 }}>{count}</span>}
            </button>
          );
        })}
      </div>
      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '36px 0' }}>
          <p style={{ fontFamily: C.font.body, fontSize: 13, color: C.inkFaint, margin: 0 }}>{total === 0 ? 'No applications yet.' : 'No results match your filters.'}</p>
        </div>
      ) : (
        <div style={{ border: `1px solid rgba(26,39,68,0.10)`, borderRadius: 12, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'rgba(26,39,68,0.04)', borderBottom: `1px solid rgba(26,39,68,0.08)` }}>
                {['Company / Role', 'Status', 'Applied', 'Updated', 'Location', ''].map((h, i) => (
                  <th key={i} style={{ fontFamily: C.font.body, fontSize: 10, fontWeight: 700, color: C.inkFaint, textTransform: 'uppercase', letterSpacing: '0.6px', padding: i === 0 ? '10px 16px 10px 20px' : '10px 12px', textAlign: 'left', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(app => (
                <AppTableRow key={app.id} app={app} expanded={expandedId === app.id} onToggle={() => setExpandedId(expandedId === app.id ? null : app.id)} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   CHALLENGE COMPONENTS
───────────────────────────────────────────────────────────── */
function Divider() { return <div style={{ height: 1, background: 'rgba(26,39,68,0.08)' }} />; }

function ChallengeRow({ title, status, score, isLast }) {
  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '11px 0', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
          <div style={{ width: 7, height: 7, borderRadius: '50%', flexShrink: 0, background: status === 'approved' ? C.teal : status === 'pending' ? C.amber : status === 'rejected' ? C.red : 'rgba(26,39,68,0.22)' }} />
          <p style={{ fontFamily: C.font.body, fontSize: 13, fontWeight: 500, color: C.ink, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{title}</p>
        </div>
        <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
          {score != null && <span style={{ fontFamily: C.font.body, fontSize: 12, fontWeight: 700, color: C.teal, background: C.tealBg, border: `1px solid ${C.tealBorder}`, borderRadius: 8, padding: '2px 9px' }}>{score}</span>}
          <Badge status={status} />
        </div>
      </div>
      {!isLast && <Divider />}
    </>
  );
}

function PhasePill({ status }) {
  const cfg = {
    active:    { bg: C.tealBg, color: C.teal, label: 'In Progress' },
    completed: { bg: C.blueBg, color: C.blue, label: 'Completed' },
    locked:    { bg: C.muted,  color: C.inkFaint, label: 'Locked' },
  }[status] || { bg: C.muted, color: C.inkFaint, label: status };
  return <span style={{ fontFamily: C.font.body, fontSize: 10, fontWeight: 700, background: cfg.bg, color: cfg.color, borderRadius: 20, padding: '2px 9px', textTransform: 'uppercase', letterSpacing: '0.6px' }}>{cfg.label}</span>;
}

function PhaseBlock({ phase, challenges, isLast }) {
  const [open, setOpen] = useState(phase.status === 'active');
  const approved = challenges.filter(c => c.status === 'approved').length;
  const total    = challenges.length;
  const pct      = total > 0 ? Math.round(approved / total * 100) : 0;
  return (
    <div style={{ marginBottom: isLast ? 0 : 12 }}>
      <div onClick={() => setOpen(!open)} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderRadius: open ? '11px 11px 0 0' : 11, cursor: 'pointer', background: open ? C.tealBg : 'rgba(26,39,68,0.03)', border: `1px solid ${open ? C.tealBorder : 'rgba(26,39,68,0.10)'}`, borderBottom: open ? 'none' : undefined, userSelect: 'none' }}>
        <div style={{ width: 22, height: 22, borderRadius: 6, background: phase.status === 'locked' ? C.muted : C.tealBg, border: `1px solid ${phase.status === 'locked' ? C.mutedBorder : C.tealBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          {phase.status === 'completed' ? <svg width="11" height="11" viewBox="0 0 11 11" fill="none"><path d="M2 5.5L4.5 8 9 3" stroke={C.teal} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          : phase.status === 'active' ? <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><circle cx="5" cy="5" r="3" stroke={C.teal} strokeWidth="1.5"/><circle cx="5" cy="5" r="1.2" fill={C.teal}/></svg>
          : <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><rect x="2.5" y="4.5" width="5" height="4" rx="1" stroke={C.inkFaint} strokeWidth="1.2"/><path d="M3.5 4.5V3.5a1.5 1.5 0 013 0v1" stroke={C.inkFaint} strokeWidth="1.2" strokeLinecap="round"/></svg>}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <p style={{ fontFamily: C.font.body, fontSize: 13.5, fontWeight: 700, color: C.ink, margin: 0 }}>{phase.phase_name}</p>
            <PhasePill status={phase.status} />
          </div>
          {total > 0 && <p style={{ fontFamily: C.font.body, fontSize: 10.5, color: C.inkFaint, margin: '2px 0 0' }}>{approved}/{total} completed</p>}
        </div>
        {total > 0 && (
          <div style={{ width: 68, flexShrink: 0 }}>
            <div style={{ height: 4, background: 'rgba(26,39,68,0.09)', borderRadius: 10, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${pct}%`, background: 'linear-gradient(90deg,#2DB8A0,#1A9E88)', borderRadius: 10 }} />
            </div>
            <p style={{ fontFamily: C.font.body, fontSize: 10, color: C.inkFaint, margin: '2px 0 0', textAlign: 'right' }}>{pct}%</p>
          </div>
        )}
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform .2s', flexShrink: 0 }}>
          <path d="M2 3.5l3 3 3-3" stroke={C.inkFaint} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      {open && (
        <div style={{ padding: challenges.length > 0 ? '0 16px' : '14px 16px', background: 'rgba(255,255,255,0.60)', border: `1px solid ${C.tealBorder}`, borderTop: 'none', borderRadius: '0 0 11px 11px' }}>
          {challenges.length > 0
            ? challenges.map((ch, i) => <ChallengeRow key={ch.id} title={ch.title} status={ch.status} score={ch.ai_score} isLast={i === challenges.length - 1} />)
            : <p style={{ fontFamily: C.font.body, fontSize: 12.5, color: C.inkFaint, margin: 0 }}>{phase.status === 'locked' ? 'Complete the previous phase to unlock.' : 'No challenges yet.'}</p>}
        </div>
      )}
    </div>
  );
}

function LogRow({ item, isLast }) {
  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '12px 0', flexWrap: 'wrap' }}>
        <div style={{ minWidth: 0 }}>
          <p style={{ fontFamily: C.font.body, fontSize: 13, fontWeight: 600, color: C.ink, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.challengeTitle}</p>
          <p style={{ fontFamily: C.font.body, fontSize: 11, color: C.inkFaint, margin: '2px 0 0' }}>
            {fmt(item.submitted_at, { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
            {item.attempt_number > 1 && ` · Attempt ${item.attempt_number}`}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
          {item.ai_score != null && <span style={{ fontFamily: C.font.body, fontSize: 13, fontWeight: 700, color: C.teal, background: C.tealBg, border: `1px solid ${C.tealBorder}`, borderRadius: 8, padding: '2px 10px' }}>{item.ai_score}</span>}
          <Badge status={item.status} />
        </div>
      </div>
      {!isLast && <Divider />}
    </>
  );
}

/* ─────────────────────────────────────────────────────────────
   SECTION SHELL
───────────────────────────────────────────────────────────── */
function Section({ icon, title, children, right }) {
  return (
    <div style={{ background: C.card, backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)', border: `1px solid rgba(26,39,68,0.10)`, borderRadius: 18, boxShadow: '0 2px 14px rgba(26,39,68,0.07)', overflow: 'hidden' }}>
      {title && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 22px', borderBottom: `1px solid rgba(26,39,68,0.08)` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
            <div style={{ width: 32, height: 32, borderRadius: 9, background: C.tealBg, border: `1px solid ${C.tealBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.teal }}>{icon}</div>
            <h2 style={{ fontFamily: C.font.display, fontSize: 15.5, fontWeight: 600, color: C.ink, margin: 0 }}>{title}</h2>
          </div>
          {right}
        </div>
      )}
      <div style={{ padding: '20px 22px' }}>{children}</div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   TABS
───────────────────────────────────────────────────────────── */
const TABS = [
  { id: 'overview',     label: 'Overview'     },
  { id: 'applications', label: 'Applications' },
  { id: 'roadmap',      label: 'Roadmap'      },
  { id: 'submissions',  label: 'Submissions'  },
];

/* ─────────────────────────────────────────────────────────────
   EMPTY STATE — shown before assessment is completed
───────────────────────────────────────────────────────────── */
function EmptyTracker() {
  return (
    <div style={{ padding: '60px 30px', textAlign: 'center', maxWidth: 420, margin: '0 auto' }}>
      <div style={{ fontSize: 48, marginBottom: 16 }}>📊</div>
      <h2 style={{ fontFamily: C.font.display, fontSize: 20, fontWeight: 700, color: C.ink, margin: '0 0 10px' }}>No data yet</h2>
      <p style={{ fontFamily: C.font.body, fontSize: 14, color: C.inkMid, lineHeight: 1.6, margin: 0 }}>
        Complete your assessment to generate your personalised roadmap and challenges. Your progress will appear here automatically.
      </p>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   NOTION CARD (kept as-is, Notion integration unchanged)
───────────────────────────────────────────────────────────── */
function NotionCard({ isConnected, connectedAt, notionUrl }) {
  const [status, setStatus] = useState(isConnected ? 'connected' : 'idle');
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const result = params.get('notion');
    if (result === 'connected') setStatus('connected');
    if (result === 'error')     setStatus('error');
    if (result === 'declined')  setStatus('idle');
    if (result) {
      const url = new URL(window.location.href);
      url.searchParams.delete('notion');
      window.history.replaceState({}, '', url);
    }
  }, []);
  const connected = status === 'connected';
  return (
    <div style={{ background: connected ? C.tealBg : 'rgba(255,255,255,0.65)', border: connected ? `1.5px solid ${C.tealBorder}` : '1.5px dashed rgba(26,39,68,0.18)', borderRadius: 14, padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
      <div style={{ width: 38, height: 38, borderRadius: 10, flexShrink: 0, background: connected ? C.tealBg : C.muted, border: `1px solid ${connected ? C.tealBorder : C.mutedBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg width="18" height="18" viewBox="0 0 20 20" fill="none"><rect x="3.5" y="3.5" width="13" height="13" rx="2.5" stroke={connected ? C.teal : C.inkFaint} strokeWidth="1.4"/><path d="M7 7.5h6M7 10h6M7 12.5h4" stroke={connected ? C.teal : C.inkFaint} strokeWidth="1.3" strokeLinecap="round"/></svg>
      </div>
      <div style={{ flex: 1, minWidth: 160 }}>
        <p style={{ fontFamily: C.font.body, fontSize: 13.5, fontWeight: 700, color: C.ink, margin: 0 }}>{connected ? 'Notion Connected' : 'Connect Notion'}</p>
        <p style={{ fontFamily: C.font.body, fontSize: 11.5, color: C.inkMid, margin: '2px 0 0' }}>{connected ? `Tracker syncs automatically.${connectedAt ? ` Connected ${fmt(connectedAt)}.` : ''}` : 'Get a personal tracker page pre-filled with your roadmap.'}</p>
      </div>
      {connected ? (
        <div style={{ display: 'flex', gap: 9, flexShrink: 0 }}>
          <span style={{ fontFamily: C.font.body, fontSize: 11, fontWeight: 700, background: C.tealBg, color: C.teal, border: `1px solid ${C.tealBorder}`, borderRadius: 20, padding: '4px 12px' }}>Active</span>
          {notionUrl && <a href={notionUrl} target="_blank" rel="noopener noreferrer" style={{ fontFamily: C.font.body, fontSize: 12, fontWeight: 600, color: C.teal, textDecoration: 'none', padding: '6px 14px', borderRadius: 9, border: `1.5px solid ${C.tealBorder}`, background: C.tealBg, whiteSpace: 'nowrap' }}>Open →</a>}
        </div>
      ) : (
        <button onClick={() => window.location.href = '/api/notion/connect'} style={{ padding: '9px 18px', borderRadius: 10, border: 'none', background: 'linear-gradient(135deg,#2DB8A0,#1A9E88)', color: '#fff', fontSize: 13, fontWeight: 700, fontFamily: C.font.body, cursor: 'pointer', flexShrink: 0 }}>Connect</button>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   MAIN PAGE EXPORT — now reads from localStorage via useAppData
───────────────────────────────────────────────────────────── */
export default function TrackerPage() {
  // ── THE ONLY CHANGE: read from localStorage instead of props ──
  const appData = useAppData();

  const isConnected  = false;   // Notion connection — wire up separately when ready
  const connectedAt  = null;
  const notionUrl    = null;

  const stats        = appData.tracker?.stats        || {};
  const phases       = appData.tracker?.phases       || [];
  const submissions  = appData.tracker?.submissions  || [];
  const applications = appData.tracker?.applications || [];
  const activityData = appData.tracker?.activityData || {};
  const challenges   = appData.challenges            || [];
  // ─────────────────────────────────────────────────────────────

  const [tab, setTab] = useState('overview');

  const totalChallenges = challenges.length;
  const approvedCount   = challenges.filter(c => c.status === 'approved').length;
  const overallPct      = totalChallenges > 0 ? Math.round(approvedCount / totalChallenges * 100) : 0;

  // Show empty state if no assessment has been completed yet
  const hasData = totalChallenges > 0 || submissions.length > 0 || applications.length > 0;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lexend:wght@300;400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; }
        @keyframes flamePulse { 0%, 100% { opacity: 0.6; transform: scale(1); } 50% { opacity: 1; transform: scale(1.12); } }
        @keyframes flameWaver { 0%, 100% { transform: skewX(-1deg) scaleY(1); } 33% { transform: skewX(2deg) scaleY(1.03); } 66% { transform: skewX(-2deg) scaleY(0.98); } }
        .app-tr:hover { background: rgba(45,184,160,0.05) !important; }
        .app-tr + .app-tr { border-top: 1px solid rgba(26,39,68,0.06); }
        tr + tr:not(.exp-row) { border-top: 1px solid rgba(26,39,68,0.06); }
        .heatmap-cell:hover { transform: scale(1.25); }
        @media (max-width: 700px) {
          .stat-grid-6   { grid-template-columns: repeat(2,1fr) !important; }
          .app-top-grid  { grid-template-columns: 1fr !important; }
          .hero-grid     { grid-template-columns: 1fr !important; }
          .streak-top-row { flex-direction: column !important; }
          .streak-stat-row { grid-template-columns: repeat(2,1fr) !important; }
        }
      `}</style>

      <div style={{ padding: '30px 30px 48px', display: 'flex', flexDirection: 'column', gap: 18, maxWidth: 900, margin: '0 auto', width: '100%', fontFamily: C.font.body, color: C.ink }}>

        {/* HEADER */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
          <div>
            <p style={{ fontFamily: C.font.body, fontSize: 11, fontWeight: 700, color: C.teal, textTransform: 'uppercase', letterSpacing: '1.2px', margin: '0 0 5px' }}>Dashboard</p>
            <h1 style={{ fontFamily: C.font.display, fontSize: 27, fontWeight: 700, color: C.ink, letterSpacing: '-0.4px', margin: 0, lineHeight: 1.1 }}>My Tracker</h1>
          </div>
          <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap' }}>
            <span style={{ fontFamily: C.font.body, fontSize: 11.5, fontWeight: 600, color: C.teal, background: C.tealBg, border: `1px solid ${C.tealBorder}`, borderRadius: 20, padding: '5px 13px' }}>{approvedCount}/{totalChallenges} challenges</span>
            <span style={{ fontFamily: C.font.body, fontSize: 11.5, fontWeight: 600, color: C.blue, background: C.blueBg, border: `1px solid ${C.blueBorder}`, borderRadius: 20, padding: '5px 13px' }}>{applications.length} applications</span>
          </div>
        </div>

        {/* NOTION */}
        <NotionCard isConnected={isConnected} connectedAt={connectedAt} notionUrl={notionUrl} />

        {/* Empty state — no assessment yet */}
        {!hasData ? <EmptyTracker /> : (
          <>
            {/* TAB BAR */}
            <div style={{ display: 'flex', gap: 2, background: 'rgba(26,39,68,0.06)', border: `1px solid rgba(26,39,68,0.10)`, borderRadius: 12, padding: '3px', width: 'fit-content' }}>
              {TABS.map(t => (
                <button key={t.id} onClick={() => setTab(t.id)} style={{ fontFamily: C.font.body, fontSize: 13, fontWeight: 600, padding: '7px 16px', borderRadius: 9, border: 'none', background: tab === t.id ? 'rgba(255,255,255,0.95)' : 'transparent', color: tab === t.id ? C.ink : C.inkFaint, cursor: 'pointer', transition: 'all .15s' }}>{t.label}</button>
              ))}
            </div>

            {/* OVERVIEW */}
            {tab === 'overview' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 16 }} className="hero-grid">
                  <div style={{ padding: '22px 24px', background: C.card, backdropFilter: 'blur(14px)', border: `1px solid rgba(26,39,68,0.10)`, borderRadius: 18, boxShadow: '0 2px 14px rgba(26,39,68,0.07)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
                    <CircleRing pct={overallPct} size={136} stroke={11} color={C.teal} label="completed" sublabel={`${approvedCount}/${totalChallenges}`} animate />
                    <p style={{ fontFamily: C.font.display, fontSize: 13, fontWeight: 600, color: C.ink, margin: 0, textAlign: 'center', lineHeight: 1.3 }}>Challenge<br/>Progress</p>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }} className="stat-grid-6">
                    {[
                      { label: 'Submitted',    value: stats.totalSubmitted    || 0,                               sub: 'attempts',       color: C.blue,  border: C.blueBorder  },
                      { label: 'Approved',     value: stats.totalApproved     || 0,                               sub: 'verified',       color: C.teal,  border: C.tealBorder  },
                      { label: 'Streak',       value: `${stats.currentStreak  || 0}d`,                            sub: `best ${stats.longestStreak || 0}d`, color: C.amber, border: C.amberBorder },
                      { label: 'Rejected',     value: stats.totalRejected     || 0,                               sub: 'to retry',       color: C.red,   border: C.redBorder   },
                      { label: 'Score',        value: Number(stats.verificationScore || 0).toFixed(1),            sub: 'verification',   color: C.purp,  border: C.purpBorder  },
                      { label: 'Applications', value: applications.length,                                         sub: 'tracked',        color: C.navy,  border: C.navyBorder  },
                    ].map((s, i) => (
                      <div key={i} style={{ padding: '13px 14px', background: 'rgba(255,255,255,0.75)', border: `1.5px solid ${s.border}`, borderRadius: 12 }}>
                        <p style={{ fontFamily: C.font.display, fontSize: 21, fontWeight: 700, color: s.color, margin: 0, lineHeight: 1 }}>{s.value}</p>
                        <p style={{ fontFamily: C.font.body, fontSize: 10, fontWeight: 700, color: C.inkFaint, margin: '4px 0 1px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{s.label}</p>
                        <p style={{ fontFamily: C.font.body, fontSize: 10.5, color: C.inkFaint, margin: 0 }}>{s.sub}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {applications.length > 0 && (
                  <Section icon={<svg width="15" height="15" viewBox="0 0 16 16" fill="none"><rect x="2" y="2" width="12" height="12" rx="2.5" stroke={C.teal} strokeWidth="1.4"/><path d="M5 6h6M5 9h4" stroke={C.teal} strokeWidth="1.3" strokeLinecap="round"/></svg>} title="Application Snapshot" right={<button onClick={() => setTab('applications')} style={{ fontFamily: C.font.body, fontSize: 12, fontWeight: 600, color: C.teal, background: C.tealBg, border: `1px solid ${C.tealBorder}`, borderRadius: 8, padding: '5px 12px', cursor: 'pointer' }}>View all →</button>}>
                    <div style={{ display: 'flex', gap: 9, flexWrap: 'wrap' }}>
                      {Object.entries(APP_STATUS).map(([s, cfg]) => {
                        const count = applications.filter(a => a.status === s).length;
                        if (count === 0) return null;
                        return <div key={s} onClick={() => setTab('applications')} style={{ padding: '11px 15px', background: cfg.bg, border: `1px solid ${cfg.border}`, borderRadius: 10, minWidth: 75, cursor: 'pointer' }}><p style={{ fontFamily: C.font.display, fontSize: 20, fontWeight: 700, color: cfg.color, margin: 0 }}>{count}</p><p style={{ fontFamily: C.font.body, fontSize: 10, fontWeight: 700, color: cfg.color, margin: '3px 0 0', textTransform: 'uppercase', letterSpacing: '0.4px' }}>{cfg.label}</p></div>;
                      })}
                    </div>
                  </Section>
                )}

                <Section icon={<svg width="15" height="15" viewBox="0 0 16 16" fill="none"><path d="M2 14V6l5-4 5 4v8" stroke={C.teal} strokeWidth="1.4" strokeLinejoin="round"/><rect x="6" y="9" width="4" height="5" rx="0.8" stroke={C.teal} strokeWidth="1.2"/></svg>} title="Challenge Breakdown">
                  <div style={{ display: 'flex', gap: 18, marginBottom: 12, flexWrap: 'wrap' }}>
                    {[
                      { dot: C.teal,                label: `${stats.totalApproved || 0} Approved`  },
                      { dot: C.amber,               label: `${challenges.filter(c=>c.status==='pending').length} Pending` },
                      { dot: C.red,                 label: `${stats.totalRejected || 0} Rejected`   },
                      { dot: 'rgba(26,39,68,0.22)', label: `${challenges.filter(c=>c.status==='not_started').length} Not started` },
                    ].map((item, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: item.dot }} />
                        <span style={{ fontSize: 12, color: C.inkMid }}>{item.label}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{ height: 9, background: 'rgba(26,39,68,0.08)', borderRadius: 10, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${overallPct}%`, background: 'linear-gradient(90deg,#2DB8A0,#1A9E88)', borderRadius: 10 }} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
                    <p style={{ fontFamily: C.font.body, fontSize: 12, color: C.inkMid, margin: 0 }}>{approvedCount} of {totalChallenges} approved</p>
                    <p style={{ fontFamily: C.font.display, fontSize: 15, fontWeight: 700, color: C.teal, margin: 0 }}>{overallPct}%</p>
                  </div>
                </Section>

                <StreakSection currentStreak={stats.currentStreak || 0} longestStreak={stats.longestStreak || 0} activityData={activityData} />
              </div>
            )}

            {tab === 'applications' && (
              <Section icon={<svg width="15" height="15" viewBox="0 0 16 16" fill="none"><rect x="2" y="2" width="12" height="12" rx="2.5" stroke={C.teal} strokeWidth="1.4"/><path d="M5 6h6M5 9h4" stroke={C.teal} strokeWidth="1.3" strokeLinecap="round"/></svg>} title="Application Tracker">
                <ApplicationTracker applications={applications} />
              </Section>
            )}

            {tab === 'roadmap' && (
              <Section icon={<svg width="15" height="15" viewBox="0 0 16 16" fill="none"><circle cx="3" cy="13" r="1.5" fill={C.teal}/><circle cx="8" cy="3" r="1.5" fill={C.teal}/><circle cx="13" cy="13" r="1.5" fill={C.teal}/><path d="M3 13C4 8 6 3 8 3M8 3C10 3 12 8 13 13" stroke={C.teal} strokeWidth="1.3" strokeLinecap="round"/></svg>} title="My Roadmap">
                {phases.length === 0
                  ? <p style={{ fontFamily: C.font.body, fontSize: 13, color: C.inkFaint, textAlign: 'center', padding: '20px 0', margin: 0 }}>Your roadmap will appear once it has been generated.</p>
                  : phases.map((phase, i) => <PhaseBlock key={phase.id} phase={phase} challenges={challenges.filter(c => c.phase_id === phase.id)} isLast={i === phases.length - 1} />)
                }
              </Section>
            )}

            {tab === 'submissions' && (
              <Section icon={<svg width="15" height="15" viewBox="0 0 16 16" fill="none"><path d="M3 4h10M3 7.5h7M3 11h5" stroke={C.teal} strokeWidth="1.4" strokeLinecap="round"/></svg>} title="Submission Log">
                {submissions.length === 0
                  ? <p style={{ fontFamily: C.font.body, fontSize: 13, color: C.inkFaint, textAlign: 'center', padding: '20px 0', margin: 0 }}>No submissions yet.</p>
                  : submissions.map((item, i) => <LogRow key={item.id} item={item} isLast={i === submissions.length - 1} />)
                }
              </Section>
            )}
          </>
        )}
      </div>
    </>
  );
}