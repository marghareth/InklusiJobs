// lib/initMockData.js
// InklusiJobs — Mock Data Initialiser
// Runs ONCE when the app first loads.
// Checks if localStorage already has data — if not, pre-loads everything.
// Call this in your root layout.js inside a useEffect.

import {
  MOCK_WORKERS,
  MOCK_EMPLOYERS,
  MOCK_JOB_POSTINGS,
  MOCK_WORK_REQUESTS,
  MOCK_NOTIFICATIONS,
  MOCK_ROADMAP_FALLBACK,
  MOCK_QUIZ_FALLBACK,
  MOCK_SKILL_GAP_FALLBACK,
} from "@/lib/mockData";

const INIT_FLAG = "inklusijobs_mock_loaded"; // key to track if data is already loaded

export function initMockData() {
  // Only runs in the browser (not during Next.js server-side render)
  if (typeof window === "undefined") return;

  // If already initialised, do nothing
  if (localStorage.getItem(INIT_FLAG) === "true") {
    console.log("[InklusiJobs] Mock data already loaded. Skipping init.");
    return;
  }

  console.log("[InklusiJobs] First load detected. Pre-loading mock data...");

  try {
    // ── Workers ──────────────────────────────────────────────────────────────
    localStorage.setItem("inklusi_workers", JSON.stringify(MOCK_WORKERS));

    // Store each worker profile individually by email for quick lookup after login
    MOCK_WORKERS.forEach((worker) => {
      localStorage.setItem(
        `inklusi_worker_${worker.email}`,
        JSON.stringify(worker)
      );
      // Pre-load their notifications
      const notifs = MOCK_NOTIFICATIONS[worker.id] || [];
      localStorage.setItem(
        `inklusi_notifications_${worker.id}`,
        JSON.stringify(notifs)
      );
    });

    // ── Employers ─────────────────────────────────────────────────────────────
    localStorage.setItem("inklusi_employers", JSON.stringify(MOCK_EMPLOYERS));

    MOCK_EMPLOYERS.forEach((employer) => {
      localStorage.setItem(
        `inklusi_employer_${employer.email}`,
        JSON.stringify(employer)
      );
    });

    // ── Job Postings ──────────────────────────────────────────────────────────
    localStorage.setItem("inklusi_job_postings", JSON.stringify(MOCK_JOB_POSTINGS));

    // ── Work Requests ─────────────────────────────────────────────────────────
    localStorage.setItem("inklusi_work_requests", JSON.stringify(MOCK_WORK_REQUESTS));

    // ── Roadmap Fallbacks ─────────────────────────────────────────────────────
    localStorage.setItem(
      "inklusi_roadmap_fallbacks",
      JSON.stringify(MOCK_ROADMAP_FALLBACK)
    );

    // ── Quiz Fallbacks ────────────────────────────────────────────────────────
    localStorage.setItem(
      "inklusi_quiz_fallbacks",
      JSON.stringify(MOCK_QUIZ_FALLBACK)
    );

    // ── Skill Gap Fallbacks ───────────────────────────────────────────────────
    localStorage.setItem(
      "inklusi_skillgap_fallbacks",
      JSON.stringify(MOCK_SKILL_GAP_FALLBACK)
    );

    // ── Mark as initialised ───────────────────────────────────────────────────
    localStorage.setItem(INIT_FLAG, "true");

    console.log("[InklusiJobs] ✅ Mock data successfully loaded into localStorage.");
  } catch (error) {
    console.error("[InklusiJobs] ❌ Failed to initialise mock data:", error);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// RESET FUNCTION
// Call this if you want to wipe everything and reload fresh mock data.
// Useful during development or if something looks broken during the demo.
// Usage: resetMockData() in browser console
// ─────────────────────────────────────────────────────────────────────────────

export function resetMockData() {
  if (typeof window === "undefined") return;

  console.log("[InklusiJobs] 🔄 Resetting all mock data...");
  localStorage.clear();
  initMockData();
  console.log("[InklusiJobs] ✅ Mock data reset complete.");
}

// ─────────────────────────────────────────────────────────────────────────────
// LOCALSTORAGE READ/WRITE HELPERS
// Use these throughout your app instead of calling localStorage directly.
// Keeps everything consistent and prevents typos in key names.
// ─────────────────────────────────────────────────────────────────────────────

// ── Auth & Session ────────────────────────────────────────────────────────────

export function saveCurrentUser(firebaseUser) {
  localStorage.setItem(
    "inklusi_current_user",
    JSON.stringify({
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      name: firebaseUser.displayName,
      photo: firebaseUser.photoURL,
    })
  );
}

export function getCurrentUser() {
  const data = localStorage.getItem("inklusi_current_user");
  return data ? JSON.parse(data) : null;
}

export function clearCurrentUser() {
  localStorage.removeItem("inklusi_current_user");
  localStorage.removeItem("inklusi_current_role");
}

// ── Role ──────────────────────────────────────────────────────────────────────

export function saveUserRole(email, role) {
  // role should be "worker" or "employer"
  localStorage.setItem(`inklusi_role_${email}`, role);
  localStorage.setItem("inklusi_current_role", role);
}

export function getUserRole(email) {
  return localStorage.getItem(`inklusi_role_${email}`) || null;
}

export function getCurrentRole() {
  return localStorage.getItem("inklusi_current_role") || null;
}

// ── Worker Profile ────────────────────────────────────────────────────────────

export function getWorkerProfile(email) {
  const data = localStorage.getItem(`inklusi_worker_${email}`);
  return data ? JSON.parse(data) : null;
}

export function saveWorkerProfile(email, profileData) {
  localStorage.setItem(`inklusi_worker_${email}`, JSON.stringify(profileData));

  // Also update the main workers list
  const workers = getAllWorkers();
  const index = workers.findIndex((w) => w.email === email);
  if (index !== -1) {
    workers[index] = profileData;
  } else {
    workers.push(profileData);
  }
  localStorage.setItem("inklusi_workers", JSON.stringify(workers));
}

export function getAllWorkers() {
  const data = localStorage.getItem("inklusi_workers");
  return data ? JSON.parse(data) : [];
}

// ── Employer Profile ──────────────────────────────────────────────────────────

export function getEmployerProfile(email) {
  const data = localStorage.getItem(`inklusi_employer_${email}`);
  return data ? JSON.parse(data) : null;
}

export function saveEmployerProfile(email, profileData) {
  localStorage.setItem(`inklusi_employer_${email}`, JSON.stringify(profileData));
}

export function getAllEmployers() {
  const data = localStorage.getItem("inklusi_employers");
  return data ? JSON.parse(data) : [];
}

// ── Job Postings ──────────────────────────────────────────────────────────────

export function getAllJobPostings() {
  const data = localStorage.getItem("inklusi_job_postings");
  return data ? JSON.parse(data) : [];
}

export function getJobPostingsByTrack(track) {
  return getAllJobPostings().filter((j) => j.track === track);
}

export function getJobPostingsByEmployer(employerId) {
  return getAllJobPostings().filter((j) => j.employerId === employerId);
}

// ── Work Requests ─────────────────────────────────────────────────────────────

export function getAllWorkRequests() {
  const data = localStorage.getItem("inklusi_work_requests");
  return data ? JSON.parse(data) : [];
}

export function getWorkRequestsForWorker(workerId) {
  return getAllWorkRequests().filter((r) => r.workerId === workerId);
}

export function getWorkRequestsForEmployer(employerId) {
  return getAllWorkRequests().filter((r) => r.employerId === employerId);
}

export function saveWorkRequest(request) {
  const requests = getAllWorkRequests();
  requests.push(request);
  localStorage.setItem("inklusi_work_requests", JSON.stringify(requests));
}

export function updateWorkRequestStatus(requestId, status, workerResponse = null) {
  const requests = getAllWorkRequests();
  const index = requests.findIndex((r) => r.id === requestId);
  if (index !== -1) {
    requests[index].status = status;
    if (workerResponse) {
      requests[index].workerResponse = workerResponse;
      requests[index].respondedAt = new Date().toISOString();
    }
    localStorage.setItem("inklusi_work_requests", JSON.stringify(requests));
  }
}

// ── Notifications ─────────────────────────────────────────────────────────────

export function getNotifications(userId) {
  const data = localStorage.getItem(`inklusi_notifications_${userId}`);
  return data ? JSON.parse(data) : [];
}

export function addNotification(userId, notification) {
  const notifs = getNotifications(userId);
  notifs.unshift({ ...notification, id: `notif_${Date.now()}`, createdAt: new Date().toISOString(), read: false });
  localStorage.setItem(`inklusi_notifications_${userId}`, JSON.stringify(notifs));
}

export function markNotificationRead(userId, notifId) {
  const notifs = getNotifications(userId);
  const index = notifs.findIndex((n) => n.id === notifId);
  if (index !== -1) {
    notifs[index].read = true;
    localStorage.setItem(`inklusi_notifications_${userId}`, JSON.stringify(notifs));
  }
}

export function getUnreadCount(userId) {
  return getNotifications(userId).filter((n) => !n.read).length;
}

// ── Roadmap ───────────────────────────────────────────────────────────────────

export function getRoadmap(email) {
  const data = localStorage.getItem(`inklusi_roadmap_${email}`);
  return data ? JSON.parse(data) : null;
}

export function saveRoadmap(email, roadmapData) {
  localStorage.setItem(`inklusi_roadmap_${email}`, JSON.stringify(roadmapData));
}

export function getRoadmapFallback(jobId) {
  const data = localStorage.getItem("inklusi_roadmap_fallbacks");
  const fallbacks = data ? JSON.parse(data) : {};
  return fallbacks[jobId] || null;
}

// ── Quiz Fallback ─────────────────────────────────────────────────────────────

export function getQuizFallback(resourceId) {
  const data = localStorage.getItem("inklusi_quiz_fallbacks");
  const fallbacks = data ? JSON.parse(data) : {};
  return fallbacks[resourceId] || [];
}

// ── Skill Gap Fallback ────────────────────────────────────────────────────────

export function getSkillGapFallback(jobId) {
  const data = localStorage.getItem("inklusi_skillgap_fallbacks");
  const fallbacks = data ? JSON.parse(data) : {};
  return fallbacks[jobId] || null;
}

// ── Progress Tracking ─────────────────────────────────────────────────────────

export function getProgress(email) {
  const data = localStorage.getItem(`inklusi_progress_${email}`);
  return data ? JSON.parse(data) : { completedResources: [], completedChallenges: [], unlockedPhases: [1] };
}

export function markResourceComplete(email, resourceId) {
  const progress = getProgress(email);
  if (!progress.completedResources.includes(resourceId)) {
    progress.completedResources.push(resourceId);
    localStorage.setItem(`inklusi_progress_${email}`, JSON.stringify(progress));
  }
}

export function markChallengeComplete(email, challengeId) {
  const progress = getProgress(email);
  if (!progress.completedChallenges.includes(challengeId)) {
    progress.completedChallenges.push(challengeId);
    localStorage.setItem(`inklusi_progress_${email}`, JSON.stringify(progress));
  }
}

export function unlockPhase(email, phaseNumber) {
  const progress = getProgress(email);
  if (!progress.unlockedPhases.includes(phaseNumber)) {
    progress.unlockedPhases.push(phaseNumber);
    localStorage.setItem(`inklusi_progress_${email}`, JSON.stringify(progress));
  }
}