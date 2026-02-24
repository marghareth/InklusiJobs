"use client";

/**
 * app/dashboard/page.js
 *
 * Acts as a role router. Visiting /dashboard directly redirects
 * to /dashboard/worker or /dashboard/employer based on the stored role.
 *
 * Currently uses a simple module-level variable as a stand-in.
 * ─────────────────────────────────────────────────────────────────────────────
 * TODO: when you add real auth, replace getRole() with your actual
 * session/token reader. Examples:
 *
 *   // JWT cookie via next-auth:
 *   import { getSession } from "next-auth/react";
 *   const session = await getSession();
 *   const role = session?.user?.role;
 *
 *   // Custom cookie:
 *   import { cookies } from "next/headers";
 *   const role = cookies().get("role")?.value;
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * Stub role reader.
 * Replace this with your real auth session reader when ready.
 * Returns "worker" | "employer" | null
 */
function getRole() {
  // Safe guard for SSR — window is undefined on server
  if (typeof window === "undefined") return null;
  // ← swap this line for your real auth check
  return null;
}

export default function DashboardIndexPage() {
  const router = useRouter();

  useEffect(() => {
    const role = getRole();

    if (role === "employer") {
      router.replace("/dashboard/employer");
    } else {
      // Default to worker dashboard.
      // Once real auth is in place, add a redirect to /login if role is null.
      router.replace("/dashboard/worker");
    }
  }, [router]);

  // Blank screen while redirect happens — replace with a spinner if desired
  return null;
}