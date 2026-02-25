'use client';

import { useState, useMemo } from 'react';
import JobCard from './JobCard';
import SavedPanel from './SavedPanel';
import A11yPanel from './A11yPanel';
import { Ic } from './Icons';
import { 
  JOB_LISTINGS, 
  USER_PROFILE, 
  FIELD_OPTIONS, 
  SETUP_OPTIONS, 
  PWD_TYPES,
  FONT_SIZES 
} from './jobsData';
import JobsPageCSS from './JobsPageCSS';

export default function JobsPageMain() {
  // Theme and accessibility state
  const [theme, setTheme] = useState("dark");
  const [hc, setHc] = useState(false);
  const [rm, setRm] = useState(false);
  const [fontSize, setFontSize] = useState("md");
  const [dyslexic, setDyslexic] = useState(false);

  // Filters and search
  const [search, setSearch] = useState("");
  const [fField, setFField] = useState("all");
  const [fSetup, setFSetup] = useState("All");
  const [fPWD, setFPWD] = useState("all");
  
  // UI state
  const [expJob, setExpJob] = useState(null);
  const [tab, setTab] = useState("all");
  const [saved, setSaved] = useState([]);
  const [showSaved, setShowSaved] = useState(false);
  const [savedFull, setSavedFull] = useState(false);
  const [showA11y, setShowA11y] = useState(false);

  const dark = theme === "dark";
  const fontScale = FONT_SIZES.find(f => f.id === fontSize)?.scale ?? 1;
  const fontFamily = dyslexic
    ? "'OpenDyslexic','Comic Sans MS','Comic Sans',cursive"
    : "'Plus Jakarta Sans','Syne',sans-serif";

  // Score calculation function
  const score = (job) => {
    let s = 0;
    if (job.pwdFriendly.includes(USER_PROFILE.disability)) s += 3;
    if (job.field === USER_PROFILE.field) s += 2;
    if (job.setup === "Remote" || job.setup === "Work from Home") s += 1;
    return s;
  };

  // Filter and sort jobs
  const filtered = useMemo(() => {
    let jobs = JOB_LISTINGS;
    
    // Apply tab filter
    if (tab === "matched") {
      jobs = jobs.filter(j => 
        j.pwdFriendly.includes(USER_PROFILE.disability) || 
        j.field === USER_PROFILE.field
      );
    }
    
    // Apply search filter
    if (search) {
      const q = search.toLowerCase();
      jobs = jobs.filter(j => 
        j.position.toLowerCase().includes(q) || 
        j.company.toLowerCase().includes(q) || 
        j.location.toLowerCase().includes(q)
      );
    }
    
    // Apply field filter
    if (fField !== "all") {
      jobs = jobs.filter(j => j.field === fField);
    }
    
    // Apply setup filter
    if (fSetup !== "All") {
      jobs = jobs.filter(j => j.setup === fSetup);
    }
    
    // Apply PWD type filter
    if (fPWD !== "all") {
      jobs = jobs.filter(j => j.pwdFriendly.includes(fPWD));
    }
    
    // Sort by match score
    return [...jobs].sort((a, b) => score(b) - score(a));
  }, [search, fField, fSetup, fPWD, tab]);

  const matchedCount = JOB_LISTINGS.filter(j => 
    j.pwdFriendly.includes(USER_PROFILE.disability) || 
    j.field === USER_PROFILE.field
  ).length;

  const toggleSave = (id) => {
    setSaved(prev => prev.includes(id) 
      ? prev.filter(x => x !== id) 
      : [...prev, id]
    );
  };

  return (
    <>
      <JobsPageCSS 
        dark={dark}
        hc={hc}
        rm={rm}
        fontScale={fontScale}
        fontFamily={fontFamily}
      />
      
      <div className={`jp-page ${dark ? "jp-dark" : "jp-light"} ${hc ? "jp-hc" : ""} ${rm ? "jp-rm" : ""}`}
           style={{"--ff": fontFamily, "--fscale": fontScale}}>

        {/* ── Jobs top-bar: theme + accessibility + saved ────────────── */}
        <div className="jp-toolbar">
          <div className="jp-toolbar-l">
            <h1 className="jp-page-title">Jobs Board</h1>
            <p className="jp-page-sub">Inclusive listings matched to your profile</p>
          </div>
          <div className="jp-toolbar-r">
            {/* Theme toggle */}
            <button className="jp-tbtn" onClick={() => setTheme(dark ? "light" : "dark")} title="Toggle theme">
              {dark ? <Ic.Sun /> : <Ic.Moon />}
            </button>

            {/* Accessibility */}
            <div className="jp-pop-wrap">
              <button
                className={`jp-tbtn jp-tbtn-a11y ${showA11y ? "jp-tbtn-on" : ""}`}
                onClick={() => { setShowA11y(!showA11y); setShowSaved(false); }}
                title="Accessibility settings"
              >
                <Ic.A11y />
              </button>
              {showA11y && (
                <A11yPanel
                  hc={hc} setHc={setHc}
                  rm={rm} setRm={setRm}
                  fontSize={fontSize} setFontSize={setFontSize}
                  dyslexic={dyslexic} setDyslexic={setDyslexic}
                  onClose={() => setShowA11y(false)}
                />
              )}
            </div>

            {/* Saved Jobs */}
            <button
              className={`jp-saved-btn ${showSaved ? "jp-saved-on" : ""}`}
              onClick={() => { setShowSaved(!showSaved); setSavedFull(false); setShowA11y(false); }}
            >
              <Ic.Bookmark f={saved.length > 0} />
              Saved Jobs
              {saved.length > 0 && <span className="jp-saved-dot">{saved.length}</span>}
            </button>

            {/* Match pill */}
            <div className="jp-match-pill">
              <span className="jp-match-dot" />
              <strong>{matchedCount}</strong>&nbsp;matched
            </div>
          </div>
        </div>

        {/* ── Content layout ── */}
        <div className={`jp-layout ${showSaved && !savedFull ? "jp-split" : ""}`}>

          {/* Main column */}
          <main className="jp-main">
            {/* Tabs */}
            <div className="jp-tabs">
              <button className={`jp-tab ${tab === "all" ? "jp-tab-on" : ""}`} onClick={() => setTab("all")}>
                All Jobs <span className="jp-tct">{JOB_LISTINGS.length}</span>
              </button>
              <button className={`jp-tab ${tab === "matched" ? "jp-tab-on" : ""}`} onClick={() => setTab("matched")}>
                ✦ Matched For You <span className="jp-tct jp-tct-gold">{matchedCount}</span>
              </button>
            </div>

            {/* Filters */}
            <div className="jp-filters">
              <div className="jp-sw">
                <span className="jp-si"><Ic.Search /></span>
                <input 
                  className="jp-search" 
                  placeholder="Search jobs, companies, locations…" 
                  value={search} 
                  onChange={e => setSearch(e.target.value)} 
                />
              </div>
              <div className="jp-fr">
                <select className="jp-sel" value={fField} onChange={e => setFField(e.target.value)}>
                  {FIELD_OPTIONS.map(f => <option key={f.id} value={f.id}>{f.label}</option>)}
                </select>
                <select className="jp-sel" value={fSetup} onChange={e => setFSetup(e.target.value)}>
                  {SETUP_OPTIONS.map(s => <option key={s} value={s}>{s === "All" ? "All Setups" : s}</option>)}
                </select>
                <select className="jp-sel" value={fPWD} onChange={e => setFPWD(e.target.value)}>
                  <option value="all">All PWD Types</option>
                  {PWD_TYPES.map(p => <option key={p.id} value={p.id}>{p.label}</option>)}
                </select>
              </div>
            </div>

            {tab === "matched" && (
              <div className="jp-mbanner">
                <span className="jp-mstar">✦</span>
                <div>
                  <div className="jp-mbt">Matched to Your Profile</div>
                  <div className="jp-mbs">
                    Based on <strong>{USER_PROFILE.disability} disability</strong> and <strong>{USER_PROFILE.field}</strong> field
                  </div>
                </div>
              </div>
            )}

            <div className="jp-rct">{filtered.length} job{filtered.length !== 1 ? "s" : ""} found</div>

            <div className="jp-list">
              {filtered.length === 0 ? (
                <div className="jp-empty">
                  <div className="jp-ei"><Ic.Search /></div>
                  <div className="jp-et">No jobs match your filters</div>
                  <div className="jp-es">Try adjusting your search or filters</div>
                </div>
              ) : (
                filtered.map(job => (
                  <JobCard 
                    key={job.id} 
                    job={job}
                    expanded={expJob === job.id}
                    onToggle={() => setExpJob(expJob === job.id ? null : job.id)}
                    saved={saved.includes(job.id)}
                    onSave={() => toggleSave(job.id)}
                    score={score(job)}
                  />
                ))
              )}
            </div>
          </main>

          {/* Sidebar panel */}
          {showSaved && !savedFull && (
            <aside className="jp-sidebar">
              <SavedPanel 
                savedIds={saved} 
                onClose={() => setShowSaved(false)} 
                full={false} 
                setFull={setSavedFull} 
                onUnsave={toggleSave} 
              />
            </aside>
          )}
        </div>

        {/* Full-page saved overlay */}
        {showSaved && savedFull && (
          <div className="jp-fp-overlay">
            <SavedPanel 
              savedIds={saved} 
              onClose={() => { setShowSaved(false); setSavedFull(false); }} 
              full={true} 
              setFull={setSavedFull} 
              onUnsave={toggleSave} 
            />
          </div>
        )}

        {/* Floating a11y FAB */}
        <button 
          className="jp-fab" 
          onClick={() => { setShowA11y(!showA11y); setShowSaved(false); }} 
          title="Accessibility"
        >
          <Ic.A11y />
        </button>
      </div>
    </>
  );
}