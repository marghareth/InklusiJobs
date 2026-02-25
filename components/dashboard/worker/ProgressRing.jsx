'use client';

export default function StatCard({ icon, value, label, delta, color = '#6366f1', accentBg }) {
  return (
    <>
      <style>{`
        .stat-card {
          background: linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.02) 100%);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 16px;
          padding: 22px 24px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          position: relative;
          overflow: hidden;
          backdrop-filter: blur(10px);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          cursor: default;
        }
        .stat-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(0,0,0,0.25);
        }
        .stat-card::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.03) 0%, transparent 60%);
          pointer-events: none;
        }
        .stat-top {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
        }
        .stat-icon-wrap {
          width: 40px;
          height: 40px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
        }
        .stat-delta {
          font-family: 'DM Mono', monospace;
          font-size: 11px;
          font-weight: 500;
          color: #10b981;
          background: rgba(16,185,129,0.1);
          border: 1px solid rgba(16,185,129,0.15);
          padding: 3px 8px;
          border-radius: 20px;
        }
        .stat-value {
          font-family: 'Syne', sans-serif;
          font-size: 32px;
          font-weight: 800;
          color: #fff;
          letter-spacing: -1px;
          line-height: 1;
        }
        .stat-label {
          font-family: 'Syne', sans-serif;
          font-size: 12px;
          color: rgba(255,255,255,0.4);
          font-weight: 500;
          letter-spacing: 0.2px;
        }
        .stat-glow {
          position: absolute;
          bottom: -20px;
          right: -20px;
          width: 80px;
          height: 80px;
          border-radius: 50%;
          opacity: 0.08;
          pointer-events: none;
        }
      `}</style>

      <div className="stat-card">
        <div className="stat-top">
          <div className="stat-icon-wrap" style={{ background: accentBg || `${color}18`, border: `1px solid ${color}22` }}>
            {icon}
          </div>
          {delta && <div className="stat-delta">↑ {delta}</div>}
        </div>
        <div>
          <div className="stat-value">{value}</div>
          <div className="stat-label">{label}</div>
        </div>
        <div className="stat-glow" style={{ background: color }} />
      </div>
    </>
  );
}