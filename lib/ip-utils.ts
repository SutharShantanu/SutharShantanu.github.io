import type { NextRequest } from "next/server"

export function getClientIP(request: NextRequest): string {
    // Check various headers for the real IP
    const forwarded = request.headers.get("x-forwarded-for")
    const realIP = request.headers.get("x-real-ip")
    const cfConnectingIP = request.headers.get("cf-connecting-ip")

    if (cfConnectingIP) return cfConnectingIP
    if (realIP) return realIP
    if (forwarded) return forwarded.split(",")[0].trim()

    // Fallback if no IP headers are found
    return "unknown"
}

export function createFingerprint(request: NextRequest): string {
    const ip = getClientIP(request)
    const userAgent = request.headers.get("user-agent") || ""
    const acceptLanguage = request.headers.get("accept-language") || ""

    // Create a simple fingerprint
    return `${ip}-${userAgent.slice(0, 50)}-${acceptLanguage.slice(0, 20)}`
}
