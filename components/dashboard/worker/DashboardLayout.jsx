// components/dashboard/worker/DashboardLayout.jsx
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from './Sidebar';
import { Bell } from 'lucide-react';
import AccessibilityPanel from '@/components/accessibility/AccessibilityPanel';
import { auth } from '@/lib/firebase';
import { storage } from '@/lib/storage';

function getInitials() {
  // Try storage first
  const { profile } = storage.get();
  if (profile?.avatarInitials) return profile.avatarInitials;
  if (profile?.firstName || profile?.lastName) {
    return ((profile.firstName?.[0] || '') + (profile.lastName?.[0] || '')).toUpperCase();
  }
  // Fall back to Firebase displayName
  const name = auth.currentUser?.displayName || '';
  const parts = name.trim().split(' ');
  return ((parts[0]?.[0] || '') + (parts[1]?.[0] || '')).toUpperCase() || '?';
}

export default function DashboardLayout({ children }) {
  const [activeTab, setActiveTab]       = useState('dashboard');
  const [showNotif, setShowNotif]       = useState(false);
  const router                          = useRouter();
  const capitalize = s => s.charAt(0).toUpperCase() + s.slice(1);
  const initials = getInitials();

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Instrument+Sans:wght@400;500;600;700&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .dl-shell {
          display: flex;
          min-height: 100vh;
          background-color: #F0F2F7;
          background-image:
            radial-gradient(ellipse 90% 60% at 70% 10%, rgba(45,184,160,0.06) 0%, transparent 65%),
            radial-gradient(ellipse 60% 40% at 10% 90%, rgba(26,39,68,0.05) 0%, transparent 65%);
          color: #1A2744;
          font-family: 'Instrument Sans', sans-serif;
        }

        .dl-main { flex: 1; display: flex; flex-direction: column; min-width: 0; overflow: hidden; }

        .dl-topbar {
          height: 58px;
          border-bottom: 1px solid rgba(26,39,68,0.10);
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 36px;
          background: rgba(240,242,247,0.88);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          position: sticky; top: 0; z-index: 10; flex-shrink: 0;
        }

        .dl-bc {
          font-family: 'Instrument Sans', sans-serif;
          font-size: 12.5px; color: rgba(26,39,68,0.38);
          display: flex; align-items: center; gap: 8px; letter-spacing: 0.1px;
        }
        .dl-bc-sep    { color: rgba(26,39,68,0.20); }
        .dl-bc-active { color: rgba(26,39,68,0.75); font-weight: 600; }

        .dl-tr { display: flex; align-items: center; gap: 10px; }

        .dl-date {
          font-family: 'Instrument Sans', sans-serif;
          font-size: 11.5px; color: rgba(26,39,68,0.38); letter-spacing: 0.3px;
        }

        .dl-notif {
          position: relative; width: 36px; height: 36px;
          border: 1px solid rgba(26,39,68,0.15); border-radius: 10px;
          background: rgba(255,255,255,0.75); backdrop-filter: blur(6px);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: all .2s; color: rgba(26,39,68,0.50);
          box-shadow: 0 1px 4px rgba(26,39,68,0.08);
        }
        .dl-notif:hover {
          background: rgba(255,255,255,0.95);
          border-color: rgba(45,184,160,0.35);
          color: #1A7A6E;
          box-shadow: 0 2px 10px rgba(45,184,160,0.12);
        }
        .dl-nd {
          position: absolute; top: 7px; right: 7px;
          width: 7px; height: 7px; background: #2DB8A0;
          border-radius: 50%; border: 1.5px solid #F0F2F7;
        }

        /* ── Notification dropdown ── */
        .dl-notif-wrap { position: relative; }
        .dl-notif-panel {
          position: absolute; top: 44px; right: 0;
          width: 300px;
          background: rgba(255,255,255,0.98);
          border: 1px solid rgba(26,39,68,0.12);
          border-radius: 14px;
          box-shadow: 0 12px 40px rgba(26,39,68,0.16);
          overflow: hidden;
          z-index: 100;
          animation: notif-in .18s cubic-bezier(0.4,0,0.2,1);
        }
        @keyframes notif-in {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .dl-notif-head {
          padding: 14px 18px;
          border-bottom: 1px solid rgba(26,39,68,0.08);
          font-weight: 700; font-size: 13px; color: #1A2744;
          font-family: 'Instrument Sans', sans-serif;
          display: flex; align-items: center; justify-content: space-between;
        }
        .dl-notif-mark {
          font-size: 11px; font-weight: 500; color: #2DB8A0;
          cursor: pointer; background: none; border: none;
          font-family: 'Instrument Sans', sans-serif;
        }
        .dl-notif-item {
          padding: 13px 18px;
          border-bottom: 1px solid rgba(26,39,68,0.06);
          display: flex; gap: 12px; align-items: flex-start;
        }
        .dl-notif-dot {
          width: 8px; height: 8px; border-radius: 50%;
          background: #2DB8A0; flex-shrink: 0; margin-top: 5px;
        }
        .dl-notif-dot.read { background: rgba(26,39,68,0.18); }
        .dl-notif-text {
          font-size: 12.5px; color: #1A2744; line-height: 1.5;
          font-family: 'Instrument Sans', sans-serif;
        }
        .dl-notif-time {
          font-size: 11px; color: rgba(26,39,68,0.40);
          margin-top: 3px; font-family: 'Instrument Sans', sans-serif;
        }
        .dl-notif-empty {
          padding: 28px 18px; text-align: center;
          font-size: 13px; color: rgba(26,39,68,0.40);
          font-family: 'Instrument Sans', sans-serif;
        }

        /* ── Avatar button ── */
        .dl-av {
          width: 34px; height: 34px;
          background: linear-gradient(135deg, #1A2744, #2D3F6B);
          border-radius: 50%; display: flex; align-items: center; justify-content: center;
          font-size: 11px; font-weight: 700; color: #fff; cursor: pointer;
          font-family: 'Instrument Sans', sans-serif; letter-spacing: 0.3px;
          box-shadow: 0 2px 8px rgba(26,39,68,0.25);
          border: none; transition: all .2s;
        }
        .dl-av:hover {
          box-shadow: 0 4px 14px rgba(26,39,68,0.35);
          transform: translateY(-1px);
        }

        .dl-content {
          flex: 1; overflow-y: auto;
          scrollbar-width: thin; scrollbar-color: rgba(26,39,68,0.15) transparent;
        }
        .dl-content::-webkit-scrollbar { width: 5px; }
        .dl-content::-webkit-scrollbar-thumb { background: rgba(26,39,68,0.15); border-radius: 10px; }
      `}</style>

      <div className="dl-shell">
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
        <div className="dl-main">
          <div className="dl-topbar">
            <div className="dl-bc">
              <span>InklusiJobs</span>
              <span className="dl-bc-sep">/</span>
              <span className="dl-bc-active">{capitalize(activeTab)}</span>
            </div>
            <div className="dl-tr">
              <span className="dl-date">
                {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
              </span>

              {/* ✅ Notifications dropdown */}
              <div className="dl-notif-wrap">
                <div className="dl-notif" onClick={() => setShowNotif(v => !v)}>
                  <Bell size={14} />
                  <div className="dl-nd" />
                </div>
                {showNotif && (
                  <>
                    {/* Click outside to close */}
                    <div style={{ position: 'fixed', inset: 0, zIndex: 99 }} onClick={() => setShowNotif(false)} />
                    <div className="dl-notif-panel">
                      <div className="dl-notif-head">
                        Notifications
                        <button className="dl-notif-mark">Mark all read</button>
                      </div>
                      {/* Sample notifications — replace with real data later */}
                      <div className="dl-notif-item">
                        <div className="dl-notif-dot" />
                        <div>
                          <div className="dl-notif-text">Your assessment results are ready to view.</div>
                          <div className="dl-notif-time">2 hours ago</div>
                        </div>
                      </div>
                      <div className="dl-notif-item">
                        <div className="dl-notif-dot" />
                        <div>
                          <div className="dl-notif-text">New job match: UI/UX Designer at TechCorp.</div>
                          <div className="dl-notif-time">Yesterday</div>
                        </div>
                      </div>
                      <div className="dl-notif-item">
                        <div className="dl-notif-dot read" />
                        <div>
                          <div className="dl-notif-text">Complete your profile to get better matches.</div>
                          <div className="dl-notif-time">3 days ago</div>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* ✅ Avatar → goes to settings/profile */}
              <button
                className="dl-av"
                onClick={() => router.push('/dashboard/worker/settings')}
                title="Go to profile settings"
              >
                {initials}
              </button>
            </div>
          </div>
          <div className="dl-content">
            {children}
          </div>
        </div>
      </div>
      <AccessibilityPanel />
    </>
  );
}