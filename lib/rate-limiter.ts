// Simple in-memory rate limiter for demonstration
// In production, use Redis or a database for persistence across server restarts

interface RateLimitEntry {
    count: number
    resetTime: number
}

class RateLimiter {
    private limits = new Map<string, RateLimitEntry>()
    private readonly maxRequests: number
    private readonly windowMs: number

    constructor (maxRequests = 5, windowMs: number = 15 * 60 * 1000) {
        // Default: 5 requests per 15 minutes
        this.maxRequests = maxRequests
        this.windowMs = windowMs
    }

    isAllowed(identifier: string): { allowed: boolean; resetTime?: number } {
        const now = Date.now()
        const entry = this.limits.get(identifier)

        // Clean up expired entries
        if (entry && now > entry.resetTime) {
            this.limits.delete(identifier)
        }

        const currentEntry = this.limits.get(identifier)

        if (!currentEntry) {
            // First request
            this.limits.set(identifier, {
                count: 1,
                resetTime: now + this.windowMs,
            })
            return { allowed: true }
        }

        if (currentEntry.count >= this.maxRequests) {
            return {
                allowed: false,
                resetTime: currentEntry.resetTime,
            }
        }

        // Increment count
        currentEntry.count++
        this.limits.set(identifier, currentEntry)

        return { allowed: true }
    }

    getRemainingTime(identifier: string): number {
        const entry = this.limits.get(identifier)
        if (!entry) return 0

        const remaining = entry.resetTime - Date.now()
        return Math.max(0, Math.ceil(remaining / 1000)) // Return seconds
    }
}

export const rateLimiter = new RateLimiter()
