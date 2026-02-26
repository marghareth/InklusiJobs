'use client';

import AccessibilityPanel from '@/components/accessibility/AccessibilityPanel';
import { useState } from 'react';
import Sidebar from './Sidebar';
import DashboardHome from './DashboardHome';
import PlaceholderPage from './PlaceholderPage';
import JobsPageMain from '../jobs/JobsPageMain.jsx';
import { Bell } from 'lucide-react';
import SettingsPage from './SettingsPage';
import PortfolioPage from './portfolio/PortfolioPage';
import TrackerPage from './TrackerPage';

const PAGE_CONFIG = {
  dashboard:  { component: <DashboardHome /> },
  roadmap:    { component: <PlaceholderPage title="Roadmap"    icon="🗺️" description="Your personalised skill roadmap will be built from your career goals and current capabilities." /> },
  challenges: { component: <PlaceholderPage title="Challenges" icon="⚡" description="Browse and tackle hands-on coding challenges matched to your skill level and target role." /> },
  tracker:    { component: <TrackerPage /> },
  portfolio:  { component: <PortfolioPage /> },
  jobs:       { component: <JobsPageMain /> },
  feedback:   { component: <PlaceholderPage title="Feedback"   icon="💬" description="Get AI-powered feedback on your submissions and request mentor reviews." /> },
  settings:   { component: <SettingsPage /> },
};

export default function DashboardLayout() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const capitalize = s => s.charAt(0).toUpperCase() + s.slice(1);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Instrument+Sans:wght@400;500;600;700&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .dl-shell {
          display: flex;
          min-height: 100vh;
          background-color: #F9F8F6;
          background-image:
            radial-gradient(ellipse 90% 60% at 70% 10%, rgba(180,160,130,0.07) 0%, transparent 65%),
            radial-gradient(ellipse 60% 40% at 10% 90%, rgba(107,143,113,0.05) 0%, transparent 65%);
          color: #2C2A27;
          font-family: 'Instrument Sans', sans-serif;
        }

        .dl-main { flex: 1; display: flex; flex-direction: column; min-width: 0; overflow: hidden; }

        .dl-topbar {
          height: 58px;
          border-bottom: 1px solid rgba(180,160,130,0.18);
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 36px;
          background: rgba(249,248,246,0.82);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          position: sticky; top: 0; z-index: 10; flex-shrink: 0;
        }

        .dl-bc {
          font-family: 'Instrument Sans', sans-serif;
          font-size: 12.5px; color: rgba(44,42,39,0.38);
          display: flex; align-items: center; gap: 8px; letter-spacing: 0.1px;
        }
        .dl-bc-sep { color: rgba(44,42,39,0.2); }
        .dl-bc-active { color: rgba(44,42,39,0.75); font-weight: 600; }

        .dl-tr { display: flex; align-items: center; gap: 10px; }

        .dl-date {
          font-family: 'Instrument Sans', sans-serif;
          font-size: 11.5px; color: rgba(44,42,39,0.38); letter-spacing: 0.3px;
        }

        .dl-notif {
          position: relative; width: 36px; height: 36px;
          border: 1px solid rgba(180,160,130,0.28); border-radius: 10px;
          background: rgba(255,255,255,0.6); backdrop-filter: blur(6px);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: all .2s; color: rgba(44,42,39,0.5);
          box-shadow: 0 1px 4px rgba(180,160,130,0.1);
        }
        .dl-notif:hover {
          background: rgba(255,255,255,0.9);
          border-color: rgba(180,160,130,0.45);
          color: rgba(44,42,39,0.8);
          box-shadow: 0 2px 10px rgba(180,160,130,0.15);
        }
        .dl-nd {
          position: absolute; top: 7px; right: 7px;
          width: 7px; height: 7px; background: #C4704F;
          border-radius: 50%; border: 1.5px solid #F9F8F6;
        }

        .dl-av {
          width: 34px; height: 34px;
          background: linear-gradient(135deg, #6B8F71, #5B6B8A);
          border-radius: 50%; display: flex; align-items: center; justify-content: center;
          font-size: 11px; font-weight: 700; color: #fff; cursor: pointer;
          font-family: 'Instrument Sans', sans-serif; letter-spacing: 0.3px;
          box-shadow: 0 2px 8px rgba(107,143,113,0.25);
        }

        .dl-content {
          flex: 1; overflow-y: auto;
          scrollbar-width: thin; scrollbar-color: rgba(180,160,130,0.3) transparent;
        }
        .dl-content::-webkit-scrollbar { width: 5px; }
        .dl-content::-webkit-scrollbar-thumb { background: rgba(180,160,130,0.3); border-radius: 10px; }
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
              <div className="dl-notif">
                <Bell size={14} />
                <div className="dl-nd" />
              </div>
              <div className="dl-av">SJ</div>
            </div>
          </div>
          <div className="dl-content">
            {PAGE_CONFIG[activeTab]?.component}
          </div>
        </div>
      </div>
      <AccessibilityPanel />
    </>
  );
}