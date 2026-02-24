"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CAREER_TRACKS, JOBS } from "@/lib/jobs";

// ─── Storage helpers ──────────────────────────────────────────────────────────
function saveJobSelection(trackId, jobId) {
  try {
    localStorage.setItem(
      "inklusijobs_job_selection",
      JSON.stringify({ trackId, jobId })
    );
  } catch {}
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function JobSelectPage() {
  const router = useRouter();
  const [selectedTrack, setSelectedTrack] = useState(null);
  const [selectedJob, setSelectedJob]     = useState(null);
  const [step, setStep]                   = useState(1); // 1 = pick track, 2 = pick job

  const jobs = selectedTrack ? JOBS[selectedTrack] : [];
  const track = CAREER_TRACKS.find((t) => t.id === selectedTrack);

  function handleTrackSelect(trackId) {
    setSelectedTrack(trackId);
    setSelectedJob(null);
    setStep(2);
  }

  function handleJobSelect(jobId) {
    setSelectedJob(jobId);
  }

  function handleContinue() {
    if (!selectedTrack || !selectedJob) return;
    saveJobSelection(selectedTrack, selectedJob);
    router.push("/assessment");
  }

  function handleBack() {
    setStep(1);
    setSelectedJob(null);
  }

  return (
    <div className="ij-page">
      <Styles />

      <div className="ij-shell">
        {/* Logo */}
        <div className="ij-logo-row">
          <div className="ij-logo-mark">IJ</div>
          <span className="ij-logo-text">InklusiJobs</span>
        </div>

        {/* Header */}
        <div className="ij-header">
          <div className="ij-step-badge">
            Step {step} of 2 — {step === 1 ? "Choose a Career Track" : "Choose a Job"}
          </div>
          <h1 className="ij-title">
            {step === 1
              ? "What kind of work are you aiming for?"
              : `Which ${track?.label} role interests you?`}
          </h1>
          <p className="ij-subtitle">
            {step === 1
              ? "We'll assess your skills against the real requirements of jobs in this field."
              : "Pick the specific job you want. We'll check how ready you are for it."}
          </p>
        </div>

        {/* Step 1 — Career Track Selection */}
        {step === 1 && (
          <div className="ij-tracks">
            {CAREER_TRACKS.map((track) => (
              <button
                key={track.id}
                className={`ij-track-card ${selectedTrack === track.id ? "selected" : ""}`}
                onClick={() => handleTrackSelect(track.id)}
                style={{ "--track-color": track.color, "--track-gradient": track.gradient }}
              >
                <div className="ij-track-emoji">{track.emoji}</div>
                <div className="ij-track-info">
                  <div className="ij-track-label">{track.label}</div>
                  <div className="ij-track-desc">{track.description}</div>
                </div>
                <div className="ij-track-arrow">→</div>
              </button>
            ))}
          </div>
        )}

        {/* Step 2 — Job Selection */}
        {step === 2 && (
          <>
            <div className="ij-jobs">
              {jobs.map((job) => {
                const isSelected = selectedJob === job.id;
                return (
                  <button
                    key={job.id}
                    className={`ij-job-card ${isSelected ? "selected" : ""}`}
                    onClick={() => handleJobSelect(job.id)}
                    style={{ "--track-color": track?.color }}
                  >
                    {/* Selected checkmark */}
                    <div className={`ij-job-check ${isSelected ? "visible" : ""}`}>
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M2.5 7l3 3 6-6" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>

                    {/* Job header */}
                    <div className="ij-job-header">
                      <div className="ij-job-title">{job.title}</div>
                      <div className="ij-job-company">{job.company}</div>
                    </div>

                    {/* Tags */}
                    <div className="ij-job-tags">
                      <span className="ij-tag">{job.setup}</span>
                      <span className="ij-tag">{job.type}</span>
                      <span className="ij-tag salary">{job.salaryRange}</span>
                    </div>

                    {/* Description */}
                    <p className="ij-job-desc">{job.description}</p>

                    {/* Required skills preview */}
                    <div className="ij-skills-preview">
                      <div className="ij-skills-label">Key skills assessed:</div>
                      <div className="ij-skills-list">
                        {job.requiredSkills.slice(0, 3).map((s) => (
                          <span key={s.skill} className="ij-skill-chip">{s.skill}</span>
                        ))}
                        {job.requiredSkills.length > 3 && (
                          <span className="ij-skill-chip more">+{job.requiredSkills.length - 3} more</span>
                        )}
                      </div>
                    </div>

                    {/* PWD accommodations */}
                    <div className="ij-accommodations">
                      {job.pwdAccommodations.map((a) => (
                        <span key={a} className="ij-accommodation">✓ {a}</span>
                      ))}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Navigation */}
            <div className="ij-nav-row">
              <button className="ij-btn-back" onClick={handleBack}>
                ← Back
              </button>
              <button
                className={`ij-btn-primary ${!selectedJob ? "disabled" : ""}`}
                onClick={handleContinue}
                disabled={!selectedJob}
              >
                Start Assessment →
              </button>
            </div>
          </>
        )}

        <p className="ij-footer-note">
          🔒 Your selections are saved locally. You can change them anytime.
        </p>
      </div>
    </div>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
function Styles() {
  return (
    <style jsx global>{`
      @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

      :root {
        --teal:   #479880;
        --blue:   #4B959E;
        --mid:    #648FBF;
        --purple: #8891C9;
        --bg:     #f4f9f8;
      }

      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

      body { background: var(--bg); }

      .ij-page {
        min-height: 100vh;
        background: var(--bg);
        display: flex;
        align-items: flex-start;
        justify-content: center;
        font-family: 'Plus Jakarta Sans', sans-serif;
        padding: 2rem 1.5rem 4rem;
      }

      .ij-shell {
        width: 100%;
        max-width: 640px;
      }

      /* Logo */
      .ij-logo-row {
        display: flex;
        align-items: center;
        gap: 0.6rem;
        justify-content: center;
        margin-bottom: 2rem;
      }
      .ij-logo-mark {
        width: 36px; height: 36px;
        background: linear-gradient(135deg, var(--teal), var(--blue));
        border-radius: 10px;
        display: flex; align-items: center; justify-content: center;
        color: white; font-weight: 800; font-size: 0.85rem;
      }
      .ij-logo-text {
        font-weight: 700; font-size: 1.1rem; color: #0f2421; letter-spacing: -0.02em;
      }

      /* Header */
      .ij-header {
        text-align: center;
        margin-bottom: 2rem;
      }
      .ij-step-badge {
        display: inline-block;
        padding: 0.3rem 0.9rem;
        background: linear-gradient(135deg, #e8f6f2, #e4f2f5);
        color: #4B959E;
        border-radius: 999px;
        font-size: 0.72rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.06em;
        margin-bottom: 0.9rem;
      }
      .ij-title {
        font-size: 1.6rem;
        font-weight: 800;
        color: #0f2421;
        letter-spacing: -0.02em;
        line-height: 1.25;
        margin-bottom: 0.6rem;
      }
      .ij-subtitle {
        font-size: 0.95rem;
        color: #6b8a87;
        line-height: 1.6;
      }

      /* Track cards */
      .ij-tracks {
        display: flex;
        flex-direction: column;
        gap: 0.85rem;
      }
      .ij-track-card {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 1.2rem 1.4rem;
        background: white;
        border: 2px solid #e4ecea;
        border-radius: 18px;
        cursor: pointer;
        text-align: left;
        transition: all 0.2s ease;
        font-family: inherit;
        width: 100%;
      }
      .ij-track-card:hover {
        border-color: var(--track-color);
        background: var(--track-gradient);
        transform: translateY(-2px);
        box-shadow: 0 8px 24px rgba(71,152,128,0.12);
      }
      .ij-track-card.selected {
        border-color: var(--track-color);
        background: var(--track-gradient);
        box-shadow: 0 4px 20px rgba(71,152,128,0.15);
      }
      .ij-track-emoji {
        font-size: 2rem;
        flex-shrink: 0;
        width: 48px;
        height: 48px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: white;
        border-radius: 12px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.06);
      }
      .ij-track-info { flex: 1; }
      .ij-track-label {
        font-size: 1rem;
        font-weight: 700;
        color: #0f2421;
        margin-bottom: 0.2rem;
      }
      .ij-track-desc {
        font-size: 0.82rem;
        color: #6b8a87;
        font-weight: 400;
      }
      .ij-track-arrow {
        color: var(--track-color);
        font-size: 1.1rem;
        font-weight: 700;
        opacity: 0.6;
        transition: opacity 0.2s, transform 0.2s;
      }
      .ij-track-card:hover .ij-track-arrow {
        opacity: 1;
        transform: translateX(3px);
      }

      /* Job cards */
      .ij-jobs {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        margin-bottom: 1.5rem;
      }
      .ij-job-card {
        position: relative;
        padding: 1.4rem;
        background: white;
        border: 2px solid #e4ecea;
        border-radius: 18px;
        cursor: pointer;
        text-align: left;
        transition: all 0.2s ease;
        font-family: inherit;
        width: 100%;
      }
      .ij-job-card:hover {
        border-color: var(--track-color);
        transform: translateY(-2px);
        box-shadow: 0 8px 24px rgba(71,152,128,0.1);
      }
      .ij-job-card.selected {
        border-color: var(--track-color);
        background: linear-gradient(135deg, #f8fffe, #f5fbff);
        box-shadow: 0 4px 20px rgba(71,152,128,0.14);
      }

      /* Check indicator */
      .ij-job-check {
        position: absolute;
        top: 1rem;
        right: 1rem;
        width: 26px;
        height: 26px;
        border-radius: 50%;
        background: #e4ecea;
        border: 2px solid #c5d9d6;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s ease;
      }
      .ij-job-check.visible {
        background: var(--track-color);
        border-color: var(--track-color);
      }

      .ij-job-header {
        padding-right: 2.5rem;
        margin-bottom: 0.75rem;
      }
      .ij-job-title {
        font-size: 1.05rem;
        font-weight: 700;
        color: #0f2421;
        margin-bottom: 0.2rem;
      }
      .ij-job-company {
        font-size: 0.82rem;
        color: #6b8a87;
        font-weight: 500;
      }

      /* Tags */
      .ij-job-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 0.4rem;
        margin-bottom: 0.75rem;
      }
      .ij-tag {
        padding: 0.2rem 0.65rem;
        background: #f0faf7;
        color: #479880;
        border-radius: 999px;
        font-size: 0.72rem;
        font-weight: 600;
        border: 1px solid #c8e8df;
      }
      .ij-tag.salary {
        background: #fff8f0;
        color: #c47a3a;
        border-color: #f0d9bc;
      }

      .ij-job-desc {
        font-size: 0.85rem;
        color: #4a6360;
        line-height: 1.6;
        margin-bottom: 1rem;
      }

      /* Skills preview */
      .ij-skills-preview {
        margin-bottom: 0.85rem;
      }
      .ij-skills-label {
        font-size: 0.72rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        color: #7a9b97;
        margin-bottom: 0.4rem;
      }
      .ij-skills-list {
        display: flex;
        flex-wrap: wrap;
        gap: 0.35rem;
      }
      .ij-skill-chip {
        padding: 0.2rem 0.6rem;
        background: #eef5f4;
        color: #3d6b65;
        border-radius: 6px;
        font-size: 0.75rem;
        font-weight: 500;
      }
      .ij-skill-chip.more {
        background: #f0f0f8;
        color: #7a80b0;
      }

      /* Accommodations */
      .ij-accommodations {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
      }
      .ij-accommodation {
        font-size: 0.75rem;
        color: #479880;
        font-weight: 500;
      }

      /* Navigation */
      .ij-nav-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 1rem;
        margin-bottom: 1.25rem;
      }
      .ij-btn-back {
        background: none;
        border: 2px solid #e4ecea;
        border-radius: 12px;
        padding: 0.75rem 1.3rem;
        font-family: 'Plus Jakarta Sans', sans-serif;
        font-size: 0.9rem;
        font-weight: 600;
        color: #4a6360;
        cursor: pointer;
        transition: all 0.18s ease;
      }
      .ij-btn-back:hover { border-color: var(--teal); color: var(--teal); }

      .ij-btn-primary {
        background: linear-gradient(135deg, var(--teal), var(--blue));
        border: none;
        border-radius: 12px;
        padding: 0.8rem 2rem;
        font-family: 'Plus Jakarta Sans', sans-serif;
        font-size: 0.95rem;
        font-weight: 700;
        color: white;
        cursor: pointer;
        transition: all 0.2s ease;
        box-shadow: 0 4px 16px rgba(71,152,128,0.3);
      }
      .ij-btn-primary:hover:not(.disabled) {
        transform: translateY(-2px);
        box-shadow: 0 8px 24px rgba(71,152,128,0.35);
      }
      .ij-btn-primary.disabled {
        background: #c5d9d6;
        box-shadow: none;
        cursor: not-allowed;
      }

      .ij-footer-note {
        text-align: center;
        font-size: 0.78rem;
        color: #7a9b97;
        margin-top: 0.5rem;
      }

      @media (max-width: 480px) {
        .ij-title { font-size: 1.35rem; }
        .ij-job-card { padding: 1.1rem; }
      }
    `}</style>
  );
}