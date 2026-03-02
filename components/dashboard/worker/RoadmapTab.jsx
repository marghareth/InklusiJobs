// components/dashboard/worker/RoadmapTab.jsx
// Drop this into your dashboard's tab system as the "Roadmap" tab content.
// It reads from localStorage and shows either an empty state with Generate CTA,
// or a summary of the existing roadmap with a link to the full roadmap page.

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const LS = {
  get: (key) => { try { return JSON.parse(localStorage.getItem(key) || "null"); } catch { return null; } },
};

export default function RoadmapTab() {
  const router = useRouter();
  const [roadmap,    setRoadmap]    = useState(null);
  const [progress,   setProgress]   = useState(null);
  const [generating, setGenerating] = useState(false);
  const [mounted,    setMounted]    = useState(false);

  useEffect(() => {
    setMounted(true);
    setRoadmap(LS.get("inklusijobs_roadmap"));
    setProgress(LS.get("inklusijobs_roadmap_progress"));
  }, []);

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const scoring = LS.get("inklusijobs_scoring");
      const job     = LS.get("inklusijobs_job_for_roadmap");

      if (scoring && job) {
        // Has assessment results — generate via API
        const res = await fetch("/api/roadmap/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ scoring, job }),
        });
        if (res.ok) {
          const data = await res.json();
          if (data?.roadmap) {
            localStorage.setItem("inklusijobs_roadmap", JSON.stringify(data.roadmap));
          }
        }
      }
      // Navigate to roadmap page regardless (it will generate fallback if needed)
      router.push("/roadmap");
    } catch {
      router.push("/roadmap");
    }
  };

  if (!mounted) return null;

  // ── Empty state — no roadmap yet ──────────────────────────────────────────
  if (!roadmap) {
    return (
      <div style={{ padding: "2rem 0" }}>
        <div style={{
          background: "white", borderRadius: 20, padding: "2.5rem 2rem",
          border: "1.5px dashed #c8e8df", textAlign: "center",
          maxWidth: 520, margin: "0 auto",
        }}>
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🗺️</div>
          <h3 style={{ fontSize: "1.2rem", fontWeight: 800, color: "#0f2421", marginBottom: "0.6rem", letterSpacing: "-0.02em" }}>
            Your roadmap is waiting
          </h3>
          <p style={{ fontSize: "0.9rem", color: "#6b8a87", lineHeight: 1.7, marginBottom: "1.5rem" }}>
            Generate a personalised step-by-step learning plan tailored to your target job.
            AI will identify your skill gaps and curate free resources to close them.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginBottom: "1.5rem", textAlign: "left", background: "#f4f9f8", borderRadius: 12, padding: "1rem 1.2rem" }}>
            {[
              "📚 Curated free learning resources",
              "🎯 Phase-by-phase skill building",
              "💼 Portfolio challenges per phase",
              "📈 Progress tracking built-in",
            ].map(item => (
              <span key={item} style={{ fontSize: "0.82rem", color: "#4a6360", fontWeight: 500 }}>{item}</span>
            ))}
          </div>

          <button
            onClick={handleGenerate}
            disabled={generating}
            style={{
              width: "100%", padding: "0.9rem", borderRadius: 12, fontSize: "0.95rem",
              fontWeight: 700, border: "none", cursor: generating ? "not-allowed" : "pointer",
              background: generating ? "#c5d9d6" : "linear-gradient(135deg, #479880, #4B959E)",
              color: "white", fontFamily: "inherit",
              boxShadow: generating ? "none" : "0 4px 16px rgba(71,152,128,0.3)",
              transition: "all 0.2s",
            }}
          >
            {generating ? "⚙️ Generating your roadmap…" : "✨ Generate My Roadmap"}
          </button>

          {/* If they haven't done assessment yet */}
          <p style={{ fontSize: "0.75rem", color: "#7a9b97", marginTop: "0.75rem" }}>
            Haven't taken the skills assessment yet?{" "}
            <button
              onClick={() => router.push("/job-select")}
              style={{ background: "none", border: "none", color: "#479880", fontWeight: 700, cursor: "pointer", fontSize: "0.75rem", textDecoration: "underline", fontFamily: "inherit" }}
            >
              Start here →
            </button>
          </p>
        </div>
      </div>
    );
  }

  // ── Roadmap exists — show summary card ────────────────────────────────────
  const overall    = progress?.overall || 0;
  const phases     = roadmap.phases || [];
  const totalWeeks = roadmap.totalWeeks || "—";

  return (
    <div style={{ padding: "1.5rem 0" }}>
      {/* Summary card */}
      <div style={{
        background: "white", borderRadius: 20, padding: "1.5rem",
        border: "1px solid #e4ecea", marginBottom: "1rem",
        boxShadow: "0 2px 12px rgba(71,152,128,0.07)",
      }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "1rem", marginBottom: "1.2rem" }}>
          <div>
            <div style={{ fontSize: "0.68rem", fontWeight: 700, color: "#4B959E", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 4 }}>Your Roadmap</div>
            <h3 style={{ fontSize: "1.05rem", fontWeight: 800, color: "#0f2421", lineHeight: 1.3, margin: 0 }}>{roadmap.title}</h3>
          </div>
          <div style={{ textAlign: "center", flexShrink: 0 }}>
            <div style={{ fontSize: "1.6rem", fontWeight: 800, color: overall >= 80 ? "#16A34A" : overall >= 40 ? "#D97706" : "#479880" }}>{overall}%</div>
            <div style={{ fontSize: "0.65rem", color: "#6b8a87", fontWeight: 600 }}>Complete</div>
          </div>
        </div>

        {/* Progress bar */}
        <div style={{ height: 8, background: "rgba(71,152,128,0.1)", borderRadius: 99, overflow: "hidden", marginBottom: "1rem" }}>
          <div style={{ height: "100%", width: `${overall}%`, background: "linear-gradient(90deg, #479880, #4B959E)", borderRadius: 99, transition: "width 1s ease" }} />
        </div>

        {/* Phase pills */}
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "1.2rem" }}>
          {phases.map((phase, i) => {
            const phasePct = progress?.[`phase${phase.phaseNumber}`] || 0;
            return (
              <div key={i} style={{
                padding: "0.3rem 0.8rem", borderRadius: 99, fontSize: "0.72rem", fontWeight: 700,
                background: phasePct === 100 ? "rgba(22,163,74,0.1)" : "rgba(71,152,128,0.08)",
                color: phasePct === 100 ? "#16A34A" : "#479880",
                border: `1px solid ${phasePct === 100 ? "rgba(22,163,74,0.2)" : "rgba(71,152,128,0.15)"}`,
              }}>
                {phasePct === 100 ? "✓ " : ""}{phase.title || `Phase ${phase.phaseNumber}`} · {phasePct}%
              </div>
            );
          })}
        </div>

        {/* Stats row */}
        <div style={{ display: "flex", gap: "1rem", padding: "0.8rem 1rem", background: "#f8fffe", borderRadius: 10, border: "1px solid #e4ecea", marginBottom: "1.2rem" }}>
          <div style={{ flex: 1, textAlign: "center" }}>
            <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "#0f2421" }}>{totalWeeks}</div>
            <div style={{ fontSize: "0.65rem", color: "#6b8a87", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>Weeks</div>
          </div>
          <div style={{ width: 1, background: "#e4ecea" }} />
          <div style={{ flex: 1, textAlign: "center" }}>
            <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "#0f2421" }}>{phases.length}</div>
            <div style={{ fontSize: "0.65rem", color: "#6b8a87", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>Phases</div>
          </div>
          <div style={{ width: 1, background: "#e4ecea" }} />
          <div style={{ flex: 1, textAlign: "center" }}>
            <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "#0f2421" }}>{overall}%</div>
            <div style={{ fontSize: "0.65rem", color: "#6b8a87", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>Done</div>
          </div>
        </div>

        <button
          onClick={() => router.push("/roadmap")}
          style={{
            width: "100%", padding: "0.85rem", borderRadius: 12, fontSize: "0.9rem",
            fontWeight: 700, border: "none", cursor: "pointer",
            background: "linear-gradient(135deg, #479880, #4B959E)",
            color: "white", fontFamily: "inherit",
            boxShadow: "0 4px 14px rgba(71,152,128,0.3)",
          }}
        >
          Continue Learning →
        </button>
      </div>

      {/* Encouragement */}
      {roadmap.encouragementMessage && (
        <div style={{
          display: "flex", gap: "0.75rem", alignItems: "flex-start",
          background: "linear-gradient(135deg, #f0faf7, #ebf7f8)",
          borderRadius: 12, padding: "1rem 1.2rem",
          border: "1px solid #c8e8df",
        }}>
          <span style={{ fontSize: "1.2rem", flexShrink: 0 }}>💬</span>
          <p style={{ fontSize: "0.85rem", color: "#2d5f55", lineHeight: 1.6, fontStyle: "italic", margin: 0 }}>
            {roadmap.encouragementMessage}
          </p>
        </div>
      )}
    </div>
  );
}