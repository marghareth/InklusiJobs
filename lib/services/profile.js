// lib/services/profile.js
// DEMO VERSION — Supabase replaced with localStorage
// Keeps the same function signature: saveBasicInfo(formData)
// Now reads/writes from localStorage using the current Firebase user's email.

import { getCurrentUser, getWorkerProfile, saveWorkerProfile } from "@/lib/initMockData";

/**
 * Save basic profile info for the currently logged-in user.
 * Same signature as before: saveBasicInfo(formData)
 *
 * formData shape:
 * {
 *   firstName, lastName, age,
 *   currentAddress, permanentAddress,
 *   contactNumber, educationalAttainment
 * }
 */
export async function saveBasicInfo(formData) {
  // Get current user from localStorage (set by Firebase login)
  const currentUser = getCurrentUser();
  if (!currentUser || !currentUser.email) {
    throw new Error("Not authenticated");
  }

  const email = currentUser.email;

  // Get existing profile or create a new one
  const existingProfile = getWorkerProfile(email) || {
    id: `worker_${Date.now()}`,
    email,
    name: currentUser.name || `${formData.firstName} ${formData.lastName}`,
    avatar: `${formData.firstName?.[0] || ""}${formData.lastName?.[0] || ""}`.toUpperCase(),
    joinedAt: new Date().toISOString(),
    isAvailableForWork: true,
    verifiedPWD: false,
    completedChallenges: [],
    badges: [],
    portfolioItems: [],
  };

  // Merge new basic info into the profile
  const updatedProfile = {
    ...existingProfile,
    firstName: formData.firstName,
    lastName: formData.lastName,
    name: `${formData.firstName} ${formData.lastName}`,
    age: Number(formData.age),
    currentAddress: formData.currentAddress,
    permanentAddress: formData.permanentAddress,
    contactNumber: formData.contactNumber,
    educationalAttainment: formData.educationalAttainment,
    updatedAt: new Date().toISOString(),
  };

  // Save back to localStorage
  saveWorkerProfile(email, updatedProfile);

  return updatedProfile;
}

/**
 * Get the full profile of the currently logged-in user.
 * Bonus helper — not in original file but useful throughout the app.
 */
export async function getCurrentProfile() {
  const currentUser = getCurrentUser();
  if (!currentUser || !currentUser.email) return null;

  return getWorkerProfile(currentUser.email);
}

/**
 * Update any field(s) on the current user's profile.
 * Usage: updateProfile({ jobTrack: "social_media", jobId: "smm_manager" })
 */
export async function updateProfile(fields) {
  const currentUser = getCurrentUser();
  if (!currentUser || !currentUser.email) {
    throw new Error("Not authenticated");
  }

  const email = currentUser.email;
  const existingProfile = getWorkerProfile(email) || {};

  const updatedProfile = {
    ...existingProfile,
    ...fields,
    updatedAt: new Date().toISOString(),
  };

  saveWorkerProfile(email, updatedProfile);
  return updatedProfile;
}