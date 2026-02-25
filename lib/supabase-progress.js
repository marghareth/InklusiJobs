// lib/supabase-progress.js
// Supabase progress tracking for InklusiJobs learn/challenge system
//
// ─── SQL SCHEMA (run in Supabase SQL Editor) ──────────────────────────────────
//
// -- 1. Resource completion tracking
// CREATE TABLE user_resource_progress (
//   id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
//   user_id         UUID REFERENCES auth.users(id) ON DELETE CASCADE,
//   job_id          TEXT NOT NULL,
//   resource_id     TEXT NOT NULL,
//   phase_number    INT NOT NULL,
//   completed       BOOLEAN DEFAULT FALSE,
//   completed_at    TIMESTAMPTZ,
//   created_at      TIMESTAMPTZ DEFAULT NOW(),
//   UNIQUE(user_id, resource_id)
// );
//
// -- 2. Quiz attempt tracking
// CREATE TABLE user_quiz_attempts (
//   id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
//   user_id         UUID REFERENCES auth.users(id) ON DELETE CASCADE,
//   job_id          TEXT NOT NULL,
//   resource_id     TEXT NOT NULL,
//   phase_number    INT NOT NULL,
//   score           INT NOT NULL,
//   max_score       INT NOT NULL DEFAULT 100,
//   passed          BOOLEAN NOT NULL,
//   answers         JSONB,
//   ai_feedback     JSONB,
//   attempted_at    TIMESTAMPTZ DEFAULT NOW(),
//   UNIQUE(user_id, resource_id)
// );
//
// -- 3. Challenge attempt tracking
// CREATE TABLE user_challenge_attempts (
//   id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
//   user_id         UUID REFERENCES auth.users(id) ON DELETE CASCADE,
//   job_id          TEXT NOT NULL,
//   challenge_id    TEXT NOT NULL,
//   phase_number    INT NOT NULL,
//   submission      TEXT NOT NULL,
//   score           INT NOT NULL,
//   max_score       INT NOT NULL DEFAULT 100,
//   passed          BOOLEAN NOT NULL,
//   rubric_scores   JSONB,
//   ai_feedback     TEXT,
//   encouragement   TEXT,
//   submitted_at    TIMESTAMPTZ DEFAULT NOW(),
//   UNIQUE(user_id, challenge_id)
// );
//
// -- Enable Row Level Security
// ALTER TABLE user_resource_progress ENABLE ROW LEVEL SECURITY;
// ALTER TABLE user_quiz_attempts ENABLE ROW LEVEL SECURITY;
// ALTER TABLE user_challenge_attempts ENABLE ROW LEVEL SECURITY;
//
// -- RLS Policies (users can only see/edit their own data)
// CREATE POLICY "Users own resource progress" ON user_resource_progress
//   FOR ALL USING (auth.uid() = user_id);
// CREATE POLICY "Users own quiz attempts" ON user_quiz_attempts
//   FOR ALL USING (auth.uid() = user_id);
// CREATE POLICY "Users own challenge attempts" ON user_challenge_attempts
//   FOR ALL USING (auth.uid() = user_id);

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// ─── RESOURCE PROGRESS ────────────────────────────────────────────────────────

/**
 * Mark a resource as completed (checkbox ticked)
 */
export async function markResourceComplete(userId, jobId, resourceId, phaseNumber) {
  const { data, error } = await supabase
    .from("user_resource_progress")
    .upsert({
      user_id:      userId,
      job_id:       jobId,
      resource_id:  resourceId,
      phase_number: phaseNumber,
      completed:    true,
      completed_at: new Date().toISOString(),
    }, { onConflict: "user_id,resource_id" });

  if (error) throw error;
  return data;
}

/**
 * Unmark a resource as completed
 */
export async function unmarkResourceComplete(userId, resourceId) {
  const { data, error } = await supabase
    .from("user_resource_progress")
    .upsert({
      user_id:     userId,
      resource_id: resourceId,
      completed:   false,
      completed_at: null,
    }, { onConflict: "user_id,resource_id" });

  if (error) throw error;
  return data;
}

/**
 * Get all resource progress for a user + job
 */
export async function getResourceProgress(userId, jobId) {
  const { data, error } = await supabase
    .from("user_resource_progress")
    .select("*")
    .eq("user_id", userId)
    .eq("job_id", jobId);

  if (error) throw error;
  // Returns a map: { [resourceId]: { completed, completed_at } }
  return Object.fromEntries(
    (data || []).map(r => [r.resource_id, { completed: r.completed, completedAt: r.completed_at }])
  );
}

// ─── QUIZ ATTEMPTS ────────────────────────────────────────────────────────────

/**
 * Save a quiz attempt after AI scoring
 */
export async function saveQuizAttempt(userId, jobId, resourceId, phaseNumber, result) {
  const { data, error } = await supabase
    .from("user_quiz_attempts")
    .upsert({
      user_id:      userId,
      job_id:       jobId,
      resource_id:  resourceId,
      phase_number: phaseNumber,
      score:        result.score,
      max_score:    result.maxScore || 100,
      passed:       result.passed,
      answers:      result.answers,
      ai_feedback:  result.feedback,
      attempted_at: new Date().toISOString(),
    }, { onConflict: "user_id,resource_id" });

  if (error) throw error;
  return data;
}

/**
 * Get quiz attempt for a specific resource
 */
export async function getQuizAttempt(userId, resourceId) {
  const { data, error } = await supabase
    .from("user_quiz_attempts")
    .select("*")
    .eq("user_id", userId)
    .eq("resource_id", resourceId)
    .single();

  if (error && error.code !== "PGRST116") throw error; // PGRST116 = not found
  return data || null;
}

/**
 * Get all quiz attempts for a user + job
 */
export async function getAllQuizAttempts(userId, jobId) {
  const { data, error } = await supabase
    .from("user_quiz_attempts")
    .select("*")
    .eq("user_id", userId)
    .eq("job_id", jobId);

  if (error) throw error;
  return Object.fromEntries(
    (data || []).map(q => [q.resource_id, { score: q.score, passed: q.passed, feedback: q.ai_feedback }])
  );
}

// ─── CHALLENGE ATTEMPTS ───────────────────────────────────────────────────────

/**
 * Save a challenge submission + AI score
 */
export async function saveChallengeAttempt(userId, jobId, challengeId, phaseNumber, result) {
  const { data, error } = await supabase
    .from("user_challenge_attempts")
    .upsert({
      user_id:       userId,
      job_id:        jobId,
      challenge_id:  challengeId,
      phase_number:  phaseNumber,
      submission:    result.submission,
      score:         result.score,
      max_score:     result.maxScore || 100,
      passed:        result.passed,
      rubric_scores: result.rubricScores,
      ai_feedback:   result.feedback,
      encouragement: result.encouragement,
      submitted_at:  new Date().toISOString(),
    }, { onConflict: "user_id,challenge_id" });

  if (error) throw error;
  return data;
}

/**
 * Get challenge attempt for a specific challenge
 */
export async function getChallengeAttempt(userId, challengeId) {
  const { data, error } = await supabase
    .from("user_challenge_attempts")
    .select("*")
    .eq("user_id", userId)
    .eq("challenge_id", challengeId)
    .single();

  if (error && error.code !== "PGRST116") throw error;
  return data || null;
}

/**
 * Get all challenge attempts for a user + job
 */
export async function getAllChallengeAttempts(userId, jobId) {
  const { data, error } = await supabase
    .from("user_challenge_attempts")
    .select("*")
    .eq("user_id", userId)
    .eq("job_id", jobId);

  if (error) throw error;
  return Object.fromEntries(
    (data || []).map(c => [c.challenge_id, { score: c.score, passed: c.passed, feedback: c.ai_feedback }])
  );
}

// ─── PHASE UNLOCK LOGIC ───────────────────────────────────────────────────────

/**
 * Check if a phase is unlocked for a user.
 * Phase 1 is always unlocked.
 * Phase N is unlocked when the challenge of Phase N-1 is passed.
 */
export async function getUnlockedPhases(userId, jobId) {
  const challenges = await getAllChallengeAttempts(userId, jobId);

  // Phase 1 always unlocked
  const unlocked = new Set([1]);

  // Check each phase challenge
  const phaseNumbers = [1, 2, 3, 4];
  for (const phase of phaseNumbers) {
    const challengeId = `${jobId}_challenge_${phase}`;
    if (challenges[challengeId]?.passed) {
      unlocked.add(phase + 1);
    }
  }

  return unlocked;
}

/**
 * Get overall progress summary for a user + job
 */
export async function getProgressSummary(userId, jobId, totalResources, totalPhases) {
  const [resourceProgress, quizAttempts, challengeAttempts, unlockedPhases] = await Promise.all([
    getResourceProgress(userId, jobId),
    getAllQuizAttempts(userId, jobId),
    getAllChallengeAttempts(userId, jobId),
    getUnlockedPhases(userId, jobId),
  ]);

  const completedResources = Object.values(resourceProgress).filter(r => r.completed).length;
  const passedQuizzes      = Object.values(quizAttempts).filter(q => q.passed).length;
  const passedChallenges   = Object.values(challengeAttempts).filter(c => c.passed).length;

  return {
    resourceProgress,
    quizAttempts,
    challengeAttempts,
    unlockedPhases,
    completedResources,
    passedQuizzes,
    passedChallenges,
    totalResources,
    overallPercent: totalResources > 0
      ? Math.round((completedResources / totalResources) * 100)
      : 0,
  };
}