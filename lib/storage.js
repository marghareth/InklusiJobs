// lib/storage.js
// ─── InklusiJobs localStorage layer ──────────────────────────────────────────
// Single source of truth for all app data.
// NEVER call localStorage directly in components — always use this file.
//
// Usage:
//   import { storage, EMPTY_STATE } from '@/lib/storage'
//   const data = storage.get()
//   storage.setScoring(aiResult)
//   storage.updateChallenge(id, { status: 'approved', ai_score: 88 })

// ─── Key names ────────────────────────────────────────────────────────────────
const MASTER_KEY     = 'inklusijobs_user';
const RESULTS_KEY    = 'inklusijobs_results';   // legacy — keep for results page
const SCORING_KEY    = 'inklusijobs_scoring';   // legacy — keep for roadmap page
const PROGRESS_KEY   = 'inklusijobs_assessment_v3';
const JOB_SELECT_KEY = 'inklusijobs_job_selection';

// ─── Custom event — fires whenever data changes ───────────────────────────────
// Components that call useAppData() will re-render automatically.
const CHANGE_EVENT = 'inklusijobs_storage_updated';

function dispatch() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(CHANGE_EVENT));
  }
}

// ─── Empty / default state ────────────────────────────────────────────────────
export const EMPTY_STATE = {
  profile: {
    name:           'Your Name',
    email:          'your@email.com',
    avatarInitials: 'YN',
  },
  assessment: {
    completedAt:  null,
    jobSelection: {},
    answers:      {},
  },
  scoring: {
    jobTitle:             '',
    overallScore:         0,
    passingThreshold:     0,
    qualified:            false,
    qualificationLevel:   '',
    skillScores:          [],
    overallFeedback:      '',
    strengths:            [],
    areasToGrow:          [],
    encouragementMessage: '',
    nextStep:             '',
  },
  job: {
    id:                '',
    title:             '',
    company:           '',
    salaryRange:       '',
    pwdAccommodations: [],
  },
  challenges:  [],  // [{ id, title, phase_id, phase_name, status, ai_score, submittedAt, description, estimatedHours, portfolioWorthy }]
  tracker: {
    stats: {
      totalSubmitted:    0,
      totalApproved:     0,
      totalRejected:     0,
      currentStreak:     0,
      longestStreak:     0,
      verificationScore: 0,
    },
    phases:       [],   // [{ id, phase_name, status, phaseNumber }]
    submissions:  [],   // [{ id, challengeTitle, submitted_at, status, ai_score, attempt_number }]
    activityData: {},   // { "2026-03-01": 2 } — for heatmap
    applications: [],   // job applications tracked manually
  },
};

// ─── Core read / write ────────────────────────────────────────────────────────
export const storage = {

  /** Returns the full state object, merged with EMPTY_STATE as fallback. */
  get() {
    if (typeof window === 'undefined') return EMPTY_STATE;
    try {
      const raw = localStorage.getItem(MASTER_KEY);
      if (!raw) return { ...EMPTY_STATE };
      const parsed = JSON.parse(raw);
      // Deep merge so new fields added to EMPTY_STATE always exist
      return deepMerge(EMPTY_STATE, parsed);
    } catch {
      return { ...EMPTY_STATE };
    }
  },

  /** Replaces the full state and fires the change event. */
  set(newState) {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(MASTER_KEY, JSON.stringify(newState));
      dispatch();
    } catch {}
  },

  /** Merges a partial update into the current state. */
  update(partial) {
    const current = this.get();
    this.set(deepMerge(current, partial));
  },

  /** Clears all InklusiJobs data (e.g. on sign out). */
  clear() {
    if (typeof window === 'undefined') return;
    [MASTER_KEY, RESULTS_KEY, SCORING_KEY, PROGRESS_KEY, JOB_SELECT_KEY].forEach(k => {
      try { localStorage.removeItem(k); } catch {}
    });
    dispatch();
  },

  // ── Convenience writers ──────────────────────────────────────────────────

  /**
   * Called in /results/page.js right after the AI responds.
   * Saves scoring + job into the master record so Tracker and Dashboard
   * can read them immediately.
   *
   * @param {object} apiResponse — full response from /api/score
   */
  setFromAssessmentResult(apiResponse) {
    const { scoring, job, jobSelection } = apiResponse;
    this.update({
      assessment: { completedAt: new Date().toISOString(), jobSelection: jobSelection || {} },
      scoring:    scoring || {},
      job:        job     || {},
    });

    // Also write legacy keys so existing results/roadmap pages keep working
    try {
      localStorage.setItem(RESULTS_KEY, JSON.stringify(apiResponse));
      localStorage.setItem(SCORING_KEY, JSON.stringify(scoring));
    } catch {}

    dispatch();
  },

  /**
   * Called after roadmap is generated.
   * Converts roadmap phases + challenges into the flat arrays Tracker expects.
   *
   * @param {object} roadmap — from /api/roadmap response
   */
  setFromRoadmap(roadmap) {
    if (!roadmap?.phases) return;

    const phases = roadmap.phases.map((p, i) => ({
      id:          `phase_${i + 1}`,
      phase_name:  p.title,
      phaseNumber: p.phaseNumber || i + 1,
      status:      i === 0 ? 'active' : 'locked',
    }));

    const challenges = roadmap.phases.flatMap((p, i) =>
      (p.challenges || []).map((c, j) => ({
        id:             `ch_${i + 1}_${j + 1}`,
        title:          c.title,
        description:    c.description || '',
        phase_id:       `phase_${i + 1}`,
        phase_name:     p.title,
        status:         'not_started',
        ai_score:       null,
        submittedAt:    null,
        estimatedHours: c.estimatedHours || 0,
        portfolioWorthy: c.portfolioWorthy || false,
      }))
    );

    this.update({
      challenges,
      tracker: { phases },
    });
  },

  /**
   * Updates a single challenge (e.g. after submission/verification).
   *
   * @param {string} challengeId
   * @param {object} patch — e.g. { status: 'approved', ai_score: 88 }
   */
  updateChallenge(challengeId, patch) {
    const state = this.get();
    const challenges = state.challenges.map(c =>
      c.id === challengeId ? { ...c, ...patch } : c
    );
    const updatedState = { ...state, challenges };

    // Recompute tracker stats from the updated challenges array
    updatedState.tracker = {
      ...updatedState.tracker,
      stats: computeStats(challenges, updatedState.tracker),
    };

    this.set(updatedState);
  },

  /**
   * Logs a new submission and updates activity heatmap + stats.
   *
   * @param {object} submission — { challengeId, challengeTitle, status, ai_score }
   */
  logSubmission(submission) {
    const state     = this.get();
    const today     = new Date().toISOString().split('T')[0];
    const existing  = state.tracker.submissions || [];
    const attempts  = existing.filter(s => s.challengeId === submission.challengeId).length;

    const newEntry = {
      id:              `sub_${Date.now()}`,
      challengeId:     submission.challengeId,
      challengeTitle:  submission.challengeTitle,
      submitted_at:    new Date().toISOString(),
      status:          submission.status,
      ai_score:        submission.ai_score ?? null,
      attempt_number:  attempts + 1,
    };

    const activity = { ...state.tracker.activityData };
    activity[today] = (activity[today] || 0) + 1;

    const submissions = [newEntry, ...existing];
    const streak      = computeStreak(activity);

    const updatedTracker = {
      ...state.tracker,
      submissions,
      activityData: activity,
      stats: {
        ...state.tracker.stats,
        totalSubmitted:    submissions.length,
        totalApproved:     submissions.filter(s => s.status === 'approved').length,
        totalRejected:     submissions.filter(s => s.status === 'rejected').length,
        currentStreak:     streak.current,
        longestStreak:     Math.max(state.tracker.stats.longestStreak || 0, streak.current),
        verificationScore: computeVerificationScore(submissions),
      },
    };

    this.set({ ...state, tracker: updatedTracker });
  },

  /**
   * Adds or updates a job application.
   *
   * @param {object} application
   */
  upsertApplication(application) {
    const state = this.get();
    const apps  = state.tracker.applications || [];
    const idx   = apps.findIndex(a => a.id === application.id);
    const updated = idx >= 0
      ? apps.map(a => a.id === application.id ? { ...a, ...application } : a)
      : [application, ...apps];

    this.update({ tracker: { applications: updated } });
  },

  /** Updates user profile (name, email, avatar). */
  setProfile(profilePatch) {
    this.update({ profile: profilePatch });
  },
};

// ─── Stat calculators ─────────────────────────────────────────────────────────

function computeStats(challenges, tracker) {
  const submissions = tracker.submissions || [];
  return {
    totalSubmitted:    submissions.length,
    totalApproved:     challenges.filter(c => c.status === 'approved').length,
    totalRejected:     challenges.filter(c => c.status === 'rejected').length,
    currentStreak:     tracker.stats?.currentStreak  || 0,
    longestStreak:     tracker.stats?.longestStreak  || 0,
    verificationScore: computeVerificationScore(submissions),
  };
}

function computeVerificationScore(submissions) {
  if (!submissions.length) return 0;
  const scored = submissions.filter(s => s.ai_score != null);
  if (!scored.length) return 0;
  const avg = scored.reduce((sum, s) => sum + s.ai_score, 0) / scored.length;
  return Math.round(avg * 10) / 10;
}

function computeStreak(activityData) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  let current = 0;
  const d = new Date(today);
  while (true) {
    const key = d.toISOString().split('T')[0];
    if (!activityData[key]) break;
    current++;
    d.setDate(d.getDate() - 1);
  }
  return { current };
}

// ─── Deep merge utility ───────────────────────────────────────────────────────
// Arrays are replaced (not merged) so challenge lists update cleanly.
function deepMerge(base, override) {
  if (override === null || override === undefined) return base;
  if (Array.isArray(base) || Array.isArray(override)) return override ?? base;
  if (typeof base !== 'object' || typeof override !== 'object') return override ?? base;

  const result = { ...base };
  for (const key of Object.keys(override)) {
    result[key] = deepMerge(base[key], override[key]);
  }
  return result;
}