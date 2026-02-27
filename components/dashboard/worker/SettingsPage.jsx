'use client';

import { useState } from 'react';

// ── Reusable Toggle ──────────────────────────────────────────────────────────
function Toggle({ checked, onChange }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      style={{
        width: 44, height: 24, borderRadius: 12, border: 'none',
        background: checked ? 'linear-gradient(135deg,#2DB8A0,#1A9E88)' : 'rgba(26,39,68,0.15)',
        cursor: 'pointer', position: 'relative', flexShrink: 0,
        transition: 'background .25s ease',
        boxShadow: checked ? '0 2px 8px rgba(45,184,160,0.35)' : 'none',
        padding: 0,
      }}
    >
      <span style={{
        position: 'absolute', top: 3,
        left: checked ? 23 : 3,
        width: 18, height: 18, borderRadius: '50%',
        background: '#fff',
        boxShadow: '0 1px 4px rgba(0,0,0,0.18)',
        transition: 'left .22s cubic-bezier(0.4,0,0.2,1)',
        display: 'block',
      }} />
    </button>
  );
}

// ── Section card ─────────────────────────────────────────────────────────────
function Section({ icon, title, children, danger }) {
  return (
    <div style={{
      background: danger ? 'rgba(180,40,40,0.03)' : 'rgba(255,255,255,0.92)',
      backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)',
      border: danger ? '1.5px solid rgba(180,40,40,0.14)' : '1px solid rgba(26,39,68,0.12)',
      borderRadius: 18,
      boxShadow: '0 2px 12px rgba(26,39,68,0.08), 0 1px 3px rgba(26,39,68,0.05)',
      overflow: 'hidden',
    }}>
      {title && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 12,
          padding: '20px 28px',
          borderBottom: `1px solid ${danger ? 'rgba(180,40,40,0.10)' : 'rgba(26,39,68,0.08)'}`,
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10, fontSize: 17,
            background: danger ? 'rgba(180,40,40,0.08)' : 'rgba(45,184,160,0.10)',
            border: danger ? '1px solid rgba(180,40,40,0.16)' : '1px solid rgba(45,184,160,0.22)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>{icon}</div>
          <h2 style={{
            fontFamily: '"Playfair Display", serif',
            fontSize: 17, fontWeight: 600, color: danger ? '#A83030' : '#1A2744',
            letterSpacing: '-0.2px', margin: 0,
          }}>{title}</h2>
        </div>
      )}
      <div style={{ padding: '24px 28px' }}>{children}</div>
    </div>
  );
}

// ── Field label ───────────────────────────────────────────────────────────────
function Label({ children }) {
  return (
    <label style={{
      fontFamily: '"Instrument Sans", sans-serif',
      fontSize: 11, fontWeight: 700,
      color: 'rgba(26,39,68,0.50)',
      letterSpacing: '0.6px', textTransform: 'uppercase',
      display: 'block', marginBottom: 7,
    }}>{children}</label>
  );
}

// ── Divider ──────────────────────────────────────────────────────────────────
function Divider() {
  return <div style={{ height: 1, background: 'rgba(26,39,68,0.08)', margin: '2px 0' }} />;
}

// ── Toggle row ────────────────────────────────────────────────────────────────
function TRow({ label, sub, checked, onChange }) {
  return (
    <>
      <div style={{
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', gap: 16,
        padding: '15px 0',
      }}>
        <div>
          <p style={{ margin: 0, fontFamily: '"Instrument Sans", sans-serif', fontSize: 14, fontWeight: 500, color: '#1A2744' }}>{label}</p>
          {sub && <p style={{ margin: '3px 0 0', fontFamily: '"Instrument Sans", sans-serif', fontSize: 12, color: 'rgba(26,39,68,0.45)' }}>{sub}</p>}
        </div>
        <Toggle checked={checked} onChange={onChange} />
      </div>
      <Divider />
    </>
  );
}

// ── Action row (security) ────────────────────────────────────────────────────
function ARow({ label, sub, children }) {
  return (
    <>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        gap: 16, padding: '16px 0',
      }}>
        <div>
          <p style={{ margin: 0, fontFamily: '"Instrument Sans", sans-serif', fontSize: 14, fontWeight: 600, color: '#1A2744' }}>{label}</p>
          {sub && <p style={{ margin: '3px 0 0', fontSize: 12, color: 'rgba(26,39,68,0.45)', fontFamily: '"Instrument Sans", sans-serif' }}>{sub}</p>}
        </div>
        <div>{children}</div>
      </div>
      <Divider />
    </>
  );
}

// ── Shared input style ────────────────────────────────────────────────────────
const inp = {
  width: '100%', padding: '11px 14px',
  background: '#fff',
  border: '1.5px solid rgba(26,39,68,0.16)',
  borderRadius: 10, outline: 'none',
  fontFamily: '"Instrument Sans", sans-serif',
  fontSize: 14, color: '#1A2744',
  boxSizing: 'border-box',
  transition: 'border-color .18s, box-shadow .18s',
};

// ── Button variants ───────────────────────────────────────────────────────────
const Btn = {
  primary: {
    padding: '10px 22px', borderRadius: 10, border: 'none',
    background: 'linear-gradient(135deg,#2DB8A0,#1A9E88)',
    color: '#fff', fontSize: 13, fontWeight: 700,
    fontFamily: '"Instrument Sans", sans-serif',
    cursor: 'pointer', letterSpacing: '0.2px',
    boxShadow: '0 4px 14px rgba(45,184,160,0.28)',
    transition: 'all .2s',
  },
  outline: {
    padding: '10px 22px', borderRadius: 10,
    border: '1.5px solid rgba(26,39,68,0.18)',
    color: 'rgba(26,39,68,0.65)', fontSize: 13, fontWeight: 600,
    fontFamily: '"Instrument Sans", sans-serif',
    cursor: 'pointer', background: 'rgba(255,255,255,0.8)',
    transition: 'all .2s', whiteSpace: 'nowrap',
  },
  slate: {
    padding: '10px 22px', borderRadius: 10, border: 'none',
    background: 'linear-gradient(135deg,#1A2744,#2D3F6B)',
    color: '#fff', fontSize: 13, fontWeight: 700,
    fontFamily: '"Instrument Sans", sans-serif',
    cursor: 'pointer', whiteSpace: 'nowrap',
    boxShadow: '0 4px 14px rgba(26,39,68,0.22)',
    transition: 'all .2s',
  },
  danger: {
    padding: '10px 22px', borderRadius: 10,
    background: 'rgba(180,40,40,0.06)',
    border: '1.5px solid rgba(180,40,40,0.20)',
    color: '#A83030', fontSize: 13, fontWeight: 700,
    fontFamily: '"Instrument Sans", sans-serif',
    cursor: 'pointer', transition: 'all .2s',
    whiteSpace: 'nowrap',
  },
  logout: {
    width: '100%', padding: '14px', borderRadius: 12, border: 'none',
    background: 'linear-gradient(135deg,#1A2744,#2D3F6B)',
    color: '#fff', fontSize: 14, fontWeight: 700,
    fontFamily: '"Instrument Sans", sans-serif',
    cursor: 'pointer', letterSpacing: '0.3px',
    boxShadow: '0 4px 16px rgba(26,39,68,0.25)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
    transition: 'all .2s',
  },
};

// ════════════════════════════════════════════════════════════════════════════
export default function SettingsPage() {

  // ── Profile state ──
  const [firstName, setFirstName] = useState('Sarah');
  const [lastName,  setLastName]  = useState('Johnson');
  const [email,     setEmail]     = useState('sarah.johnson@email.com');
  const [phone,     setPhone]     = useState('+1 (555) 234-5678');
  const [bio,       setBio]       = useState('Full-stack developer passionate about creating intuitive user experiences and scalable backend systems.');
  const [location,  setLocation]  = useState('San Francisco, CA');
  const [website,   setWebsite]   = useState('https://sarahjohnson.dev');
  const [saved,     setSaved]     = useState(false);

  // ── Accessibility ──
  const [screenReader,  setScreenReader]  = useState(true);
  const [highContrast,  setHighContrast]  = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [largeText,     setLargeText]     = useState(false);
  const [keyboardHints, setKeyboardHints] = useState(true);

  // ── Preferences ──
  const [language,    setLanguage]    = useState('en-US');
  const [timezone,    setTimezone]    = useState('America/Los_Angeles');
  const [showProfile, setShowProfile] = useState(true);
  const [publicPort,  setPublicPort]  = useState(true);

  // ── Notifications ──
  const [nJobMatch,  setNJobMatch]  = useState(true);
  const [nChallenge, setNChallenge] = useState(true);
  const [nProgress,  setNProgress]  = useState(true);
  const [nFeedback,  setNFeedback]  = useState(true);
  const [nMarketing, setNMarketing] = useState(false);

  // ── UI state ──
  const [showLogout, setShowLogout] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const selectSt = {
    ...inp,
    appearance: 'none', WebkitAppearance: 'none',
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%231A2744' stroke-width='2.5'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat', backgroundPosition: 'right 14px center',
    paddingRight: 36, cursor: 'pointer',
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Instrument+Sans:wght@400;500;600;700&display=swap');
        .st-input-el:focus { border-color: rgba(45,184,160,0.60) !important; box-shadow: 0 0 0 3px rgba(45,184,160,0.10) !important; }
        .st-btn-h:hover   { box-shadow: 0 6px 20px rgba(45,184,160,0.40) !important; transform: translateY(-1px); }
        .st-btn-ol:hover  { border-color: rgba(45,184,160,0.45) !important; color: #1A7A6E !important; background: rgba(45,184,160,0.06) !important; }
        .st-btn-sl:hover  { box-shadow: 0 6px 20px rgba(26,39,68,0.35) !important; transform: translateY(-1px); }
        .st-btn-dg:hover  { background: rgba(180,40,40,0.10) !important; border-color: rgba(180,40,40,0.32) !important; }
        .st-btn-lo:hover  { box-shadow: 0 6px 24px rgba(26,39,68,0.40) !important; transform: translateY(-1px); }
        .st-overlay { position:fixed;inset:0;z-index:200;background:rgba(26,39,68,0.28);backdrop-filter:blur(6px);display:flex;align-items:center;justify-content:center;padding:24px; }
        .st-modal { background:rgba(255,255,255,0.98);border:1px solid rgba(26,39,68,0.12);border-radius:20px;padding:40px 32px;max-width:380px;width:100%;box-shadow:0 20px 60px rgba(26,39,68,0.18);text-align:center; }
        .st-toast { position:fixed;bottom:28px;left:50%;transform:translateX(-50%);background:linear-gradient(135deg,#1A2744,#2D3F6B);color:#fff;padding:12px 24px;border-radius:12px;font-family:'Instrument Sans',sans-serif;font-size:13px;font-weight:600;box-shadow:0 8px 24px rgba(26,39,68,0.30);display:flex;align-items:center;gap:8px;z-index:300;white-space:nowrap;animation:toastin .3s cubic-bezier(0.4,0,.2,1); }
        @keyframes toastin { from{opacity:0;transform:translateX(-50%) translateY(10px)} to{opacity:1;transform:translateX(-50%) translateY(0)} }
        .st-two { display:grid;grid-template-columns:1fr 1fr;gap:16px; }
        @media(max-width:620px){.st-two{grid-template-columns:1fr;}}
      `}</style>

      <div style={{
         padding: '36px', display: 'flex', flexDirection: 'column', gap: 24,
         maxWidth: 860, fontFamily: '"Instrument Sans", sans-serif', color: '#1A2744',
         margin: '0 auto', width: '100%',
      }}>

        {/* ── Page header ── */}
        <div>
          <h1 style={{ fontFamily: '"Playfair Display",serif', fontSize: 27, fontWeight: 700, color: '#1A2744', letterSpacing: '-0.3px', margin: '0 0 6px' }}>Settings</h1>
          <p style={{ fontSize: 13, color: 'rgba(26,39,68,0.50)', margin: 0 }}>Manage your account settings and preferences</p>
        </div>

        {/* ══ 1. PROFILE INFORMATION ══ */}
        <Section icon="👤" title="Profile Information">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div className="st-two">
              <div><Label>First Name</Label><input className="st-input-el" style={inp} value={firstName} onChange={e=>setFirstName(e.target.value)} /></div>
              <div><Label>Last Name</Label><input className="st-input-el" style={inp} value={lastName} onChange={e=>setLastName(e.target.value)} /></div>
            </div>
            <div><Label>Email Address</Label><input className="st-input-el" style={inp} type="email" value={email} onChange={e=>setEmail(e.target.value)} /></div>
            <div className="st-two">
              <div><Label>Phone Number</Label><input className="st-input-el" style={inp} type="tel" value={phone} onChange={e=>setPhone(e.target.value)} /></div>
              <div><Label>Location</Label><input className="st-input-el" style={inp} value={location} onChange={e=>setLocation(e.target.value)} /></div>
            </div>
            <div><Label>Website / Portfolio URL</Label><input className="st-input-el" style={inp} type="url" value={website} onChange={e=>setWebsite(e.target.value)} /></div>
            <div>
              <Label>Bio</Label>
              <textarea className="st-input-el" style={{ ...inp, minHeight: 96, lineHeight: 1.65, resize: 'vertical' }}
                value={bio} onChange={e=>setBio(e.target.value)} />
            </div>
            <div>
              <button className="st-btn-h" style={{ ...Btn.primary, ...(saved ? { background:'linear-gradient(135deg,#1A9E88,#157C6E)' } : {}) }} onClick={handleSave}>
                {saved ? '✓  Changes Saved' : 'Save Changes'}
              </button>
            </div>
          </div>
        </Section>

        {/* ══ 2. ACCESSIBILITY ══ */}
        <Section icon="♿" title="Accessibility">
          <TRow label="Screen reader support"      sub="Optimise interface for assistive technologies"   checked={screenReader}  onChange={setScreenReader}  />
          <TRow label="High contrast mode"         sub="Increase contrast for better visibility"          checked={highContrast}  onChange={setHighContrast}  />
          <TRow label="Reduce motion"              sub="Minimise animations and transitions"              checked={reducedMotion} onChange={setReducedMotion} />
          <TRow label="Large text"                 sub="Increase base font size across the dashboard"     checked={largeText}     onChange={setLargeText}     />
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:16, paddingTop:15 }}>
            <div>
              <p style={{ margin:0, fontSize:14, fontWeight:500, color:'#1A2744', fontFamily:'"Instrument Sans",sans-serif' }}>Keyboard navigation hints</p>
              <p style={{ margin:'3px 0 0', fontSize:12, color:'rgba(26,39,68,0.45)', fontFamily:'"Instrument Sans",sans-serif' }}>Show shortcut hints for keyboard users</p>
            </div>
            <Toggle checked={keyboardHints} onChange={setKeyboardHints} />
          </div>
        </Section>

        {/* ══ 3. PREFERENCES ══ */}
        <Section icon="🎨" title="Preferences">
          <div style={{ display:'flex', flexDirection:'column', gap:18 }}>
            <div className="st-two">
              <div>
                <Label>Language</Label>
                <select className="st-input-el" style={selectSt} value={language} onChange={e=>setLanguage(e.target.value)}>
                  <option value="en-US">English (US)</option>
                  <option value="en-GB">English (UK)</option>
                  <option value="fil">Filipino</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                </select>
              </div>
              <div>
                <Label>Timezone</Label>
                <select className="st-input-el" style={selectSt} value={timezone} onChange={e=>setTimezone(e.target.value)}>
                  <option value="America/Los_Angeles">Pacific Time (PT)</option>
                  <option value="America/Denver">Mountain Time (MT)</option>
                  <option value="America/Chicago">Central Time (CT)</option>
                  <option value="America/New_York">Eastern Time (ET)</option>
                  <option value="Asia/Manila">Philippine Time (PHT)</option>
                  <option value="Europe/London">GMT / London</option>
                  <option value="Europe/Paris">Central European (CET)</option>
                </select>
              </div>
            </div>
            <Divider />
            <TRow label="Show profile to employers" sub="Employers can discover your profile in search"    checked={showProfile} onChange={setShowProfile} />
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:16, paddingTop:4 }}>
              <div>
                <p style={{ margin:0, fontSize:14, fontWeight:500, color:'#1A2744', fontFamily:'"Instrument Sans",sans-serif' }}>Public portfolio</p>
                <p style={{ margin:'3px 0 0', fontSize:12, color:'rgba(26,39,68,0.45)', fontFamily:'"Instrument Sans",sans-serif' }}>Anyone with the link can view your portfolio</p>
              </div>
              <Toggle checked={publicPort} onChange={setPublicPort} />
            </div>
          </div>
        </Section>

        {/* ══ 4. NOTIFICATIONS ══ */}
        <Section icon="🔔" title="Notification Preferences">
          <TRow label="Email notifications for new job matches"   checked={nJobMatch}  onChange={setNJobMatch}  />
          <TRow label="Challenge completion reminders"            checked={nChallenge} onChange={setNChallenge} />
          <TRow label="Weekly progress summary"                   checked={nProgress}  onChange={setNProgress}  />
          <TRow label="Feedback and review notifications"         checked={nFeedback}  onChange={setNFeedback}  />
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:16, paddingTop:15 }}>
            <p style={{ margin:0, fontSize:14, fontWeight:500, color:'#1A2744', fontFamily:'"Instrument Sans",sans-serif' }}>Marketing and promotional emails</p>
            <Toggle checked={nMarketing} onChange={setNMarketing} />
          </div>
        </Section>

        {/* ══ 5. SECURITY ══ */}
        <Section icon="🔒" title="Security">
          <ARow label="Password"                    sub="Last changed 3 months ago">
            <button className="st-btn-ol" style={Btn.outline}>Change Password</button>
          </ARow>
          <ARow label="Two-Factor Authentication"   sub="Add an extra layer of security to your account">
            <button className="st-btn-sl" style={Btn.slate}>Enable 2FA</button>
          </ARow>
          <ARow label="Active Sessions"             sub="2 devices currently signed in">
            <button className="st-btn-ol" style={Btn.outline}>Manage Sessions</button>
          </ARow>
          <ARow label="Login History"               sub="View recent sign-in activity and locations">
            <button className="st-btn-ol" style={Btn.outline}>View History</button>
          </ARow>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:16, paddingTop:16 }}>
            <div>
              <p style={{ margin:0, fontSize:14, fontWeight:600, color:'#1A2744', fontFamily:'"Instrument Sans",sans-serif' }}>Download My Data</p>
              <p style={{ margin:'3px 0 0', fontSize:12, color:'rgba(26,39,68,0.45)', fontFamily:'"Instrument Sans",sans-serif' }}>Export a full copy of your account data</p>
            </div>
            <button className="st-btn-ol" style={Btn.outline}>Request Export</button>
          </div>
        </Section>

        {/* ══ 6. DANGER ZONE ══ */}
        <Section icon="⚠️" title="Danger Zone" danger>
          <p style={{ margin:'0 0 18px', fontSize:13, color:'rgba(26,39,68,0.55)', lineHeight:1.65, fontFamily:'"Instrument Sans",sans-serif' }}>
            These actions are permanent and cannot be undone. Please read carefully before proceeding.
          </p>
          <div style={{ display:'flex', gap:12, flexWrap:'wrap' }}>
            <button className="st-btn-dg" style={Btn.danger}>Deactivate Account</button>
            <button className="st-btn-dg" style={{ ...Btn.danger, background:'rgba(180,40,40,0.10)', borderColor:'rgba(180,40,40,0.28)' }}>
              Delete Account Permanently
            </button>
          </div>
        </Section>

        {/* ══ 7. SIGN OUT ══ */}
        <div style={{
          background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)',
          border: '1px solid rgba(26,39,68,0.12)', borderRadius: 18,
          boxShadow: '0 2px 12px rgba(26,39,68,0.08)', padding: '24px 28px',
        }}>
          <h2 style={{ fontFamily:'"Playfair Display",serif', fontSize:17, fontWeight:600, color:'#1A2744', margin:'0 0 6px' }}>Sign Out</h2>
          <p style={{ fontSize:13, color:'rgba(26,39,68,0.50)', margin:'0 0 20px', lineHeight:1.65, fontFamily:'"Instrument Sans",sans-serif' }}>
            You'll be signed out on this device. Your progress and data are always saved automatically.
          </p>
          <button className="st-btn-lo" style={Btn.logout} onClick={() => setShowLogout(true)}>
            <span style={{ fontSize:16 }}>↩</span> Sign Out of InklusiJobs
          </button>
        </div>

        <div style={{ height: 16 }} />
      </div>

      {/* ── Logout confirm modal ── */}
      {showLogout && (
        <div className="st-overlay" onClick={() => setShowLogout(false)}>
          <div className="st-modal" onClick={e => e.stopPropagation()}>
            <div style={{ fontSize:44, marginBottom:14 }}>👋</div>
            <h3 style={{ fontFamily:'"Playfair Display",serif', fontSize:22, fontWeight:700, color:'#1A2744', margin:'0 0 10px' }}>Sign out?</h3>
            <p style={{ fontSize:13.5, color:'rgba(26,39,68,0.55)', lineHeight:1.65, margin:'0 0 28px', fontFamily:'"Instrument Sans",sans-serif' }}>
              You'll be returned to the home page. Your progress and all data are always saved automatically.
            </p>
            <div style={{ display:'flex', gap:10 }}>
              <button className="st-btn-ol" style={{ ...Btn.outline, flex:1 }} onClick={() => setShowLogout(false)}>
                Cancel
              </button>
              <button className="st-btn-lo" style={{ ...Btn.logout, flex:1, padding:'11px' }}
                onClick={() => { setShowLogout(false); /* router.push('/') */ }}>
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Save toast ── */}
      {saved && (
        <div className="st-toast">
          <span>✓</span> Profile saved successfully
        </div>
      )}
    </>
  );
}