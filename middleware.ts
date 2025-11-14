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
  const { nextUrl } = req;

  // Development shortcut: when running the app on localhost, the browser
  // won't include cookies for `api.duckcross.com` on requests to `localhost`.
  // That causes the middleware refresh call (which relies on the cookie) to
  // fail and redirect to `/`. To improve developer UX, bypass the middleware
  // auth check for requests coming from localhost or 127.0.0.1.
  //
  // Important: this is strictly for local development. Production must rely
  // on proper cookie domains and the refresh endpoint.
  const hostname = req.nextUrl.hostname;
  if (hostname === "localhost" || hostname === "127.0.0.1") {
    return NextResponse.next();
  }

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
  // Match both the dashboard root and any nested dashboard routes.
  // Some Next.js matcher edge-cases require the explicit root path to be
  // included when protecting the top-level route.
  matcher: ["/dash", "/dash/:path*"],
};
