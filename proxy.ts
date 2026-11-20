import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { getSessionCookie } from "better-auth/cookies";

import {
  authRateLimiter,
  fallbackAuthRateLimiter,
  uploadAuthRateLimiter,
  fallbackUploadAuthRateLimiter,
  globalRateLimiter,
  fallbackGlobalRateLimiter,
} from "@/lib/rate-limit";

const isDev = process.env.NODE_ENV === "development";

const applySecurityHeaders = (headers: Headers, csp: string) => {
  headers.set("Content-Security-Policy", csp);
  headers.set("X-Frame-Options", "DENY");
  headers.set("X-Content-Type-Options", "nosniff");
  headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  headers.set(
    "Strict-Transport-Security",
    "max-age=63072000; includeSubDomains; preload",
  );
  headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), interest-cohort=(), payment=(), usb=()",
  );
  headers.set("X-DNS-Prefetch-Control", "off");
  headers.set("X-XSS-Protection", "0");
  headers.set("Cross-Origin-Opener-Policy", "same-origin");
  headers.set("Cross-Origin-Resource-Policy", "same-origin");
};

const generateNonce = (): string => {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return btoa(String.fromCharCode(...bytes));
};

function getClientIp(request: NextRequest): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    const firstIp = forwardedFor.split(",")[0]?.trim();
    if (firstIp) return firstIp;
  }
  const realIp = request.headers.get("x-real-ip");
  if (realIp) return realIp.trim();
  return "unknown";
}

function tooManyRequests(retryAfterSeconds: number, csp: string): NextResponse {
  const safeRetryAfter = Math.max(1, retryAfterSeconds);
  const response = NextResponse.json(
    { message: "Too many requests. Please try again later." },
    { status: 429, headers: { "Retry-After": String(safeRetryAfter) } },
  );
  applySecurityHeaders(response.headers, csp);
  return response;
}

function isDynamicRoute(path: string): boolean {
  return path.startsWith("/admin") || path.startsWith("/api/");
}

function isSensitivePath(path: string): boolean {
  const normalized = path.toLowerCase();
  if (normalized === "/.env" || normalized.startsWith("/.env.")) return true;
  if (normalized === "/.git" || normalized.startsWith("/.git/")) return true;
  return false;
}

function buildCsp(nonce: string | null): string {
  const evalSrc = isDev ? " 'unsafe-eval'" : "";
  const scriptSrc = nonce
    ? `'self' 'nonce-${nonce}' https://www.googletagmanager.com https://www.google-analytics.com${evalSrc}`
    : `'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com${evalSrc}`;

  const cspHeader = `
    default-src 'self';
    script-src ${scriptSrc};
    object-src 'none';
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
    img-src 'self' blob: data: https://*.imagekit.io https://images.unsplash.com https://*.google-analytics.com https://www.googletagmanager.com;
    font-src 'self' https://fonts.gstatic.com;
    connect-src 'self' https://upload.imagekit.io https://*.imagekit.io https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com;
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    ${isDev ? "" : "upgrade-insecure-requests;"}
  `;

  return cspHeader.replace(/\s{2,}/g, " ").trim();
}

export default async function proxy(request: NextRequest) {
  const startTime = Date.now();
  const path = request.nextUrl.pathname;
  const method = request.method;
  const dynamic = isDynamicRoute(path);

  const nonce = dynamic ? generateNonce() : null;
  const contentSecurityPolicyHeaderValue = buildCsp(nonce);
  const ip = getClientIp(request);

  if (isSensitivePath(path)) {
    const response = NextResponse.json(
      { message: "Not found" },
      { status: 404 },
    );
    applySecurityHeaders(response.headers, contentSecurityPolicyHeaderValue);
    return response;
  }

  const isSignIn = method === "POST" && path.startsWith("/api/auth/sign-in");
  const isUploadAuth = path.startsWith("/api/upload-auth");
  const isOtherApi =
    path.startsWith("/api/") && !path.startsWith("/api/auth") && !isUploadAuth;

  if (isSignIn) {
    const limiter = authRateLimiter ?? fallbackAuthRateLimiter;
    const { success, reset } = await limiter.limit(`auth:${ip}`);
    if (!success) {
      const retryAfter = Math.max(0, Math.ceil((reset - Date.now()) / 1000));
      return tooManyRequests(retryAfter, contentSecurityPolicyHeaderValue);
    }
  } else if (isUploadAuth) {
    const limiter = uploadAuthRateLimiter ?? fallbackUploadAuthRateLimiter;
    const { success, reset } = await limiter.limit(`upload:${ip}`);
    if (!success) {
      const retryAfter = Math.max(0, Math.ceil((reset - Date.now()) / 1000));
      return tooManyRequests(retryAfter, contentSecurityPolicyHeaderValue);
    }
  } else if (isOtherApi) {
    const limiter = globalRateLimiter ?? fallbackGlobalRateLimiter;
    const { success, reset } = await limiter.limit(`global:${ip}`);
    if (!success) {
      const retryAfter = Math.max(0, Math.ceil((reset - Date.now()) / 1000));
      return tooManyRequests(retryAfter, contentSecurityPolicyHeaderValue);
    }
  }

  if (path.startsWith("/admin") && !getSessionCookie(request)) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", path);
    const redirectResponse = NextResponse.redirect(loginUrl);
    applySecurityHeaders(
      redirectResponse.headers,
      contentSecurityPolicyHeaderValue,
    );
    return redirectResponse;
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", path);
  if (nonce) {
    requestHeaders.set("x-nonce", nonce);
  }
  requestHeaders.set(
    "Content-Security-Policy",
    contentSecurityPolicyHeaderValue,
  );

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  applySecurityHeaders(response.headers, contentSecurityPolicyHeaderValue);

  const duration = Date.now() - startTime;
  if (duration > 150) {
    console.warn(`[Performance] Slow middleware: ${duration}ms for ${path}`);
  }

  return response;
}

export const config = {
  matcher: [
    {
      source:
        "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff|woff2|ttf|eot)$).*)",
      missing: [
        {
          type: "header",
          key: "next-router-prefetch",
        },
        {
          type: "header",
          key: "purpose",
          value: "prefetch",
        },
      ],
    },
  ],
};
