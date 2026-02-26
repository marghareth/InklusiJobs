"use client";
import { useState } from "react";
import PortfolioCSS from "./PortfolioCSS";
import { USER, SKILLS_DATA, CHALLENGES_DATA, INIT_BIO, INIT_HEADLINE, INIT_SECTIONS } from "./portfolioData";
import { TABS } from "./utils/constants";
import { 
  IcEye, IcShare, IcCheck, IcInfo, IcEdit2, IcSparkle, 
  IcLink, IcBell, IcX 
} from "./portfolio_components/Icons";
import StatPill from "./portfolio_components/StatPill";
import SkillRow from "./portfolio_components/SkillRow";
import ChallengeCard from "./portfolio_components/ChallengeCard";
import CustomSections from "./portfolio_components/CustomSections";
import EmployerPreview from "./portfolio_components/EmployerPreview";
import UpdateBanner from "./portfolio_components/UpdateBanner";

export default function PortfolioPage() {
  const [tab, setTab] = useState("overview");
  const [bio, setBio] = useState(INIT_BIO);
  const [editBio, setEditBio] = useState(false);
  const [headline, setHeadline] = useState(INIT_HEADLINE);
  const [editHL, setEditHL] = useState(false);
  const [sections, setSections] = useState(INIT_SECTIONS);
  const [showPreview, setShowPreview] = useState(false);
  const [bannerOpen, setBannerOpen] = useState(true);
  const [copied, setCopied] = useState(false);

  const done = CHALLENGES_DATA.filter(c => c.status === "completed");
  const ongoing = CHALLENGES_DATA.filter(c => c.status === "ongoing");
  const totalPts = done.reduce((a, c) => a + c.pts, 0);
  const avgSkill = Math.round(SKILLS_DATA.reduce((a, s) => a + s.pct, 0) / SKILLS_DATA.length);

  const handleShare = () => {
    navigator.clipboard?.writeText("https://inklusijobs.ph/portfolio/sarah-johnson").then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2400);
    });
  };

  return (
    <>
      <PortfolioCSS />
      <div className="pf-root">
        {/* Banner */}
        {bannerOpen && (
          <UpdateBanner 
            lastUpdated={USER.lastUpdated} 
            prevUpdate={USER.prevUpdate} 
            onDismiss={() => setBannerOpen(false)} 
          />
        )}

        {/* Page Header */}
        <div className="pf-page-header">
          <div className="pf-page-header-l">
            <h1 className="pf-page-title">My Portfolio</h1>
            <p className="pf-page-sub">Showcase your verified profile and skills to potential employers</p>
          </div>
          <div className="pf-header-actions">
            <button className="pf-btn-outline" onClick={() => setShowPreview(true)}>
              <IcEye /> Employer Preview
            </button>
            <button className={`pf-btn-solid ${copied ? "pf-btn-copied" : ""}`} onClick={handleShare}>
              {copied ? <><IcCheck /> Copied!</> : <><IcShare /> Share Portfolio</>}
            </button>
          </div>
        </div>

        {/* Hero Card */}
        <div className="pf-hero-card">
          <div className="pf-av-col">
            <div className="pf-av-wrap">
              <div className="pf-av">{USER.initials}</div>
              <div className="pf-av-status" />
            </div>
            <div className="pf-av-since">
              <IcSparkle /> Member since {USER.memberSince}
            </div>
          </div>

          <div className="pf-info-col">
            <div className="pf-name-row">
              <h2 className="pf-name">{USER.name}</h2>
              <span className="pf-field-badge">{USER.field}</span>
            </div>

            {editHL ? (
              <div className="pf-hl-edit-row">
                <input
                  className="pf-hl-inp"
                  value={headline}
                  autoFocus
                  onChange={e => setHeadline(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter" || e.key === "Escape") setEditHL(false); }}
                  onBlur={() => setEditHL(false)}
                />
              </div>
            ) : (
              <div className="pf-hl-row">
                <p className="pf-headline">{headline}</p>
                <button className="pf-hl-edit-btn" onClick={() => setEditHL(true)}><IcEdit2 /></button>
              </div>
            )}

            <div className="pf-details-grid">
              <div className="pf-detail">
                <span className="pf-detail-k">Email</span>
                <span className="pf-detail-v">{USER.email}</span>
              </div>
              <div className="pf-detail">
                <span className="pf-detail-k">Phone</span>
                <span className="pf-detail-v">{USER.phone}</span>
              </div>
              <div className="pf-detail">
                <span className="pf-detail-k">Age</span>
                <span className="pf-detail-v">{USER.age} yrs · {USER.birthday}</span>
              </div>
              <div className="pf-detail">
                <span className="pf-detail-k">Address</span>
                <span className="pf-detail-v">{USER.address}</span>
              </div>
              <div className="pf-detail">
                <span className="pf-detail-k">Disability</span>
                <span className="pf-detail-v pf-detail-pwd">♿ {USER.disability}</span>
              </div>
              <div className="pf-detail">
                <span className="pf-detail-k">PWD ID No.</span>
                <span className="pf-detail-v pf-detail-code">{USER.pwdIdNo}</span>
              </div>
            </div>
          </div>

          <div className="pf-stats-col">
            <StatPill n={done.length} label="Completed" accent="#2D5016" />
            <StatPill n={ongoing.length} label="In Progress" accent="#7B6226" />
            <StatPill n={`${avgSkill}%`} label="Avg. Skill" accent="#4A7C59" />
            <StatPill n={totalPts.toLocaleString()} label="Total Points" accent="#5C6B54" />
          </div>
        </div>

        {/* Update strip */}
        <div className="pf-update-strip">
          <IcInfo />
          <span>
            Last updated <strong>{USER.lastUpdated}</strong>
            <span className="pf-update-prev"> · Previous: {USER.prevUpdate}</span>
          </span>
        </div>

        {/* Tabs */}
        <div className="pf-tabs-bar">
          {TABS.map(t => (
            <button
              key={t.id}
              className={`pf-tab ${tab === t.id ? "pf-tab-active" : ""}`}
              onClick={() => setTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="pf-content">
          {tab === "overview" && (
            <div className="pf-overview-grid">
              {/* Bio Card */}
              <div className="pf-card">
                <div className="pf-card-hd">
                  <h3 className="pf-card-title">About Me</h3>
                  <button className="pf-card-action" onClick={() => setEditBio(v => !v)}>
                    {editBio ? <><IcCheck /> Done</> : <><IcEdit2 /> Edit</>}
                  </button>
                </div>
                {editBio ? (
                  <textarea className="pf-bio-inp" value={bio} rows={6} onChange={e => setBio(e.target.value)} />
                ) : (
                  <p className="pf-bio-text">{bio}</p>
                )}
              </div>

              {/* Challenge Summary Card */}
              <div className="pf-card">
                <div className="pf-card-hd">
                  <h3 className="pf-card-title">Challenge Summary</h3>
                  <button className="pf-card-action" onClick={() => setTab("challenges")}>View all →</button>
                </div>
                <div className="pf-ch-sum-boxes">
                  <div className="pf-sum-box pf-sum-green">
                    <span className="pf-sum-n">{done.length}</span>
                    <span className="pf-sum-l">Completed</span>
                  </div>
                  <div className="pf-sum-box pf-sum-gold">
                    <span className="pf-sum-n">{ongoing.length}</span>
                    <span className="pf-sum-l">Ongoing</span>
                  </div>
                  <div className="pf-sum-box pf-sum-pts">
                    <span className="pf-sum-n">{totalPts.toLocaleString()}</span>
                    <span className="pf-sum-l">Points</span>
                  </div>
                </div>
                <div className="pf-ch-mini-list">
                  {CHALLENGES_DATA.slice(0, 3).map(ch => (
                    <div key={ch.id} className="pf-ch-mini-row">
                      <span className={`pf-mini-dot ${ch.status === "completed" ? "pf-mini-dot-done" : "pf-mini-dot-going"}`} />
                      <span className="pf-ch-mini-title">{ch.title}</span>
                      <span className="pf-ch-mini-pts">{ch.pts} pts</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Skills Preview Card */}
              <div className="pf-card">
                <div className="pf-card-hd">
                  <h3 className="pf-card-title">Top Skills</h3>
                  <button className="pf-card-action" onClick={() => setTab("skills")}>View all →</button>
                </div>
                <div className="pf-skill-list">
                  {SKILLS_DATA.slice(0, 4).map((s, i) => <SkillRow key={s.name} skill={s} i={i} compact />)}
                </div>
              </div>

              {/* Links Preview Card */}
              <div className="pf-card">
                <div className="pf-card-hd">
                  <h3 className="pf-card-title">Links & Profiles</h3>
                  <button className="pf-card-action" onClick={() => setTab("sections")}>Manage →</button>
                </div>
                <div className="pf-links-preview">
                  {sections.filter(s => s.type === "links").flatMap(s => s.items || []).length > 0 ? (
                    sections.filter(s => s.type === "links").flatMap(s => s.items || []).map(lk => (
                      <a key={lk.id} href={lk.url} target="_blank" rel="noopener noreferrer" className="pf-link-pill">
                        <IcLink /> {lk.label}
                      </a>
                    ))
                  ) : (
                    <p className="pf-empty-hint">No links yet — go to Custom Sections to add some.</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {tab === "skills" && (
            <>
              <div className="pf-card pf-card-wide">
                <div className="pf-card-hd">
                  <h3 className="pf-card-title">Skill Proficiency</h3>
                  <span className="pf-card-note">Auto-calculated from completed challenge assessments</span>
                </div>
                <div className="pf-skill-list pf-skill-list-full">
                  {SKILLS_DATA.map((s, i) => <SkillRow key={s.name} skill={s} i={i} />)}
                </div>
              </div>
              <div className="pf-info-note">
                <IcInfo /> Skill scores update automatically when you complete challenges. Last sync: <strong>{USER.lastUpdated}</strong>
              </div>
            </>
          )}

          {tab === "challenges" && (
            <>
              <div className="pf-ch-strip">
                <div className="pf-ch-strip-stat pf-ch-ss-done">
                  <span className="pf-ch-ss-n">{done.length}</span>
                  <span className="pf-ch-ss-l">Completed</span>
                </div>
                <div className="pf-ch-strip-stat pf-ch-ss-going">
                  <span className="pf-ch-ss-n">{ongoing.length}</span>
                  <span className="pf-ch-ss-l">In Progress</span>
                </div>
                <div className="pf-ch-strip-stat pf-ch-ss-pts">
                  <span className="pf-ch-ss-n">{totalPts.toLocaleString()}</span>
                  <span className="pf-ch-ss-l">Points Earned</span>
                </div>
              </div>

              {ongoing.length > 0 && (
                <>
                  <div className="pf-section-label">⚡ In Progress</div>
                  {ongoing.map(ch => <ChallengeCard key={ch.id} ch={ch} />)}
                </>
              )}
              <div className="pf-section-label">✅ Completed</div>
              {done.map(ch => <ChallengeCard key={ch.id} ch={ch} />)}
            </>
          )}

          {tab === "sections" && (
            <div className="pf-card pf-card-wide">
              <div className="pf-card-hd">
                <h3 className="pf-card-title">Custom Sections</h3>
                <span className="pf-card-note">Appears in your public portfolio — add links, text, or images</span>
              </div>
              <CustomSections sections={sections} setSections={setSections} readOnly={false} />
            </div>
          )}
        </div>

        {showPreview && (
          <EmployerPreview
            bio={bio}
            headline={headline}
            sections={sections}
            onClose={() => setShowPreview(false)}
          />
        )}
      </div>
    </>
  );
}