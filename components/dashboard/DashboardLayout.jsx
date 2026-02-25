'use client';

import { useState } from 'react';
import Sidebar from './Sidebar';
import DashboardHome from './DashboardHome';
import PlaceholderPage from './PlaceholderPage';
import JobsPageMain from './jobs/JobsPageMain';  // Import the new Jobs page
import { Bell } from 'lucide-react';

const PAGE_CONFIG = {
  dashboard:  { component: <DashboardHome /> },
  roadmap:    { component: <PlaceholderPage title="Roadmap" icon="🗺️" description="Your personalised skill roadmap will be built from your career goals and current capabilities." /> },
  challenges: { component: <PlaceholderPage title="Challenges" icon="⚡" description="Browse and tackle hands-on coding challenges matched to your skill level and target role." /> },
  portfolio:  { component: <PlaceholderPage title="Portfolio" icon="🗂️" description="Showcase your completed projects and challenge submissions to potential employers." /> },
  jobs:       { component: <JobsPageMain /> },  // ← REPLACED placeholder with real JobsPageMain
  feedback:   { component: <PlaceholderPage title="Feedback" icon="💬" description="Get AI-powered feedback on your submissions and request mentor reviews." /> },
  settings:   { component: <PlaceholderPage title="Settings" icon="⚙️" description="Manage your account, preferences, notifications, and privacy options." /> },
};

export default function DashboardLayout() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const capitalize = s => s.charAt(0).toUpperCase() + s.slice(1);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Mono:wght@400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .dl-shell {
          display: flex;
          min-height: 100vh;
          background: #0d1117;
          background-image:
            radial-gradient(ellipse 80% 50% at 50% -10%, rgba(99,102,241,0.08) 0%, transparent 60%),
            radial-gradient(ellipse 60% 40% at 80% 80%, rgba(139,92,246,0.05) 0%, transparent 60%);
          color: #fff;
          font-family: 'Syne', sans-serif;
        }
        .dl-main { flex: 1; display: flex; flex-direction: column; min-width: 0; overflow: hidden; }
        .dl-topbar {
          height: 56px;
          border-bottom: 1px solid rgba(255,255,255,0.04);
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 32px;
          background: rgba(13,17,23,0.7);
          backdrop-filter: blur(12px);
          position: sticky; top: 0; z-index: 10; flex-shrink: 0;
        }
        .dl-bc { font-size: 12.5px; color: rgba(255,255,255,0.35); font-family: 'DM Mono', monospace; display: flex; align-items: center; gap: 8px; }
        .dl-bc-sep { color: rgba(255,255,255,0.15); }
        .dl-bc-active { color: rgba(255,255,255,0.7); font-weight: 500; }
        .dl-tr { display: flex; align-items: center; gap: 10px; }
        .dl-date { font-family: 'DM Mono', monospace; font-size: 11px; color: rgba(255,255,255,0.25); }
        .dl-notif {
          position: relative; width: 34px; height: 34px;
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 10px; background: rgba(255,255,255,0.03);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: all .2s; color: rgba(255,255,255,0.45);
        }
        .dl-notif:hover { background: rgba(255,255,255,0.07); color: rgba(255,255,255,0.7); }
        .dl-nd { position: absolute; top: 6px; right: 7px; width: 7px; height: 7px; background: #ef4444; border-radius: 50%; border: 1.5px solid #0d1117; }
        .dl-av { width: 32px; height: 32px; background: linear-gradient(135deg,#6366f1,#8b5cf6); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 700; color: #fff; cursor: pointer; font-family: 'Syne', sans-serif; }
        .dl-content { flex: 1; overflow-y: auto; scrollbar-width: thin; scrollbar-color: rgba(99,102,241,0.2) transparent; }
        .dl-content::-webkit-scrollbar { width: 5px; }
        .dl-content::-webkit-scrollbar-thumb { background: rgba(99,102,241,0.2); border-radius: 10px; }
      `}</style>

      <div className="dl-shell">
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
        <div className="dl-main">
          <div className="dl-topbar">
            <div className="dl-bc">
              <span>CareerPath AI</span>
              <span className="dl-bc-sep">/</span>
              <span className="dl-bc-active">{capitalize(activeTab)}</span>
            </div>
            <div className="dl-tr">
              <div className="dl-date">{new Date().toLocaleDateString('en-US', { weekday:'short', month:'short', day:'numeric' })}</div>
              <div className="dl-notif"><Bell size={14} /><div className="dl-nd" /></div>
              <div className="dl-av">SJ</div>
            </div>
          </div>
          <div className="dl-content">
            {PAGE_CONFIG[activeTab]?.component}
          </div>
        </div>
      </div>
    </>
  );
}