// lib/supabase-progress.js
// DEMO VERSION — All Supabase queries replaced with localStorage
// Keeps the EXACT same function signatures so nothing else in the app breaks.
// Just swap the import and everything works the same way.

// ─── HELPERS ──────────────────────────────────────────────────────────────────

function getKey(type, userId, jobId = null) {
  if (jobId) return `inklusi_${type}_${userId}_${jobId}`;
  return `inklusi_${type}_${userId}`;
}

function readFromStorage(key) {
  if (typeof window === "undefined") return null;
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

function writeToStorage(key, value) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error("[Progress] localStorage write failed:", e);
  }
}

// ─── RESOURCE PROGRESS ────────────────────────────────────────────────────────

/**
 * Mark a resource as completed (checkbox ticked)
 * Same signature as before: markResourceComplete(userId, jobId, resourceId, phaseNumber)
 */
export async function markResourceComplete(userId, jobId, resourceId, phaseNumber) {
  const key = getKey("resource_progress", userId, jobId);
  const existing = readFromStorage(key) || {};

  existing[resourceId] = {
    completed: true,
    completedAt: new Date().toISOString(),
    jobId,
    resourceId,
    phaseNumber,
  };

  writeToStorage(key, existing);
  return existing[resourceId];
}

/**
 * Unmark a resource as completed
 */
export async function unmarkResourceComplete(userId, resourceId, jobId) {
  const key = getKey("resource_progress", userId, jobId);
  const existing = readFromStorage(key) || {};

  if (existing[resourceId]) {
    existing[resourceId].completed = false;
    existing[resourceId].completedAt = null;
    writeToStorage(key, existing);
  }

  return existing[resourceId] || null;
}

/**
 * Get all resource progress for a user + job
 * Returns: { [resourceId]: { completed, completedAt } }
 */
export async function getResourceProgress(userId, jobId) {
  const key = getKey("resource_progress", userId, jobId);
  const data = readFromStorage(key) || {};

  // Return in the same shape the app expects
  return Object.fromEntries(
    Object.entries(data).map(([resourceId, val]) => [
      resourceId,
      { completed: val.completed, completedAt: val.completedAt },
    ])
  );
}

// ─── QUIZ ATTEMPTS ────────────────────────────────────────────────────────────

/**
 * Save a quiz attempt after AI scoring
 * Same signature: saveQuizAttempt(userId, jobId, resourceId, phaseNumber, result)
 */
export async function saveQuizAttempt(userId, jobId, resourceId, phaseNumber, result) {
  const key = getKey("quiz_attempts", userId, jobId);
  const existing = readFromStorage(key) || {};

  existing[resourceId] = {
    userId,
    jobId,
    resourceId,
    phaseNumber,
    score: result.score,
    maxScore: result.maxScore || 100,
    passed: result.passed,
    answers: result.answers,
    feedback: result.feedback,
    attemptedAt: new Date().toISOString(),
  };

  writeToStorage(key, existing);
  return existing[resourceId];
}

/**
 * Get quiz attempt for a specific resource
 * Returns null if not found (same as Supabase PGRST116 handling)
 */
export async function getQuizAttempt(userId, resourceId, jobId) {
  const key = getKey("quiz_attempts", userId, jobId);
  const data = readFromStorage(key) || {};
  return data[resourceId] || null;
}

/**
 * Get all quiz attempts for a user + job
 * Returns: { [resourceId]: { score, passed, feedback } }
 */
export async function getAllQuizAttempts(userId, jobId) {
  const key = getKey("quiz_attempts", userId, jobId);
  const data = readFromStorage(key) || {};

  return Object.fromEntries(
    Object.entries(data).map(([resourceId, val]) => [
      resourceId,
      { score: val.score, passed: val.passed, feedback: val.feedback },
    ])
  );
}

// ─── CHALLENGE ATTEMPTS ───────────────────────────────────────────────────────

/**
 * Save a challenge submission + AI score
 * Same signature: saveChallengeAttempt(userId, jobId, challengeId, phaseNumber, result)
 */
export async function saveChallengeAttempt(userId, jobId, challengeId, phaseNumber, result) {
  const key = getKey("challenge_attempts", userId, jobId);
  const existing = readFromStorage(key) || {};

  existing[challengeId] = {
    userId,
    jobId,
    challengeId,
    phaseNumber,
    submission: result.submission,
    score: result.score,
    maxScore: result.maxScore || 100,
    passed: result.passed,
    rubricScores: result.rubricScores,
    feedback: result.feedback,
    encouragement: result.encouragement,
    submittedAt: new Date().toISOString(),
  };

  writeToStorage(key, existing);

  // If passed, automatically unlock the next phase
  if (result.passed) {
    await unlockNextPhase(userId, jobId, phaseNumber);
  }

  return existing[challengeId];
}

/**
 * Get challenge attempt for a specific challenge
 */
export async function getChallengeAttempt(userId, challengeId, jobId) {
  const key = getKey("challenge_attempts", userId, jobId);
  const data = readFromStorage(key) || {};
  return data[challengeId] || null;
}

/**
 * Get all challenge attempts for a user + job
 * Returns: { [challengeId]: { score, passed, feedback } }
 */
export async function getAllChallengeAttempts(userId, jobId) {
  const key = getKey("challenge_attempts", userId, jobId);
  const data = readFromStorage(key) || {};

  return Object.fromEntries(
    Object.entries(data).map(([challengeId, val]) => [
      challengeId,
      { score: val.score, passed: val.passed, feedback: val.feedback },
    ])
  );
}

// ─── PHASE UNLOCK LOGIC ───────────────────────────────────────────────────────

/**
 * Unlock the next phase after passing a challenge
 */
async function unlockNextPhase(userId, jobId, currentPhase) {
  const key = getKey("unlocked_phases", userId, jobId);
  const existing = readFromStorage(key) || [1]; // Phase 1 always unlocked

  const nextPhase = currentPhase + 1;
  if (!existing.includes(nextPhase)) {
    existing.push(nextPhase);
    writeToStorage(key, existing);
  }
}

/**
 * Check which phases are unlocked for a user.
 * Phase 1 is always unlocked.
 * Phase N unlocks when challenge of Phase N-1 is passed.
 * Same signature: getUnlockedPhases(userId, jobId)
 */
export async function getUnlockedPhases(userId, jobId) {
  const key = getKey("unlocked_phases", userId, jobId);
  const stored = readFromStorage(key);

  if (stored) return new Set(stored);

  // If nothing stored yet, check challenge attempts to rebuild unlock state
  const challenges = await getAllChallengeAttempts(userId, jobId);
  const unlocked = new Set([1]);

  const phaseNumbers = [1, 2, 3, 4];
  for (const phase of phaseNumbers) {
    const challengeId = `${jobId}_challenge_${phase}`;
    if (challenges[challengeId]?.passed) {
      unlocked.add(phase + 1);
    }
  }

  // Save rebuilt state for next time
  writeToStorage(key, Array.from(unlocked));
  return unlocked;
}

/**
 * Get overall progress summary for a user + job
 * Same signature: getProgressSummary(userId, jobId, totalResources, totalPhases)
 */
export async function getProgressSummary(userId, jobId, totalResources, totalPhases) {
  const [resourceProgress, quizAttempts, challengeAttempts, unlockedPhases] =
    await Promise.all([
      getResourceProgress(userId, jobId),
      getAllQuizAttempts(userId, jobId),
      getAllChallengeAttempts(userId, jobId),
      getUnlockedPhases(userId, jobId),
    ]);

  const completedResources = Object.values(resourceProgress).filter(
    (r) => r.completed
  ).length;
  const passedQuizzes = Object.values(quizAttempts).filter((q) => q.passed).length;
  const passedChallenges = Object.values(challengeAttempts).filter((c) => c.passed).length;

  return {
    resourceProgress,
    quizAttempts,
    challengeAttempts,
    unlockedPhases,
    completedResources,
    passedQuizzes,
    passedChallenges,
    totalResources,
    overallPercent:
      totalResources > 0
        ? Math.round((completedResources / totalResources) * 100)
        : 0,
  };
}