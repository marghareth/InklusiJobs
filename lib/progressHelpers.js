/**
 * lib/progressHelpers.js
 *
 * Simple helpers to save and read worker onboarding progress in Firestore.
 * Think of it like localStorage, but saved to the cloud tied to the user's account.
 *
 * Usage:
 *   import { saveProgress, getProgress } from "@/lib/progressHelpers";
 *
 *   // Save after a step completes:
 *   await saveProgress(userId, { onboarding_complete: true, basicInfo: { ... } });
 *
 *   // Read on login to know where to redirect:
 *   const progress = await getProgress(userId);
 *   if (!progress.onboarding_complete) redirect to /onboarding
 */

import { db } from "@/lib/firebase";
import { doc, setDoc, getDoc, merge } from "firebase/firestore";

/**
 * Save progress fields for a user.
 * Merges with existing data so you won't overwrite previous steps.
 *
 * @param {string} userId  - Firebase Auth UID
 * @param {object} fields  - e.g. { onboarding_complete: true, basicInfo: {...} }
 */
export async function saveProgress(userId, fields) {
  try {
    const ref = doc(db, "users", userId);
    await setDoc(ref, fields, { merge: true }); // merge:true = don't overwrite other fields
  } catch (err) {
    console.error("saveProgress error:", err);
    throw err;
  }
}

/**
 * Get all saved progress for a user.
 * Returns an empty object if no data found yet.
 *
 * @param {string} userId - Firebase Auth UID
 * @returns {object} - e.g. { onboarding_complete: true, job_select_complete: false, ... }
 */
export async function getProgress(userId) {
  try {
    const ref = doc(db, "users", userId);
    const snap = await getDoc(ref);
    return snap.exists() ? snap.data() : {};
  } catch (err) {
    console.error("getProgress error:", err);
    return {};
  }
}

/**
 * Decide where to redirect a worker after login based on their saved progress.
 *
 * Flow order:
 *   /onboarding → /job-select → /assessment → /results → /dashboard/worker
 *
 * @param {string} userId - Firebase Auth UID
 * @returns {string} - the path to redirect to
 */
export async function getWorkerRedirect(userId) {
  const progress = await getProgress(userId);

  if (!progress.onboarding_complete)   return "/onboarding";
  if (!progress.job_select_complete)   return "/job-select";
  if (!progress.assessment_complete)   return "/assessment";
  if (!progress.results_seen)          return "/results";
  return "/dashboard/worker";
}