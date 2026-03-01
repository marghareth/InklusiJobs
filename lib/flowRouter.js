/**
 * lib/flowRouter.js
 * Call these functions at the end of each onboarding step
 * to progress the worker/employer to the next page.
 */

// ─── Worker onboarding steps in order ────────────────────────────────────────
const WORKER_FLOW = [
  "/onboarding",    // Basic Information
  "/job-select",    // Choose job/skill area
  "/assessment",    // Skill gap assessment
  "/results",       // See assessment results
  "/verification", 
  "/dashboard/worker" // PWD verification
  // After verification → /dashboard/worker
];

/**
 * Call this at the end of each worker onboarding step.
 * It automatically pushes to the next step.
 */
export function nextWorkerStep(currentPath, router) {
  const currentIndex = WORKER_FLOW.indexOf(currentPath);

  if (currentIndex === -1 || currentIndex === WORKER_FLOW.length - 1) {
    // Last step done — mark onboarded and go to dashboard
    localStorage.setItem("ij_onboarded", "true");
    setCookieClient("ij_onboarded", "true", 30);
    router.push("/dashboard/worker");
    return;
  }

  const nextPath = WORKER_FLOW[currentIndex + 1];
  router.push(nextPath);
}

/**
 * Call this when worker has low assessment score — send to roadmap.
 */
export function goToRoadmap(router) {
  router.push("/roadmap");
}

/**
 * Call this when employer finishes onboarding.
 */
export function finishEmployerOnboarding(router) {
  localStorage.setItem("ij_emp_onboarded", "true");
  setCookieClient("ij_onboarded", "true", 30);
  router.push("/employer/dashboard");
}

/**
 * Check if user is already onboarded (call on dashboard pages).
 * Returns true if they should be on dashboard, false if still in flow.
 */
export function isWorkerOnboarded() {
  if (typeof window === "undefined") return false;
  return localStorage.getItem("ij_onboarded") === "true";
}

export function isEmployerOnboarded() {
  if (typeof window === "undefined") return false;
  return localStorage.getItem("ij_emp_onboarded") === "true";
}

// Helper to set cookie from client side
function setCookieClient(name, value, days = 30) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${value}; expires=${expires}; path=/; SameSite=Lax`;
}