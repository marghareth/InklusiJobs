'use client';

export default function PlaceholderPage({ title, icon, description }) {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Instrument+Sans:wght@400;500;600;700&display=swap');

        .ph-wrap {
          min-height: calc(100vh - 58px);
          display: flex; align-items: center; justify-content: center;
          padding: 48px;
          background-color: #F9F8F6;
          background-image:
            radial-gradient(ellipse 80% 50% at 50% 50%, rgba(180,160,130,0.06) 0%, transparent 70%);
        }
        .ph-card {
          text-align: center; padding: 52px 44px;
          background: rgba(255,255,255,0.72);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          border: 1px solid rgba(180,160,130,0.2);
          border-radius: 24px;
          max-width: 400px;
          box-shadow: 0 4px 24px rgba(180,160,130,0.1);
        }
        .ph-icon { font-size: 50px; margin-bottom: 20px; line-height: 1; }
        .ph-title {
          font-family: 'Playfair Display', serif;
          font-size: 23px; font-weight: 700;
          color: #2C2A27; letter-spacing: -0.3px;
          margin-bottom: 12px; line-height: 1.2;
        }
        .ph-desc {
          font-family: 'Instrument Sans', sans-serif;
          color: rgba(44,42,39,0.5); font-size: 13.5px;
          line-height: 1.7; margin-bottom: 28px;
        }
        .ph-badge {
          display: inline-block; padding: 7px 18px; border-radius: 10px;
          background: rgba(107,143,113,0.08);
          border: 1px solid rgba(107,143,113,0.22);
          font-family: 'Instrument Sans', sans-serif;
          font-size: 11px; font-weight: 700;
          color: #4E7055; letter-spacing: 1.2px; text-transform: uppercase;
        }
      `}</style>

      <div className="ph-wrap">
        <div className="ph-card">
          <div className="ph-icon">{icon}</div>
          <div className="ph-title">{title}</div>
          <p className="ph-desc">{description}</p>
          <span className="ph-badge">Coming Soon</span>
        </div>
      </div>
    </>
  );
}