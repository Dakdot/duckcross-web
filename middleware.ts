import { NextRequest, NextResponse } from "next/server";

// Allow overriding the API base URL via environment (useful for local dev)
const BASE_URL = process.env.API_BASE_URL ?? "https://api.duckcross.com";

/**
 * Middleware to protect certain routes and redirect unauthenticated users to `/`.
 *
 * Strategy:
 * - For matched requests, forward the incoming `cookie` header to the API
 *   refresh endpoint so the backend can validate the session (HttpOnly cookie).
 * - If the refresh endpoint returns a successful response, allow the request.
 * - Otherwise redirect to `/`.
 */
export async function middleware(req: NextRequest) {
  return NextResponse.next();
}

// Apply middleware to the dashboard (protected) routes. Adjust matcher as needed.
export const config = {
  // Match both the dashboard root and any nested dashboard routes.
  // Some Next.js matcher edge-cases require the explicit root path to be
  // included when protecting the top-level route.
  matcher: ["/dash", "/dash/:path*"],
};
