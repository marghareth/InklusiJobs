'use client';

import { useState } from 'react';
import {
  LayoutDashboard, Map, Zap, Briefcase, Search,
  MessageSquare, Settings, ChevronLeft, ChevronRight,
  Bell, LogOut, BarChart2,
} from 'lucide-react';

const NAV_ITEMS = [
  { id: 'dashboard',  label: 'Dashboard',  icon: LayoutDashboard, group: 'main' },
  { id: 'roadmap',    label: 'Roadmap',    icon: Map,             group: 'main' },
  { id: 'challenges', label: 'Challenges', icon: Zap,             group: 'main' },
  { id: 'portfolio',  label: 'Portfolio',  icon: Briefcase,       group: 'main' },
  { id: 'tracker',    label: 'Tracker',    icon: BarChart2,       group: 'main' },
  { id: 'jobs',       label: 'Jobs',       icon: Search,          group: 'main', badge: '3' },
  { id: 'feedback',   label: 'Feedback',   icon: MessageSquare,   group: 'support' },
  { id: 'settings',   label: 'Settings',   icon: Settings,        group: 'support' },
];

// ─── Sage palette (all sidebar colours live here) ────────────────────────────
// Base        : #3D6B47  deep muted sage
// Mid         : #4E7A55  warm mid sage
// Light       : #6B8F71  soft sage (same as accent in content area)
// Text on bg  : rgba(255,255,255,0.85) primary  /  0.45 muted
// Border      : rgba(255,255,255,0.10)
// Glass hover : rgba(255,255,255,0.10)
// Glass active: rgba(255,255,255,0.15)
// ─────────────────────────────────────────────────────────────────────────────

export default function Sidebar({ activeTab, onTabChange }) {
  const [collapsed, setCollapsed] = useState(false);
  const w = collapsed ? '72px' : '240px';

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Instrument+Sans:wght@400;500;600;700&display=swap');

        /* ── Shell ── */
        .sb {
          width: ${w};
          min-height: 100vh;
          /* Gradient: dark sage at top, slightly lighter in the middle, back deep at foot */
          background:
            linear-gradient(175deg,
              #2E5237 0%,
              #3D6B47 35%,
              #4A7554 65%,
              #365F40 100%
            );
          border-right: 1px solid rgba(255,255,255,0.08);
          display: flex;
          flex-direction: column;
          transition: width 0.32s cubic-bezier(0.4,0,0.2,1);
          position: relative;
          flex-shrink: 0;
          overflow: hidden;
        }

        /* Soft radial glows — warm sage, not harsh */
        .sb::before {
          content: '';
          position: absolute; inset: 0; pointer-events: none;
          background:
            radial-gradient(ellipse 90% 40% at 50% 0%,   rgba(180,220,185,0.10) 0%, transparent 70%),
            radial-gradient(ellipse 60% 30% at 80% 100%, rgba(107,143,113,0.12) 0%, transparent 70%),
            radial-gradient(ellipse 40% 40% at 10% 50%,  rgba(255,255,255,0.03) 0%, transparent 60%);
        }

        /* Hairline top accent */
        .sb::after {
          content: '';
          position: absolute; top: 0; left: 0; right: 0; height: 2px;
          background: linear-gradient(90deg,
            transparent 0%,
            rgba(180,220,185,0.45) 30%,
            rgba(220,240,210,0.60) 50%,
            rgba(180,220,185,0.45) 70%,
            transparent 100%
          );
          pointer-events: none;
        }

        /* ── Header ── */
        .sb-head {
          padding: ${collapsed ? '20px 16px' : '22px 20px'};
          display: flex; align-items: center; gap: 12px;
          border-bottom: 1px solid rgba(255,255,255,0.08);
          min-height: 76px;
          transition: padding .3s;
        }

        .sb-logo {
          width: 36px; height: 36px; flex-shrink: 0;
          /* Glass logo tile */
          background: rgba(255,255,255,0.18);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255,255,255,0.25);
          border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          font-family: 'Instrument Sans', sans-serif;
          font-weight: 700; font-size: 13px; color: #fff;
          letter-spacing: -.5px;
          box-shadow:
            0 2px 8px rgba(0,0,0,0.15),
            inset 0 1px 0 rgba(255,255,255,0.30);
        }

        .sb-brand {
          overflow: hidden;
          opacity: ${collapsed ? 0 : 1};
          transform: translateX(${collapsed ? '-6px' : '0'});
          transition: opacity .2s ease, transform .2s ease;
          white-space: nowrap;
        }
        .sb-brand-name {
          font-family: 'Playfair Display', serif;
          font-weight: 700; font-size: 15px;
          color: rgba(255,255,255,0.95);
          letter-spacing: -.2px; line-height: 1.2;
        }
        .sb-brand-sub {
          font-family: 'Instrument Sans', sans-serif;
          font-size: 9.5px; font-weight: 600;
          color: rgba(200,230,205,0.65);
          letter-spacing: 1.2px; text-transform: uppercase;
          margin-top: 1px;
        }

        /* ── User ── */
        .sb-user {
          padding: ${collapsed ? '14px 12px' : '14px 20px'};
          border-bottom: 1px solid rgba(255,255,255,0.08);
          display: flex; align-items: center; gap: 12px;
          transition: padding .3s;
        }
        .sb-avatar {
          width: 38px; height: 38px; flex-shrink: 0;
          background: rgba(255,255,255,0.18);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255,255,255,0.25);
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-family: 'Instrument Sans', sans-serif;
          font-weight: 700; font-size: 12px; color: #fff;
          position: relative;
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.25);
        }
        .sb-dot {
          position: absolute; bottom: 1px; right: 1px;
          width: 9px; height: 9px;
          background: #A8D5A2;
          border-radius: 50%;
          border: 2px solid #3D6B47;
        }
        .sb-uinfo {
          overflow: hidden;
          opacity: ${collapsed ? 0 : 1};
          transition: opacity .2s;
        }
        .sb-uname {
          font-family: 'Instrument Sans', sans-serif;
          font-weight: 600; font-size: 12.5px;
          color: rgba(255,255,255,0.92);
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .sb-uemail {
          font-family: 'Instrument Sans', sans-serif;
          font-size: 10.5px; font-weight: 400;
          color: rgba(200,230,205,0.55);
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
          margin-top: 1px;
        }

        /* ── Nav ── */
        .sb-nav {
          flex: 1; padding: 10px 8px;
          display: flex; flex-direction: column; gap: 1px;
          overflow-y: auto; scrollbar-width: none;
        }
        .sb-nav::-webkit-scrollbar { display: none; }

        .sb-section-label {
          font-family: 'Instrument Sans', sans-serif;
          font-size: 9px; font-weight: 700;
          letter-spacing: 1.6px; text-transform: uppercase;
          color: rgba(200,230,205,0.45);
          padding: 10px 10px 4px;
          white-space: nowrap;
          opacity: ${collapsed ? 0 : 1};
          transition: opacity .2s;
        }

        .sb-item {
          display: flex; align-items: center;
          gap: 12px;
          padding: ${collapsed ? '11px' : '10px 12px'};
          border-radius: 10px; cursor: pointer;
          transition: all .2s ease; position: relative;
          border: 1px solid transparent;
          justify-content: ${collapsed ? 'center' : 'flex-start'};
        }
        .sb-item:hover {
          background: rgba(255,255,255,0.10);
          border-color: rgba(255,255,255,0.12);
        }
        .sb-item:hover .sb-icon   { color: rgba(255,255,255,0.85); }
        .sb-item:hover .sb-ilabel { color: rgba(255,255,255,0.90); }

        /* Active — frosted glass tile */
        .sb-item.active {
          background: rgba(255,255,255,0.16);
          backdrop-filter: blur(8px);
          border-color: rgba(255,255,255,0.20);
          box-shadow:
            0 2px 12px rgba(0,0,0,0.10),
            inset 0 1px 0 rgba(255,255,255,0.22);
        }
        .sb-item.active::before {
          content: ''; position: absolute; left: 0; top: 18%; bottom: 18%;
          width: 3px;
          background: rgba(220,245,215,0.85);
          border-radius: 0 3px 3px 0;
        }
        .sb-item.active .sb-icon   { color: rgba(255,255,255,0.95); }
        .sb-item.active .sb-ilabel { color: rgba(255,255,255,0.95); font-weight: 600; }

        .sb-icon {
          width: 17px; height: 17px; flex-shrink: 0;
          color: rgba(255,255,255,0.45);
          transition: color .2s;
        }
        .sb-ilabel {
          font-family: 'Instrument Sans', sans-serif;
          font-size: 13px; font-weight: 500;
          color: rgba(255,255,255,0.55);
          white-space: nowrap;
          opacity: ${collapsed ? 0 : 1};
          transition: opacity .2s, color .2s;
        }
        .sb-badge {
          margin-left: auto; padding: 2px 7px;
          background: rgba(255,255,255,0.18);
          border: 1px solid rgba(255,255,255,0.22);
          color: rgba(255,255,255,0.90);
          font-size: 9px; font-weight: 700;
          font-family: 'Instrument Sans', sans-serif;
          border-radius: 20px;
          opacity: ${collapsed ? 0 : 1};
          transition: opacity .2s;
        }

        /* Collapsed tooltip */
        .sb-tip {
          display: ${collapsed ? 'block' : 'none'};
          position: absolute; left: 62px;
          background: rgba(46,82,55,0.96);
          backdrop-filter: blur(10px);
          color: rgba(255,255,255,0.90);
          font-size: 11.5px;
          font-family: 'Instrument Sans', sans-serif;
          padding: 5px 10px; border-radius: 7px; white-space: nowrap;
          border: 1px solid rgba(255,255,255,0.12);
          pointer-events: none; opacity: 0; transition: opacity .15s;
          z-index: 100;
          box-shadow: 0 4px 14px rgba(0,0,0,0.18);
        }
        .sb-item:hover .sb-tip { opacity: 1; }

        /* ── Footer ── */
        .sb-foot {
          padding: 10px 8px;
          border-top: 1px solid rgba(255,255,255,0.08);
          display: flex; flex-direction: column; gap: 1px;
        }
        .sb-fitem {
          display: flex; align-items: center; gap: 12px;
          padding: ${collapsed ? '10px' : '9px 12px'};
          border-radius: 10px; cursor: pointer;
          color: rgba(255,255,255,0.38);
          transition: all .2s;
          border: 1px solid transparent;
          justify-content: ${collapsed ? 'center' : 'flex-start'};
          position: relative;
        }
        .sb-fitem:hover {
          background: rgba(255,255,255,0.08);
          color: rgba(255,255,255,0.70);
        }
        .sb-fitem.danger:hover {
          background: rgba(220,100,80,0.12);
          color: rgba(240,160,140,0.90);
          border-color: rgba(220,100,80,0.15);
        }
        .sb-fitem svg { width: 15px; height: 15px; flex-shrink: 0; }
        .sb-fitem span {
          font-size: 12.5px;
          font-family: 'Instrument Sans', sans-serif;
          white-space: nowrap;
          opacity: ${collapsed ? 0 : 1};
          transition: opacity .2s;
        }
        .sb-ftip {
          display: ${collapsed ? 'block' : 'none'};
          position: absolute; left: 62px;
          background: rgba(46,82,55,0.96);
          backdrop-filter: blur(10px);
          color: rgba(255,255,255,0.90);
          font-size: 11.5px;
          font-family: 'Instrument Sans', sans-serif;
          padding: 5px 10px; border-radius: 7px; white-space: nowrap;
          border: 1px solid rgba(255,255,255,0.12);
          pointer-events: none; opacity: 0; transition: opacity .15s;
          z-index: 100; box-shadow: 0 4px 14px rgba(0,0,0,0.18);
        }
        .sb-fitem:hover .sb-ftip { opacity: 1; }

        /* ── Collapse toggle ── */
        .sb-toggle {
          position: absolute; right: -13px; top: 50%; transform: translateY(-50%);
          width: 26px; height: 26px;
          background: #3D6B47;
          border: 1px solid rgba(255,255,255,0.20);
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; color: rgba(255,255,255,0.60);
          transition: all .2s;
          box-shadow: 0 2px 8px rgba(0,0,0,0.18);
          z-index: 20;
        }
        .sb-toggle:hover {
          background: rgba(255,255,255,0.22);
          color: #fff;
          border-color: rgba(255,255,255,0.35);
          box-shadow: 0 0 12px rgba(180,220,185,0.25);
        }
      `}</style>

      <aside className="sb">
        {/* Header */}
        <div className="sb-head">
          <div className="sb-logo">IJ</div>
          <div className="sb-brand">
            <div className="sb-brand-name">InklusiJobs</div>
            <div className="sb-brand-sub">AI Platform</div>
          </div>
        </div>

        {/* User */}
        <div className="sb-user">
          <div className="sb-avatar">
            SJ<div className="sb-dot" />
          </div>
          <div className="sb-uinfo">
            <div className="sb-uname">Sarah Johnson</div>
            <div className="sb-uemail">sarah.johnson@email.com</div>
          </div>
        </div>

        {/* Nav */}
        <nav className="sb-nav">
          <div className="sb-section-label">Main Menu</div>
          {NAV_ITEMS.filter(i => i.group === 'main').map(({ id, label, icon: Icon, badge }) => (
            <div
              key={id}
              className={`sb-item${activeTab === id ? ' active' : ''}`}
              onClick={() => onTabChange(id)}
            >
              <Icon className="sb-icon" />
              <span className="sb-ilabel">{label}</span>
              {badge && <span className="sb-badge">{badge}</span>}
              <div className="sb-tip">{label}</div>
            </div>
          ))}

          <div className="sb-section-label" style={{ marginTop: 8 }}>Support</div>
          {NAV_ITEMS.filter(i => i.group === 'support').map(({ id, label, icon: Icon }) => (
            <div
              key={id}
              className={`sb-item${activeTab === id ? ' active' : ''}`}
              onClick={() => onTabChange(id)}
            >
              <Icon className="sb-icon" />
              <span className="sb-ilabel">{label}</span>
              <div className="sb-tip">{label}</div>
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="sb-foot">
          <div className="sb-fitem">
            <Bell /><span>Notifications</span>
            <div className="sb-ftip">Notifications</div>
          </div>
          <div className="sb-fitem danger">
            <LogOut /><span>Sign Out</span>
            <div className="sb-ftip">Sign Out</div>
          </div>
        </div>

        {/* Collapse toggle */}
        <div className="sb-toggle" onClick={() => setCollapsed(!collapsed)}>
          {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
        </div>
      </aside>
    </>
  );
}