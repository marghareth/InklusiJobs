// middleware.js  —  DEMO VERSION
// Supabase auth removed for hackathon demo.
// All route protection is handled client-side via localStorage.

import { NextResponse } from "next/server";

export async function middleware(request) {
  // Simply pass through all requests — no Supabase session check needed for demo
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};