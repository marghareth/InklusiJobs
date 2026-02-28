//app/(main)/admin/review-queue/page.js
"use client";

/**
 * app/(main)/admin/review-queue/page.js
 * Visit: http://localhost:3000/admin/review-queue
 *
 * Human reviewer dashboard for PWD verification submissions.
 * Shows flagged submissions ranked by risk score (lowest = most suspicious first).
 * Reviewer can: Approve, Reject, or Request Resubmission.
 */

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase";

// ─────────────────────────────────────────────
// Risk score color helper
// ─────────────────────────────────────────────
function scoreColor(score) {
  if (score >= 80) return { text: "text-green-700",  bg: "bg-green-100",  border: "border-green-200" };
  if (score >= 50) return { text: "text-amber-700",  bg: "bg-amber-100",  border: "border-amber-200" };
  return               { text: "text-red-700",    bg: "bg-red-100",    border: "border-red-200"   };
}

// ─────────────────────────────────────────────
// Suspicion level badge
// ─────────────────────────────────────────────
function SuspicionBadge({ level }) {
  const config = {
    LOW:    "bg-green-100 text-green-700",
    MEDIUM: "bg-amber-100 text-amber-700",
    HIGH:   "bg-red-100 text-red-700",
  }[level] || "bg-gray-100 text-gray-500";
  return (
    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${config}`}>
      {level || "—"}
    </span>
  );
}

// ─────────────────────────────────────────────
// Submission detail modal
// ─────────────────────────────────────────────
function ReviewModal({ submission, onClose, onDecision }) {
  const [decision, setDecision]   = useState(null);
  const [note, setNote]           = useState("");
  const [submitting, setSubmitting] = useState(false);

  const sc = scoreColor(submission.risk_score);

  const handleSubmit = async () => {
    if (!decision) return;
    setSubmitting(true);
    await onDecision(submission.id, decision, note);
    setSubmitting(false);
    onClose();
  };

  const Field = ({ label, value, flag }) => (
    <div className={`p-3 rounded-xl border ${flag ? "bg-red-50 border-red-200" : "bg-gray-50 border-gray-100"}`}>
      <div className="text-xs font-semibold text-gray-500 mb-0.5">{label}</div>
      <div className={`text-sm font-medium ${flag ? "text-red-700" : "text-gray-800"}`}>
        {value || <span className="text-gray-300 italic">Not extracted</span>}
      </div>
      {flag && <div className="text-xs text-red-500 mt-1">⚠️ {flag}</div>}
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">

        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 p-5 flex justify-between items-start rounded-t-2xl">
          <div>
            <div className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1">Submission Review</div>
            <h2 className="text-lg font-extrabold text-gray-900">{submission.applicant_name}</h2>
            <div className="text-sm text-gray-500">{submission.applicant_email}</div>
          </div>
          <div className="flex items-center gap-3">
            <div className={`${sc.bg} ${sc.border} ${sc.text} border rounded-xl px-3 py-1.5 text-center`}>
              <div className="text-lg font-extrabold leading-none">{submission.risk_score}</div>
              <div className="text-xs font-medium">/ 100</div>
            </div>
            <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 flex items-center justify-center font-bold">
              ×
            </button>
          </div>
        </div>

        <div className="p-5 space-y-5">

          {/* Extracted ID fields */}
          <div>
            <div className="text-sm font-bold text-gray-700 mb-3">Extracted ID Fields</div>
            <div className="grid grid-cols-2 gap-2">
              <Field
                label="PWD ID Number"
                value={submission.pwd_id_number}
                flag={submission.psgc_valid === false ? "PSGC format invalid" : null}
              />
              <Field
                label="Disability Type"
                value={submission.disability_type}
                flag={submission.disability_valid === false ? "Not a valid NCDA category" : null}
              />
              <Field
                label="Issuing LGU"
                value={submission.issuing_lgu}
                flag={submission.lgu_valid === false ? "City/Municipality mismatch" : null}
              />
              <Field
                label="AI Suspicion Level"
                value={<SuspicionBadge level={submission.ai_suspicion_level} />}
              />
            </div>
          </div>

          {/* Verification signals */}
          <div>
            <div className="text-sm font-bold text-gray-700 mb-3">Verification Signals</div>
            <div className="grid grid-cols-2 gap-2">
              {[
                ["Face Match",       `${submission.face_match_confidence ?? "—"}%`,  parseInt(submission.face_match_confidence) < 75],
                ["Forgery Signals",  `${submission.forgery_signal_count ?? "—"} detected`, parseInt(submission.forgery_signal_count) > 0],
                ["Cross-Doc Check",  submission.cross_doc_consistency,                submission.cross_doc_consistency === "INCONSISTENT"],
                ["DOH Registry",     submission.doh_registry_found ? "✅ Found" : "— Not found", false],
              ].map(([label, value, isFlag]) => (
                <div key={label} className={`p-3 rounded-xl border ${isFlag ? "bg-amber-50 border-amber-200" : "bg-gray-50 border-gray-100"}`}>
                  <div className="text-xs font-semibold text-gray-500 mb-0.5">{label}</div>
                  <div className={`text-sm font-semibold ${isFlag ? "text-amber-700" : "text-gray-700"}`}>{value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Flags */}
          {submission.flags?.length > 0 && (
            <div>
              <div className="text-sm font-bold text-gray-700 mb-3">
                Flags ({submission.flags.length})
              </div>
              <div className="space-y-2">
                {submission.flags.map((flag, i) => (
                  <div key={i} className="flex items-start gap-2 bg-red-50 border border-red-100 rounded-xl p-3">
                    <span className="text-red-400 shrink-0">⚠️</span>
                    <span className="text-xs text-red-700">{flag}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Behavioral flags */}
          {submission.behavioral_flags?.length > 0 && (
            <div>
              <div className="text-sm font-bold text-gray-700 mb-3">Behavioral Flags</div>
              <div className="space-y-2">
                {submission.behavioral_flags.map((flag, i) => (
                  <div key={i} className="flex items-start gap-2 bg-amber-50 border border-amber-100 rounded-xl p-3">
                    <span className="shrink-0">🔍</span>
                    <span className="text-xs text-amber-700">{flag}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Submitted */}
          <div className="text-xs text-gray-400">
            Submitted: {new Date(submission.submitted_at).toLocaleString("en-PH", { timeZone: "Asia/Manila" })}
          </div>

          {/* Decision */}
          <div className="border-t border-gray-100 pt-5">
            <div className="text-sm font-bold text-gray-700 mb-3">Your Decision</div>
            <div className="grid grid-cols-3 gap-2 mb-4">
              {[
                { value: "approved",            label: "✅ Approve",    style: "border-green-300 bg-green-50 text-green-700" },
                { value: "needs_resubmission",  label: "🔄 Resubmit",  style: "border-amber-300 bg-amber-50 text-amber-700" },
                { value: "rejected",            label: "❌ Reject",    style: "border-red-300 bg-red-50 text-red-700"       },
              ].map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setDecision(opt.value)}
                  className={`border-2 rounded-xl py-3 text-sm font-bold transition-all
                    ${decision === opt.value ? opt.style + " ring-2 ring-offset-1 ring-current" : "border-gray-200 text-gray-500 hover:border-gray-300"}`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add a note for the applicant (optional)…"
              rows={3}
              className="w-full border border-gray-200 rounded-xl p-3 text-sm text-gray-700 resize-none focus:outline-none focus:border-[#1a6b5c] focus:ring-1 focus:ring-[#1a6b5c]"
            />

            <button
              disabled={!decision || submitting}
              onClick={handleSubmit}
              className="mt-3 w-full py-3.5 rounded-xl font-bold text-sm transition-all
                disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed
                bg-[#1a6b5c] text-white hover:bg-[#155a4d]"
            >
              {submitting ? "Submitting…" : "Submit Decision →"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Submission row
// ─────────────────────────────────────────────
function SubmissionRow({ submission, onSelect }) {
  const sc = scoreColor(submission.risk_score);
  return (
    <div
      onClick={() => onSelect(submission)}
      className="bg-white border border-gray-100 rounded-2xl p-4 hover:border-[#1a6b5c]/30 hover:shadow-sm transition-all cursor-pointer"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="text-sm font-bold text-gray-900 truncate">{submission.applicant_name}</span>
            <SuspicionBadge level={submission.ai_suspicion_level} />
          </div>
          <div className="text-xs text-gray-400 mb-2">{submission.applicant_email}</div>

          {/* Quick signals */}
          <div className="flex flex-wrap gap-2">
            {submission.pwd_id_number && (
              <span className="text-xs bg-gray-100 text-gray-600 rounded-lg px-2 py-0.5 font-mono">
                {submission.pwd_id_number}
              </span>
            )}
            {submission.disability_type && (
              <span className="text-xs bg-[#1a6b5c]/10 text-[#1a6b5c] rounded-lg px-2 py-0.5">
                {submission.disability_type}
              </span>
            )}
            {parseInt(submission.forgery_signal_count) > 0 && (
              <span className="text-xs bg-red-100 text-red-600 rounded-lg px-2 py-0.5">
                ⚠️ {submission.forgery_signal_count} forgery signal(s)
              </span>
            )}
            {submission.flags?.length > 0 && (
              <span className="text-xs bg-amber-100 text-amber-600 rounded-lg px-2 py-0.5">
                🚩 {submission.flags.length} flag(s)
              </span>
            )}
          </div>
        </div>

        {/* Score */}
        <div className={`${sc.bg} ${sc.border} ${sc.text} border rounded-xl px-3 py-2 text-center shrink-0`}>
          <div className="text-xl font-extrabold leading-none">{submission.risk_score}</div>
          <div className="text-xs font-medium">score</div>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <span className="text-xs text-gray-400">
          {new Date(submission.submitted_at).toLocaleString("en-PH", {
            timeZone: "Asia/Manila", month: "short", day: "numeric",
            hour: "2-digit", minute: "2-digit",
          })}
        </span>
        <span className="text-xs text-[#1a6b5c] font-semibold">Review →</span>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────────
export default function AdminReviewQueue() {
  const [submissions, setSubmissions] = useState([]);
  const [selected, setSelected]       = useState(null);
  const [loading, setLoading]         = useState(true);
  const [stats, setStats]             = useState({ pending: 0, approved: 0, rejected: 0 });
  const [filter, setFilter]           = useState("pending_review");
  const supabase = createClient();

  const fetchSubmissions = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch from the admin_review_queue view we created in the schema
      const { data, error } = await supabase
        .from("admin_review_queue")
        .select("*")
        .order("risk_score", { ascending: true })   // Most suspicious first
        .order("submitted_at", { ascending: true }); // FIFO within same score

      if (error) throw error;
      setSubmissions(data || []);

      // Fetch stats
      const { data: allData } = await supabase
        .from("pwd_verifications")
        .select("status");

      if (allData) {
        setStats({
          pending:  allData.filter(r => r.status === "pending_review").length,
          approved: allData.filter(r => r.status === "approved").length,
          rejected: allData.filter(r => r.status === "rejected").length,
        });
      }
    } catch (err) {
      console.error("Failed to fetch submissions:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchSubmissions(); }, [fetchSubmissions]);

  const handleDecision = async (id, decision, note) => {
    const { error } = await supabase
      .from("pwd_verifications")
      .update({
        status: decision,
        decision_reason: note || null,
        reviewed_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (!error) {
      // If approved, also set the PWD verified badge on their profile
      if (decision === "approved") {
        const sub = submissions.find(s => s.id === id);
        if (sub?.user_id) {
          await supabase
            .from("profiles")
            .update({
              pwd_verified: true,
              pwd_verified_at: new Date().toISOString(),
              pwd_verification_id: id,
            })
            .eq("id", sub.user_id);
        }
      }
      await fetchSubmissions();
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f5f0] p-4 sm:p-8">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-1">
            <span className="text-2xl">🛡️</span>
            <h1 className="text-2xl font-extrabold text-gray-900">PWD Verification Queue</h1>
          </div>
          <p className="text-sm text-gray-500 ml-10">
            Submissions ranked by risk score — lowest (most suspicious) first.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { label: "Pending Review", value: stats.pending,  color: "text-amber-600", bg: "bg-amber-50",  border: "border-amber-200" },
            { label: "Approved",       value: stats.approved, color: "text-green-600", bg: "bg-green-50",  border: "border-green-200" },
            { label: "Rejected",       value: stats.rejected, color: "text-red-600",   bg: "bg-red-50",    border: "border-red-200"   },
          ].map((stat) => (
            <div key={stat.label} className={`${stat.bg} border ${stat.border} rounded-2xl p-4 text-center`}>
              <div className={`text-3xl font-extrabold ${stat.color}`}>{stat.value}</div>
              <div className="text-xs text-gray-500 font-medium mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Queue */}
        {loading ? (
          <div className="text-center py-16">
            <div className="w-10 h-10 border-4 border-[#1a6b5c] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm text-gray-400">Loading submissions…</p>
          </div>
        ) : submissions.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
            <div className="text-5xl mb-3">✅</div>
            <h3 className="text-lg font-bold text-gray-700 mb-1">Queue is clear!</h3>
            <p className="text-sm text-gray-400">No pending submissions to review.</p>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-bold text-gray-700">
                {submissions.length} submission{submissions.length !== 1 ? "s" : ""} pending
              </span>
              <button
                onClick={fetchSubmissions}
                className="text-xs text-[#1a6b5c] font-semibold hover:underline"
              >
                ↺ Refresh
              </button>
            </div>
            {submissions.map((sub) => (
              <SubmissionRow key={sub.id} submission={sub} onSelect={setSelected} />
            ))}
          </div>
        )}
      </div>

      {/* Review modal */}
      {selected && (
        <ReviewModal
          submission={selected}
          onClose={() => setSelected(null)}
          onDecision={handleDecision}
        />
      )}
    </div>
  );
}