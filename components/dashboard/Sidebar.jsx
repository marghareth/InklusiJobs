'use client';

import { useState } from 'react';
import {
  LayoutDashboard, Map, Zap, Briefcase, Search,
  MessageSquare, Settings, ChevronLeft, ChevronRight,
  Bell, LogOut,
} from 'lucide-react';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, group: 'main' },
  { id: 'roadmap',   label: 'Roadmap',   icon: Map,             group: 'main' },
  { id: 'challenges',label: 'Challenges',icon: Zap,             group: 'main', badge: null },
  { id: 'portfolio', label: 'Portfolio', icon: Briefcase,        group: 'main' },
  { id: 'jobs',      label: 'Jobs',      icon: Search,           group: 'main', badge: '3' },
  { id: 'feedback',  label: 'Feedback',  icon: MessageSquare,    group: 'support' },
  { id: 'settings',  label: 'Settings',  icon: Settings,         group: 'support' },
];

export default function Sidebar({ activeTab, onTabChange }) {
  const [collapsed, setCollapsed] = useState(false);
  const w = collapsed ? '72px' : '240px';

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Mono:wght@400;500&display=swap');

        .sb {
          width: ${w};
          min-height: 100vh;
          background: linear-gradient(175deg, #0c1128 0%, #0f1623 55%, #0a0f1e 100%);
          border-right: 1px solid rgba(99,102,241,0.1);
          display: flex;
          flex-direction: column;
          transition: width 0.32s cubic-bezier(0.4,0,0.2,1);
          position: relative;
          flex-shrink: 0;
          overflow: hidden;
        }
        .sb::before {
          content:'';
          position:absolute;inset:0;pointer-events:none;
          background:
            radial-gradient(ellipse 80% 35% at 50% 0%,  rgba(99,102,241,0.07) 0%, transparent 70%),
            radial-gradient(ellipse 50% 25% at 50% 100%,rgba(139,92,246,0.05) 0%, transparent 70%);
        }

        /* ── Header ── */
        .sb-head {
          padding: ${collapsed ? '20px 16px' : '22px 20px'};
          display:flex; align-items:center; gap:12px;
          border-bottom:1px solid rgba(255,255,255,0.04);
          min-height:76px;
          transition: padding .3s;
        }
        .sb-logo {
          width:36px;height:36px;flex-shrink:0;
          background:linear-gradient(135deg,#6366f1,#8b5cf6,#06b6d4);
          border-radius:10px; display:flex; align-items:center; justify-content:center;
          font-weight:800; font-size:13px; color:#fff;
          box-shadow:0 0 20px rgba(99,102,241,0.45);
          font-family:'DM Mono',monospace; letter-spacing:-.5px;
        }
        .sb-brand {
          overflow:hidden;
          opacity:${collapsed ? 0 : 1};
          transform:translateX(${collapsed ? '-6px' : '0'});
          transition:opacity .2s ease, transform .2s ease;
          white-space:nowrap;
        }
        .sb-brand-name {
          font-family:'Syne',sans-serif; font-weight:700; font-size:15px;
          color:#fff; letter-spacing:-.3px; line-height:1.2;
        }
        .sb-brand-sub {
          font-family:'DM Mono',monospace; font-size:9.5px;
          color:rgba(99,102,241,0.75); letter-spacing:1px; text-transform:uppercase;
        }

        /* ── User ── */
        .sb-user {
          padding:${collapsed ? '14px 12px' : '14px 20px'};
          border-bottom:1px solid rgba(255,255,255,0.04);
          display:flex; align-items:center; gap:12px;
          transition:padding .3s;
        }
        .sb-avatar {
          width:38px;height:38px;flex-shrink:0;
          background:linear-gradient(135deg,#6366f1,#8b5cf6);
          border-radius:50%; display:flex; align-items:center; justify-content:center;
          font-weight:700; font-size:13px; color:#fff;
          font-family:'Syne',sans-serif; position:relative;
        }
        .sb-dot {
          position:absolute; bottom:1px; right:1px;
          width:9px;height:9px;
          background:#10b981; border-radius:50%;
          border:2px solid #0f1623;
        }
        .sb-uinfo { overflow:hidden; opacity:${collapsed ? 0 : 1}; transition:opacity .2s; }
        .sb-uname {
          font-family:'Syne',sans-serif; font-weight:600; font-size:12.5px;
          color:#fff; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;
        }
        .sb-uemail {
          font-family:'DM Mono',monospace; font-size:10px;
          color:rgba(255,255,255,0.3); white-space:nowrap; overflow:hidden; text-overflow:ellipsis;
        }

        /* ── Nav ── */
        .sb-nav { flex:1; padding:10px 8px; display:flex; flex-direction:column; gap:1px; overflow-y:auto; scrollbar-width:none; }
        .sb-nav::-webkit-scrollbar { display:none; }

        .sb-section-label {
          font-family:'DM Mono',monospace; font-size:9px;
          letter-spacing:1.6px; text-transform:uppercase;
          color:rgba(255,255,255,0.18); padding:10px 10px 4px;
          white-space:nowrap;
          opacity:${collapsed ? 0 : 1}; transition:opacity .2s;
        }

        .sb-item {
          display:flex; align-items:center;
          gap:12px; padding:${collapsed ? '11px' : '10px 12px'};
          border-radius:10px; cursor:pointer;
          transition:all .2s ease; position:relative;
          border:1px solid transparent;
          justify-content:${collapsed ? 'center' : 'flex-start'};
        }
        .sb-item:hover { background:rgba(99,102,241,0.08); border-color:rgba(99,102,241,0.1); }
        .sb-item:hover .sb-icon { color:rgba(255,255,255,0.75); }
        .sb-item:hover .sb-ilabel { color:rgba(255,255,255,0.85); }

        .sb-item.active {
          background:linear-gradient(135deg,rgba(99,102,241,0.18),rgba(139,92,246,0.1));
          border-color:rgba(99,102,241,0.22);
          box-shadow:0 0 24px rgba(99,102,241,0.08), inset 0 1px 0 rgba(255,255,255,0.04);
        }
        .sb-item.active::before {
          content:''; position:absolute; left:0; top:20%; bottom:20%;
          width:3px; background:linear-gradient(180deg,#6366f1,#8b5cf6);
          border-radius:0 3px 3px 0;
        }
        .sb-item.active .sb-icon { color:#818cf8; filter:drop-shadow(0 0 5px rgba(129,140,248,0.55)); }
        .sb-item.active .sb-ilabel { color:#c7d2fe; font-weight:600; }

        .sb-icon { width:17px;height:17px; color:rgba(255,255,255,0.35); flex-shrink:0; transition:all .2s; }
        .sb-ilabel {
          font-family:'Syne',sans-serif; font-size:12.5px; font-weight:500;
          color:rgba(255,255,255,0.45); white-space:nowrap;
          opacity:${collapsed ? 0 : 1}; transition:opacity .2s, color .2s;
        }
        .sb-badge {
          margin-left:auto; padding:2px 6px;
          background:linear-gradient(135deg,#6366f1,#8b5cf6);
          color:#fff; font-size:9px; font-weight:700;
          font-family:'DM Mono',monospace; border-radius:20px;
          opacity:${collapsed ? 0 : 1}; transition:opacity .2s;
        }
        .sb-tip {
          display:${collapsed ? 'block' : 'none'};
          position:absolute; left:62px;
          background:#1c2340; color:rgba(255,255,255,0.9);
          font-size:11.5px; font-family:'Syne',sans-serif;
          padding:5px 10px; border-radius:7px; white-space:nowrap;
          border:1px solid rgba(99,102,241,0.2);
          pointer-events:none; opacity:0; transition:opacity .15s;
          z-index:100; box-shadow:0 4px 14px rgba(0,0,0,0.35);
        }
        .sb-item:hover .sb-tip { opacity:1; }

        /* ── Footer ── */
        .sb-foot { padding:10px 8px; border-top:1px solid rgba(255,255,255,0.04); display:flex; flex-direction:column; gap:1px; }
        .sb-fitem {
          display:flex; align-items:center; gap:12px;
          padding:${collapsed ? '10px' : '9px 12px'};
          border-radius:10px; cursor:pointer;
          color:rgba(255,255,255,0.3); transition:all .2s;
          border:1px solid transparent;
          justify-content:${collapsed ? 'center' : 'flex-start'};
          position:relative;
        }
        .sb-fitem:hover { background:rgba(255,255,255,0.04); color:rgba(255,255,255,0.6); }
        .sb-fitem.danger:hover { background:rgba(239,68,68,0.08); color:rgba(239,68,68,0.7); border-color:rgba(239,68,68,0.1); }
        .sb-fitem svg { width:15px;height:15px;flex-shrink:0; }
        .sb-fitem span {
          font-size:12px; font-family:'Syne',sans-serif; white-space:nowrap;
          opacity:${collapsed ? 0 : 1}; transition:opacity .2s;
        }
        .sb-ftip { display:${collapsed ? 'block' : 'none'}; position:absolute; left:62px; background:#1c2340; color:rgba(255,255,255,0.9); font-size:11.5px; font-family:'Syne',sans-serif; padding:5px 10px; border-radius:7px; white-space:nowrap; border:1px solid rgba(99,102,241,0.2); pointer-events:none; opacity:0; transition:opacity .15s; z-index:100; box-shadow:0 4px 14px rgba(0,0,0,0.35); }
        .sb-fitem:hover .sb-ftip { opacity:1; }

        /* ── Collapse toggle ── */
        .sb-toggle {
          position:absolute; right:-13px; top:50%; transform:translateY(-50%);
          width:26px;height:26px;
          background:#151d35; border:1px solid rgba(99,102,241,0.22); border-radius:50%;
          display:flex; align-items:center; justify-content:center;
          cursor:pointer; color:rgba(255,255,255,0.45); transition:all .2s;
          box-shadow:0 2px 10px rgba(0,0,0,0.35); z-index:20;
        }
        .sb-toggle:hover { background:#6366f1; color:#fff; border-color:#6366f1; box-shadow:0 0 14px rgba(99,102,241,0.5); }
      `}</style>

      <aside className="sb">
        {/* Header */}
        <div className="sb-head">
          <div className="sb-logo">CP</div>
          <div className="sb-brand">
            <div className="sb-brand-name">CareerPath</div>
            <div className="sb-brand-sub">AI Platform</div>
          </div>
        </div>

        {/* User */}
        <div className="sb-user">
          <div className="sb-avatar">
            SJ <div className="sb-dot" />
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
            <div key={id} className={`sb-item${activeTab === id ? ' active' : ''}`} onClick={() => onTabChange(id)}>
              <Icon className="sb-icon" />
              <span className="sb-ilabel">{label}</span>
              {badge && <span className="sb-badge">{badge}</span>}
              <div className="sb-tip">{label}</div>
            </div>
          ))}

          <div className="sb-section-label" style={{ marginTop: 8 }}>Support</div>
          {NAV_ITEMS.filter(i => i.group === 'support').map(({ id, label, icon: Icon }) => (
            <div key={id} className={`sb-item${activeTab === id ? ' active' : ''}`} onClick={() => onTabChange(id)}>
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

        {/* Toggle */}
        <div className="sb-toggle" onClick={() => setCollapsed(!collapsed)}>
          {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
        </div>
      </aside>
    </>
  );
}