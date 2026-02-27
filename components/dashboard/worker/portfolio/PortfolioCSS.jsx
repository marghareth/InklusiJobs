export default function PortfolioCSS() {
  return (
    <style>{`
@import url('https://fonts.googleapis.com/css2?family=Lexend:wght@300;400;500;600;700;800&family=DM+Mono:wght@400;500&display=swap');

/* ═══════════════════════════════════════
   DESIGN TOKENS — InklusiJobs navy + teal
═══════════════════════════════════════ */
.pf-root {
  /* Surfaces */
  --bg:      #EEF1F7;
  --white:   #FFFFFF;
  --sf2:     #F4F6FB;
  /* Borders */
  --bdr:     rgba(26,39,68,0.12);
  --bdr2:    rgba(26,39,68,0.20);
  /* Text */
  --ink:     #1A2744;
  --ink2:    rgba(26,39,68,0.58);
  --ink3:    rgba(26,39,68,0.36);
  /* Navy */
  --navy:    #1A2744;
  --navy2:   #2D3F6B;
  --navy3:   #243459;
  --ndim:    rgba(26,39,68,0.07);
  --nbdr:    rgba(26,39,68,0.18);
  /* Teal */
  --teal:    #2DB8A0;
  --teal2:   #1A9E88;
  --tdim:    rgba(45,184,160,0.10);
  --tbdr:    rgba(45,184,160,0.28);
  /* Shadows */
  --sh:      rgba(26,39,68,0.07);
  --sh2:     rgba(26,39,68,0.14);
  --sh3:     rgba(26,39,68,0.24);
  /* Danger */
  --red:     #C0392B;

  font-family: 'Lexend', sans-serif;
  background: var(--bg);
  color: var(--ink);
  min-height: 100%;
  line-height: 1.6;
  padding-bottom: 5rem;
}
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

/* ═══════════════════════════════════════
   UPDATE BANNER
═══════════════════════════════════════ */
.pf-banner {
  display: flex; align-items: center; justify-content: space-between;
  background: linear-gradient(135deg, #1A2744, #2D3F6B);
  color: #fff;
  padding: .6rem 2rem; gap: 1.2rem;
  animation: slideDown .32s cubic-bezier(.4,0,.2,1);
}
@keyframes slideDown { from{transform:translateY(-100%);opacity:0} to{transform:translateY(0);opacity:1} }
.pf-banner-l { display: flex; align-items: center; gap: .65rem; }
.pf-banner-ico { display: flex; align-items: center; opacity: .85; }
.pf-banner-text { font-size: .82rem; line-height: 1.5; font-weight: 400; }
.pf-banner-prev { display: block; font-size: .72rem; opacity: .65; margin-top: .06rem; }
.pf-banner-dismiss {
  background: rgba(255,255,255,.15); border: 1px solid rgba(255,255,255,.28);
  border-radius: 6px; color: #fff; cursor: pointer;
  padding: .25rem .4rem; display: flex; align-items: center;
  transition: background .15s; flex-shrink: 0;
}
.pf-banner-dismiss:hover { background: rgba(255,255,255,.28); }

/* ═══════════════════════════════════════
   PAGE HEADER
═══════════════════════════════════════ */
.pf-page-header {
  display: flex; align-items: flex-start; justify-content: space-between;
  flex-wrap: wrap; gap: 1rem;
  padding: 1.85rem 2rem 0;
}
.pf-page-title {
  font-size: 1.8rem; font-weight: 800; color: var(--navy);
  letter-spacing: -.035em; margin-bottom: .18rem;
}
.pf-page-sub { font-size: .86rem; color: var(--ink2); font-weight: 400; }
.pf-header-actions { display: flex; align-items: center; gap: .6rem; flex-wrap: wrap; }

.pf-btn-outline, .pf-btn-solid {
  display: inline-flex; align-items: center; gap: .4rem;
  padding: .54rem 1.1rem; border-radius: 9px;
  font-family: 'Lexend', sans-serif; font-size: .83rem; font-weight: 600;
  cursor: pointer; transition: all .2s; letter-spacing: -.005em;
}
.pf-btn-outline {
  background: transparent; border: 1.5px solid var(--navy); color: var(--navy);
}
.pf-btn-outline:hover { background: var(--ndim); }
.pf-btn-solid {
  background: linear-gradient(135deg, #2DB8A0, #1A9E88);
  border: none; color: #fff;
  box-shadow: 0 3px 12px rgba(45,184,160,0.30);
}
.pf-btn-solid:hover { transform: translateY(-1px); box-shadow: 0 5px 18px rgba(45,184,160,0.38); }
.pf-btn-copied { background: linear-gradient(135deg,#1A9E88,#148070) !important; }

/* ═══════════════════════════════════════
   PROFILE HERO CARD
═══════════════════════════════════════ */
.pf-hero-card {
  display: flex; align-items: stretch; flex-wrap: wrap; gap: 0;
  background: var(--white); border: 1px solid var(--bdr);
  border-radius: 20px; margin: 1.3rem 2rem 0;
  box-shadow: 0 2px 18px var(--sh); overflow: hidden;
  animation: cardIn .4s cubic-bezier(.4,0,.2,1);
}
@keyframes cardIn { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }

.pf-av-col {
  display: flex; flex-direction: column; align-items: center;
  gap: .75rem; padding: 2rem 2rem;
  background: var(--tdim); border-right: 1px solid var(--tbdr);
  min-width: 160px; flex-shrink: 0;
}
.pf-av-wrap { position: relative; }
.pf-av {
  width: 82px; height: 82px; border-radius: 50%;
  background: linear-gradient(145deg, #1A2744, #2D3F6B);
  color: #fff; font-size: 1.5rem; font-weight: 800;
  display: flex; align-items: center; justify-content: center;
  border: 3px solid rgba(26,39,68,0.18);
  box-shadow: 0 6px 20px rgba(26,39,68,0.22);
  font-family: 'Lexend', sans-serif;
}
.pf-av-status {
  position: absolute; bottom: 3px; right: 3px;
  width: 15px; height: 15px; border-radius: 50%;
  background: #2DB8A0; border: 2.5px solid var(--white);
  box-shadow: 0 0 0 1.5px rgba(45,184,160,0.35);
}
.pf-av-since {
  display: flex; align-items: center; gap: .3rem;
  font-size: .68rem; color: var(--teal2); font-weight: 600;
  text-align: center; line-height: 1.3;
}

.pf-info-col { flex: 1; padding: 1.75rem 1.75rem; min-width: 0; overflow: hidden; }

.pf-name-row {
  display: flex; align-items: center; gap: .65rem;
  flex-wrap: wrap; margin-bottom: .22rem;
}
.pf-name {
  font-size: 1.55rem; font-weight: 800; color: var(--navy);
  letter-spacing: -.025em;
}
.pf-field-badge {
  padding: .18rem .72rem; border-radius: 999px;
  background: var(--tdim); color: var(--teal2);
  border: 1px solid var(--tbdr); font-size: .74rem; font-weight: 600;
}

.pf-hl-row { display: flex; align-items: center; gap: .4rem; margin-bottom: 1rem; }
.pf-headline { font-size: 1rem; color: var(--ink2); font-weight: 400; flex: 1; }
.pf-hl-edit-btn {
  background: none; border: 1px solid var(--bdr2); border-radius: 6px;
  padding: .2rem .38rem; color: var(--ink3); cursor: pointer;
  display: flex; align-items: center; transition: all .16s; flex-shrink: 0;
}
.pf-hl-edit-btn:hover { border-color: var(--teal); color: var(--teal); }
.pf-hl-edit-row { margin-bottom: .8rem; }
.pf-hl-inp {
  width: 100%; font-family: 'Lexend', sans-serif; font-size: .9rem; font-weight: 500;
  padding: .35rem .7rem; border: 1.5px solid var(--teal); border-radius: 8px;
  background: var(--sf2); color: var(--ink); outline: none;
}

.pf-details-grid {
  display: flex; flex-wrap: wrap; gap: .65rem 0; margin-top: .25rem;
}
.pf-detail {
  display: flex; flex-direction: column; gap: .1rem;
  min-width: 160px; flex: 1 1 160px; max-width: 50%; padding-right: 1rem;
}
.pf-detail-k {
  font-size: .68rem; font-weight: 700; color: var(--ink3);
  text-transform: uppercase; letter-spacing: .07em; white-space: nowrap;
}
.pf-detail-v { font-size: .92rem; color: var(--ink); word-break: break-word; line-height: 1.4; }
.pf-detail-pwd { color: var(--teal2); font-weight: 600; }
.pf-detail-code { font-family: 'DM Mono', monospace; font-size: .88rem; color: var(--ink2); }

.pf-stats-col {
  display: flex; flex-direction: column; gap: .65rem;
  padding: 1.75rem 1.75rem; border-left: 1px solid var(--bdr); flex-shrink: 0; min-width: 170px;
}
.stat-pill {
  border-radius: 13px; padding: .85rem 1.1rem; text-align: center;
  background: var(--sf2); border: 1px solid var(--bdr); transition: box-shadow .18s;
}
.stat-pill:hover { box-shadow: 0 3px 12px var(--sh2); }
.stat-pill-n {
  display: block; font-size: 1.55rem; font-weight: 800;
  letter-spacing: -.04em; color: var(--acc, var(--teal));
}
.stat-pill-l {
  display: block; font-size: .72rem; color: var(--ink2); font-weight: 400; margin-top: .06rem;
}

/* ═══════════════════════════════════════
   UPDATE STRIP
═══════════════════════════════════════ */
.pf-update-strip {
  display: flex; align-items: center; gap: .5rem;
  margin: .85rem 2rem 0; padding: .55rem .95rem;
  background: var(--tdim); border: 1px solid var(--tbdr);
  border-radius: 9px; font-size: .78rem; color: var(--teal2);
}
.pf-update-prev { opacity: .72; }

/* ═══════════════════════════════════════
   TABS BAR
═══════════════════════════════════════ */
.pf-tabs-bar {
  display: flex; gap: .18rem;
  padding: 0 2rem; margin-top: 1.45rem;
  border-bottom: 1px solid var(--bdr);
}
.pf-tab {
  background: none; border: none; border-bottom: 2.5px solid transparent;
  padding: .58rem .95rem; margin-bottom: -1px;
  font-family: 'Lexend', sans-serif; font-size: .83rem; font-weight: 500;
  color: var(--ink2); cursor: pointer; transition: all .18s; white-space: nowrap;
}
.pf-tab:hover { color: var(--ink); }
.pf-tab-active { color: var(--teal); border-bottom-color: var(--teal); font-weight: 600; }

/* ═══════════════════════════════════════
   CONTENT AREA
═══════════════════════════════════════ */
.pf-content { padding: 1.5rem 2rem; }

.pf-overview-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }

/* Cards */
.pf-card {
  background: var(--white); border: 1px solid var(--bdr); border-radius: 15px;
  padding: 1.3rem 1.45rem; box-shadow: 0 1px 6px var(--sh); transition: box-shadow .2s;
}
.pf-card:hover { box-shadow: 0 5px 22px var(--sh2); }
.pf-card-wide { grid-column: 1/-1; }
.pf-card-hd {
  display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.05rem;
}
.pf-card-title { font-size: .95rem; font-weight: 700; color: var(--navy); }
.pf-card-note  { font-size: .72rem; color: var(--ink3); }
.pf-card-action {
  display: flex; align-items: center; gap: .28rem;
  background: none; border: 1px solid var(--bdr2); border-radius: 7px;
  padding: .26rem .68rem; font-family: 'Lexend', sans-serif;
  font-size: .73rem; font-weight: 600; color: var(--ink2); cursor: pointer; transition: all .18s;
}
.pf-card-action:hover { border-color: var(--teal); color: var(--teal); }

/* Bio */
.pf-bio-text { font-size: .85rem; color: var(--ink2); line-height: 1.72; }
.pf-bio-inp {
  width: 100%; font-family: 'Lexend', sans-serif;
  font-size: .85rem; line-height: 1.65;
  padding: .65rem .88rem; border: 1.5px solid var(--teal);
  border-radius: 10px; background: var(--sf2); color: var(--ink);
  outline: none; resize: vertical;
}

/* Challenge summary */
.pf-ch-sum-boxes { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: .55rem; margin-bottom: .9rem; }
.pf-sum-box {
  padding: .7rem .5rem; border-radius: 10px; text-align: center; border: 1px solid transparent;
}
.pf-sum-green { background: var(--tdim); border-color: var(--tbdr); }
.pf-sum-gold  { background: var(--ndim); border-color: var(--nbdr); }
.pf-sum-pts   { background: var(--sf2);  border-color: var(--bdr);  }
.pf-sum-n { display: block; font-size: 1.4rem; font-weight: 800; letter-spacing: -.04em; }
.pf-sum-green .pf-sum-n { color: var(--teal);  }
.pf-sum-gold  .pf-sum-n { color: var(--navy);  }
.pf-sum-pts   .pf-sum-n { color: var(--navy2); }
.pf-sum-l { font-size: .63rem; color: var(--ink2); font-weight: 500; margin-top: .05rem; display: block; }

/* Mini list */
.pf-ch-mini-list { display: flex; flex-direction: column; gap: .38rem; }
.pf-ch-mini-row  {
  display: flex; align-items: center; gap: .5rem; font-size: .78rem;
  padding: .28rem 0; border-top: 1px solid var(--bdr);
}
.pf-ch-mini-row:first-child { border-top: none; }
.pf-mini-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
.pf-mini-dot-done  { background: var(--teal);  }
.pf-mini-dot-going { background: var(--navy2); }
.pf-ch-mini-title { flex: 1; color: var(--ink); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.pf-ch-mini-pts   { font-size: .7rem; color: var(--ink3); font-family: 'DM Mono', monospace; flex-shrink: 0; }

/* Skill rows */
.pf-skill-list      { display: flex; flex-direction: column; gap: .75rem; }
.pf-skill-list-full { gap: .9rem; }
.sk-row {}
.sk-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: .32rem; }
.sk-left { display: flex; align-items: center; gap: .5rem; }
.sk-name { font-size: .83rem; font-weight: 600; color: var(--navy); }
.sk-tag {
  padding: .1rem .42rem; border-radius: 999px;
  background: var(--sf2); border: 1px solid var(--bdr);
  font-size: .63rem; font-weight: 600; color: var(--ink3);
}
.sk-pct { font-size: .74rem; font-weight: 700; color: var(--teal); font-family: 'DM Mono', monospace; }

/* Links */
.pf-links-preview { display: flex; flex-wrap: wrap; gap: .5rem; }
.pf-link-pill {
  display: inline-flex; align-items: center; gap: .35rem;
  padding: .32rem .82rem; border-radius: 999px;
  border: 1px solid var(--tbdr); background: var(--tdim);
  color: var(--teal2); font-size: .78rem; font-weight: 600;
  text-decoration: none; transition: all .18s;
}
.pf-link-pill:hover { background: var(--teal); color: #fff; }
.pf-empty-hint { font-size: .78rem; color: var(--ink3); font-style: italic; }
.pf-info-note {
  display: flex; align-items: center; gap: .5rem;
  margin-top: 1rem; padding: .6rem .95rem;
  background: var(--tdim); border: 1px solid var(--tbdr);
  border-radius: 9px; font-size: .78rem; color: var(--teal2);
}

/* ═══════════════════════════════════════
   CHALLENGES TAB
═══════════════════════════════════════ */
.pf-ch-strip { display: flex; gap: .8rem; margin-bottom: 1.5rem; flex-wrap: wrap; }
.pf-ch-strip-stat {
  flex: 1; min-width: 130px; text-align: center;
  padding: .9rem 1rem; border-radius: 13px; border: 1px solid transparent;
}
.pf-ch-ss-done  { background: var(--tdim); border-color: var(--tbdr); }
.pf-ch-ss-going { background: var(--ndim); border-color: var(--nbdr); }
.pf-ch-ss-pts   { background: var(--white); border-color: var(--bdr); }
.pf-ch-ss-n { display: block; font-size: 1.6rem; font-weight: 800; letter-spacing: -.04em; }
.pf-ch-ss-done  .pf-ch-ss-n { color: var(--teal);  }
.pf-ch-ss-going .pf-ch-ss-n { color: var(--navy2); }
.pf-ch-ss-pts   .pf-ch-ss-n { color: var(--navy);  }
.pf-ch-ss-l { font-size: .7rem; color: var(--ink2); font-weight: 500; display: block; margin-top: .1rem; }
.pf-section-label {
  font-size: .72rem; font-weight: 700; text-transform: uppercase; letter-spacing: .07em;
  color: var(--ink3); margin: .35rem 0 .75rem;
}

/* Challenge card */
.ch-card {
  display: flex; gap: 0; background: var(--white);
  border: 1px solid var(--bdr); border-radius: 14px;
  margin-bottom: .7rem; overflow: hidden;
  box-shadow: 0 1px 5px var(--sh); transition: box-shadow .2s, transform .2s;
}
.ch-card:hover { box-shadow: 0 5px 20px var(--sh2); transform: translateY(-1px); }
.ch-done  .ch-stripe { background: var(--teal);  width: 4px; flex-shrink: 0; }
.ch-going .ch-stripe { background: var(--navy2); width: 4px; flex-shrink: 0; }
.ch-inner { flex: 1; padding: 1.1rem 1.35rem; }
.ch-head {
  display: flex; align-items: flex-start; justify-content: space-between;
  gap: .9rem; margin-bottom: .38rem;
}
.ch-title-wrap { flex: 1; }
.ch-status-badge {
  display: inline-flex; align-items: center; gap: .22rem;
  padding: .14rem .55rem; border-radius: 999px;
  font-size: .66rem; font-weight: 700; margin-bottom: .32rem;
}
.ch-sbadge-done  { background: var(--tdim); color: var(--teal2); border: 1px solid var(--tbdr); }
.ch-sbadge-going { background: var(--ndim); color: var(--navy2); border: 1px solid var(--nbdr); }
.ch-title { font-size: .9rem; font-weight: 700; color: var(--navy); line-height: 1.35; }
.ch-pts-wrap { display: flex; align-items: center; gap: .28rem; flex-shrink: 0; color: var(--ink3); }
.ch-pts { font-size: .75rem; font-weight: 700; color: var(--ink2); font-family: 'DM Mono', monospace; }
.ch-desc { font-size: .78rem; color: var(--ink2); line-height: 1.65; margin-bottom: .65rem; }
.ch-meta-row {
  display: flex; align-items: center; gap: .55rem; flex-wrap: wrap; margin-bottom: .6rem;
}
.ch-field-tag {
  padding: .1rem .5rem; background: var(--sf2); border: 1px solid var(--bdr);
  border-radius: 5px; font-size: .67rem; font-weight: 600; color: var(--ink2);
}
.ch-date { font-size: .69rem; color: var(--ink3); font-family: 'DM Mono', monospace; }
.ch-prog-row { display: flex; align-items: center; gap: .7rem; }
.ch-prog-track { flex: 1; }
.ch-prog-num { font-size: .7rem; font-weight: 700; color: var(--ink2); font-family: 'DM Mono', monospace; width: 2.8rem; text-align: right; flex-shrink: 0; }

/* ═══════════════════════════════════════
   CUSTOM SECTIONS
═══════════════════════════════════════ */
.cs-root { display: flex; flex-direction: column; gap: 1.1rem; }
.cs-sec {
  background: var(--sf2); border: 1px solid var(--bdr); border-radius: 12px; padding: 1.05rem 1.2rem;
}
.cs-sec-head {
  display: flex; align-items: center; justify-content: space-between; margin-bottom: .85rem;
}
.cs-sec-title { font-size: .9rem; font-weight: 700; color: var(--navy); }
.cs-title-inp {
  font-family: 'Lexend', sans-serif; font-size: .9rem; font-weight: 700;
  border: none; border-bottom: 1.5px dashed var(--bdr2); background: transparent;
  color: var(--ink); outline: none; padding: .08rem .2rem; min-width: 120px; width: auto;
}
.cs-del-btn {
  display: flex; align-items: center; gap: .28rem;
  background: none; border: 1px solid var(--bdr2); border-radius: 7px;
  padding: .24rem .65rem; font-family: 'Lexend', sans-serif;
  font-size: .72rem; font-weight: 600; color: var(--ink3); cursor: pointer; transition: all .16s;
}
.cs-del-btn:hover { border-color: var(--red); color: var(--red); }

/* Links */
.cs-links { display: flex; flex-direction: column; gap: .45rem; }
.cs-link-row {
  display: flex; align-items: center; gap: .6rem; padding: .42rem .75rem;
  background: var(--white); border: 1px solid var(--bdr); border-radius: 9px;
}
.cs-link-ico   { color: var(--teal); display: flex; align-items: center; flex-shrink: 0; }
.cs-link-name  {
  font-size: .83rem; font-weight: 700; color: var(--teal2);
  text-decoration: none; white-space: nowrap; flex-shrink: 0;
}
.cs-link-name:hover { text-decoration: underline; }
.cs-link-url   {
  font-size: .72rem; color: var(--ink3); flex: 1;
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}
.cs-lk-rm {
  background: none; border: none; color: var(--ink3); cursor: pointer;
  display: flex; align-items: center; padding: .2rem; transition: color .15s; margin-left: auto; flex-shrink: 0;
}
.cs-lk-rm:hover { color: var(--red); }
.cs-link-form {
  display: flex; flex-direction: column; gap: .45rem; margin-top: .45rem;
  padding: .85rem; background: var(--white); border: 1.5px solid var(--tbdr); border-radius: 10px;
}
.cs-inp {
  padding: .44rem .75rem; border: 1px solid var(--bdr2); border-radius: 8px;
  background: var(--sf2); color: var(--ink);
  font-family: 'Lexend', sans-serif; font-size: .82rem; outline: none; transition: border-color .16s;
}
.cs-inp:focus { border-color: var(--teal); }
.cs-link-form-btns { display: flex; gap: .45rem; }
.cs-confirm-btn, .cs-cancel-btn {
  display: flex; align-items: center; gap: .3rem;
  padding: .4rem .95rem; border-radius: 8px;
  font-family: 'Lexend', sans-serif; font-size: .78rem; font-weight: 700; cursor: pointer;
}
.cs-confirm-btn { background: linear-gradient(135deg,#2DB8A0,#1A9E88); border: none; color: #fff; }
.cs-confirm-btn:hover { opacity: .9; }
.cs-cancel-btn  { background: none; border: 1px solid var(--bdr); color: var(--ink2); }
.cs-cancel-btn:hover { border-color: var(--ink2); }
.cs-add-link-btn {
  display: flex; align-items: center; gap: .35rem; width: fit-content;
  background: none; border: 1.5px dashed var(--bdr2); border-radius: 8px;
  padding: .4rem .9rem; font-family: 'Lexend', sans-serif;
  font-size: .78rem; font-weight: 600; color: var(--ink3); cursor: pointer;
  transition: all .16s; margin-top: .35rem;
}
.cs-add-link-btn:hover { border-color: var(--teal); color: var(--teal); }

.cs-text-view { font-size: .84rem; color: var(--ink2); line-height: 1.7; white-space: pre-line; }
.cs-textarea {
  width: 100%; font-family: 'Lexend', sans-serif; font-size: .84rem; line-height: 1.65;
  padding: .65rem .88rem; border: 1.5px solid var(--bdr2); border-radius: 10px;
  background: var(--white); color: var(--ink); outline: none; resize: vertical; transition: border-color .16s;
}
.cs-textarea:focus { border-color: var(--teal); }

/* Image */
.cs-img-area { display: flex; flex-direction: column; gap: .65rem; }
.cs-img-drop {
  border: 2px dashed var(--bdr); border-radius: 13px; padding: 2.5rem 1.5rem; cursor: pointer;
  display: flex; flex-direction: column; align-items: center; gap: .6rem;
  color: var(--ink3); transition: all .18s; background: var(--white);
}
.cs-img-drop:hover { border-color: var(--teal); color: var(--teal); }
.cs-img-drop-ico { opacity: .5; display: flex; align-items: center; }
.cs-img-drop-t   { font-size: .84rem; font-weight: 600; }
.cs-img-drop-s   { font-size: .72rem; opacity: .7; }
.cs-img          { width: 100%; border-radius: 10px; object-fit: cover; max-height: 320px; }
.cs-img-empty    { font-size: .8rem; color: var(--ink3); font-style: italic; }
.cs-img-rm {
  background: none; border: 1px solid var(--bdr); border-radius: 7px;
  padding: .3rem .8rem; font-size: .74rem; color: var(--ink2); cursor: pointer;
  align-self: flex-start; transition: all .16s;
}
.cs-img-rm:hover { border-color: var(--red); color: var(--red); }

.cs-add-row {
  display: flex; align-items: center; gap: .5rem; flex-wrap: wrap;
  padding: .85rem 1rem; border: 1.5px dashed var(--bdr); border-radius: 12px;
}
.cs-add-label {
  font-size: .72rem; font-weight: 700; color: var(--ink3);
  text-transform: uppercase; letter-spacing: .05em; margin-right: .2rem;
}
.cs-add-btn {
  display: flex; align-items: center; gap: .3rem;
  padding: .36rem .85rem; border-radius: 8px;
  border: 1px solid var(--bdr); background: var(--white);
  color: var(--ink2); font-family: 'Lexend', sans-serif;
  font-size: .78rem; font-weight: 600; cursor: pointer; transition: all .18s;
}
.cs-add-btn:hover { border-color: var(--teal); color: var(--teal); background: var(--tdim); }

/* ═══════════════════════════════════════
   EMPLOYER PREVIEW OVERLAY
═══════════════════════════════════════ */
.ep-overlay {
  position: fixed; inset: 0; z-index: 600;
  background: rgba(26,39,68,0.55); backdrop-filter: blur(6px);
  display: flex; justify-content: center; align-items: flex-start;
  overflow-y: auto; padding: 2.5rem 1.25rem 4rem;
  animation: epFade .22s ease;
}
@keyframes epFade { from{opacity:0} to{opacity:1} }

.ep-sheet {
  width: 100%; max-width: 840px;
  background: var(--white); border: 1px solid var(--bdr);
  border-radius: 22px; overflow: hidden;
  box-shadow: 0 28px 80px var(--sh3);
  animation: epRise .28s cubic-bezier(.4,0,.2,1);
}
@keyframes epRise { from{transform:translateY(22px);opacity:0} to{transform:translateY(0);opacity:1} }

.ep-topbar {
  display: flex; align-items: center; justify-content: space-between;
  padding: .9rem 1.6rem;
  background: linear-gradient(135deg, #1A2744, #2D3F6B);
  color: #fff;
}
.ep-topbar-inner { display: flex; align-items: center; gap: 1rem; }
.ep-mode-pill {
  display: flex; align-items: center; gap: .35rem;
  padding: .25rem .8rem; border-radius: 999px;
  background: rgba(255,255,255,.20); font-size: .72rem; font-weight: 800; letter-spacing: .05em;
}
.ep-mode-note { font-size: .77rem; opacity: .72; }
.ep-close {
  display: flex; align-items: center; gap: .38rem;
  background: rgba(255,255,255,.16); border: 1px solid rgba(255,255,255,.28);
  border-radius: 8px; padding: .38rem .95rem;
  color: #fff; font-family: 'Lexend', sans-serif;
  font-size: .78rem; font-weight: 700; cursor: pointer; transition: background .16s;
}
.ep-close:hover { background: rgba(255,255,255,.28); }

.ep-scroll { max-height: calc(100vh - 200px); overflow-y: auto; }

.ep-hero { position: relative; padding: 2rem 1.75rem; border-bottom: 1px solid var(--bdr); overflow: hidden; }
.ep-hero-bg {
  position: absolute; inset: 0; z-index: 0;
  background: linear-gradient(135deg, var(--tdim) 0%, transparent 60%);
}
.ep-hero-content { position: relative; z-index: 1; display: flex; gap: 1.4rem; align-items: flex-start; }
.ep-av {
  width: 72px; height: 72px; border-radius: 50%; flex-shrink: 0;
  background: linear-gradient(145deg, #1A2744, #2D3F6B);
  color: #fff; font-size: 1.25rem; font-weight: 800;
  display: flex; align-items: center; justify-content: center;
  font-family: 'Lexend', sans-serif;
  box-shadow: 0 6px 18px rgba(26,39,68,0.25);
}
.ep-hero-info { flex: 1; }
.ep-name { font-size: 1.45rem; font-weight: 800; color: var(--navy); letter-spacing: -.03em; margin-bottom: .2rem; }
.ep-headline { font-size: .9rem; color: var(--teal2); font-weight: 600; margin-bottom: .55rem; }
.ep-contact-row {
  display: flex; flex-wrap: wrap; gap: .32rem 1.2rem;
  font-size: .79rem; color: var(--ink2); margin-bottom: .65rem;
}
.ep-tag-row { display: flex; flex-wrap: wrap; gap: .38rem; }
.ep-tag { padding: .18rem .65rem; border-radius: 999px; font-size: .69rem; font-weight: 700; }
.ep-tag-pwd   { background: var(--tdim); color: var(--teal2); border: 1px solid var(--tbdr); }
.ep-tag-field { background: var(--sf2);  color: var(--ink2);  border: 1px solid var(--bdr);  }
.ep-tag-id    { background: var(--ndim); color: var(--navy2); border: 1px solid var(--nbdr); font-family: 'DM Mono', monospace; }

/* Stats strip */
.ep-stats-strip { display: flex; border-bottom: 1px solid var(--bdr); }
.ep-stat { flex: 1; text-align: center; padding: .95rem 1rem; border-right: 1px solid var(--bdr); }
.ep-stat:last-child { border-right: none; }
.ep-stat-n { display: block; font-size: 1.4rem; font-weight: 800; color: var(--teal); letter-spacing: -.04em; }
.ep-stat-l { font-size: .67rem; color: var(--ink2); font-weight: 500; display: block; margin-top: .1rem; }

/* Sections */
.ep-section { padding: 1.45rem 1.75rem; border-bottom: 1px solid var(--bdr); }
.ep-section:last-of-type { border-bottom: none; }
.ep-sec-title {
  font-size: .68rem; font-weight: 800; text-transform: uppercase;
  letter-spacing: .09em; color: var(--ink3); margin-bottom: .95rem;
}
.ep-bio { font-size: .86rem; color: var(--ink2); line-height: 1.75; }
.ep-skills-grid { display: flex; flex-direction: column; gap: .88rem; }

/* Challenge table */
.ep-ch-table { display: flex; flex-direction: column; gap: .42rem; }
.ep-ch-row {
  display: flex; align-items: center; gap: .6rem; flex-wrap: wrap;
  padding: .5rem .8rem; background: var(--sf2); border: 1px solid var(--bdr); border-radius: 9px; font-size: .82rem;
}
.ep-ch-check { color: var(--teal);  display: flex; align-items: center; flex-shrink: 0; }
.ep-ch-title { flex: 1; color: var(--navy); font-weight: 600; min-width: 180px; }
.ep-ch-tag   {
  padding: .1rem .45rem; background: var(--white); border: 1px solid var(--bdr);
  border-radius: 5px; font-size: .65rem; font-weight: 600; color: var(--ink2); flex-shrink: 0;
}
.ep-ch-date  { font-size: .7rem; color: var(--ink3); font-family: 'DM Mono', monospace; flex-shrink: 0; }
.ep-ch-pts   {
  display: flex; align-items: center; gap: .22rem; font-size: .72rem;
  color: var(--ink2); font-family: 'DM Mono', monospace; flex-shrink: 0; margin-left: auto;
}
.ep-ch-pts svg { color: var(--teal); }

.ep-footer {
  display: flex; align-items: center; justify-content: center; gap: .45rem;
  padding: .9rem 1.75rem; font-size: .73rem; color: var(--ink3);
  background: var(--sf2); border-top: 1px solid var(--bdr);
}

/* ═══════════════════════════════════════
   RESPONSIVE
═══════════════════════════════════════ */
@media(max-width:800px){
  .pf-page-header,.pf-tabs-bar,.pf-content,.pf-update-strip{padding-left:1rem;padding-right:1rem;}
  .pf-hero-card{margin:1rem;}
  .pf-av-col{flex-direction:row;padding:1rem 1.25rem;border-right:none;border-bottom:1px solid var(--tbdr);width:100%;}
  .pf-info-col{width:100%;border-bottom:1px solid var(--bdr);}
  .pf-stats-col{flex-direction:row;flex-wrap:wrap;padding:1rem 1.25rem;border-left:none;width:100%;}
  .stat-pill{flex:1;min-width:110px;}
  .pf-overview-grid{grid-template-columns:1fr;}
  .pf-detail{max-width:100%;flex:1 1 140px;}
  .ep-hero-content{flex-direction:column;}
  .ep-stats-strip{flex-wrap:wrap;}
  .ep-stat{min-width:50%;}
  .ep-topbar{flex-direction:column;gap:.6rem;align-items:flex-start;}
  .ep-ch-row{flex-wrap:wrap;}
}
    `}</style>
  );
}