'use client';

export default function StatCard({ icon, value, label, delta, color = '#2DB8A0' }) {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Instrument+Sans:wght@400;500;600;700&display=swap');

        .sc-card {
          background: rgba(255,255,255,0.92);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          border: 1px solid rgba(26,39,68,0.12);
          border-radius: 16px;
          padding: 22px 24px;
          display: flex; flex-direction: column; gap: 14px;
          position: relative; overflow: hidden;
          box-shadow: 0 2px 12px rgba(26,39,68,0.08), 0 1px 3px rgba(26,39,68,0.05);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          cursor: default;
        }
        .sc-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 28px rgba(26,39,68,0.12), 0 2px 6px rgba(26,39,68,0.07);
        }

        .sc-top {
          display: flex; align-items: flex-start; justify-content: space-between;
        }
        .sc-icon-wrap {
          width: 40px; height: 40px; border-radius: 11px;
          display: flex; align-items: center; justify-content: center;
          font-size: 18px;
        }
        .sc-delta {
          font-family: 'Instrument Sans', sans-serif;
          font-size: 11px; font-weight: 600;
          color: #2DB8A0;
          background: rgba(45,184,160,0.10);
          border: 1px solid rgba(45,184,160,0.22);
          padding: 3px 8px; border-radius: 20px;
          letter-spacing: 0.2px;
        }
        .sc-value {
          font-family: 'Playfair Display', serif;
          font-size: 32px; font-weight: 700;
          color: #1A2744; letter-spacing: -1px; line-height: 1;
        }
        .sc-label {
          font-family: 'Instrument Sans', sans-serif;
          font-size: 12px; color: rgba(26,39,68,0.50);
          font-weight: 500; letter-spacing: 0.2px;
          margin-top: 3px;
        }
        .sc-glow {
          position: absolute; bottom: -18px; right: -18px;
          width: 72px; height: 72px; border-radius: 50%;
          opacity: 0.10; pointer-events: none;
          filter: blur(4px);
        }
      `}</style>

      <div className="sc-card">
        <div className="sc-top">
          <div className="sc-icon-wrap" style={{ background: `${color}18`, border: `1px solid ${color}30` }}>
            {icon}
          </div>
          {delta && <span className="sc-delta">↑ {delta}</span>}
        </div>
        <div>
          <div className="sc-value">{value}</div>
          <div className="sc-label">{label}</div>
        </div>
        <div className="sc-glow" style={{ background: color }} />
      </div>
    </>
  );
}