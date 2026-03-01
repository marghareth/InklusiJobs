import { NextResponse } from "next/server";

/**
 * middleware.js
 * Protects routes and enforces onboarding flow.
 * Firebase auth token is stored in a cookie called "firebase_token"
 * Role is stored in a cookie called "ij_role" (set after login/signup)
 */

// Routes that don't need auth
const PUBLIC_ROUTES = [
  "/",
  "/about",
  "/for-employers",
  "/find-work",
  "/learn",
  "/privacy",
  "/terms",
  "/employers",
  "/auth/verified",
];

// Routes only for workers
const WORKER_ROUTES = [
  "/onboarding",
  "/job-select",
  "/assessment",
  "/results",
  "/verification",
  "/dashboard/worker",
  "/dashboard/tracker",
  "/dashboard/find-work",
  "/challenges",
  "/roadmap",
  "/learn/quiz",
  "/messages",
];

// Routes only for employers
const EMPLOYER_ROUTES = [
  "/employer/dashboard",
  "/employer/onboarding",
];

// Admin routes
const ADMIN_ROUTES = ["/admin"];

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // ✅ DEV BYPASS — lets you visit any page freely while building
  // ❌ Remove this block before deploying to production!
  if (process.env.NODE_ENV === "development") {
    return NextResponse.next();
  }

  // Get auth cookies
  const token     = request.cookies.get("firebase_token")?.value;
  const role      = request.cookies.get("ij_role")?.value;
  const onboarded = request.cookies.get("ij_onboarded")?.value;

  const isLoggedIn  = !!token;
  const isWorker    = role === "worker";
  const isEmployer  = role === "employer";
  const isOnboarded = onboarded === "true";

  // Allow public routes always
  if (PUBLIC_ROUTES.some((r) => pathname === r || pathname.startsWith(r + "/"))) {
    // If already logged in and tries to visit landing, redirect to dashboard
    if (pathname === "/" && isLoggedIn) {
      if (isEmployer) return NextResponse.redirect(new URL("/employer/dashboard", request.url));
      if (isWorker && isOnboarded) return NextResponse.redirect(new URL("/dashboard/worker", request.url));
      if (isWorker && !isOnboarded) return NextResponse.redirect(new URL("/onboarding", request.url));
    }
    return NextResponse.next();
  }

  // Allow API routes
  if (pathname.startsWith("/api/")) return NextResponse.next();

  // Not logged in — redirect to home
  if (!isLoggedIn) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Employer tries to access worker routes
  if (isEmployer && WORKER_ROUTES.some((r) => pathname.startsWith(r))) {
    return NextResponse.redirect(new URL("/employer/dashboard", request.url));
  }

  // Worker tries to access employer routes
  if (isWorker && EMPLOYER_ROUTES.some((r) => pathname.startsWith(r))) {
    return NextResponse.redirect(new URL("/dashboard/worker", request.url));
  }

  // Worker not yet onboarded — force onboarding flow
  if (isWorker && !isOnboarded) {
    const onboardingRoutes = ["/onboarding", "/job-select", "/assessment", "/results", "/verification"];
    const isInFlow = onboardingRoutes.some((r) => pathname.startsWith(r));
    if (!isInFlow) {
      return NextResponse.redirect(new URL("/onboarding", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|public|images|models|.*\\.png|.*\\.svg|.*\\.ico).*)",
  ],
};