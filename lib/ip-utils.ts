import type { NextRequest } from "next/server"

/**
 * Client IP as set by the hosting platform (Vercel sets x-real-ip / x-forwarded-for).
 * Headers like cf-connecting-ip are NOT trusted: off Cloudflare, any client can send them
 * and rotate them to dodge rate limiting.
 */
export function getClientIP(request: NextRequest): string {
    const realIP = request.headers.get("x-real-ip")
    if (realIP) return realIP.trim()
    const forwarded = request.headers.get("x-forwarded-for")
    if (forwarded) return forwarded.split(",")[0].trim()
    return "unknown"
}

/** Rate-limit key. IP only: user-agent/accept-language are free for a bot to rotate. */
export function createFingerprint(request: NextRequest): string {
    return getClientIP(request)
}
