'use client';

import { Ic } from './Icons';
import { FONT_SIZES } from './jobsData';

export default function A11yPanel({ 
  hc, setHc, 
  rm, setRm, 
  fontSize, setFontSize, 
  dyslexic, setDyslexic, 
  onClose 
}) {
  return (
    <div className="ac-panel">
      <div className="ac-header">
        <div className="ac-title">
          <Ic.A11y /> ACCESSIBILITY
        </div>
        <button className="ac-close" onClick={onClose}>
          <Ic.X />
        </button>
      </div>

      {/* Display section */}
      <div className="ac-section-label">Display</div>
      <div className="ac-opts">
        <button 
          className={`ac-opt ${!hc ? "ac-active" : ""}`} 
          onClick={() => setHc(false)}
        >
          <span className="ac-opt-ico" style={{background:"linear-gradient(135deg,#479880,#648FBF)"}}>
            <span style={{fontSize:"9px",fontWeight:800,color:"white",letterSpacing:"-0.02em"}}>abc</span>
          </span>
          Normal Text
          {!hc && <span className="ac-check"><Ic.Check /></span>}
        </button>
        
        <button 
          className={`ac-opt ${hc ? "ac-active" : ""}`} 
          onClick={() => setHc(!hc)}
        >
          <span className="ac-opt-ico"><Ic.Contrast /></span>
          High Contrast
          {hc && <span className="ac-check"><Ic.Check /></span>}
        </button>
        
        <button 
          className={`ac-opt ${rm ? "ac-active" : ""}`} 
          onClick={() => setRm(!rm)}
        >
          <span className="ac-opt-ico"><Ic.Pause /></span>
          Reduce Motion
          {rm && <span className="ac-check"><Ic.Check /></span>}
        </button>
      </div>

      {/* Font size section */}
      <div className="ac-section-label" style={{marginTop:"0.9rem"}}>
        <Ic.TextSize /> Text Size
      </div>
      <div className="ac-size-row">
        {FONT_SIZES.map(f => (
          <button
            key={f.id}
            className={`ac-size-btn ${fontSize === f.id ? "ac-size-active" : ""}`}
            onClick={() => setFontSize(f.id)}
            title={f.label}
          >
            <span style={{
              fontSize: `${0.65 + (FONT_SIZES.indexOf(f) * 0.1)}rem`,
              fontWeight: 700,
              lineHeight: 1
            }}>A</span>
          </button>
        ))}
      </div>
      <div className="ac-size-label-row">
        {FONT_SIZES.map(f => (
          <span 
            key={f.id} 
            className={`ac-size-name ${fontSize === f.id ? "ac-size-name-active" : ""}`}
          >
            {f.label}
          </span>
        ))}
      </div>

      {/* Font style section */}
      <div className="ac-section-label" style={{marginTop:"0.9rem"}}>
        <Ic.Font /> Font Style
      </div>
      <div className="ac-opts">
        <button 
          className={`ac-opt ${!dyslexic ? "ac-active" : ""}`} 
          onClick={() => setDyslexic(false)}
        >
          <span className="ac-opt-ico" style={{
            fontFamily:"'Plus Jakarta Sans',sans-serif",
            fontSize:"11px",
            fontWeight:700,
            color:"var(--blue)"
          }}>Aa</span>
          Default Font
          {!dyslexic && <span className="ac-check"><Ic.Check /></span>}
        </button>
        
        <button 
          className={`ac-opt ${dyslexic ? "ac-active" : ""}`} 
          onClick={() => setDyslexic(!dyslexic)}
        >
          <span className="ac-opt-ico" style={{
            fontFamily:"'OpenDyslexic','Comic Sans MS',sans-serif",
            fontSize:"10px",
            fontWeight:700,
            color:"var(--purp)"
          }}>Aa</span>
          <div style={{display:"flex",flexDirection:"column",gap:"1px",flex:1}}>
            <span>Dyslexia-Friendly</span>
            <span style={{fontSize:"0.62rem",color:"var(--t3)",fontWeight:400}}>
              OpenDyslexic · easier reading
            </span>
          </div>
          {dyslexic && <span className="ac-check"><Ic.Check /></span>}
        </button>
      </div>
    </div>
  );
}