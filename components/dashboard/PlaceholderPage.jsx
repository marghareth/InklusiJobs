'use client';

export default function PlaceholderPage({ title, icon, description }) {
  return (
    <>
      <style>{`
        .ph-root {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: calc(100vh - 100px);
          gap: 16px;
          padding: 40px;
          font-family: 'Syne', sans-serif;
          text-align: center;
        }
        .ph-icon {
          font-size: 56px;
          filter: drop-shadow(0 0 24px rgba(99,102,241,0.35));
          margin-bottom: 8px;
        }
        .ph-title {
          font-size: 26px;
          font-weight: 800;
          color: #fff;
          letter-spacing: -0.5px;
        }
        .ph-desc {
          font-size: 14px;
          color: rgba(255,255,255,0.35);
          max-width: 380px;
          line-height: 1.7;
          font-family: 'DM Mono', monospace;
        }
        .ph-chip {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 16px;
          background: rgba(99,102,241,0.1);
          border: 1px solid rgba(99,102,241,0.2);
          border-radius: 20px;
          font-size: 12px;
          color: #818cf8;
          font-family: 'DM Mono', monospace;
          margin-top: 8px;
        }
      `}</style>
      <div className="ph-root">
        <div className="ph-icon">{icon}</div>
        <div className="ph-title">{title}</div>
        <div className="ph-desc">{description}</div>
        <div className="ph-chip">🚧 Coming soon — this section is under construction</div>
      </div>
    </>
  );
}