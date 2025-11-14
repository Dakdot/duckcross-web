import { NextRequest, NextResponse } from "next/server";

const BASE_URL = "https://api.duckcross.com";

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
  const { nextUrl } = req;

  // Forward cookie header to backend so the backend can check session cookies
  const cookie = req.headers.get("cookie") ?? "";

  try {
    const res = await fetch(`${BASE_URL}/v1/auth/refresh`, {
      method: "POST",
      headers: {
        // pass cookies that came with the request to the API
        cookie,
      },
    });

    if (res.ok) {
      // Backend verified the session (or returned a new access token). Allow request.
      return NextResponse.next();
    }
  } catch {
    // network or other error -> fallthrough to redirect
    // (we purposely don't throw so user is redirected to `/`)
  }

  // Not authenticated -> redirect to root
  const url = nextUrl.clone();
  url.pathname = "/";
  return NextResponse.redirect(url);
}

// Apply middleware to the dashboard (protected) routes. Adjust matcher as needed.
export const config = {
  matcher: ["/dash/:path*"],
};
