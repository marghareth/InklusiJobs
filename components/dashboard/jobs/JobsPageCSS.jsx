export default function JobsPageCSS({ dark, hc, rm, fontScale, fontFamily }) {
  return (
    <style>{`
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
@font-face {
  font-family: 'OpenDyslexic';
  src: url('https://cdn.jsdelivr.net/npm/open-dyslexic@1.0.3/open-dyslexic-regular.woff') format('woff');
  font-weight: normal; font-style: normal;
}

/* ── Light tokens — InklusiJobs palette (cream + forest green) ── */
.jp-light {
  --bg:        #F2EFE9;   /* warm cream page background */
  --sf:        #FFFFFF;   /* white card surface */
  --sf2:       #F7F5F0;   /* off-white secondary surface */
  --bd:        #E4DDD2;   /* warm beige border */
  --bd2:       #D5CCBF;   /* slightly darker border */
  --t1:        #1C2B1A;   /* near-black with green tint */
  --t2:        #5C6B54;   /* muted olive text */
  --t3:        #9CA88F;   /* light sage placeholder */
  --teal:      #2D5016;   /* forest green (sidebar color) — primary accent */
  --teal2:     #3D6B1F;   /* slightly lighter forest green */
  --blue:      #4A7C59;   /* sage green (secondary accent) */
  --purp:      #6B8F5E;   /* muted olive green */
  --purp2:     #3D6B1F;
  --td:        rgba(45,80,22,.09);   /* teal tint bg */
  --tb:        rgba(45,80,22,.28);   /* teal border */
  --bd_:       rgba(74,124,89,.1);   /* blue tint bg */
  --bb:        rgba(74,124,89,.3);   /* blue border */
  --gold:      #7B6226;   /* warm amber/ochre for highlights */
  --gd:        rgba(123,98,38,.1);
  --gb:        rgba(123,98,38,.28);
  --green:     #2D5016;
  --green2:    #3D6B1F;
  --red:       #B84040;
  --sh:        rgba(28,43,26,.1);
  --card-top:  linear-gradient(135deg,#fff,rgba(45,80,22,.03));
  --apply-grad:linear-gradient(135deg,#2D5016,#3D6B1F);
  --apply-sh:  rgba(45,80,22,.3);
}

/* ── Dark tokens — InklusiJobs dark variant ── */
.jp-dark {
  --bg:        #111810;   /* very dark forest-black */
  --sf:        #1A2318;   /* dark forest green surface */
  --sf2:       #1F2A1D;   /* slightly lighter surface */
  --bd:        #2A3828;   /* muted green border */
  --bd2:       #334530;   /* visible green border */
  --t1:        #E8F0E5;   /* light sage white text */
  --t2:        #8FAD84;   /* muted sage text */
  --t3:        #536B4A;   /* dim olive placeholder */
  --teal:      #5DB87A;   /* bright sage green accent */
  --teal2:     #4EA869;
  --blue:      #7BBF90;   /* lighter sage */
  --purp:      #A0C896;   /* soft mint */
  --purp2:     #5DB87A;
  --td:        rgba(93,184,122,.12);
  --tb:        rgba(93,184,122,.32);
  --bd_:       rgba(123,191,144,.12);
  --bb:        rgba(123,191,144,.3);
  --gold:      #D4A843;   /* warm amber for badges */
  --gd:        rgba(212,168,67,.12);
  --gb:        rgba(212,168,67,.3);
  --green:     #5DB87A;
  --green2:    #7BBF90;
  --red:       #E06060;
  --sh:        rgba(0,8,0,.55);
  --card-top:  linear-gradient(135deg,#1A2318,rgba(93,184,122,.04));
  --apply-grad:linear-gradient(135deg,#2D6B3F,#5DB87A);
  --apply-sh:  rgba(93,184,122,.3);
}

.jp-hc { --t2:var(--t1); --t3:var(--t1); }
.jp-light.jp-hc { --bg:#fff; --sf:#fff; --t2:#000; --t3:#000; }
.jp-dark.jp-hc  { --bg:#000; --sf:#0d1a0d; --t2:#e8f0e5; --t3:#e8f0e5; }
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
.jp-rm *{animation:none!important;transition:none!important;}

/* ── Page root ── */
.jp-page {
  font-family: var(--ff, 'Plus Jakarta Sans', sans-serif);
  font-size: calc(1rem * ${fontScale});
  background: var(--bg);
  color: var(--t1);
  min-height: 100%;
  position: relative;
  padding-bottom: 4rem;
  line-height: 1.6;
}

/* ── Top toolbar ── */
.jp-toolbar {
  display: flex; align-items: center; justify-content: space-between;
  flex-wrap: wrap; gap: .75rem;
  padding: 1.4rem 2rem 0;
  margin-bottom: 1.4rem;
}
.jp-page-title { font-size: calc(1.6rem * ${fontScale}); font-weight: 800; color: var(--t1); letter-spacing: -.03em; margin-bottom: .2rem; }
.jp-page-sub   { font-size: calc(0.84rem * ${fontScale}); color: var(--t2); }
.jp-toolbar-r  { display: flex; align-items: center; gap: .45rem; flex-wrap: wrap; }

/* ── Toolbar buttons ── */
.jp-tbtn {
  width:32px; height:32px; border-radius:8px;
  border:1px solid var(--bd2); background:var(--sf2); color:var(--t2);
  display:flex; align-items:center; justify-content:center;
  cursor:pointer; transition:all .18s;
}
.jp-tbtn:hover,.jp-tbtn-on { background:var(--td); border-color:var(--tb); color:var(--teal); }
.jp-tbtn-a11y:hover,.jp-tbtn-a11y.jp-tbtn-on { background:var(--bd_); border-color:var(--bb); color:var(--blue); }

.jp-saved-btn {
  display:flex; align-items:center; gap:.38rem;
  padding:.38rem .8rem; border-radius:8px;
  border:1px solid var(--bd2); background:var(--sf2);
  color:var(--t2); font-family:inherit; font-size:calc(0.8rem * ${fontScale}); font-weight:600;
  cursor:pointer; transition:all .18s; position:relative;
}
.jp-saved-btn:hover,.jp-saved-on { background:var(--gd); border-color:var(--gb); color:var(--gold); }
.jp-saved-dot {
  position:absolute; top:-5px; right:-5px;
  width:16px; height:16px; background:var(--teal); color:#fff;
  border-radius:50%; font-size:.6rem; font-weight:800;
  display:flex; align-items:center; justify-content:center;
  border:2px solid var(--bg);
}
.jp-match-pill {
  display:flex; align-items:center; gap:.4rem;
  background:var(--gd); border:1px solid var(--gb);
  border-radius:999px; padding:.38rem .85rem;
  font-size:calc(0.78rem * ${fontScale}); color:var(--gold); white-space:nowrap;
}
.jp-match-dot { width:7px; height:7px; border-radius:50%; background:var(--gold); animation:pulse 2s infinite; }
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}

/* ── Accessibility popover ── */
.jp-pop-wrap { position:relative; }
.ac-panel {
  position:absolute; top:calc(100% + 10px); right:0;
  width:256px;
  background:var(--sf); border:1px solid var(--bd2);
  border-radius:16px; box-shadow:0 10px 36px var(--sh);
  padding:1rem 1.1rem; z-index:300;
  animation:afd .18s ease;
}
@keyframes afd{from{opacity:0;transform:translateY(-5px)}to{opacity:1;transform:translateY(0)}}
.ac-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:.75rem;}
.ac-title{display:flex;align-items:center;gap:.4rem;font-size:.68rem;font-weight:800;letter-spacing:.07em;text-transform:uppercase;color:var(--blue);}
.ac-close{width:22px;height:22px;background:none;border:none;color:var(--t3);cursor:pointer;border-radius:5px;display:flex;align-items:center;justify-content:center;transition:all .15s;}
.ac-close:hover{color:var(--t1);background:var(--sf2);}
.ac-section-label{display:flex;align-items:center;gap:.35rem;font-size:.65rem;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:var(--t3);margin-bottom:.45rem;}
.ac-opts{display:flex;flex-direction:column;gap:.32rem;}
.ac-opt{display:flex;align-items:center;gap:.6rem;padding:.52rem .7rem;border:1.5px solid var(--bd2);border-radius:9px;background:var(--sf2);color:var(--t2);font-family:inherit;font-size:calc(0.82rem * ${fontScale});font-weight:600;cursor:pointer;transition:all .18s;text-align:left;}
.ac-opt:hover{border-color:var(--bb);color:var(--blue);background:var(--bd_);}
.ac-active{border-color:var(--bb)!important;color:var(--blue)!important;background:var(--bd_)!important;}
.ac-opt-ico{width:26px;height:26px;flex-shrink:0;border-radius:6px;background:var(--sf);border:1px solid var(--bd2);display:flex;align-items:center;justify-content:center;color:var(--t2);}
.ac-check{margin-left:auto;color:var(--blue);}

/* Font size selector */
.ac-size-row{display:flex;gap:.3rem;margin-bottom:.3rem;}
.ac-size-btn{flex:1;height:36px;border:1.5px solid var(--bd2);border-radius:8px;background:var(--sf2);color:var(--t2);display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all .18s;}
.ac-size-btn:hover{border-color:var(--bb);color:var(--blue);}
.ac-size-active{border-color:var(--bb)!important;background:var(--bd_)!important;color:var(--blue)!important;}
.ac-size-label-row{display:flex;gap:.3rem;margin-bottom:.1rem;}
.ac-size-name{flex:1;text-align:center;font-size:.6rem;color:var(--t3);font-weight:500;}
.ac-size-name-active{color:var(--blue);font-weight:700;}

/* FAB */
.jp-fab{position:fixed;bottom:1.4rem;right:1.4rem;width:44px;height:44px;border-radius:50%;background:linear-gradient(135deg,var(--teal),var(--teal2));color:#fff;border:none;display:flex;align-items:center;justify-content:center;cursor:pointer;z-index:150;box-shadow:0 4px 14px var(--sh);transition:transform .2s,box-shadow .2s;}
.jp-fab:hover{transform:scale(1.07);box-shadow:0 7px 22px var(--sh);}
.jp-dark .jp-fab{background:linear-gradient(135deg,#2D6B3F,#5DB87A);}

/* ── Layout ── */
.jp-layout{display:flex;gap:0;padding:0 2rem;}
.jp-main{flex:1;min-width:0;padding-bottom:2rem;}
.jp-split .jp-main{flex:1;}
.jp-sidebar{width:355px;flex-shrink:0;border-left:1px solid var(--bd);background:var(--sf);position:sticky;top:56px;height:calc(100vh - 56px);overflow:hidden;display:flex;flex-direction:column;animation:slin .22s ease;}
@keyframes slin{from{transform:translateX(14px);opacity:0}to{transform:translateX(0);opacity:1}}
.jp-fp-overlay{position:fixed;inset:0;top:56px;background:var(--bg);z-index:200;overflow:auto;animation:fdin .2s ease;}
@keyframes fdin{from{opacity:0}to{opacity:1}}

/* ── Saved panel ── */
.sj-panel{display:flex;flex-direction:column;height:100%;}
.sj-full{max-width:880px;margin:0 auto;padding:2rem;height:auto;}
.sj-header{display:flex;align-items:center;justify-content:space-between;padding:1rem 1.2rem;border-bottom:1px solid var(--bd);flex-shrink:0;}
.sj-full .sj-header{padding:0 0 1rem;border-bottom:1px solid var(--bd);margin-bottom:1.5rem;}
.sj-title{display:flex;align-items:center;gap:.45rem;font-size:calc(0.92rem * ${fontScale});font-weight:700;color:var(--t1);}
.sj-badge{padding:.08rem .45rem;background:var(--gd);color:var(--gold);border:1px solid var(--gb);border-radius:999px;font-size:.68rem;font-weight:700;}
.sj-hdr-btns{display:flex;gap:.3rem;}
.sj-ibtn{width:26px;height:26px;border-radius:6px;border:1px solid var(--bd2);background:var(--sf2);color:var(--t2);display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all .15s;}
.sj-ibtn:hover{border-color:var(--tb);color:var(--teal);background:var(--td);}
.sj-body{flex:1;overflow-y:auto;padding:1rem 1.2rem;}
.sj-full .sj-body{padding:0;}
.sj-empty{display:flex;flex-direction:column;align-items:center;justify-content:center;padding:3rem 1rem;text-align:center;color:var(--t3);gap:.5rem;}
.sj-empty-t{font-weight:600;font-size:calc(0.88rem * ${fontScale});color:var(--t2);}
.sj-empty-s{font-size:calc(0.76rem * ${fontScale});}
.sj-list{display:flex;flex-direction:column;gap:.75rem;}
.sj-item{display:flex;gap:.8rem;padding:.9rem;background:var(--sf2);border:1px solid var(--bd);border-radius:11px;transition:border-color .18s;}
.sj-item:hover{border-color:var(--bd2);}
.sj-logo{width:36px;height:36px;flex-shrink:0;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:.68rem;font-weight:800;}
.sj-info{flex:1;min-width:0;}
.sj-pos{font-size:calc(0.85rem * ${fontScale});font-weight:700;color:var(--t1);margin-bottom:.12rem;}
.sj-co{font-size:calc(0.73rem * ${fontScale});color:var(--t2);margin-bottom:.45rem;}
.sj-meta{display:flex;gap:.38rem;margin-bottom:.45rem;flex-wrap:wrap;align-items:center;}
.sj-mtag{padding:.12rem .5rem;background:var(--td);color:var(--teal);border:1px solid var(--tb);border-radius:999px;font-size:.65rem;font-weight:600;}
.sj-sal{font-size:.7rem;font-weight:700;color:var(--teal2);}
.sj-loc{display:flex;align-items:center;gap:.28rem;font-size:calc(0.73rem * ${fontScale});color:var(--t2);margin-bottom:.45rem;}
.sj-pwd-row{display:flex;flex-wrap:wrap;gap:.28rem;margin-bottom:.45rem;}
.sj-pc{padding:.12rem .45rem;background:var(--sf);border:1px solid var(--bd);border-radius:4px;font-size:.65rem;color:var(--t2);}
.sj-pc.hl{background:var(--gd);border-color:var(--gb);color:var(--gold);font-weight:600;}
.sj-desc{font-size:calc(0.76rem * ${fontScale});color:var(--t2);line-height:1.55;margin-bottom:.55rem;}
.sj-contacts{display:flex;flex-direction:column;gap:.28rem;margin-bottom:.65rem;}
.sj-contacts span{display:flex;align-items:center;gap:.3rem;font-size:calc(0.73rem * ${fontScale});color:var(--t2);}
.sj-actions{display:flex;gap:.45rem;}
.sj-apply{padding:.32rem .85rem;background:var(--apply-grad);border:none;border-radius:6px;color:#fff;font-family:inherit;font-size:calc(0.72rem * ${fontScale});font-weight:700;cursor:pointer;transition:opacity .18s;}
.sj-apply:hover{opacity:.88;}
.sj-remove{padding:.32rem .85rem;background:none;border:1px solid var(--bd2);border-radius:6px;color:var(--t3);font-family:inherit;font-size:calc(0.72rem * ${fontScale});font-weight:600;cursor:pointer;transition:all .18s;}
.sj-remove:hover{border-color:var(--red);color:var(--red);}

/* ── Tabs ── */
.jp-tabs{display:flex;gap:.3rem;border-bottom:1px solid var(--bd);margin-bottom:1.1rem;}
.jp-tab{display:flex;align-items:center;gap:.4rem;background:none;border:none;border-bottom:2px solid transparent;padding:.5rem .85rem;margin-bottom:-1px;font-family:inherit;font-size:calc(0.83rem * ${fontScale});font-weight:600;color:var(--t2);cursor:pointer;transition:all .18s;}
.jp-tab:hover{color:var(--t1);}
.jp-tab-on{color:var(--teal);border-bottom-color:var(--teal);}
.jp-tct{padding:.08rem .42rem;border-radius:999px;font-size:.68rem;font-weight:700;background:var(--sf2);color:var(--t2);}
.jp-tct-gold{background:var(--gd);color:var(--gold);}

/* ── Filters ── */
.jp-filters{display:flex;flex-direction:column;gap:.6rem;margin-bottom:1rem;}
.jp-sw{position:relative;}
.jp-si{position:absolute;left:.85rem;top:50%;transform:translateY(-50%);color:var(--t3);pointer-events:none;display:flex;align-items:center;}
.jp-search{width:100%;padding:.65rem 1rem .65rem 2.4rem;background:var(--sf);border:1px solid var(--bd2);border-radius:10px;color:var(--t1);font-family:inherit;font-size:calc(0.86rem * ${fontScale});outline:none;transition:border-color .18s;}
.jp-search::placeholder{color:var(--t3);}
.jp-search:focus{border-color:var(--teal);}
.jp-fr{display:flex;gap:.45rem;flex-wrap:wrap;}
.jp-sel{flex:1;min-width:125px;padding:.52rem .75rem;background:var(--sf);border:1px solid var(--bd2);border-radius:9px;color:var(--t2);font-family:inherit;font-size:calc(0.8rem * ${fontScale});outline:none;cursor:pointer;transition:border-color .18s;}
.jp-sel:focus{border-color:var(--teal);color:var(--t1);}

/* ── Match banner ── */
.jp-mbanner{display:flex;align-items:center;gap:.85rem;background:linear-gradient(135deg,var(--td),var(--gd));border:1px solid var(--tb);border-radius:11px;padding:.82rem 1rem;margin-bottom:1rem;}
.jp-mstar{font-size:1.1rem;color:var(--gold);}
.jp-mbt{font-size:calc(0.85rem * ${fontScale});font-weight:700;color:var(--t1);margin-bottom:.12rem;}
.jp-mbs{font-size:calc(0.76rem * ${fontScale});color:var(--t2);}
.jp-mbs strong{color:var(--teal);}
.jp-rct{font-size:calc(0.73rem * ${fontScale});color:var(--t3);margin-bottom:.8rem;font-weight:500;}

/* ── Job list + cards ── */
.jp-list{display:flex;flex-direction:column;gap:.8rem;}
.jc{position:relative;background:var(--sf);border:1px solid var(--bd2);border-radius:15px;padding:1.2rem 1.3rem;transition:border-color .2s,box-shadow .2s;}
.jc:hover{box-shadow:0 4px 18px var(--sh);}
.jc-top{border-color:var(--gb);background:var(--card-top);}
.jc-top:hover{border-color:var(--gold);box-shadow:0 4px 22px var(--sh);}
.jc-badge{position:absolute;top:-1px;right:1rem;padding:.18rem .6rem;border-radius:0 0 8px 8px;font-size:.65rem;font-weight:700;letter-spacing:.04em;}
.jc-badge-top{background:var(--gold);color:#fff;}
.jp-dark .jc-badge-top{background:linear-gradient(135deg,#2D6B3F,#5DB87A);color:#fff;}
.jc-badge-good{background:var(--td);color:var(--teal);border:1px solid var(--tb);border-top:none;}
.jc-urgent{position:absolute;top:.85rem;right:.85rem;padding:.15rem .5rem;background:rgba(248,81,73,.1);color:var(--red);border:1px solid rgba(248,81,73,.28);border-radius:999px;font-size:.65rem;font-weight:700;}
.jc-urgent-shift{right:7.5rem;}
.jc-header{display:flex;align-items:flex-start;gap:.85rem;margin-bottom:.75rem;padding-right:5rem;}
.jc-logo{width:40px;height:40px;border-radius:9px;display:flex;align-items:center;justify-content:center;font-size:.68rem;font-weight:800;flex-shrink:0;letter-spacing:.02em;}
.jc-pos{font-size:calc(0.98rem * ${fontScale});font-weight:700;color:var(--t1);margin-bottom:.18rem;letter-spacing:-.01em;}
.jc-co{font-size:calc(0.78rem * ${fontScale});color:var(--t2);font-weight:500;display:flex;align-items:center;gap:.38rem;}
.jc-verified{display:inline-flex;align-items:center;gap:.18rem;font-size:.62rem;font-weight:700;color:var(--green);background:var(--td);padding:.1rem .42rem;border-radius:999px;border:1px solid var(--tb);}
.jc-right{margin-left:auto;text-align:right;flex-shrink:0;}
.jc-sal{font-size:calc(0.8rem * ${fontScale});font-weight:700;color:var(--teal);margin-bottom:.18rem;}
.jc-age{font-size:.68rem;color:var(--t3);}
.jc-tags{display:flex;flex-wrap:wrap;gap:.32rem;margin-bottom:.72rem;}
.jc-tag{display:inline-flex;align-items:center;gap:.22rem;padding:.16rem .58rem;border-radius:999px;font-size:calc(0.68rem * ${fontScale});font-weight:600;}
.jc-tag-s{background:var(--td);color:var(--teal);border:1px solid var(--tb);}
.jc-tag-t{background:var(--bd_);color:var(--blue);border:1px solid var(--bb);}
.jc-tag-l{background:var(--sf2);color:var(--t2);border:1px solid var(--bd2);}
.jc-pwd{display:flex;align-items:flex-start;gap:.45rem;margin-bottom:.68rem;flex-wrap:wrap;}
.jc-pwd-lbl{font-size:.65rem;font-weight:700;color:var(--t3);text-transform:uppercase;letter-spacing:.05em;margin-top:.16rem;white-space:nowrap;}
.jc-pwd-chips{display:flex;flex-wrap:wrap;gap:.28rem;}
.jc-chip{padding:.13rem .48rem;background:var(--sf2);border:1px solid var(--bd);border-radius:5px;font-size:calc(0.65rem * ${fontScale});color:var(--t2);}
.jc-chip-hl{background:var(--gd);border-color:var(--gb);color:var(--gold);font-weight:600;}
.jc-desc{font-size:calc(0.8rem * ${fontScale});color:var(--t2);line-height:1.65;margin-bottom:.8rem;}
.jc-foot{display:flex;align-items:center;justify-content:space-between;gap:.45rem;}
.jc-expand{background:none;border:1px solid var(--bd2);border-radius:7px;padding:.35rem .82rem;font-family:inherit;font-size:calc(0.72rem * ${fontScale});font-weight:600;color:var(--t2);cursor:pointer;transition:all .18s;}
.jc-expand:hover{border-color:var(--tb);color:var(--teal);}
.jc-save{display:flex;align-items:center;gap:.3rem;background:none;border:1px solid var(--bd2);border-radius:7px;padding:.35rem .72rem;font-family:inherit;font-size:calc(0.72rem * ${fontScale});font-weight:600;color:var(--t2);cursor:pointer;transition:all .18s;}
.jc-save:hover{border-color:var(--gb);color:var(--gold);}
.jc-saved{border-color:var(--gb);color:var(--gold);background:var(--gd);}
.jc-expand-body{margin-top:1rem;border-top:1px solid var(--bd);padding-top:1rem;animation:xea .2s ease;}
@keyframes xea{from{opacity:0;transform:translateY(-4px)}to{opacity:1;transform:translateY(0)}}
.jc-grid{display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem;}
.jc-sect-full{grid-column:1/-1;}
.jc-sect-t{font-size:.65rem;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:var(--t3);margin-bottom:.5rem;}
.jc-ul{list-style:none;display:flex;flex-direction:column;gap:.28rem;}
.jc-ul li{font-size:calc(0.78rem * ${fontScale});color:var(--t2);padding-left:.8rem;position:relative;}
.jc-ul li::before{content:'·';position:absolute;left:0;color:var(--t3);font-weight:700;}
.jc-ul-green li{color:var(--green2);padding-left:0;display:flex;align-items:flex-start;gap:.3rem;}
.jc-ul-green li::before{content:none;}
.jc-ul-green li svg{flex-shrink:0;margin-top:2px;color:var(--green);}
.jc-contacts{display:flex;flex-direction:column;gap:.42rem;}
.jc-ct{display:flex;align-items:flex-start;gap:.4rem;font-size:calc(0.78rem * ${fontScale});color:var(--t2);}
.jc-ct svg{flex-shrink:0;margin-top:2px;color:var(--t3);}
.jc-ct a{color:var(--blue);text-decoration:none;}
.jc-ct a:hover{text-decoration:underline;}
.jc-actions{display:flex;gap:.6rem;align-items:center;}
.jc-apply{background:var(--apply-grad);border:none;border-radius:8px;padding:.58rem 1.35rem;font-family:inherit;font-size:calc(0.82rem * ${fontScale});font-weight:700;color:#fff;cursor:pointer;transition:all .2s;box-shadow:0 3px 11px var(--apply-sh);}
.jc-apply:hover{transform:translateY(-1px);box-shadow:0 5px 16px var(--apply-sh);}
.jc-save-lg{display:flex;align-items:center;gap:.32rem;background:none;border:1px solid var(--bd2);border-radius:8px;padding:.58rem 1rem;font-family:inherit;font-size:calc(0.82rem * ${fontScale});font-weight:600;color:var(--t2);cursor:pointer;transition:all .18s;}
.jc-save-lg:hover{border-color:var(--gb);color:var(--gold);}
.jc-save-lg.jc-saved{border-color:var(--gb);color:var(--gold);background:var(--gd);}
.jp-empty{text-align:center;padding:3.5rem 2rem;}
.jp-ei{color:var(--t3);margin-bottom:.8rem;display:flex;justify-content:center;}
.jp-et{font-size:calc(0.92rem * ${fontScale});font-weight:600;color:var(--t2);margin-bottom:.3rem;}
.jp-es{font-size:calc(0.8rem * ${fontScale});color:var(--t3);}

/* ── Responsive ── */
@media(max-width:900px){
  .jp-toolbar,.jp-layout{padding:1.1rem 1rem 0;}
  .jp-sidebar{display:none;}
  .jp-fp-overlay{padding:1rem;}
  .jc-grid{grid-template-columns:1fr;}
  .jc-header{padding-right:0;flex-wrap:wrap;}
  .jc-right{width:100%;text-align:left;}
  .jp-fr{flex-direction:column;}
}
    `}</style>
  );
}