import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";
import { authRateLimiter, fallbackAuthRateLimiter } from "@/lib/rate-limit";

const handlers = toNextJsHandler(auth);

function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}

export async function POST(req: NextRequest) {
  if (req.nextUrl.pathname.includes("/sign-in/")) {
    const ip = getClientIp(req);
    const limiter = authRateLimiter ?? fallbackAuthRateLimiter;
    const { success, reset } = await limiter.limit(`sign-in:${ip}`);

    if (!success) {
      const retryAfterSeconds = Math.max(
        0,
        Math.ceil((reset - Date.now()) / 1000),
      );
      return NextResponse.json(
        { message: "Too many sign-in attempts. Please try again later." },
        {
          status: 429,
          headers: { "Retry-After": String(retryAfterSeconds) },
        },
      );
    }
  }

  return handlers.POST(req);
}

export const GET = handlers.GET;
