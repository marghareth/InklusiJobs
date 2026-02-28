// components/dashboard/worker/Sidebar.jsx
"use client";

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Map, Zap, Briefcase, Search,
  MessageSquare, Settings, ChevronLeft, ChevronRight,
  Bell, LogOut, BarChart2,
} from 'lucide-react';

const NAV_ITEMS = [
  { id: 'dashboard',  label: 'Dashboard',  icon: LayoutDashboard, path: '/dashboard/worker', group: 'main' },
  { id: 'roadmap',    label: 'Roadmap',    icon: Map,             path: '/roadmap', group: 'main' },
  { id: 'challenges', label: 'Challenges', icon: Zap,             path: '/challenges', group: 'main' },
  { id: 'portfolio',  label: 'Portfolio',  icon: Briefcase,       path: '/dashboard/worker/portfolio', group: 'main' },
  { id: 'tracker',    label: 'Tracker',    icon: BarChart2,       path: '/dashboard/worker/tracker', group: 'main' },
  { id: 'jobs',       label: 'Jobs',       icon: Search,          path: '/jobs', group: 'main', badge: '3' },
  { id: 'feedback',   label: 'Feedback',   icon: MessageSquare,   path: '/feedback', group: 'support' },
  { id: 'settings',   label: 'Settings',   icon: Settings,        path: '/dashboard/worker/settings', group: 'support' },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const w = collapsed ? '72px' : '240px';

  // Check if current path matches item path
  const isActive = (path) => pathname === path;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lexend:wght@300;400;500;600;700;800&display=swap');

        .sb {
          width: ${w};
          min-height: 100vh;
          background: linear-gradient(175deg, #0D1829 0%, #1A2744 40%, #1E3055 70%, #111D38 100%);
          border-right: 1px solid rgba(255,255,255,0.06);
          display: flex;
          flex-direction: column;
          transition: width 0.32s cubic-bezier(0.4,0,0.2,1);
          position: relative;
          flex-shrink: 0;
          overflow: hidden;
        }

        .sb::before {
          content: '';
          position: absolute; inset: 0; pointer-events: none;
          background:
            radial-gradient(ellipse 100% 35% at 50% 0%, rgba(45,184,160,0.18) 0%, transparent 70%),
            radial-gradient(ellipse 70% 25% at 80% 100%, rgba(45,184,160,0.10) 0%, transparent 70%);
        }

        .sb::after {
          content: '';
          position: absolute; top: 0; left: 0; right: 0; height: 2.5px;
          background: linear-gradient(90deg, transparent 0%, rgba(45,184,160,0.55) 25%, #2DB8A0 50%, rgba(45,184,160,0.55) 75%, transparent 100%);
          pointer-events: none;
        }

        .sb-head {
          padding: ${collapsed ? '20px 16px' : '22px 20px'};
          display: flex; align-items: center; gap: 12px;
          border-bottom: 1px solid rgba(255,255,255,0.07);
          min-height: 76px;
          transition: padding .3s;
        }

        .sb-logo {
          width: 36px; height: 36px; flex-shrink: 0;
          background: rgba(45,184,160,0.22);
          border: 1.5px solid rgba(45,184,160,0.45);
          border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          font-family: 'Lexend', sans-serif;
          font-weight: 700; font-size: 13px; color: #fff;
          box-shadow: 0 2px 10px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.20);
        }

        .sb-brand {
          overflow: hidden;
          opacity: ${collapsed ? 0 : 1};
          transform: translateX(${collapsed ? '-6px' : '0'});
          transition: opacity .2s ease, transform .2s ease;
          white-space: nowrap;
        }
        .sb-brand-name {
          font-family: 'Lexend', sans-serif;
          font-weight: 700; font-size: 15px;
          color: #FFFFFF;
          letter-spacing: -.3px; line-height: 1.2;
        }
        .sb-brand-sub {
          font-family: 'Lexend', sans-serif;
          font-size: 9.5px; font-weight: 500;
          color: rgba(45,184,160,0.80);
          letter-spacing: 1.4px; text-transform: uppercase;
          margin-top: 2px;
        }

        .sb-user {
          padding: ${collapsed ? '14px 12px' : '14px 20px'};
          border-bottom: 1px solid rgba(255,255,255,0.07);
          display: flex; align-items: center; gap: 12px;
          transition: padding .3s;
        }
        .sb-avatar {
          width: 38px; height: 38px; flex-shrink: 0;
          background: rgba(45,184,160,0.25);
          border: 1.5px solid rgba(45,184,160,0.45);
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-family: 'Lexend', sans-serif;
          font-weight: 700; font-size: 12px; color: #fff;
          position: relative;
        }
        .sb-dot {
          position: absolute; bottom: 1px; right: 1px;
          width: 9px; height: 9px;
          background: #2DB8A0;
          border-radius: 50%;
          border: 2px solid #1A2744;
          box-shadow: 0 0 0 1.5px rgba(45,184,160,0.4);
        }
        .sb-uinfo {
          overflow: hidden;
          opacity: ${collapsed ? 0 : 1};
          transition: opacity .2s;
        }
        .sb-uname {
          font-family: 'Lexend', sans-serif;
          font-weight: 600; font-size: 13px;
          color: #FFFFFF;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .sb-uemail {
          font-family: 'Lexend', sans-serif;
          font-size: 10.5px; font-weight: 300;
          color: rgba(45,184,160,0.70);
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
          margin-top: 1px;
        }

        .sb-nav {
          flex: 1; padding: 10px 8px;
          display: flex; flex-direction: column; gap: 1px;
          overflow-y: auto; scrollbar-width: none;
        }
        .sb-nav::-webkit-scrollbar { display: none; }

        .sb-section-label {
          font-family: 'Lexend', sans-serif;
          font-size: 9px; font-weight: 600;
          letter-spacing: 1.8px; text-transform: uppercase;
          color: rgba(45,184,160,0.60);
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
          transition: all .18s ease; position: relative;
          border: 1px solid transparent;
          justify-content: ${collapsed ? 'center' : 'flex-start'};
          text-decoration: none;
        }
        .sb-item:hover {
          background: rgba(255,255,255,0.08);
          border-color: rgba(255,255,255,0.10);
        }
        .sb-item:hover .sb-icon   { color: #FFFFFF; }
        .sb-item:hover .sb-ilabel { color: #FFFFFF; font-weight: 500; }

        .sb-item.active {
          background: rgba(45,184,160,0.15);
          border-color: rgba(45,184,160,0.25);
          box-shadow: 0 2px 12px rgba(0,0,0,0.12), inset 0 1px 0 rgba(45,184,160,0.18);
        }
        .sb-item.active::before {
          content: ''; position: absolute; left: 0; top: 16%; bottom: 16%;
          width: 3px;
          background: #2DB8A0;
          border-radius: 0 3px 3px 0;
          box-shadow: 0 0 8px rgba(45,184,160,0.6);
        }
        .sb-item.active .sb-icon   { color: #2DB8A0; }
        .sb-item.active .sb-ilabel { color: #FFFFFF; font-weight: 600; }

        .sb-icon {
          width: 17px; height: 17px; flex-shrink: 0;
          color: rgba(255,255,255,0.60);
          transition: color .18s;
        }
        .sb-ilabel {
          font-family: 'Lexend', sans-serif;
          font-size: 13px; font-weight: 400;
          color: rgba(255,255,255,0.82);
          white-space: nowrap;
          opacity: ${collapsed ? 0 : 1};
          transition: opacity .2s, color .18s, font-weight .18s;
          letter-spacing: -0.1px;
        }
        .sb-badge {
          margin-left: auto; padding: 2px 7px;
          background: rgba(45,184,160,0.22);
          border: 1px solid rgba(45,184,160,0.40);
          color: #2DB8A0;
          font-size: 9px; font-weight: 700;
          font-family: 'Lexend', sans-serif;
          border-radius: 20px;
          opacity: ${collapsed ? 0 : 1};
          transition: opacity .2s;
        }

        .sb-tip {
          display: ${collapsed ? 'block' : 'none'};
          position: absolute; left: 62px;
          background: rgba(13,24,41,0.97);
          backdrop-filter: blur(10px);
          color: #FFFFFF;
          font-size: 12px;
          font-family: 'Lexend', sans-serif;
          font-weight: 500;
          padding: 5px 11px; border-radius: 7px; white-space: nowrap;
          border: 1px solid rgba(45,184,160,0.22);
          pointer-events: none; opacity: 0; transition: opacity .15s;
          z-index: 100;
          box-shadow: 0 4px 16px rgba(0,0,0,0.30);
        }
        .sb-item:hover .sb-tip { opacity: 1; }

        .sb-foot {
          padding: 10px 8px;
          border-top: 1px solid rgba(255,255,255,0.07);
          display: flex; flex-direction: column; gap: 1px;
        }
        .sb-fitem {
          display: flex; align-items: center; gap: 12px;
          padding: ${collapsed ? '10px' : '9px 12px'};
          border-radius: 10px; cursor: pointer;
          color: rgba(255,255,255,0.50);
          transition: all .18s;
          border: 1px solid transparent;
          justify-content: ${collapsed ? 'center' : 'flex-start'};
          position: relative;
          text-decoration: none;
        }
        .sb-fitem:hover {
          background: rgba(255,255,255,0.07);
          color: rgba(255,255,255,0.90);
        }
        .sb-fitem.danger:hover {
          background: rgba(220,70,70,0.10);
          color: rgba(255,140,130,0.95);
          border-color: rgba(220,70,70,0.15);
        }
        .sb-fitem svg { width: 15px; height: 15px; flex-shrink: 0; }
        .sb-fitem span {
          font-size: 13px;
          font-family: 'Lexend', sans-serif;
          font-weight: 400;
          color: rgba(255,255,255,0.65);
          white-space: nowrap;
          opacity: ${collapsed ? 0 : 1};
          transition: opacity .2s, color .18s;
        }
        .sb-fitem:hover span { color: rgba(255,255,255,0.92); }
        .sb-fitem.danger:hover span { color: rgba(255,140,130,0.95); }

        .sb-ftip {
          display: ${collapsed ? 'block' : 'none'};
          position: absolute; left: 62px;
          background: rgba(13,24,41,0.97);
          backdrop-filter: blur(10px);
          color: #FFFFFF;
          font-size: 12px;
          font-family: 'Lexend', sans-serif;
          font-weight: 500;
          padding: 5px 11px; border-radius: 7px; white-space: nowrap;
          border: 1px solid rgba(45,184,160,0.22);
          pointer-events: none; opacity: 0; transition: opacity .15s;
          z-index: 100; box-shadow: 0 4px 16px rgba(0,0,0,0.30);
        }
        .sb-fitem:hover .sb-ftip { opacity: 1; }

        .sb-toggle {
          position: absolute; right: -13px; top: 50%; transform: translateY(-50%);
          width: 26px; height: 26px;
          background: #1A2744;
          border: 1.5px solid rgba(45,184,160,0.35);
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; color: rgba(255,255,255,0.70);
          transition: all .2s;
          box-shadow: 0 2px 10px rgba(0,0,0,0.30);
          z-index: 20;
        }
        .sb-toggle:hover {
          background: rgba(45,184,160,0.22);
          color: #fff;
          border-color: rgba(45,184,160,0.60);
          box-shadow: 0 0 14px rgba(45,184,160,0.25);
        }
      `}</style>

      <aside className="sb">
        <Link href="/dashboard/worker" className="sb-head" style={{ textDecoration: 'none' }}>
          <div className="sb-logo">IJ</div>
          <div className="sb-brand">
            <div className="sb-brand-name">InklusiJobs</div>
            <div className="sb-brand-sub">AI Platform</div>
          </div>
        </Link>

        <div className="sb-user">
          <div className="sb-avatar">
            SJ<div className="sb-dot" />
          </div>
          <div className="sb-uinfo">
            <div className="sb-uname">Sarah Johnson</div>
            <div className="sb-uemail">sarah.johnson@email.com</div>
          </div>
        </div>

        <nav className="sb-nav">
          <div className="sb-section-label">Main Menu</div>
          {NAV_ITEMS.filter(i => i.group === 'main').map(({ id, label, icon: Icon, path, badge }) => (
            <Link
              key={id}
              href={path}
              className={`sb-item${isActive(path) ? ' active' : ''}`}
            >
              <Icon className="sb-icon" />
              <span className="sb-ilabel">{label}</span>
              {badge && <span className="sb-badge">{badge}</span>}
              <div className="sb-tip">{label}</div>
            </Link>
          ))}

          <div className="sb-section-label" style={{ marginTop: 8 }}>Support</div>
          {NAV_ITEMS.filter(i => i.group === 'support').map(({ id, label, icon: Icon, path }) => (
            <Link
              key={id}
              href={path}
              className={`sb-item${isActive(path) ? ' active' : ''}`}
            >
              <Icon className="sb-icon" />
              <span className="sb-ilabel">{label}</span>
              <div className="sb-tip">{label}</div>
            </Link>
          ))}
        </nav>

        <div className="sb-foot">
          <Link href="/notifications" className="sb-fitem">
            <Bell /><span>Notifications</span>
            <div className="sb-ftip">Notifications</div>
          </Link>
          <Link href="/api/auth/signout" className="sb-fitem danger">
            <LogOut /><span>Sign Out</span>
            <div className="sb-ftip">Sign Out</div>
          </Link>
        </div>

        <div className="sb-toggle" onClick={() => setCollapsed(!collapsed)}>
          {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
        </div>
      </aside>
    </>
  );
}