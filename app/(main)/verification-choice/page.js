"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function VerificationChoicePage() {
  const router = useRouter();
  const [job, setJob] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const results = JSON.parse(localStorage.getItem("inklusijobs_results") || "{}");
      if (results?.job?.title) setJob(results.job);
    } catch {}
  }, []);

  const handleVerify = () => router.push("/verification");
  const handleSkip  = () => router.push("/dashboard");

  if (!mounted) return null;

  return (
    <div className="vc-page">
      <VCStyles />

      <div className="vc-shell">
        {/* Logo */}
        <div className="vc-logo-row">
          <div className="vc-logo-mark">IJ</div>
          <span className="vc-logo-text">InklusiJobs</span>
        </div>

        <div className="vc-card">
          {/* Badge */}
          <div className="vc-badge">
            <span className="vc-badge-icon">🏅</span>
            <span className="vc-badge-label">Optional Step</span>
          </div>

          <h1 className="vc-title">Get Verified & Stand Out</h1>
          <p className="vc-subtitle">
            Verified candidates are <strong>3× more likely</strong> to be shortlisted by employers.
            {job?.title && <> Boost your chances for <strong>{job.title}</strong>.</>}
          </p>

          {/* Benefits list */}
          <ul className="vc-benefits">
            {[
              { icon: "✅", text: "Verified badge on your profile" },
              { icon: "🚀", text: "Priority visibility to employers" },
              { icon: "🎯", text: "Personalised roadmap after verification" },
              { icon: "🔒", text: "Your data stays private & secure" },
            ].map(({ icon, text }) => (
              <li key={text} className="vc-benefit-item">
                <span className="vc-benefit-icon">{icon}</span>
                <span>{text}</span>
              </li>
            ))}
          </ul>

          {/* CTAs */}
          <div className="vc-actions">
            <button className="vc-btn-primary" onClick={handleVerify}>
              Get Verified Now →
            </button>
            <button className="vc-btn-skip" onClick={handleSkip}>
              Skip for now
            </button>
          </div>
        </div>

        <p className="vc-footer">🔒 Verification is free and takes about 2 minutes.</p>
      </div>
    </div>
  );
}

function VCStyles() {
  return (
    <style jsx global>{`
      @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
      :root { --teal:#479880; --blue:#4B959E; --bg:#f4f9f8; }
      *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
      body { background:var(--bg); }

      .vc-page {
        min-height: 100vh;
        background: var(--bg);
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: 'Plus Jakarta Sans', sans-serif;
        padding: 2rem 1.5rem;
      }
      .vc-shell { width: 100%; max-width: 480px; }

      .vc-logo-row {
        display: flex; align-items: center; gap: 0.6rem;
        justify-content: center; margin-bottom: 1.5rem;
      }
      .vc-logo-mark {
        width: 36px; height: 36px;
        background: linear-gradient(135deg, var(--teal), var(--blue));
        border-radius: 10px; display: flex; align-items: center;
        justify-content: center; color: white; font-weight: 800; font-size: 0.85rem;
      }
      .vc-logo-text { font-weight: 700; font-size: 1.1rem; color: #0f2421; letter-spacing: -0.02em; }

      .vc-card {
        background: white;
        border-radius: 24px;
        padding: 2.4rem 2.4rem 2rem;
        box-shadow: 0 4px 6px rgba(71,152,128,0.04), 0 20px 60px rgba(71,152,128,0.10);
        border: 1px solid rgba(71,152,128,0.08);
        text-align: center;
      }

      .vc-badge {
        display: inline-flex; align-items: center; gap: 0.4rem;
        background: #f0faf7; border: 1px solid #c5e8df;
        border-radius: 999px; padding: 0.3rem 0.85rem;
        font-size: 0.78rem; font-weight: 600; color: var(--teal);
        margin-bottom: 1.2rem;
      }

      .vc-title {
        font-size: 1.6rem; font-weight: 800; color: #0f2421;
        letter-spacing: -0.03em; margin-bottom: 0.7rem;
        line-height: 1.2;
      }
      .vc-subtitle {
        font-size: 0.92rem; color: #4a6360; line-height: 1.65;
        margin-bottom: 1.6rem;
      }
      .vc-subtitle strong { color: #0f2421; }

      .vc-benefits {
        list-style: none;
        background: #f8fcfb;
        border: 1px solid #e4ecea;
        border-radius: 14px;
        padding: 1rem 1.2rem;
        margin-bottom: 1.8rem;
        text-align: left;
        display: flex; flex-direction: column; gap: 0.65rem;
      }
      .vc-benefit-item {
        display: flex; align-items: center; gap: 0.7rem;
        font-size: 0.88rem; font-weight: 500; color: #2e4f4c;
      }
      .vc-benefit-icon { font-size: 1rem; flex-shrink: 0; }

      .vc-actions {
        display: flex; flex-direction: column; gap: 0.75rem;
      }
      .vc-btn-primary {
        background: linear-gradient(135deg, var(--teal), var(--blue));
        border: none; border-radius: 12px;
        padding: 0.9rem 2rem;
        font-family: 'Plus Jakarta Sans', sans-serif;
        font-size: 1rem; font-weight: 700; color: white;
        cursor: pointer;
        transition: all 0.2s ease;
        box-shadow: 0 4px 16px rgba(71,152,128,0.3);
      }
      .vc-btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(71,152,128,0.35); }

      .vc-btn-skip {
        background: none; border: none;
        font-family: 'Plus Jakarta Sans', sans-serif;
        font-size: 0.88rem; font-weight: 600; color: #7a9b97;
        cursor: pointer; padding: 0.4rem;
        transition: color 0.15s ease;
      }
      .vc-btn-skip:hover { color: #4a6360; }

      .vc-footer {
        text-align: center; font-size: 0.78rem; color: #7a9b97; margin-top: 1.25rem;
      }
    `}</style>
  );
}